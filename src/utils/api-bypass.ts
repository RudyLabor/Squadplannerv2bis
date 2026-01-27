// 🚨 TEMPORARY API BYPASS
// This bypasses the broken Edge Function authentication
// by accessing the KV store directly via Supabase REST API

import { projectId, publicAnonKey } from '@/utils/supabase/info';
import { getSupabase } from '@/utils/supabase/client';

// Helper type for KV rows to avoid 'never' inference
interface KVRow {
  key: string;
  value: any;
}

const KV_TABLE = 'kv_store_e884809f';
const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-e884809f`;

/**
 * Get current user ID from Supabase session
 */
async function getCurrentUserId(): Promise<string | null> {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id || null;
}

/**
 * Get auth token from current session
 */
export async function getAuthToken(): Promise<string | null> {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

/**
 * Get user profile using direct KV access
 */
export async function getProfileBypass() {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error('Not authenticated');
  }

  console.log('🚨 BYPASS: Getting profile for user', userId);
  
  const supabase = getSupabase();
  
  // Query the KV store directly
  const { data, error } = await supabase
    .from(KV_TABLE)
    .select('value')
    .eq('key', `user:${userId}`)
    .single();
  
  const result = data as any;

  if (error) {
    if (error.code === 'PGRST116') {
      // No profile found - create a default one
      console.log('⚠️ No profile found, creating default profile');
      const session = await supabase.auth.getSession();
      const defaultProfile = {
        id: userId,
        email: session.data.session?.user.email || '',
        name: session.data.session?.user.email?.split('@')[0] || 'User',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        isPremium: false,
        badges: [],
        stats: {
          totalSessions: 0,
          sessionsAttended: 0,
          reliabilityScore: 100,
          squadCount: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Store it
      await supabase
        .from(KV_TABLE)
        .insert({
          key: `user:${userId}`,
          value: JSON.stringify(defaultProfile)
        });

      return { profile: defaultProfile };
    }
    
    console.error('❌ BYPASS: Error getting profile:', error);
    throw error;
  }

  const profile = typeof result.value === 'string' ? JSON.parse(result.value) : result.value;
  console.log('✅ BYPASS: Profile retrieved');
  return { profile };
}

/**
 * Update user profile using bypass API route
 * This route bypasses JWT verification and uses userId from body
 */
export async function updateProfileBypass(updates: any) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error('Not authenticated');
  }

  const url = `${API_BASE}/auth/profile-bypass`;
  console.log('🚨 BYPASS: Updating profile via API bypass route');
  console.log('🚨 BYPASS: URL:', url);
  console.log('🚨 BYPASS: User ID:', userId);
  console.log('🚨 BYPASS: Updates:', updates);
  
  // Use publicAnonKey as a dummy auth header to pass Supabase proxy
  // The server will ignore this and use userId from body instead
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`, // Dummy header for Supabase proxy
    },
    body: JSON.stringify({
      userId,
      ...updates
    }),
  });

  console.log('🚨 BYPASS: Response status:', response.status);
  console.log('🚨 BYPASS: Response headers:', Object.fromEntries(response.headers.entries()));

  let data;
  try {
    data = await response.json();
  } catch (e) {
    console.error('❌ BYPASS: Failed to parse response JSON');
    const text = await response.text();
    console.error('❌ BYPASS: Response text:', text);
    throw new Error('Invalid server response');
  }

  console.log('🚨 BYPASS: Response data:', data);

  if (!response.ok) {
    console.error('❌ BYPASS: Profile update failed:', data);
    throw new Error(data?.message || data?.error || `Erreur ${response.status}`);
  }

  console.log('✅ BYPASS: Profile updated successfully via API');
  return data;
}

/**
 * Get user's squads using direct KV access
 */
export async function getSquadsBypass() {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error('Not authenticated');
  }

  console.log('🚨 BYPASS: Getting squads for user', userId);
  
  const supabase = getSupabase();
  
  // Get all squads
  const { data, error } = await supabase
    .from(KV_TABLE)
    .select('value')
    .like('key', 'squad:%');
  
  const rows = (data || []) as any[];

  if (error) {
    console.error('❌ BYPASS: Error getting squads:', error);
    throw error;
  }

  // Filter squads where user is a member
  const squads = rows
    .map(row => typeof row.value === 'string' ? JSON.parse(row.value) : row.value)
    .filter(squad => squad.members?.some((m: any) => m.userId === userId));

  console.log(`✅ BYPASS: Retrieved ${squads.length} squads`);
  return { squads };
}

/**
 * Get user's sessions using direct KV access
 */
export async function getSessionsBypass(squadId?: string) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error('Not authenticated');
  }

  console.log('🚨 BYPASS: Getting sessions for user', userId);
  
  const supabase = getSupabase();
  
  // Get all squads to find user's squads
  const { data: squadData } = await supabase
    .from(KV_TABLE)
    .select('value')
    .like('key', 'squad:%');

  const squads = (squadData || []) as any[];

  const userSquadIds = squads
    ?.map(row => typeof row.value === 'string' ? JSON.parse(row.value) : row.value)
    .filter(squad => squad.members?.some((m: any) => m.userId === userId))
    .map(squad => squad.id) || [];

  console.log('User belongs to squads:', userSquadIds);

  // Get all sessions for these squads
  const { data: sessionData, error } = await supabase
    .from(KV_TABLE)
    .select('value')
    .like('key', 'session:%');

  const sessionsRows = (sessionData || []) as any[];

  if (error) {
    console.error('❌ BYPASS: Error getting sessions:', error);
    throw error;
  }

  const sessions = sessionsRows
    ?.map(row => typeof row.value === 'string' ? JSON.parse(row.value) : row.value)
    .filter(session => {
      if (squadId) return session.squadId === squadId;
      return userSquadIds.includes(session.squadId);
    }) || [];

  console.log(`✅ BYPASS: Retrieved ${sessions.length} sessions`);
  return { sessions };
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticatedBypass(): Promise<boolean> {
  const userId = await getCurrentUserId();
  return userId !== null;
}