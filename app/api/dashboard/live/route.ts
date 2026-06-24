import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { reconcileFamilyMissionProgress } from '@/lib/family-missions';
import { createSupabaseRequestContext } from '@/lib/supabase/server-auth';

type Scope = 'family' | 'school' | 'enterprise' | 'ceibal';

const SCOPE_LIMITS: Record<Scope, number> = {
  family: 8,
  school: 20,
  enterprise: 30,
  ceibal: 50,
};

export async function GET(request: Request) {
  const { ctx, error } = await createSupabaseRequestContext(request, 'user');

  if (error || !ctx?.userClaims?.id) {
    return NextResponse.json({ error: error?.message ?? 'Unauthorized' }, { status: error?.status ?? 401 });
  }

  const user = ctx.userClaims;
  const supabase = ctx.supabase;

  const { searchParams } = new URL(request.url);
  const scope = (searchParams.get('scope') as Scope | null) ?? 'family';
  const limit = SCOPE_LIMITS[scope] ?? 10;

  // Determine user role and construct scoped devices query
  const role = user.app_metadata?.role || 'parent';
  let devicesQuery = supabase
    .from('devices')
    .select('id,name,is_active,device_type,platform,identifier,classroom_id,school_id,company_id,region,owner,updated_at');

  if (role === 'school_admin' || role === 'teacher') {
    const classroomId = user.app_metadata?.classroom_id;
    const schoolId = user.app_metadata?.school_id;
    if (classroomId) {
      devicesQuery = devicesQuery.eq('classroom_id', classroomId);
    } else if (schoolId) {
      devicesQuery = devicesQuery.eq('school_id', schoolId);
    } else {
      devicesQuery = devicesQuery.eq('user_id', user.id);
    }
  } else if (role === 'enterprise_admin') {
    const companyId = user.app_metadata?.company_id;
    if (companyId) {
      devicesQuery = devicesQuery.eq('company_id', companyId);
    } else {
      devicesQuery = devicesQuery.eq('user_id', user.id);
    }
  } else if (role === 'ceibal_admin') {
    const region = user.app_metadata?.region;
    if (region) {
      devicesQuery = devicesQuery.eq('region', region);
    }
  } else {
    // Parent / default
    devicesQuery = devicesQuery.eq('user_id', user.id);
  }

  const [subscriptionResult, profileResult, devicesResult] = await Promise.all([
    supabaseAdmin
      .from('subscriptions')
      .select('plan,status,devices_allowed,updated_at')
      .eq('user_id', user.id)
      .maybeSingle(),
    supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .maybeSingle(),
    devicesQuery
      .order('updated_at', { ascending: false })
      .limit(limit),
  ]);

  type DeviceRow = {
    id: string;
    name: string;
    owner: string | null;
    is_active: boolean;
    platform: string | null;
    device_type: string | null;
  };

  const rawDevices = (devicesResult.data ?? []) as DeviceRow[];
  const devices = rawDevices.map((device) => ({
    id: device.id,
    name: device.name,
    owner: device.owner ?? profileResult.data?.full_name ?? 'Usuario',
    status: device.is_active ? 'active' : 'paused',
    activity: device.platform ?? device.device_type ?? 'Sin actividad',
    signal: scope === 'enterprise' ? 'LAN' : scope === 'ceibal' ? 'Regional' : 'Local',
    risk: device.is_active ? 'Bajo' : 'Medio',
  }));

  const metrics = {
    plan: subscriptionResult.data?.plan ?? 'individual',
    status: subscriptionResult.data?.status ?? 'inactive',
    devicesAllowed: subscriptionResult.data?.devices_allowed ?? devices.length,
    profileName: profileResult.data?.full_name ?? user.app_metadata?.full_name ?? 'Familia ByeBut',
  };

  if (scope === 'family') {
    try {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(user.id);
      const parentEmail = authUser?.user?.email || user.email;

      await reconcileFamilyMissionProgress({
        userId: user.id,
        parentName: metrics.profileName,
        parentEmail,
        scope,
        devices: rawDevices,
      });
    } catch (missionErr) {
      console.error('Family mission reconciliation failed:', missionErr);
    }
  }

  return NextResponse.json({
    scope,
    metrics,
    devices,
  });
}
