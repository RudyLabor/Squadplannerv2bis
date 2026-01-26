// 🔗 SQUAD PLANNER - API Client
// Centralized API calls to Supabase backend

import { projectId, publicAnonKey } from '@/utils/supabase/info';
import { getSupabase } from '@/utils/supabase/client';
import { getProfileBypass, getSquadsBypass, getSessionsBypass, updateProfileBypass } from '@/utils/api-bypass';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-e884809f`;

// 🚨 BYPASS MODE: Set to true to use direct KV access instead of Edge Functions
// This is a temporary workaround for the "Invalid JWT" error
const USE_BYPASS_MODE = true;

// ============================================================
// SESSION REFRESH SINGLETON
// ============================================================
// Prevents multiple simultaneous session refresh calls which can trigger rate limits

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshSessionOnce(): Promise<string | null> {
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    console.log('🔄 Session refresh already in progress, waiting...');
    return refreshPromise;
  }

  // Start a new refresh
  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      console.log('🔄 Starting session refresh...');
      const supabase = getSupabase();
      
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('❌ Failed to refresh session:', refreshError.message);
        return null;
      }
      
      if (!refreshData.session) {
        console.error('❌ No session after refresh');
        return null;
      }
      
      console.log('✅ Session refreshed successfully');
      return refreshData.session.access_token;
    } catch (error: any) {
      console.error('❌ Exception during session refresh:', error);
      return null;
    } finally {
      // Reset after a delay to allow the new token to be used
      setTimeout(() => {
        isRefreshing = false;
        refreshPromise = null;
      }, 1000);
    }
  })();

  return refreshPromise;
}

// Helper to get auth token
async function getAuthToken(): Promise<string | null> {
  const supabase = getSupabase();
  
  console.log('🔑 === GET AUTH TOKEN START ===');
  
  // First, try to get the current session
  let { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error('❌ Error getting session:', sessionError);
    return null;
  }
  
  // If no session, return null immediately
  if (!session) {
    console.log('❌ No active session found');
    console.log('🔑 === GET AUTH TOKEN END (NO SESSION) ===');
    return null;
  }
  
  console.log('✅ Session found:', {
    userId: session.user?.id,
    email: session.user?.email,
    expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'unknown'
  });
  
  // If session exists but is expired, refresh it
  if (session && session.expires_at) {
    const expiresAt = session.expires_at * 1000; // Convert to milliseconds
    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;
    
    console.log('Session check:', {
      expiresAt: new Date(expiresAt).toISOString(),
      now: new Date(now).toISOString(),
      timeUntilExpiry: Math.round(timeUntilExpiry / 1000) + ' seconds',
      isExpired: timeUntilExpiry <= 0
    });
    
    // If session is already expired, we must refresh it
    if (timeUntilExpiry <= 0) {
      console.log('❌ Session has expired, attempting refresh...');
      const token = await refreshSessionOnce();
      
      if (!token) {
        console.error('❌ Session expired and refresh failed - user must re-authenticate');
        console.log('🔑 === GET AUTH TOKEN END (REFRESH FAILED) ===');
        return null;
      }
      
      session = { ...session, access_token: token };
      console.log('✅ Expired session refreshed successfully');
    } 
    // If session expires soon (< 5 min), try to refresh but continue with current token if refresh fails
    else if (timeUntilExpiry < 5 * 60 * 1000) {
      console.log('⚠️ Session expiring soon, attempting proactive refresh...');
      const token = await refreshSessionOnce();
      
      if (token) {
        session = { ...session, access_token: token };
        console.log('✅ Session refreshed proactively');
      } else {
        console.log('⚠️ Proactive refresh failed, but current token still valid - continuing with current token');
        // Continue with current token since it's still valid
      }
    }
  }
  
  if (session?.access_token) {
    console.log('✅ Auth token retrieved:', {
      hasToken: true,
      tokenLength: session.access_token.length,
      tokenPreview: session.access_token.substring(0, 20) + '...',
      expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'unknown',
      user: session.user?.email
    });
    console.log('🔑 === GET AUTH TOKEN END (SUCCESS) ===');
    return session.access_token;
  } else {
    console.log('❌ No valid auth token available in session');
    console.log('🔑 === GET AUTH TOKEN END (NO TOKEN) ===');
    return null;
  }
}

// Helper to make authenticated API calls
async function authenticatedFetch(path: string, options: RequestInit = {}, isRetry: boolean = false): Promise<any> {
  console.log(`📡 === API CALL START: ${path} ===`);
  console.log(`📡 Is retry: ${isRetry}`);
  
  const token = await getAuthToken();
  
  console.log(`📡 Token retrieved:`, {
    hasToken: !!token,
    tokenLength: token?.length,
    tokenPreview: token ? token.substring(0, 30) + '...' : 'null'
  });
  
  if (!token) {
    console.error('❌ No token available for authenticated request');
    throw new Error('Vous devez être connecté pour effectuer cette action');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  console.log(`📡 Making request to: ${API_BASE}${path}`);
  
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  console.log(`📡 Response received:`, {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok
  });

  let data;
  try {
    data = await response.json();
    console.log(`📡 Response data:`, data);
  } catch (e) {
    console.log('📡 No JSON in response');
    data = null;
  }

  if (!response.ok) {
    // Handle 401 Unauthorized errors with automatic token refresh
    if (response.status === 401 && !isRetry) {
      console.log(`🔄 401 Unauthorized for [${path}] - Token may be expired, attempting refresh...`);
      
      // Use the singleton refresh to avoid rate limiting
      const newToken = await refreshSessionOnce();
      
      if (!newToken) {
        console.error('❌ Session refresh failed after 401 - User must re-authenticate');
        console.log('Server response:', data);
        // Clear local storage and redirect to login will be handled by AuthContext
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }
      
      console.log('✅ Session refreshed after 401, retrying request...');
      
      // Retry the request with the new token (pass isRetry=true to prevent infinite loop)
      return authenticatedFetch(path, options, true);
    }
    
    // Use different log levels based on status
    if (response.status === 401) {
      // 401 after retry is a real auth issue
      console.error(`❌ Authentication failed even after refresh [${path}]:`, {
        status: response.status,
        serverResponse: data,
        message: data?.message || data?.error || 'Unauthorized'
      });
      // This means the token is truly invalid (not just expired) or server can't verify it
      throw new Error('Session invalide. Veuillez vous reconnecter.');
    } else {
      // Other errors are actual errors
      console.error(`API Error [${path}]:`, {
        status: response.status,
        statusText: response.statusText,
        data,
      });
    }
    
    throw new Error(data?.message || data?.error || `Erreur ${response.status}`);
  }

  return data;
}

// ============================================================
// AUTH API
// ============================================================

export const authAPI = {
  async signUp(email: string, password: string, name: string, avatar?: string) {
    // Sign up doesn't need user authentication, but still needs the public anon key
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`, // Supabase requires anon key for all requests
      },
      body: JSON.stringify({ email, password, name, avatar }),
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }

    if (!response.ok) {
      console.error('Sign up error:', data);
      throw new Error(data?.message || data?.error || `Erreur ${response.status}`);
    }

    return data;
  },

  async checkUser(email: string) {
    const response = await fetch(`${API_BASE}/auth/check-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ email }),
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }

    if (!response.ok) {
      console.error('Check user error:', data);
      throw new Error(data?.message || data?.error || `Erreur ${response.status}`);
    }

    return data;
  },

  async resetPassword(email: string, newPassword: string) {
    const response = await fetch(`${API_BASE}/auth/reset-password-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ email, newPassword }),
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }

    if (!response.ok) {
      console.error('Reset password error:', data);
      throw new Error(data?.message || data?.error || `Erreur ${response.status}`);
    }

    return data;
  },

  async getProfile() {
    if (USE_BYPASS_MODE) {
      return getProfileBypass();
    }
    return authenticatedFetch('/auth/profile');
  },

  async updateProfile(updates: any) {
    if (USE_BYPASS_MODE) {
      return updateProfileBypass(updates);
    }
    return authenticatedFetch('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};

// ============================================================
// SQUADS API
// ============================================================

export const squadsAPI = {
  async getAll() {
    if (USE_BYPASS_MODE) {
      return getSquadsBypass();
    }
    return authenticatedFetch('/squads');
  },

  async getById(id: string) {
    return authenticatedFetch(`/squads/${id}`);
  },

  async create(squad: any) {
    return authenticatedFetch('/squads', {
      method: 'POST',
      body: JSON.stringify(squad),
    });
  },

  async join(inviteCode: string) {
    return authenticatedFetch('/squads/join', {
      method: 'POST',
      body: JSON.stringify({ inviteCode }),
    });
  },

  async update(id: string, updates: any) {
    return authenticatedFetch(`/squads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async delete(id: string) {
    return authenticatedFetch(`/squads/${id}`, {
      method: 'DELETE',
    });
  },

  async getMessages(squadId: string, limit = 50) {
    return authenticatedFetch(`/squads/${squadId}/messages?limit=${limit}`);
  },

  async sendMessage(squadId: string, content: string, type = 'text') {
    return authenticatedFetch(`/squads/${squadId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, type }),
    });
  },
};

