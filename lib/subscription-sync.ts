/**
 * Subscription synchronization utilities
 * Handles syncing subscription status with Mercado Pago
 */

import { supabaseAdmin } from '@/lib/supabase/admin';
import client from '@/lib/mercado-pago/server';
import { Payment } from 'mercadopago';
import { logError } from '@/lib/logger';
import { sendPaymentSuccessEmail, sendWelcomeEmail } from '@/lib/emails';
import { mercadoPagoWebhookSchema } from '@/lib/validations';

/**
 * Sync subscription status with Mercado Pago
 * Checks the payment status in Mercado Pago and updates local database
 */
export async function syncSubscriptionStatus(userId: string) {
  try {
    const { data: subscription, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (subError || !subscription) {
      console.log(`No subscription found for user ${userId}`);
      return;
    }

    if (!subscription.mercadopago_payment_id) {
      console.log(`No Mercado Pago payment ID for subscription ${subscription.id}`);
      return;
    }

    try {
      const paymentClient = new Payment(client);
      const payment = await paymentClient.get({
        id: subscription.mercadopago_payment_id
      });

      // Map Mercado Pago status to our subscription status
      const statusMap: Record<string, string> = {
        'approved': 'active',
        'pending': 'past_due',
        'authorized': 'active',
        'in_process': 'past_due',
        'rejected': 'canceled',
        'cancelled': 'canceled',
        'refunded': 'canceled',
        'charged_back': 'canceled'
      };

      const paymentStatus = payment.status ?? 'pending';
      const newStatus = statusMap[paymentStatus] || subscription.status;

      // Update subscription if status changed
      if (newStatus !== subscription.status) {
        const { error: updateError } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: newStatus,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (updateError) {
          throw updateError;
        }

        console.log(`Updated subscription status for user ${userId}: ${subscription.status} -> ${newStatus}`);
      }

      return { success: true, newStatus };
    } catch (mpError) {
      console.error('Error fetching payment from Mercado Pago:', mpError);
      throw mpError;
    }
  } catch (error) {
    await logError(error as Error, {
      userId,
      context: 'subscription_sync'
    });
    throw error;
  }
}

/**
 * Sync all active and past_due subscriptions
 * This should be called periodically (e.g., via cron job)
 */
export async function syncAllSubscriptions() {
  try {
    const { data: subscriptions, error } = await supabaseAdmin
      .from('subscriptions')
      .select('user_id, mercadopago_payment_id, status')
      .in('status', ['active', 'past_due', 'trialing']);

    if (error) {
      throw error;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No subscriptions to sync');
      return { synced: 0, errors: 0 };
    }

    let synced = 0;
    let errors = 0;

    for (const subscription of subscriptions) {
      const targetUserId = subscription.user_id ?? '';

      if (!targetUserId) {
        errors++;
        continue;
      }

      try {
        await syncSubscriptionStatus(targetUserId);
        synced++;
      } catch (error) {
        console.error(`Failed to sync subscription for user ${targetUserId}:`, error);
        errors++;
      }
    }

    console.log(`Subscription sync complete: ${synced} synced, ${errors} errors`);
    return { synced, errors };
  } catch (error) {
    await logError(error as Error, {
      context: 'sync_all_subscriptions'
    });
    throw error;
  }
}

/**
 * Check if a subscription needs to be synced
 * Returns true if the subscription was last synced more than specified hours ago
 */
export async function needsSync(userId: string, maxHours: number = 24): Promise<boolean> {
  try {
    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('updated_at')
      .eq('user_id', userId)
      .single();

    if (!subscription) {
      return false;
    }

    const lastSync = new Date(subscription.updated_at);
    const hoursSinceSync = (Date.now() - lastSync.getTime()) / (1000 * 60 * 60);

    return hoursSinceSync > maxHours;
  } catch (error) {
    console.error('Error checking if sync is needed:', error);
    return true; // Sync if we can't determine
  }
}

/**
 * Get subscription health status
 * Returns information about subscription validity and payment status
 */
export async function getSubscriptionHealth(userId: string) {
  try {
    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!subscription) {
      return {
        valid: false,
        reason: 'no_subscription'
      };
    }

    // Check if subscription is expired
    if (subscription.current_period_end && new Date(subscription.current_period_end) < new Date()) {
      return {
        valid: false,
        reason: 'expired',
        endDate: subscription.current_period_end
      };
    }

    // Check if subscription is canceled
    if (subscription.status === 'canceled') {
      return {
        valid: false,
        reason: 'canceled'
      };
    }

    // Check if payment is past due
    if (subscription.status === 'past_due') {
      return {
        valid: false,
        reason: 'past_due'
      };
    }

    return {
      valid: true,
      status: subscription.status,
      plan: subscription.plan,
      endDate: subscription.current_period_end
    };
  } catch (error) {
    console.error('Error getting subscription health:', error);
    return {
      valid: false,
      reason: 'error'
    };
  }
}

