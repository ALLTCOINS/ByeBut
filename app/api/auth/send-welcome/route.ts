/**
 * POST /api/auth/send-welcome
 *
 * Called immediately after the user completes registration.
 * Verifies the authenticated session and dispatches the welcome email via Resend.
 *
 * Body (JSON): { cosmicName?: string; avatarId?: string }
 */

import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/emails';
import { createSupabaseRequestContext } from '@/lib/supabase/server-auth';

export async function POST(request: Request) {
  try {
    const { ctx, error: authError } = await createSupabaseRequestContext(request, 'user');
    const userId = ctx?.userClaims?.id;
    const userEmail = ctx?.userClaims?.email;
    if (authError || !userId || !userEmail) {
      return NextResponse.json({ error: authError?.message ?? 'No autorizado' }, { status: authError?.status ?? 401 });
    }

    // 2. Parse optional body fields
    let cosmicName: string | undefined;
    let avatarId: string | undefined;
    try {
      const body = await request.json();
      cosmicName = body?.cosmicName;
      avatarId = body?.avatarId;
    } catch {
      // Body is optional
    }

    // 3. Fetch profile name from DB
    const { data: profile } = await ctx.supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .maybeSingle();

    const userName =
      profile?.full_name ||
      ctx.userClaims?.full_name ||
      userEmail.split('@')[0];

    // 4. Send welcome email
    const result = await sendWelcomeEmail({
      to: userEmail,
      userName,
      cosmicName,
      avatarId,
    });

    if (result.error) {
      console.error('[send-welcome] email send failed:', result.error);
      // Non-fatal: log and return 200 so the client isn't blocked
      return NextResponse.json({ sent: false, reason: result.error });
    }

    return NextResponse.json({ sent: true, id: result.id });
  } catch (err: unknown) {
    console.error('[send-welcome] unexpected error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
