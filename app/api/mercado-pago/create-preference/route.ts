import { NextResponse } from 'next/server';
import client from '@/lib/mercado-pago/server';
import { Preference } from 'mercadopago';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createSupabaseRequestContext } from '@/lib/supabase/server-auth';

const PLAN_PRICES: Record<string, { amount: number; description: string }> = {
  individual: { amount: 9.9, description: 'Plan Individual – ByeBut' },
  familiar: { amount: 14.9, description: 'Plan Familiar – ByeBut' },
  // institucional: eliminado por ahora
};

export async function POST(request: Request) {
  try {
    const { plan } = await request.json();
    if (!PLAN_PRICES[plan]) {
      return NextResponse.json({ error: 'Plan no válido' }, { status: 400 });
    }

    const { ctx, error } = await createSupabaseRequestContext(request, 'user');

    if (error || !ctx?.userClaims?.id) {
      return NextResponse.json({ error: error?.message ?? 'Debes iniciar sesión' }, { status: error?.status ?? 401 });
    }

    const { amount, description } = PLAN_PRICES[plan];
    const userId = ctx.userClaims.id;
    const userEmail = ctx.userClaims.email;

    const preference = await new Preference(client).create({
      body: {
        items: [{ id: plan, title: description, unit_price: amount, currency_id: 'UYU', quantity: 1 }],
        payer: { email: userEmail },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=success&plan=${plan}`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/precios?status=failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/precios?status=pending`,
        },
        auto_return: 'approved',
        metadata: { user_id: userId, plan },
      }
    });

    // Guardar referencia inactive (pending payment)
    await supabaseAdmin.from('subscriptions').insert({
      user_id: userId,
      plan,
      status: 'inactive',
      mp_preference_id: preference.id,
    });

    return NextResponse.json({ url: preference.init_point });
  } catch (error: unknown) {
    console.error('Error en create-preference:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
