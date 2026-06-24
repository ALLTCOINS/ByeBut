import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { subscriptionClient } from '@/lib/mercadopago';
import { validateRequest, createSubscriptionSchema } from '@/lib/validations';
import { createSupabaseRequestContext } from '@/lib/supabase/server-auth';

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
} as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateRequest(createSubscriptionSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error, details: validation.details },
        { status: 400 }
      );
    }

    const { plan } = validation.data;
    const { ctx, error: authError } = await createSupabaseRequestContext(request, 'user');

    if (authError || !ctx?.userClaims?.id) {
      return NextResponse.json(
        { error: authError?.message ?? 'No autorizado' },
        { status: authError?.status ?? 401 }
      );
    }

    const config = PLAN_CONFIGS[plan];
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const userId = ctx.userClaims.id;
    const userEmail = ctx.userClaims.email;

    const subscription = await subscriptionClient.create({
      body: {
        back_url: `${appUrl}/dashboard?view=familia&status=success`,
        reason: config.reason,
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: config.amount,
          currency_id: 'USD',
        },
        payer_email: userEmail,
        status: 'pending',
        metadata: {
          user_id: userId,
          plan,
          devices_allowed: config.devices,
        },
      } as import('mercadopago/dist/clients/preApproval/commonTypes').PreApprovalRequest & { metadata: Record<string, unknown> },
    });

    if (!subscription.id) {
      throw new Error('No se pudo generar la suscripción de Mercado Pago');
    }

    const { error: dbError } = await supabaseAdmin
      .from('subscriptions')
      .upsert(
        {
          user_id: userId,
          plan,
          status: 'inactive',
          mercadopago_subscription_id: subscription.id,
          devices_allowed: config.devices,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (dbError) {
      throw dbError;
    }

    const checkoutUrl = subscription.init_point;

    if (!checkoutUrl) {
      throw new Error('Mercado Pago no devolvió una URL de checkout');
    }

    return NextResponse.json({
      url: checkoutUrl,
      subscriptionId: subscription.id,
      plan,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno del servidor';
    console.error('Error en create-subscription:', error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
