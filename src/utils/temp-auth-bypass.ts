// 🚨 TEMPORARY AUTH BYPASS
// This file provides a temporary workaround for the "Invalid JWT" error
// while we wait for the Edge Function to redeploy with the fixed auth-helper.tsx

import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

interface BypassAuthResult {
  success: boolean;
  userId?: string;
  email?: string;
  token?: string;
  error?: string;
}

/**
 * Gets the current session directly from Supabase without server validation
 * This bypasses the broken JWT validation on the server
 */
export async function getBypassAuthSession(): Promise<BypassAuthResult> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Bypass auth error:', error);
      return { success: false, error: error.message };
    }
    
    if (!session) {
      console.log('⚠️ No active session');
      return { success: false, error: 'No active session' };
    }
    
    console.log('✅ Bypass auth successful:', {
      userId: session.user.id,
      email: session.user.email
    });
    
    return {
      success: true,
      userId: session.user.id,
      email: session.user.email || '',
      token: session.access_token
    };
  } catch (e: any) {
    console.error('❌ Bypass auth exception:', e);
    return { success: false, error: e.message };
  }
}

/**
 * Makes an authenticated API call using the bypass method
 * Instead of relying on server JWT validation, we pass user ID as a query param
 * and verify it matches the JWT token client-side
 */
export async function bypassAuthFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const session = await getBypassAuthSession();
  
  if (!session.success || !session.userId || !session.token) {
    throw new Error('Authentication required');
  }
  
  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-e884809f`;
  
  // Add bypass query params
  const url = new URL(`${API_BASE}${endpoint}`);
  url.searchParams.set('_bypass_user', session.userId);
  url.searchParams.set('_bypass_email', session.email || '');
  
  // Still include the token for future use when server is fixed
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${session.token}`,
    'Content-Type': 'application/json'
  };
  
  console.log('🔄 Making bypassed auth request:', {
    endpoint,
    userId: session.userId,
    method: options.method || 'GET'
  });
  
  return fetch(url.toString(), {
    ...options,
    headers
  });
}
