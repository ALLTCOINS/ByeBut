// app/api/mercado-pago/webhook/route.ts
import { supabaseAdmin } from '@/lib/supabase/admin';
import { processWebhookPayload } from '@/lib/subscription-sync';
import { logError } from '@/lib/logger';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const xSignature = request.headers.get('x-signature') ?? '';
    const xRequestId = request.headers.get('x-request-id') ?? '';
    const url = new URL(request.url);
    const dataId = url.searchParams.get('data.id') || '';

    const bodyText = await request.text();
    let payload: Record<string, unknown> = {};
    try {
      if (bodyText) {
        payload = JSON.parse(bodyText);
      }
    } catch (e) {
      console.error('Failed to parse webhook body:', e);
    }

    // Standardize dataId from either query param or body
    const finalDataId = dataId || payload.data?.id || '';

    // Verify signature with the webhook secret
    const parts = xSignature.split(',');
    const ts = parts.find(p => p.startsWith('ts='))?.split('=')[1];
    const v1 = parts.find(p => p.startsWith('v1='))?.split('=')[1];

    const isDev = process.env.NODE_ENV === 'development';

    if (!isDev) {
      const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
      if (!secret) {
        console.error('Missing MERCADOPAGO_WEBHOOK_SECRET in production');
        return new Response('Webhook secret not configured', { status: 500 });
      }

      if (!ts || !v1 || !finalDataId || !xRequestId) {
        console.warn('Webhook missing signature headers, request-id, or data ID');
        return new Response('Missing signature components', { status: 400 });
      }

      // Build the manifest matching Mercado Pago spec: id:[data.id];request-id:[x-request-id];ts:[ts];
      const manifest = `id:${finalDataId};request-id:${xRequestId};ts:${ts};`;

      const expected = crypto
        .createHmac('sha256', secret)
        .update(manifest)
        .digest('hex');

      if (v1 !== expected) {
        console.warn('Webhook signature verification failed');
        return new Response('Invalid signature', { status: 401 });
      }
    }

    const eventId = String(payload.id ?? finalDataId ?? crypto.randomUUID());
    const eventType = String(payload.type ?? 'payment');

    // Insert the webhook into the queue to ensure idempotency and reliability
    let queueItem = null;
    try {
      const { data, error: insertError } = await supabaseAdmin
        .from('webhook_queue')
        .insert({
          event_id: String(eventId),
          event_type: eventType,
          payload: payload,
          status: 'processing',
          attempts: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        // Unique key constraint violation: webhook has already been processed or is processing
        if (insertError.code === '23505') {
          console.log(`Webhook event ${eventId} already in queue, skipping.`);
          return new Response('Already processed', { status: 200 });
        }
        throw insertError;
      }
      queueItem = data;
    } catch (insertErr: unknown) {
      console.error('Failed to queue webhook event:', insertErr instanceof Error ? insertErr.message : insertErr);
      // We fall back to direct processing so that we don't lose the webhook if queue DB fails
    }

    // Process the webhook payload (fetch payment status, update subscriptions)
    try {
      await processWebhookPayload(payload);

      // Update queue status to completed
      if (queueItem) {
        await supabaseAdmin
          .from('webhook_queue')
          .update({
            status: 'completed',
            updated_at: new Date().toISOString(),
            error_message: null
          })
          .eq('id', queueItem.id);
      }
    } catch (processErr: unknown) {
      console.error(`Error processing webhook payload for event ${eventId}:`, processErr);
      
      // Update queue status to failed with backoff and error message
      if (queueItem) {
        const nextRetry = new Date();
        nextRetry.setMinutes(nextRetry.getMinutes() + 5); // Retry in 5 minutes

        await supabaseAdmin
          .from('webhook_queue')
          .update({
            status: 'failed',
            error_message: processErr instanceof Error ? processErr.message : String(processErr),
            next_retry_at: nextRetry.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', queueItem.id);
      }
      
      // Still log to error_logs table
      await logError(processErr as Error, {
        eventId,
        context: 'webhook_processing'
      });
    }

    return new Response('OK', { status: 200 });
  } catch (err: unknown) {
    await logError(err as Error, {
      context: 'webhook_route_outer'
    });
    return new Response('Internal Server Error', { status: 500 });
  }
}
