import { createClient } from '@supabase/supabase-js';

const c = createClient(
  'https://gooxhhjgouumjuvzmvjc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdvb3hoaGpnb3V1bWp1dnptdmpjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjE4MTU5MywiZXhwIjoyMDk3NzU3NTkzfQ.sQoXT1pqRKVLgMP8cj7L5XiQdusaeMokJVTxcPU7hj4'
);

const tables = [
  'profiles', 'subscriptions', 'devices', 'usage_logs',
  'parental_rules', 'activity_logs', 'child_profiles',
  'coins', 'whale_clusters', 'error_logs', 'webhook_events', 'webhook_queue'
];

for (const t of tables) {
  const r = await c.from(t).select('*', { count: 'exact', head: true });
  console.log(`${t}: status=${r.status} count=${r.count ?? 'N/A'}${r.error ? ' error=' + r.error.message : ''}`);
}
