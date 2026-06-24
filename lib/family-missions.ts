import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendMissionCompletedEmail } from '@/lib/emails';

type FamilyMissionContext = {
  userId: string;
  parentName: string;
  parentEmail?: string | null;
  scope: 'family' | 'school' | 'enterprise' | 'ceibal';
  devices: Array<{ id: string; name: string; is_active: boolean; owner?: string | null }>;
};

type MissionDispatchResult = {
  triggered: boolean;
  reason: string;
};

function buildMissionId(userId: string, missionKey: string) {
  return `mission_${userId}_${missionKey}`;
}

async function missionAlreadyProcessed(eventId: string) {
  const { data } = await supabaseAdmin
    .from('webhook_queue')
    .select('id, status')
    .eq('event_id', eventId)
    .maybeSingle();

  return Boolean(data);
}

/**
 * Reconciles the "family mission" progress and sends a single email
 * when the household reaches the all-devices-active milestone.
 */
export async function reconcileFamilyMissionProgress(
  context: FamilyMissionContext
): Promise<MissionDispatchResult> {
  if (context.scope !== 'family') {
    return { triggered: false, reason: 'scope_not_family' };
  }

  if (!context.parentEmail) {
    return { triggered: false, reason: 'missing_parent_email' };
  }

  const activeDevices = context.devices.filter((device) => device.is_active);
  const familySize = context.devices.length;

  if (familySize < 2) {
    return { triggered: false, reason: 'insufficient_devices' };
  }

  if (activeDevices.length !== familySize) {
    return { triggered: false, reason: 'mission_not_completed' };
  }

  const missionKey = 'all_devices_green';
  const eventId = buildMissionId(context.userId, missionKey);

  if (await missionAlreadyProcessed(eventId)) {
    return { triggered: false, reason: 'already_notified' };
  }

  const missionTitle = 'Soberanía Colectiva';
  const tokensEarned = 150;

  const { error: queueError } = await supabaseAdmin.from('webhook_queue').insert({
    event_id: eventId,
    event_type: 'mission_completed',
    payload: {
      user_id: context.userId,
      mission_title: missionTitle,
      tokens_earned: tokensEarned,
      scope: context.scope,
      triggered_at: new Date().toISOString(),
    },
    status: 'processing',
    attempts: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (queueError) {
    if (queueError.code === '23505') {
      return { triggered: false, reason: 'already_notified' };
    }
    throw queueError;
  }

  const childName = activeDevices[0]?.owner || activeDevices[0]?.name || 'la familia';

  const emailResult = await sendMissionCompletedEmail({
    to: context.parentEmail,
    parentName: context.parentName,
    childName,
    missionTitle,
    tokensEarned,
  });

  await supabaseAdmin
    .from('webhook_queue')
    .update({
      status: emailResult.error ? 'failed' : 'completed',
      error_message: emailResult.error || null,
      updated_at: new Date().toISOString(),
    })
    .eq('event_id', eventId);

  if (emailResult.error) {
    return { triggered: true, reason: 'email_failed' };
  }

  return { triggered: true, reason: 'email_sent' };
}