/**
 * Core logic to process a Mercado Pago webhook payload.
 * Fetches the payment status and updates the subscription table.
 */
export async function processWebhookPayload(payload: unknown): Promise<boolean> {
  // Validate webhook payload structure
  const validation = mercadoPagoWebhookSchema.safeParse(payload);
  if (!validation.success) {
    console.error('Invalid webhook payload:', validation.error);
    return false;
  }

  const { type, data } = validation.data;

  if (type === 'payment') {
    try {
      const paymentClient = new Payment(client);
      const payment = await paymentClient.get({ id: data.id });
      
      if (payment.status === 'approved') {
        const metadata = (payment.metadata || {}) as { user_id?: string; plan?: string };
        const { user_id, plan } = metadata;

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
            console.error(`Error updating subscription for user ${user_id}:`, error.message);
            throw error;
          }
          console.log(`Subscription updated to active for user ${user_id} plan ${plan}`);

          // ── Fire transactional email ──────────────────────────────
          try {
            // Fetch user email and name from profiles
            const { data: profile } = await supabaseAdmin
              .from('profiles')
              .select('full_name')
              .eq('id', user_id)
              .maybeSingle();

            const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(user_id);
            const userEmail = authUser?.user?.email;
            const userName = profile?.full_name || authUser?.user?.app_metadata?.full_name || 'Usuario';

            if (userEmail) {
              const planAmounts: Record<string, number> = {
                individual: 9,
                familiar: 19,
                institucional: 49,
              };
              await sendPaymentSuccessEmail({
                to: userEmail,
                userName,
                plan: (plan || 'individual') as 'individual' | 'familiar' | 'institucional',
                amount: planAmounts[plan || 'individual'] ?? 9,
              });
              console.log(`Payment success email sent to ${userEmail}`);
            }
          } catch (emailErr) {
            // Email errors are non-fatal — log but don't fail the webhook
            console.error('Failed to send payment success email:', emailErr);
          }
          // ─────────────────────────────────────────────────────────
        } else {
          console.warn(`No user_id found in payment metadata for payment ${data.id}`);
        }
      }
    } catch (error) {
      console.error(`Error processing payment webhook ${data?.id}:`, error);
      throw error;
    }
  }

  return true;
}

/**
 * Retry processing failed webhooks from the queue.
 * This should be scheduled periodically (e.g., via cron job).
 */
export async function retryFailedWebhooks() {
  try {
    const { data: failedEvents, error } = await supabaseAdmin
      .from('webhook_queue')
      .select('*')
      .eq('status', 'failed')
      .lt('next_retry_at', new Date().toISOString())
      .lt('attempts', 5); // Max 5 attempts

    if (error) {
      throw error;
    }

    if (!failedEvents || failedEvents.length === 0) {
      return { processed: 0, errors: 0 };
    }

    let processed = 0;
    let errors = 0;

    for (const event of failedEvents) {
      try {
        // Mark as processing
        await supabaseAdmin
          .from('webhook_queue')
          .update({ 
            status: 'processing', 
            updated_at: new Date().toISOString() 
          })
          .eq('id', event.id);

        // Process the payload
        await processWebhookPayload(event.payload);

        // Success - update queue status to completed
        await supabaseAdmin
          .from('webhook_queue')
          .update({
            status: 'completed',
            updated_at: new Date().toISOString(),
            error_message: null
          })
          .eq('id', event.id);
          
        processed++;
      } catch (err: unknown) {
        const nextAttempts = (event.attempts || 1) + 1;
        // Exponential backoff: 5 mins, 15 mins, 45 mins, 2 hours
        const backoffMinutes = Math.pow(3, nextAttempts) * 5;
        const nextRetry = new Date();
        nextRetry.setMinutes(nextRetry.getMinutes() + backoffMinutes);

        await supabaseAdmin
          .from('webhook_queue')
          .update({
            status: 'failed',
            attempts: nextAttempts,
            error_message: err instanceof Error ? err.message : String(err),
            next_retry_at: nextRetry.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', event.id);

        errors++;
      }
    }

    console.log(`Failed webhooks retry batch complete: ${processed} succeeded, ${errors} failed`);
    return { processed, errors };
  } catch (error) {
    await logError(error as Error, {
      context: 'retry_failed_webhooks'
    });
    throw error;
  }
}

