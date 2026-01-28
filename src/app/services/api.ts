import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

// ============================================================================
// USERS API
// ============================================================================

export const usersAPI = {
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return { user: data };
  },

  updateProfile: async (userId: string, data: any) => {
    const { data: user, error } = await supabase
      .from('users')
      .update(data)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { user };
  },

  searchUsers: async (query: string) => {
    if (!query) return { users: [] };
    
    const { data, error } = await supabase
      .from('users')
      .select('id, username, display_name, avatar_url, reliability_score')
      .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
      .limit(10);
      
    if (error) throw error;
    return { users: data || [] };
  },

  getStats: async (userId: string) => {
    // 1. Base user stats
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('total_sessions, sessions_attended, reliability_score, xp_points, level')
      .eq('id', userId)
      .single();
      
    if (userError) throw userError;

    // 2. Squad count
    const { count: squadCount } = await supabase
      .from('squad_members')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // 3. Achievement count
    const { count: achievementCount } = await supabase
      .from('user_achievements')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('unlocked', true);

    return { 
      stats: {
        ...user,
        totalSquads: squadCount || 0,
        achievementsUnlocked: achievementCount || 0
      }
    };
  },

  getAchievements: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*, achievement:achievements(*)')
      .eq('user_id', userId);
      
    if (error) throw error;
    return { achievements: data || [] };
  },
};

// ============================================================================
// SQUADS API
// ============================================================================

