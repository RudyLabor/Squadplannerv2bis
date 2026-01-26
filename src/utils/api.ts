// 🔗 SQUAD PLANNER - API Client
// Centralized API calls to Supabase backend

import { projectId, publicAnonKey } from '@/utils/supabase/info';
import { getSupabase } from '@/utils/supabase/client';
import { getProfileBypass, getSquadsBypass, getSessionsBypass, updateProfileBypass } from '@/utils/api-bypass';
import { USE_BYPASS_MODE } from '@/utils/api-config';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-e884809f`;

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
    
    console.log('Session expiry check:', {
      expiresAt: new Date(expiresAt).toISOString(),
      now: new Date(now).toISOString(),
      timeUntilExpiry: `${Math.floor(timeUntilExpiry / 1000)}s`,
      isExpired: timeUntilExpiry <= 0
    });
    
    // If expired or expiring soon (within 5 minutes), refresh
    if (timeUntilExpiry <= 5 * 60 * 1000) {
      console.log('⚠️ Session expired or expiring soon, refreshing...');
      const newToken = await refreshSessionOnce();
      
      if (newToken) {
        console.log('✅ Using refreshed token');
        console.log('🔑 === GET AUTH TOKEN END (REFRESHED) ===');
        return newToken;
      } else {
        console.log('❌ Failed to refresh, using existing token anyway');
        console.log('🔑 === GET AUTH TOKEN END (REFRESH FAILED) ===');
        return session.access_token;
      }
    }
  }
  
  console.log('✅ Using existing valid token');
  console.log('🔑 === GET AUTH TOKEN END (VALID) ===');
  return session.access_token;
}

// Helper to make authenticated API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
}

// ============================================================
// AUTH API
// ============================================================

export const authAPI = {
  /**
   * Get current user profile
   */
  async getProfile() {
    if (USE_BYPASS_MODE) {
      console.log('🚨 Using BYPASS mode for getProfile');
      return getProfileBypass();
    }
    
    return apiCall('/auth/profile');
  },

  /**
   * Update user profile
   */
  async updateProfile(profileData: any) {
    if (USE_BYPASS_MODE) {
      console.log('🚨 Using BYPASS mode for updateProfile');
      return updateProfileBypass(profileData);
    }
    
    return apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  /**
   * Check auth status
   */
  async checkAuth() {
    const supabase = getSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    return {
      isAuthenticated: !!session,
      user: session?.user || null,
    };
  },
};

// ============================================================
// SQUADS API
// ============================================================

export const squadsAPI = {
  /**
   * Get all squads for current user
   */
  async getSquads() {
    if (USE_BYPASS_MODE) {
      console.log('🚨 Using BYPASS mode for getSquads');
      return getSquadsBypass();
    }
    
    return apiCall('/squads');
  },

  /**
   * Get a specific squad
   */
  async getSquad(squadId: string) {
    return apiCall(`/squads/${squadId}`);
  },

  /**
   * Create a new squad
   */
  async createSquad(squadData: any) {
    return apiCall('/squads', {
      method: 'POST',
      body: JSON.stringify(squadData),
    });
  },

  /**
   * Update a squad
   */
  async updateSquad(squadId: string, squadData: any) {
    return apiCall(`/squads/${squadId}`, {
      method: 'PUT',
      body: JSON.stringify(squadData),
    });
  },

  /**
   * Delete a squad
   */
  async deleteSquad(squadId: string) {
    return apiCall(`/squads/${squadId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Add member to squad
   */
  async addMember(squadId: string, email: string) {
    return apiCall(`/squads/${squadId}/members`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Remove member from squad
   */
  async removeMember(squadId: string, userId: string) {
    return apiCall(`/squads/${squadId}/members/${userId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================================
// SESSIONS API
// ============================================================

export const sessionsAPI = {
  /**
   * Get all sessions for a squad
   */
  async getSessions(squadId?: string) {
    if (USE_BYPASS_MODE && squadId) {
      console.log('🚨 Using BYPASS mode for getSessions');
      return getSessionsBypass(squadId);
    }
    
    const endpoint = squadId ? `/sessions?squadId=${squadId}` : '/sessions';
    return apiCall(endpoint);
  },

  /**
   * Get a specific session
   */
  async getSession(sessionId: string) {
    return apiCall(`/sessions/${sessionId}`);
  },

  /**
   * Create a new session
   */
  async createSession(sessionData: any) {
    return apiCall('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  },

  /**
   * Update a session
   */
  async updateSession(sessionId: string, sessionData: any) {
    return apiCall(`/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    });
  },

  /**
   * Delete a session
   */
  async deleteSession(sessionId: string) {
    return apiCall(`/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  },

  /**
   * RSVP to a session
   */
  async rsvp(sessionId: string, status: 'yes' | 'no' | 'maybe') {
    return apiCall(`/sessions/${sessionId}/rsvp`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Check in to a session
   */
  async checkIn(sessionId: string) {
    return apiCall(`/sessions/${sessionId}/checkin`, {
      method: 'POST',
    });
  },
};

// ============================================================
// STATS API
// ============================================================

export const statsAPI = {
  /**
   * Get user statistics
   */
  async getUserStats(userId: string) {
    return apiCall(`/stats/user/${userId}`);
  },

  /**
   * Get squad statistics
   */
  async getSquadStats(squadId: string) {
    return apiCall(`/stats/squad/${squadId}`);
  },

  /**
   * Get reliability score
   */
  async getReliabilityScore(userId: string) {
    return apiCall(`/stats/reliability/${userId}`);
  },
};

// ============================================================
// ANALYTICS API
// ============================================================

export const analyticsAPI = {
  /**
   * Track event
   */
  async trackEvent(eventName: string, eventData?: any) {
    return apiCall('/analytics/track', {
      method: 'POST',
      body: JSON.stringify({ event: eventName, data: eventData }),
    });
  },

  /**
   * Get analytics dashboard data
   */
  async getDashboard() {
    return apiCall('/analytics/dashboard');
  },
};

// ============================================================
// NOTIFICATIONS API  
// ============================================================

export const notificationsAPI = {
  /**
   * Get user notifications
   */
  async getNotifications() {
    return apiCall('/notifications');
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string) {
    return apiCall(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string) {
    return apiCall(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================================
// INVITES API
// ============================================================

export const invitesAPI = {
  /**
   * Create squad invite
   */
  async createInvite(squadId: string, options?: any) {
    return apiCall('/invites', {
      method: 'POST',
      body: JSON.stringify({ squadId, ...options }),
    });
  },

  /**
   * Get invite by code
   */
  async getInvite(inviteCode: string) {
    return apiCall(`/invites/${inviteCode}`);
  },

  /**
   * Accept invite
   */
  async acceptInvite(inviteCode: string) {
    return apiCall(`/invites/${inviteCode}/accept`, {
      method: 'POST',
    });
  },

  /**
   * Revoke invite
   */
  async revokeInvite(inviteCode: string) {
    return apiCall(`/invites/${inviteCode}`, {
      method: 'DELETE',
    });
  },
};

// ============================================================
// WEBHOOKS API
// ============================================================

export const webhooksAPI = {
  /**
   * Get user webhooks
   */
  async getWebhooks() {
    return apiCall('/webhooks');
  },

  /**
   * Create webhook
   */
  async createWebhook(webhookData: any) {
    return apiCall('/webhooks', {
      method: 'POST',
      body: JSON.stringify(webhookData),
    });
  },

  /**
   * Delete webhook
   */
  async deleteWebhook(webhookId: string) {
    return apiCall(`/webhooks/${webhookId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Test webhook
   */
  async testWebhook(webhookId: string) {
    return apiCall(`/webhooks/${webhookId}/test`, {
      method: 'POST',
    });
  },
};

// ============================================================
// INTELLIGENCE API (IA Features - ROADMAP #1)
// ============================================================

export const intelligenceAPI = {
  /**
   * Get smart suggestions for squad scheduling
   */
  async getSmartSuggestions(squadId: string) {
    return apiCall(`/intelligence/suggestions/${squadId}`);
  },

  /**
   * Get availability heatmap for squad
   */
  async getAvailabilityHeatmap(squadId: string) {
    return apiCall(`/intelligence/heatmap/${squadId}`);
  },

  /**
   * Get members stats for squad
   */
  async getMembersStats(squadId: string) {
    return apiCall(`/intelligence/members-stats/${squadId}`);
  },

  /**
   * Get AI-powered scheduling recommendations
   */
  async getSchedulingRecommendations(squadId: string, options?: any) {
    return apiCall(`/intelligence/recommendations/${squadId}`, {
      method: 'POST',
      body: JSON.stringify(options || {}),
    });
  },
};

// Export all APIs
export default {
  auth: authAPI,
  squads: squadsAPI,
  sessions: sessionsAPI,
  stats: statsAPI,
  analytics: analyticsAPI,
  notifications: notificationsAPI,
  invites: invitesAPI,
  webhooks: webhooksAPI,
  intelligence: intelligenceAPI,
};