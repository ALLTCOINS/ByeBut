import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { subscriptionClient } from '@/lib/mercadopago';

/**
 * Mapeo de precios y configuraciones por plan
 */
const PLAN_CONFIGS = {
  individual: {
    amount: 9,
    reason: 'ByeBut Plan Individual',
    devices: 1,
  },
  familiar: {
    amount: 19,
    reason: 'ByeBut Plan Familiar',
    devices: 5,
  },
  institucional: {
    amount: 49,
    reason: 'ByeBut Plan Institucional',
    devices: 100,
  },
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // 1. Verificar sesión del usuario
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // 2. Obtener datos del body
    const { plan } = await request.json();
    
    if (!plan || !PLAN_CONFIGS[plan as keyof typeof PLAN_CONFIGS]) {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    const config = PLAN_CONFIGS[plan as keyof typeof PLAN_CONFIGS];

    // 3. Crear suscripción (PreApproval) en Mercado Pago
    const subscription = await subscriptionClient.create({
      body: {
        back_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        reason: config.reason,
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: config.amount,
          currency_id: 'USD',
        },
        payer_email: user.email,
        status: 'pending',
      }
    });

    if (!subscription.init_point) {
      throw new Error('No se pudo generar el punto de inicio de Mercado Pago');
    }

    // 4. Actualizar tabla de suscripciones en Supabase
    const { error: dbError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        plan: plan,
        status: 'inactive',
        mercadopago_subscription_id: subscription.id,
        devices_allowed: config.devices,
      }, { onConflict: 'user_id' });

    if (dbError) {
      console.error('Error actualizando suscripción en DB:', dbError);
    }

    // 5. Devolver URL para redirigir al usuario al checkout de MP
    return NextResponse.json({ url: subscription.init_point });

  } catch (error: any) {
    console.error('Error en create-subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
