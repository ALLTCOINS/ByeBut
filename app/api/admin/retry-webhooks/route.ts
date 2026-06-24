/**
 * Admin API endpoint to manually trigger webhook retry processing
 * This should be protected with admin authentication
 */

import { NextResponse } from 'next/server';
import { retryFailedWebhooks } from '@/lib/subscription-sync';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createSupabaseRequestContext } from '@/lib/supabase/server-auth';

export async function POST(request: Request) {
  try {
    // Verify user is authenticated and is admin
    const { ctx, error: authError } = await createSupabaseRequestContext(request, 'user');
    if (authError || !ctx?.userClaims?.id) {
      return NextResponse.json({ error: authError?.message ?? 'Unauthorized' }, { status: authError?.status ?? 401 });
    }
    const user = ctx.userClaims;

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    const role = user.app_metadata?.role;
    const isAdmin =
      role === 'admin' ||
      role === 'enterprise_admin' ||
      role === 'school_admin' ||
      role === 'ceibal_admin' ||
      Boolean(profile && user.email?.endsWith('@byebut.com'));

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - admin access required' }, { status: 403 });
    }

    // Process failed webhooks
    const result = await retryFailedWebhooks();

    return NextResponse.json({ 
      success: true,
      ...result 
    });
  } catch (error: unknown) {
    console.error('Error in retry-webhooks:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
