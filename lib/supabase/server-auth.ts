import { createClient } from './server';

type AuthMode = 'user' | 'publishable' | 'secret' | 'none';

export async function createSupabaseRequestContext(
  request: Request,
  auth: AuthMode = 'user'
) {
  try {
    const supabase = await createClient();
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

    if (claimsError) {
      return { error: { message: claimsError.message, status: 401 } };
    }

    if (!claimsData?.claims) {
      return { error: { message: 'No autorizado', status: 401 } };
    }

    return { ctx: { userClaims: claimsData.claims, supabase } };
  } catch (error) {
    return { error: { message: error instanceof Error ? error.message : 'Error de autenticación', status: 500 } };
  }
}
