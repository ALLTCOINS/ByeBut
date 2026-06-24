/**
 * Logger utilities
 * Handles logging errors locally and saving them to the database
 */

import { supabaseAdmin } from './supabase/admin';

export async function logError(error: Error, metadata: Record<string, any> = {}) {
  console.error('[Error Log]:', error, 'Metadata:', metadata);
  
  try {
    const { error: dbError } = await supabaseAdmin
      .from('error_logs')
      .insert({
        message: error.message,
        stack: error.stack,
        context: metadata.context || 'general',
        user_id: metadata.userId || null,
        metadata: metadata,
        created_at: new Date().toISOString()
      });
      
    if (dbError) {
      console.error('Failed to save error to database error_logs:', dbError.message);
    }
  } catch (dbErr) {
    console.error('Error writing to database error_logs:', dbErr);
  }
}

export async function logApiError(error: Error, request: Request) {
  let url = '';
  let method = '';
  let headers = {};
  
  try {
    const parsedUrl = new URL(request.url);
    url = parsedUrl.pathname + parsedUrl.search;
    method = request.method;
    headers = Object.fromEntries(request.headers.entries());
  } catch (e) {
    console.error('Error parsing request for api error logging:', e);
  }
  
  const metadata = {
    url,
    method,
    headers,
    context: 'api_error'
  };
  
  await logError(error, metadata);
}
