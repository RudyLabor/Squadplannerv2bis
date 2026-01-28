import { getSupabase } from '@/utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';

const KV_TABLE = 'kv_store_e884809f';

// Helper to get current user ID
async function getCurrentUserId(): Promise<string | null> {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id || null;
}

// Helper for KV operations
async function getKV(key: string) {
  const supabase = getSupabase();
  const { data, error } = await (supabase
    .from(KV_TABLE) as any)
    .select('value')
    .eq('key', key)
    .single();

  if (error || !data) return null;
  return typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
}

async function setKV(key: string, value: any) {
  const supabase = getSupabase();
  const { error } = await (supabase
    .from(KV_TABLE) as any)
    .upsert({ 
      key, 
      value: typeof value === 'string' ? value : JSON.stringify(value),
      updated_at: new Date().toISOString()
    });

  if (error) throw error;
  return value;
}

async function listKV(prefix: string) {
  const supabase = getSupabase();
  const { data, error } = await (supabase
    .from(KV_TABLE) as any)
    .select('value')
    .like('key', `${prefix}%`);

  if (error) throw error;
  return (data || []).map((row: any) => typeof row.value === 'string' ? JSON.parse(row.value) : row.value);
}

// ============================================================
// AUTH API
// ============================================================

export const authAPI = {
  async getProfile() {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('Not authenticated');

    let profile = await getKV(`user:${userId}`);
    
    if (!profile) {
      // Create default profile
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      
      profile = {
        id: userId,
        email: session?.user?.email || '',
        name: session?.user?.email?.split('@')[0] || 'User',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        isPremium: false,
        badges: [],
        stats: {
          totalSessions: 0,
          sessionsAttended: 0,
          reliabilityScore: 100,
          squadCount: 0
        },
        createdAt: new Date().toISOString()
      };
      await setKV(`user:${userId}`, profile);
    }
    
    return { profile }; // Match expected API response format
  },

  async updateProfile(updates: any) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('Not authenticated');

    const current = await getKV(`user:${userId}`) || {};
    const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
    await setKV(`user:${userId}`, updated);
    return { profile: updated };
  }
};

// ============================================================
// SQUADS API
// ============================================================

export const squadsAPI = {
  async getSquads() {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('Not authenticated');

    const allSquads = await listKV('squad:');
    const userSquads = allSquads.filter((s: any) => 
      s.members?.some((m: any) => m.userId === userId)
    );

    return { squads: userSquads };
  },

  async getSquad(squadId: string) {
    const squad = await getKV(`squad:${squadId}`);
    if (!squad) throw new Error('Squad not found');
    return { squad };
  },

  async createSquad(squadData: any) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('Not authenticated');

    const squadId = uuidv4();
    const newSquad = {
      id: squadId,
      ...squadData,
      ownerId: userId,
      members: [{ userId, role: 'owner', joinedAt: new Date().toISOString() }],
      createdAt: new Date().toISOString()
    };

    await setKV(`squad:${squadId}`, newSquad);
    return { squad: newSquad };
  },

  async updateSquad(squadId: string, updates: any) {
    const current = await getKV(`squad:${squadId}`);
    if (!current) throw new Error('Squad not found');
    
    const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
    await setKV(`squad:${squadId}`, updated);
    return { squad: updated };
  },

  async deleteSquad(squadId: string) {
    // In KV store, we'd typically need a DELETE operation. 
    // Supabase JS delete:
    const supabase = getSupabase();
    await supabase.from(KV_TABLE).delete().eq('key', `squad:${squadId}`);
    return { success: true };
  },

  async join(squadId: string) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('Not authenticated');

    const squad = await getKV(`squad:${squadId}`);
    if (!squad) throw new Error('Squad not found');

    if (!squad.members.some((m: any) => m.userId === userId)) {
      squad.members.push({ userId, role: 'member', joinedAt: new Date().toISOString() });
      await setKV(`squad:${squadId}`, squad);
    }

    return { squad };
  },

  async getMessages(squadId: string) {
    const messages = await listKV(`msg:${squadId}:`);
    // Sort by createdAt
    messages.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return { messages };
  },

  async sendMessage(squadId: string, messageData: any) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('Not authenticated');

    const messageId = uuidv4();
    const newMessage = {
      id: messageId,
      squadId,
      userId,
      ...messageData,
      createdAt: new Date().toISOString(),
      reactions: []
    };

    await setKV(`msg:${squadId}:${messageId}`, newMessage);
    return { message: newMessage };
  }
};

// ============================================================
// SESSIONS API
// ============================================================

export const sessionsAPI = {
  async getSessions(squadId?: string) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('Not authenticated');

    const allSessions = await listKV('session:');
    let sessions = allSessions;

    if (squadId) {
      sessions = sessions.filter((s: any) => s.squadId === squadId);
    } else {
      // Filter for sessions in squads the user is part of
      const userSquads = await squadsAPI.getSquads();
      const squadIds = userSquads.squads.map((s: any) => s.id);
      sessions = sessions.filter((s: any) => squadIds.includes(s.squadId));
    }

    return { sessions };
  },

  async createSession(squadId: string, sessionData: any) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('Not authenticated');

    const sessionId = uuidv4();
    const newSession = {
      id: sessionId,
      squadId,
      createdBy: userId,
      ...sessionData,
      attendees: [],
      createdAt: new Date().toISOString()
    };

    await setKV(`session:${sessionId}`, newSession);
    return { session: newSession };
  },

  async rsvp(sessionId: string, slotId: string, response: 'yes' | 'no' | 'maybe') {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('Not authenticated');

    const session = await getKV(`session:${sessionId}`);
    if (!session) throw new Error('Session not found');

    // Simple implementation: update attendees list
    // Remove existing rsvp for this user if any
    session.attendees = (session.attendees || []).filter((a: any) => a.userId !== userId);
    
    session.attendees.push({
      userId,
      slotId,
      response,
      timestamp: new Date().toISOString()
    });

    await setKV(`session:${sessionId}`, session);
    return { session };
  }
};

// ============================================================
// NOTIFICATIONS & OTHER APIS (Mocked/Simplified)
// ============================================================

export const notificationsAPI = {
  async getNotifications() {
    // Return empty for now, or implement KV storage
    return { notifications: [] };
  },
  async getUserNotifications() { // Alias
    return { notifications: [] };
  },
  async markAsRead() { return { success: true }; },
  async deleteNotification() { return { success: true }; }
};

export const invitesAPI = {
  async createInvite() { return { code: '123456' }; }, // Mock
  async getInvite() { return { invite: null }; },
  async acceptInvite() { return { success: true }; },
  async revokeInvite() { return { success: true }; }
};

export const intelligenceAPI = {
  async getSmartSuggestions() { return { suggestions: [] }; },
  async getAvailabilityHeatmap() { return { heatmap: [] }; },
  async getMembersStats() { return { stats: [] }; },
  async getSchedulingRecommendations() { return { recommendations: [] }; }
};

export default {
  auth: authAPI,
  squads: squadsAPI,
  sessions: sessionsAPI,
  notifications: notificationsAPI,
  invites: invitesAPI,
  intelligence: intelligenceAPI
};
