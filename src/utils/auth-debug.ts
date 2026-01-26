// 🔍 SQUAD PLANNER - Auth Debug Utility
// Utility to diagnose authentication issues

import { getSupabase } from '@/utils/supabase/client';
import { projectId } from '@/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-e884809f`;

export async function debugAuth() {
  console.log('🔍 ===== AUTH DEBUG UTILITY =====');
  
  const supabase = getSupabase();
  
  // 1. Check if user is logged in
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  console.log('1️⃣ Session Check:', {
    hasSession: !!session,
    hasError: !!sessionError,
    error: sessionError?.message
  });
  
  if (!session) {
    console.log('❌ No active session - user must log in');
    return {
      success: false,
      error: 'No active session'
    };
  }
  
  console.log('2️⃣ Session Details:', {
    userId: session.user?.id,
    email: session.user?.email,
    hasAccessToken: !!session.access_token,
    tokenLength: session.access_token?.length,
    tokenPreview: session.access_token?.substring(0, 30) + '...',
    expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'unknown',
    isExpired: session.expires_at ? session.expires_at * 1000 < Date.now() : 'unknown'
  });
  
  // 2. Decode JWT to see payload
  try {
    const parts = session.access_token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      console.log('3️⃣ JWT Payload (decoded):', {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
        iss: payload.iss,
        aud: payload.aud,
        exp: payload.exp,
        iat: payload.iat,
        expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : 'unknown',
        isExpired: payload.exp ? payload.exp * 1000 < Date.now() : 'unknown'
      });
    }
  } catch (e) {
    console.error('❌ Failed to decode JWT:', e);
  }
  
  // 3. Test the token with the server
  try {
    console.log('4️⃣ Testing token with server...');
    const response = await fetch(`${API_BASE}/auth/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      }
    });
    
    const data = await response.json();
    
    console.log('Server Response:', {
      status: response.status,
      ok: response.ok,
      data
    });
    
    if (response.ok) {
      console.log('✅ Token is valid on server!');
      return {
        success: true,
        user: data.user
      };
    } else {
      console.error('❌ Token is invalid on server:', data);
      
      // Test environment endpoint
      console.log('5️⃣ Checking server environment...');
      const envResponse = await fetch(`${API_BASE}/debug/env`);
      const envData = await envResponse.json();
      console.log('Server Environment:', envData);
      
      return {
        success: false,
        error: data.error || 'Token invalid',
        serverResponse: data,
        environment: envData
      };
    }
  } catch (e: any) {
    console.error('❌ Failed to verify token with server:', e);
    return {
      success: false,
      error: e.message
    }
  }
}

// Make it available globally for debugging in console
if (typeof window !== 'undefined') {
  (window as any).debugAuth = debugAuth;
}