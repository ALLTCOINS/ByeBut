'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase/client';

export interface DeviceItem {
  id: string;
  user_id: string;
  name: string;
  device_type: string;
  platform: string;
  identifier: string;
  is_active: boolean;
  status: string;
  classroom_id?: string;
  school_id?: string;
  company_id?: string;
  region?: string;
  owner?: string;
  created_at?: string;
  updated_at?: string;
}

export function useDevices() {
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchDevices() {
      try {
        setLoading(true);
        // Quick session check to avoid throwing AuthSessionMissingError
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          if (active) {
            setDevices([]);
            setLoading(false);
          }
          return;
        }

        // Get user to extract metadata securely
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) {
          if (active) {
            setDevices([]);
            setLoading(false);
          }
          return;
        }

        const role = user.app_metadata?.role || 'parent';
        let query = supabase.from('devices').select('*');

        // Apply metadata filters depending on role
        if (role === 'school_admin' || role === 'teacher') {
          const classroomId = user.app_metadata?.classroom_id;
          const schoolId = user.app_metadata?.school_id;
          if (classroomId) {
            query = query.eq('classroom_id', classroomId);
          } else if (schoolId) {
            query = query.eq('school_id', schoolId);
          } else {
            query = query.eq('user_id', user.id);
          }
        } else if (role === 'enterprise_admin') {
          const companyId = user.app_metadata?.company_id;
          if (companyId) {
            query = query.eq('company_id', companyId);
          } else {
            query = query.eq('user_id', user.id);
          }
        } else if (role === 'ceibal_admin') {
          const region = user.app_metadata?.region;
          if (region) {
            query = query.eq('region', region);
          }
        } else {
          // Parent / default
          query = query.eq('user_id', user.id);
        }

        const { data, error: fetchError } = await query.order('updated_at', { ascending: false });
        if (fetchError) throw fetchError;

        if (active) {
          setDevices(data || []);
        }
      } catch (err: unknown) {
        console.error('Error fetching devices:', err);
        if (active) {
          setError(err instanceof Error ? err.message : 'Error loading devices');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchDevices();

    // Subscribe to Postgres changes on devices table in real time
    const channel = supabase
      .channel('public:devices-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'devices' },
        (payload) => {
          console.log('Real-time database update on devices:', payload);
          // Re-fetch to apply proper filters and order
          fetchDevices();
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { devices, loading, error };
}
export default useDevices;
