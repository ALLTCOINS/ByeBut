import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getPresetForAge, AGE_PRESETS } from '@/lib/age-presets';
import { createSupabaseRequestContext } from '@/lib/supabase/server-auth';
import { z } from 'zod';

const schema = z.object({
  device_id: z.string().uuid(),
  // Either pass birth_year (auto-detect preset) or explicit preset key
  birth_year: z.number().int().optional(),
  preset_key: z.enum(['4-7', '8-11', '12-14', '15-17']).optional(),
});

export async function POST(req: Request) {
  const { ctx, error: authError } = await createSupabaseRequestContext(req, 'user');

  if (authError || !ctx?.userClaims?.id) {
    return NextResponse.json({ error: authError?.message ?? 'Unauthorized' }, { status: authError?.status ?? 401 });
  }

  const user = ctx.userClaims;

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { device_id, birth_year, preset_key } = parsed.data;

  // Resolve preset
  const preset = preset_key
    ? AGE_PRESETS[preset_key]
    : getPresetForAge(birth_year);

  if (!preset) return NextResponse.json({ error: 'No preset found for given age/key' }, { status: 400 });

  // Verify device belongs to user
  const { data: device } = await supabaseAdmin
    .from('devices')
    .select('id')
    .eq('id', device_id)
    .eq('user_id', user.id)
    .single();

  if (!device) return NextResponse.json({ error: 'Device not found' }, { status: 404 });

  // Delete existing rules for this device and replace with preset
  await supabaseAdmin.from('parental_rules').delete().eq('device_id', device_id);

  const rulesToInsert = preset.rules.map(rule => ({
    device_id,
    rule_type: rule.rule_type,
    time_limit_minutes: rule.time_limit_minutes ?? null,
    schedule_start: rule.schedule_start ?? null,
    schedule_end: rule.schedule_end ?? null,
    blocked_categories: rule.blocked_categories ?? null,
    is_active: true,
  }));

  const { data, error: dbError } = await supabaseAdmin
    .from('parental_rules')
    .insert(rulesToInsert)
    .select();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ ok: true, preset: preset.label, rules_created: data.length });
}
