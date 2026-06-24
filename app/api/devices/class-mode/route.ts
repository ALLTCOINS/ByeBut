import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { validateRequest, classModeToggleSchema } from '@/lib/validations';
import { createSupabaseRequestContext } from '@/lib/supabase/server-auth';

const MODE_LABELS: Record<string, string> = {
  clase: 'Modo Clase',
  examen: 'Modo Examen',
  tarea: 'Modo Tarea',
  off: 'Normal',
};

export async function POST(req: Request) {
  const { ctx, error } = await createSupabaseRequestContext(req, 'user');
  if (error || !ctx?.userClaims?.id) {
    return NextResponse.json({ error: error?.message ?? 'Unauthorized' }, { status: error?.status ?? 401 });
  }
  const user = ctx.userClaims;

  const body = await req.json();
  const validation = validateRequest(classModeToggleSchema, body);
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error, details: validation.details },
      { status: 400 }
    );
  }

  const { device_ids, allowed_url, mode } = validation.data;

  // Verify all devices belong to user
  const { data: devices, error: devErr } = await supabaseAdmin
    .from('devices')
    .select('id')
    .in('id', device_ids)
    .eq('user_id', user.id);

  if (devErr || !devices?.length) {
    return NextResponse.json({ error: 'No valid devices found' }, { status: 404 });
  }

  const confirmedIds = devices.map(d => d.id);

  if (mode === 'off') {
    // Remove class mode metadata from devices
    await supabaseAdmin
      .from('devices')
      .update({ is_active: true })
      .in('id', confirmedIds);

    return NextResponse.json({ ok: true, mode: 'off', affected: confirmedIds.length });
  }

  // For examen/clase: store the mode in device metadata (using JSONB in a future migration)
  // For now: activate devices + store the mode info in activity_logs as an event
  await supabaseAdmin.from('activity_logs').insert(
    confirmedIds.map(device_id => ({
      device_id,
      activity_type: 'notification',
      app_name: `__MODE__:${mode}`,
      metadata: { mode, allowed_url, activated_by: user.id, activated_at: new Date().toISOString() },
    }))
  );

  // Reactivate devices if they were paused
  await supabaseAdmin
    .from('devices')
    .update({ is_active: true })
    .in('id', confirmedIds);

  return NextResponse.json({
    ok: true,
    mode,
    label: MODE_LABELS[mode],
    allowed_url,
    affected: confirmedIds.length,
  });
}
