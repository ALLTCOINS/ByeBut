/* lib/supabase/client.ts */
import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client for browser / client‑side code.
 * Uses the public anon key and URL from environment variables prefixed with NEXT_PUBLIC_.
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default supabase;
