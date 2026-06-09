// app/api/mercado-pago/webhook/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import client from '@/lib/mercado-pago/server';
import { Payment } from 'mercadopago';
import crypto from 'crypto';

export async function POST(request: Request) {
  const signature = request.headers.get('x-signature') ?? '';
  const body = await request.text();

  // Verificar firma con el secreto del webhook
  const expected = crypto
    .createHmac('sha256', process.env.MP_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');

  if (signature !== expected) {
    console.warn('Webhook signature mismatch');
    return new Response('Invalid signature', { status: 401 });
  }

  const payload = JSON.parse(body);
  const { type, data } = payload;

  if (type === 'payment') {
    // Obtener detalles del pago
    const paymentClient = new Payment(client);
    const payment = await paymentClient.get({ id: data.id });
    
    if (payment.status === 'approved') {
      const { user_id, plan } = payment.metadata || {};

      if (user_id) {
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'active',
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user_id)
          .eq('plan', plan);

        if (error) {
          console.error('Error updating subscription:', error);
          return new Response('Error updating subscription', { status: 500 });
        }
      }
    }
  }

  return new Response('OK', { status: 200 });
}
