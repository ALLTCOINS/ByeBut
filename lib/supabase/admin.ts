import { createClient } from '@supabase/supabase-js';

/**
 * Cliente de Supabase con Service Role (Admin)
 * ÚSALO SOLO EN EL SERVIDOR. Permite saltar RLS.
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
