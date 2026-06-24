/**
 * Mercado Pago Refund API Route
 * Handles refund requests for payments
 */

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { PaymentRefund } from 'mercadopago';
import client from '@/lib/mercado-pago/server';
import { logApiError } from '@/lib/logger';
import { createSupabaseRequestContext } from '@/lib/supabase/server-auth';
import { z } from 'zod';

// Validation schema for refund requests
const refundSchema = z.object({
  paymentId: z.string().min(1, 'Payment ID is required'),
  amount: z.number().optional(),
  reason: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  try {
    // Authenticate user first
    const { ctx, error: authError } = await createSupabaseRequestContext(request, 'user');

    if (authError || !ctx?.userClaims?.id) {
      return NextResponse.json(
        { error: authError?.message ?? 'Unauthorized' },
        { status: authError?.status ?? 401 }
      );
    }

    const user = ctx.userClaims;

    const body = await request.json();

    // Validate request body
    const validation = refundSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { paymentId, amount, reason } = validation.data;

    try {
      const refundClient = new PaymentRefund(client);
      
      // Process refund
      const refund = amount
        ? await refundClient.create({
            payment_id: paymentId,
            body: { amount },
          })
        : await refundClient.total({
            payment_id: paymentId,
          });

      // Find subscription associated with this payment
      const { data: subscription } = await supabaseAdmin
        .from('subscriptions')
        .select('*')
        .eq('mercadopago_payment_id', paymentId)
        .single();

      if (subscription) {
        // Verify subscription belongs to authenticated user
        if (subscription.user_id !== user.id) {
          return NextResponse.json(
            { error: 'Unauthorized - subscription does not belong to user' },
            { status: 403 }
          );
        }

        // Update subscription status to canceled
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'canceled',
            cancel_at_period_end: true,
            updated_at: new Date().toISOString(),
            cancel_reason: reason || 'Refund processed'
          })
          .eq('id', subscription.id);

        // Log the refund in webhook events for tracking
        await supabaseAdmin
          .from('webhook_events')
          .insert({
            event_type: 'refund_processed',
            payment_id: paymentId,
            subscription_id: subscription.id,
            payload: refund,
            processed: true,
            created_at: new Date().toISOString()
          });
      }

      return NextResponse.json({ 
        success: true, 
        refund,
        subscriptionUpdated: !!subscription
      });
    } catch (mpError) {
      const message = mpError instanceof Error ? mpError.message : 'Unknown Mercado Pago error';
      console.error('Mercado Pago refund error:', mpError);
      return NextResponse.json(
        { error: 'Refund failed', details: message },
        { status: 500 }
      );
    }
  } catch (error) {
    await logApiError(error as Error, request);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check refund status
 */
export async function GET(request: Request) {
  try {
    // Authenticate user first
    const { ctx, error: authError } = await createSupabaseRequestContext(request, 'user');

    if (authError || !ctx?.userClaims?.id) {
      return NextResponse.json(
        { error: authError?.message ?? 'Unauthorized' },
        { status: authError?.status ?? 401 }
      );
    }

    const user = ctx.userClaims;

    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('payment_id');

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    try {
      const refundClient = new PaymentRefund(client);
      const refunds = await refundClient.list({ payment_id: paymentId });

      // Check if payment has been refunded
      const isRefunded = refunds.length > 0;

      // Verify payment belongs to user's subscription
      const { data: subscription } = await supabaseAdmin
        .from('subscriptions')
        .select('user_id')
        .eq('mercadopago_payment_id', paymentId)
        .maybeSingle();

      if (subscription && subscription.user_id !== user.id) {
        return NextResponse.json(
          { error: 'Unauthorized - payment does not belong to user' },
          { status: 403 }
        );
      }

      return NextResponse.json({
        paymentId,
        isRefunded,
        refundDetails: refunds
      });
    } catch (mpError) {
      console.error('Error checking refund status:', mpError);
      return NextResponse.json(
        { error: 'Failed to check refund status', details: mpError instanceof Error ? mpError.message : 'Unknown Mercado Pago error' },
        { status: 500 }
      );
    }
  } catch (error) {
    await logApiError(error as Error, request);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
