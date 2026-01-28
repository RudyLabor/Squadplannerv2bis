import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;

// Singleton instance
export const supabase = createClient(supabaseUrl, publicAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Backwards compatibility for legacy code
export const getSupabase = () => supabase;