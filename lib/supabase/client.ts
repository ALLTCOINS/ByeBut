/* lib/supabase/client.ts */
import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase client for browser / client‑side code.
 * Supports checking localStorage for custom self-hosted Supabase URL and key
 * to guarantee data sovereignty (local/P2P setups).
 */
const getSupabaseClient = () => {
  if (typeof window !== 'undefined') {
    const localUrl = window.localStorage.getItem('byebut_supabase_url');
    const localKey = window.localStorage.getItem('byebut_supabase_anon_key');
    if (localUrl && localKey) {
      console.log('🔌 Conexión soberana: Usando instancia Supabase local autohospedada:', localUrl);
      return createBrowserClient(localUrl, localKey);
    }
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase client configuration');
  }
  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  );
};

export const supabase = getSupabaseClient();
export default supabase;