// ============================================================
// SESSIONS API
// ============================================================

export const sessionsAPI = {
  async getAll() {
    if (USE_BYPASS_MODE) {
      return getSessionsBypass();
    }
    return authenticatedFetch('/sessions');
  },

  async getBySquad(squadId: string) {
    return authenticatedFetch(`/squads/${squadId}/sessions`);
  },

  async create(squadId: string, session: any) {
    return authenticatedFetch(`/squads/${squadId}/sessions`, {
      method: 'POST',
      body: JSON.stringify(session),
    });
  },

  async rsvp(sessionId: string, slotId: string, response: 'yes' | 'no' | 'maybe') {
    return authenticatedFetch(`/sessions/${sessionId}/rsvp`, {
      method: 'POST',
      body: JSON.stringify({ slotId, response }),
    });
  },

  async updateStatus(sessionId: string, status: string) {
    return authenticatedFetch(`/sessions/${sessionId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // ROADMAP #2: Check-in functionality
  async checkIn(sessionId: string, status: 'present' | 'late' | 'absent', note?: string) {
    return authenticatedFetch(`/sessions/${sessionId}/check-in`, {
      method: 'POST',
      body: JSON.stringify({ status, note }),
    });
  },

  async getCheckIns(sessionId: string) {
    return authenticatedFetch(`/sessions/${sessionId}/check-ins`);
  },
};

// ============================================================
// WEBHOOKS API
// ============================================================

export const webhooksAPI = {
  async getAll() {
    return authenticatedFetch('/webhooks');
  },

  async create(webhook: any) {
    return authenticatedFetch('/webhooks', {
      method: 'POST',
      body: JSON.stringify(webhook),
    });
  },

  async update(id: string, updates: any) {
    return authenticatedFetch(`/webhooks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async delete(id: string) {
    return authenticatedFetch(`/webhooks/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================================
// STATS & BADGES API
// ============================================================

export const statsAPI = {
  async getUserStats(userId: string) {
    return authenticatedFetch(`/users/${userId}/stats`);
  },

  async getLeaderboard() {
    return authenticatedFetch('/leaderboard');
  },
};

// ============================================================
// ROADMAP #3: AUTOMATISATION & INTELLIGENCE API
// ============================================================

export const intelligenceAPI = {
  // Get smart time slot suggestions based on historical data
  async getSmartSuggestions(squadId: string) {
    return authenticatedFetch(`/squads/${squadId}/smart-suggestions`);
  },

  // Create recurring session
  async createRecurringSession(squadId: string, config: {
    dayOfWeek: number;
    time: string;
    duration?: number;
    game?: string;
    title?: string;
  }) {
    return authenticatedFetch(`/squads/${squadId}/recurring-session`, {
      method: 'POST',
      body: JSON.stringify(config),
    });
  },

  // Get availability heatmap
  async getAvailabilityHeatmap(squadId: string) {
    return authenticatedFetch(`/squads/${squadId}/availability-heatmap`);
  },

  // Get members stats in batch
  async getMembersStats(squadId: string) {
    return authenticatedFetch(`/squads/${squadId}/members-stats`);
  },
};

export const notificationsAPI = {
  // Get user notifications
  async getUserNotifications(userId: string) {
    return authenticatedFetch(`/users/${userId}/notifications`);
  },

  // Mark notification as read
  async markAsRead(notificationId: string) {
    return authenticatedFetch('/notifications/mark-read', {
      method: 'POST',
      body: JSON.stringify({ notificationId }),
    });
  },
};

// ============================================================
// ANALYTICS API
// ============================================================

export const analyticsAPI = {
  async getHeatmap() {
    return authenticatedFetch('/analytics/heatmap');
  },

  async getSuggestions() {
    return authenticatedFetch('/analytics/suggestions');
  },

  async getSquadCohesion(squadId: string) {
    return authenticatedFetch(`/squads/${squadId}/cohesion`);
  },

  async getWeeklyRecap() {
    return authenticatedFetch('/analytics/weekly-recap');
  },
};

// ============================================================
// HEALTH CHECK
// ============================================================

export const healthAPI = {
  async check() {
    return authenticatedFetch('/health');
  },
};