export const squadsAPI = {
  getAll: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get squads where user is a member
    const { data: squads, error } = await supabase
      .from('squads')
      .select('*, owner:users!owner_id(username, display_name, avatar_url), squad_members!inner(user_id)')
      .eq('squad_members.user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { squads: squads || [] };
  },

  getById: async (squadId: string) => {
    const { data, error } = await supabase
      .from('squads')
      .select(`
        *,
        owner:users!owner_id(id, username, display_name, avatar_url),
        members:squad_members(
          id,
          role,
          sessions_attended,
          reliability_score,
          joined_at,
          user:users(id, username, display_name, avatar_url, reliability_score)
        )
      `)
      .eq('id', squadId)
      .single();

    if (error) throw error;
    return { squad: data };
  },

  create: async (data: {
    name: string;
    description?: string;
    game: string;
    gameMode?: string;
    maxMembers?: number;
    isPublic?: boolean;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // 1. Create Squad
    const { data: squad, error: squadError } = await supabase
      .from('squads')
      .insert({
        name: data.name,
        description: data.description,
        game: data.game,
        game_mode: data.gameMode,
        max_members: data.maxMembers || 6,
        is_public: data.isPublic || false,
        owner_id: user.id
      })
      .select()
      .single();

    if (squadError) throw squadError;

    // 2. Add owner as member (Trigger might handle this, but let's be safe)
    const { error: memberError } = await supabase
      .from('squad_members')
      .insert({
        squad_id: squad.id,
        user_id: user.id,
        role: 'owner'
      });

    if (memberError) {
        // If it's a duplicate key/constraint error, the trigger likely did it already
        if (memberError.code !== '23505') throw memberError;
    }

    return { squad };
  },

  update: async (squadId: string, data: any) => {
    const { data: squad, error } = await supabase
      .from('squads')
      .update(data)
      .eq('id', squadId)
      .select()
      .single();

    if (error) throw error;
    return { squad };
  },

  join: async (inviteCode: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // 1. Find squad
    const { data: squad, error: squadError } = await supabase
      .from('squads')
      .select('id, max_members, total_members')
      .eq('invite_code', inviteCode)
      .single();

    if (squadError) throw new Error('Invalid invite code');

    // 2. Check capacity
    if (squad.total_members >= squad.max_members) {
        throw new Error('Squad is full');
    }

    // 3. Insert member
    const { error: joinError } = await supabase
      .from('squad_members')
      .insert({
        squad_id: squad.id,
        user_id: user.id,
        role: 'member'
      });

    if (joinError) {
        if (joinError.code === '23505') throw new Error('Already a member');
        throw joinError;
    }
    
    // 4. Return new squad details
    return squadsAPI.getById(squad.id);
  },

  leave: async (squadId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('squad_members')
      .delete()
      .eq('squad_id', squadId)
      .eq('user_id', user.id);

    if (error) throw error;
    return { success: true };
  },

  getStats: async (squadId: string) => {
    // Basic stats placeholder - real implementation would aggregate data
    return { stats: { matchWinRate: 0, attendance: 0 } };
  },

  getSessions: async (squadId: string, status?: 'upcoming' | 'past' | 'all') => {
    let query = supabase
      .from('sessions')
      .select(`
        *,
        proposed_by_user:users!proposed_by(id, username, display_name, avatar_url),
        rsvps:session_rsvps(
          id,
          response,
          user:users(id, username, display_name, avatar_url)
        )
      `)
      .eq('squad_id', squadId)
      .order('scheduled_date', { ascending: true });

    if (status === 'upcoming') {
      query = query.gte('scheduled_date', new Date().toISOString().split('T')[0]);
    } else if (status === 'past') {
      query = query.lt('scheduled_date', new Date().toISOString().split('T')[0]);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { sessions: data || [] };
  },

  getMessages: async (squadId: string, limit = 50) => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        user:users(id, username, display_name, avatar_url)
      `)
      .eq('squad_id', squadId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { messages: (data || []).reverse() };
  },
};

// ============================================================================
// SESSIONS API
// ============================================================================

export const sessionsAPI = {
  getById: async (sessionId: string) => {
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        squad:squads(id, name, game),
        proposed_by_user:users!proposed_by(id, username, display_name, avatar_url),
        rsvps:session_rsvps(
          id,
          response,
          notes,
          responded_at,
          user:users(id, username, display_name, avatar_url, reliability_score)
        )
      `)
      .eq('id', sessionId)
      .single();

    if (error) throw error;
    return { session: data };
  },

  create: async (data: {
    squadId: string;
    title: string;
    description?: string;
    scheduledDate: string;
    scheduledTime: string;
    duration?: string;
    requiredPlayers?: number;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: session, error } = await supabase
      .from('sessions')
      .insert({
        squad_id: data.squadId,
        title: data.title,
        description: data.description,
        proposed_by: user.id,
        scheduled_date: data.scheduledDate,
        scheduled_time: data.scheduledTime,
        duration: data.duration,
        required_players: data.requiredPlayers || 5,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    
    // Notifications trigger should handle notifying members
    return { session };
  },

  update: async (sessionId: string, data: any) => {
    const { data: session, error } = await supabase
      .from('sessions')
      .update(data)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return { session };
  },

  rsvp: async (sessionId: string, response: 'yes' | 'no' | 'maybe', notes?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('session_rsvps')
      .upsert({
        session_id: sessionId,
        user_id: user.id,
        response,
        notes
      }, {
        onConflict: 'session_id,user_id'
      })
      .select()
      .single();

    if (error) throw error;
    return { rsvp: data };
  },
};

// ============================================================================
// NOTIFICATIONS API
// ============================================================================

export const notificationsAPI = {
  getAll: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return { notifications: data || [] };
  },

  markAsRead: async (notificationId: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return { notification: data };
  },

  markAllAsRead: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('read', false);

    if (error) throw error;
    return { success: true };
  },
};

// ============================================================================
// MESSAGES API
// ============================================================================

export const messagesAPI = {
  send: async (data: {
    squadId: string;
    content: string;
    type?: 'text' | 'system' | 'image' | 'file';
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        squad_id: data.squadId,
        user_id: user.id,
        content: data.content,
        type: data.type || 'text'
      })
      .select()
      .single();

    if (error) throw error;
    return { message };
  },
};

// ============================================================================
// HEALTH CHECK
// ============================================================================

export const healthCheck = async () => {
  // Simple check to Supabase
  const { error } = await supabase.from('users').select('count', { count: 'exact', head: true }).limit(1);
  return { 
    status: error ? 'error' : 'ok', 
    message: error ? error.message : 'Services operational' 
  };
};

export { supabase }; // Export for specific custom queries if needed
