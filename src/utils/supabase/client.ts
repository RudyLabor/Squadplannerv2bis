import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;

export function getSupabase() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = `https://${projectId}.supabase.co`;
  
  supabaseClient = createSupabaseClient(supabaseUrl, publicAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return supabaseClient;
}

// Alias for compatibility
export function createClient() {
  return getSupabase();
}