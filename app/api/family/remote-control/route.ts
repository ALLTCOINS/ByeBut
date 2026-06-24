import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { validateRequest, deviceRemoteControlSchema } from '@/lib/validations';
import { createSupabaseRequestContext } from '@/lib/supabase/server-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateRequest(deviceRemoteControlSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error, details: validation.details },
        { status: 400 }
      );
    }

    const { device_id, action } = validation.data;
    const { ctx, error: authError } = await createSupabaseRequestContext(request, 'user');

    if (authError || !ctx?.userClaims?.id) {
      return NextResponse.json({ error: authError?.message ?? 'No autorizado' }, { status: authError?.status ?? 401 });
    }
    const user = ctx.userClaims;

    const { data: device, error: deviceError } = await supabaseAdmin
      .from('devices')
      .select('id, user_id, name')
      .eq('id', device_id)
      .maybeSingle();

    if (deviceError) {
      throw deviceError;
    }

    if (!device || device.user_id !== user.id) {
      return NextResponse.json({ error: 'Dispositivo no encontrado' }, { status: 404 });
    }

    const eventId = `mdm_${device_id}_${Date.now()}`;
    const payload = {
      device_id,
      action,
      requested_by: user.id,
      device_name: device.name,
      timestamp: new Date().toISOString(),
      source: 'family_mobile',
    };

    const { error: queueError } = await supabaseAdmin
      .from('webhook_queue')
      .insert({
        event_id: eventId,
        event_type: 'device_control',
        payload,
        status: 'processing',
        attempts: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (queueError) {
      throw queueError;
    }

    const nextStatus = action === 'pause_device' ? 'paused' : 'active';
    const { error: updateError } = await supabaseAdmin
      .from('devices')
      .update({
        status: nextStatus,
        is_active: nextStatus === 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', device_id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      ok: true,
      device_id,
      action,
      status: nextStatus,
    });
  } catch (error: unknown) {
    console.error('Error en family remote-control:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
