
import { supabase } from '@/utils/supabase/client';

// ============================================================
// TYPES (aligned with SQL Schema)
// ============================================================

export interface Profile {
  id: string;
  email: string;
  username: string;
  avatar_url: string;
  is_premium: boolean;
  reliability_score: number;
  display_name?: string;
  bio?: string;
  location?: string;
  birthday?: string;
  favorite_game?: string;
  play_style?: string;
}

export interface Squad {
  id: string;
  owner_id: string;
  name: string;
  game: string;
  image_url: string;
  description: string;
  is_public: boolean;
  invite_code: string;
  created_at: string;
}

export interface Session {
  id: string;
  squad_id: string;
  created_by: string;
  title: string;
  start_time: string;
  end_time: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
}

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked' | 'rejected';
  created_at: string;
  accepted_at?: string;
}

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  xp_reward: number;
  badge_icon: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'special';
  start_date: string;
  end_date: string;
  objective: Record<string, unknown>;
  rewards: Record<string, unknown>;
  is_active: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  game: string;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'registration_open' | 'ongoing' | 'completed' | 'cancelled';
  format: string;
  max_teams: number;
  prize_pool: string;
}

export interface AvailabilitySlot {
  id: string;
  user_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_url?: string;
}

// ============================================================
// AUTH API
// ============================================================

export const authAPI = {
  async getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await (supabase
      .from('profiles') as any)
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        const newProfile = {
          id: user.id,
          email: user.email,
          username: user.user_metadata?.name || user.email?.split('@')[0],
          avatar_url: user.user_metadata?.avatar,
          reliability_score: 100
        };
        const { data: created } = await (supabase.from('profiles') as any).insert(newProfile).select().single();
        return created;
      }
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  },

  async updateProfile(updates: Partial<Profile>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await (supabase
      .from('profiles') as any)
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// ============================================================
// SQUADS API
// ============================================================

export const squadsAPI = {
  async getSquads() {
    const { data, error } = await (supabase
      .from('squads') as any)
      .select('*, members:squad_members(count)');

    if (error) {
      console.error('Error fetching squads:', error);
      return [];
    }

    return data.map((s: any) => ({
      ...s,
      memberCount: s.members?.[0]?.count || 1
    }));
  },

  async getSquad(id: string) {
    const { data, error } = await (supabase
      .from('squads') as any)
      .select(`
        *,
        members:squad_members (
            user:profiles (*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createSquad(squadData: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: squad, error } = await (supabase
      .from('squads') as any)
      .insert({
        owner_id: user.id,
        name: squadData.name,
        game: squadData.game,
        image_url: squadData.image_url,
        description: squadData.description,
        is_public: squadData.is_public
      })
      .select()
      .single();

    if (error) throw error;

    await (supabase.from('squad_members') as any).insert({
      squad_id: squad.id,
      user_id: user.id,
      role: 'owner'
    });

    return squad;
  },

  async joinSquad(inviteCode: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: squad, error: squadError } = await (supabase
      .from('squads') as any)
      .select('id, name')
      .eq('invite_code', inviteCode.toUpperCase())
      .single();

    if (squadError || !squad) throw new Error('Squad non trouvée');

    const { error } = await (supabase.from('squad_members') as any).insert({
      squad_id: squad.id,
      user_id: user.id,
      role: 'member'
    });

    if (error) {
      if (error.code === '23505') throw new Error('Déjà membre de cette squad');
      throw error;
    }

    return squad;
  },

  async leaveSquad(squadId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await (supabase.from('squad_members') as any)
      .delete()
      .eq('squad_id', squadId)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  async getPublicSquads() {
    const { data, error } = await (supabase
      .from('squads') as any)
      .select('*, members:squad_members(count)')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data.map((s: any) => ({
      ...s,
      memberCount: s.members?.[0]?.count || 1
    }));
  }
};

// ============================================================
// SESSIONS API
// ============================================================

export const sessionsAPI = {
  async getSessions(squadId?: string) {
    let query = (supabase.from('sessions') as any).select(`
        *,
        attendees:session_rsvps (
            response,
            user:profiles (id, username, avatar_url)
        )
    `);

    if (squadId) {
      query = query.eq('squad_id', squadId);
    }

    const { data, error } = await query.order('scheduled_date', { ascending: true });
    if (error) throw error;
    return { sessions: data || [] };
  },

  async getSession(sessionId: string) {
    const { data, error } = await (supabase
      .from('sessions') as any)
      .select(`
        *,
        squad:squads(*),
        attendees:session_rsvps (
            response,
            checked_in,
            user:profiles (id, username, avatar_url, reliability_score)
        )
      `)
      .eq('id', sessionId)
      .single();

    if (error) throw error;
    return { session: data };
  },

  async createSession(squadId: string, sessionData: any) {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await (supabase
      .from('sessions') as any)
      .insert({
        squad_id: squadId,
        proposed_by: user?.id,
        title: sessionData.title,
        description: sessionData.description,
        scheduled_date: sessionData.scheduled_date,
        scheduled_time: sessionData.scheduled_time,
        duration: sessionData.duration || '2 hours',
        game: sessionData.game,
        required_players: sessionData.required_players || 5,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return { session: data };
  },

  async rsvp(sessionId: string, response: 'yes' | 'no' | 'maybe') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await (supabase
      .from('session_rsvps') as any)
      .upsert({
        session_id: sessionId,
        user_id: user.id,
        response: response,
        responded_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return { rsvp: data };
  },

  async checkIn(sessionId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await (supabase
      .from('session_rsvps') as any)
      .update({
        checked_in: true,
        checked_in_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return { rsvp: data };
  },

  async updateStatus(sessionId: string, status: string) {
    const { data, error } = await (supabase
      .from('sessions') as any)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return { session: data };
  }
};

// ============================================================
// MESSAGES API
// ============================================================

export const messagesAPI = {
  async getMessages(squadId: string) {
    const { data, error } = await (supabase
      .from('messages') as any)
      .select(`
        *,
        user:profiles(id, username, avatar_url)
      `)
      .eq('squad_id', squadId)
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) throw error;
    return { messages: data || [] };
  },

  async sendMessage(squadId: string, content: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await (supabase
      .from('messages') as any)
      .insert({
        squad_id: squadId,
        user_id: user.id,
        content: content
      })
      .select(`*, user:profiles(id, username, avatar_url)`)
      .single();

    if (error) throw error;
    return { message: data };
  },

  subscribeToMessages(squadId: string, callback: (message: any) => void) {
    return supabase
      .channel(`messages:${squadId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `squad_id=eq.${squadId}`
      }, (payload) => {
        callback(payload.new);
      })
      .subscribe();
  }
};

// ============================================================
// FRIENDSHIPS API
// ============================================================

export const friendshipsAPI = {
  async getFriends() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await (supabase
      .from('friendships') as any)
      .select(`
        *,
        friend:profiles!friendships_friend_id_fkey(id, username, display_name, avatar_url, reliability_score)
      `)
      .eq('user_id', user.id)
      .eq('status', 'accepted');

    if (error) throw error;
    return { friends: data || [] };
  },

  async getPendingRequests() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await (supabase
      .from('friendships') as any)
      .select(`
        *,
        user:profiles!friendships_user_id_fkey(id, username, display_name, avatar_url)
      `)
      .eq('friend_id', user.id)
      .eq('status', 'pending');

    if (error) throw error;
    return { requests: data || [] };
  },

  async sendRequest(friendId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await (supabase
      .from('friendships') as any)
      .insert({
        user_id: user.id,
        friend_id: friendId,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') throw new Error('Demande déjà envoyée');
      throw error;
    }
    return { request: data };
  },

  async acceptRequest(requestId: string) {
    const { data, error } = await (supabase
      .from('friendships') as any)
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;
    return { friendship: data };
  },

  async rejectRequest(requestId: string) {
    const { data, error } = await (supabase
      .from('friendships') as any)
      .update({ status: 'rejected' })
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;
    return { friendship: data };
  },

  async removeFriend(friendshipId: string) {
    const { error } = await (supabase
      .from('friendships') as any)
      .delete()
      .eq('id', friendshipId);

    if (error) throw error;
  },

  async searchUsers(query: string) {
    const { data, error } = await (supabase
      .from('profiles') as any)
      .select('id, username, display_name, avatar_url, reliability_score')
      .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
      .limit(20);

    if (error) throw error;
    return { users: data || [] };
  }
};

// ============================================================
// ACHIEVEMENTS API
// ============================================================

export const achievementsAPI = {
  async getAll() {
    const { data, error } = await (supabase
      .from('achievements') as any)
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (error) throw error;
    return { achievements: data || [] };
  },

  async getUserProgress() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await (supabase
      .from('user_achievements') as any)
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq('user_id', user.id);

    if (error) throw error;
    return { progress: data || [] };
  },

  async getUnlocked() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await (supabase
      .from('user_achievements') as any)
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq('user_id', user.id)
      .eq('unlocked', true)
      .order('unlocked_at', { ascending: false });

    if (error) throw error;
    return { achievements: data || [] };
  }
};

// ============================================================
// BADGES API
// ============================================================

export const badgesAPI = {
  async getAll() {
    const { data, error } = await (supabase
      .from('badges') as any)
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (error) throw error;
    return { badges: data || [] };
  },

  async getUserBadges(userId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    const targetId = userId || user?.id;
    if (!targetId) throw new Error('Not authenticated');

    const { data, error } = await (supabase
      .from('user_badges') as any)
      .select(`
        *,
        badge:badges(*)
      `)
      .eq('user_id', targetId)
      .order('awarded_at', { ascending: false });

    if (error) throw error;
    return { badges: data || [] };
  }
};

// ============================================================
// CHALLENGES API
// ============================================================

export const challengesAPI = {
  async getActive() {
    const now = new Date().toISOString();
    const { data, error } = await (supabase
      .from('challenges') as any)
      .select('*')
      .eq('is_active', true)
      .gte('end_date', now)
      .order('start_date');

    if (error) throw error;
    return { challenges: data || [] };
  },

  async getUserProgress() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await (supabase
      .from('user_challenge_progress') as any)
      .select(`
        *,
        challenge:challenges(*)
      `)
      .eq('user_id', user.id)
      .eq('completed', false);

    if (error) throw error;
    return { progress: data || [] };
  },

  async joinChallenge(challengeId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: challenge } = await (supabase
      .from('challenges') as any)
      .select('objective')
      .eq('id', challengeId)
      .single();

    const { data, error } = await (supabase
      .from('user_challenge_progress') as any)
      .insert({
        user_id: user.id,
        challenge_id: challengeId,
        total_required: challenge?.objective?.target || 10,
        progress: 0
      })
      .select()
      .single();

    if (error) throw error;
    return { progress: data };
  },

  async claimReward(challengeId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await (supabase
      .from('user_challenge_progress') as any)
      .update({
        rewards_claimed: true,
        claimed_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('challenge_id', challengeId)
      .eq('completed', true)
      .select()
      .single();

    if (error) throw error;
    return { progress: data };
  }
};

// ============================================================
// TOURNAMENTS API
// ============================================================

export const tournamentsAPI = {
  async getAll(status?: string) {
    let query = (supabase
      .from('tournaments') as any)
      .select(`
        *,
        organizer:profiles!tournaments_organizer_id_fkey(username, display_name, avatar_url)
      `)
      .order('start_date', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { tournaments: data || [] };
  },

  async getTournament(tournamentId: string) {
    const { data, error } = await (supabase
      .from('tournaments') as any)
      .select(`
        *,
        organizer:profiles!tournaments_organizer_id_fkey(*),
        teams:tournament_teams(
          *,
          squad:squads(id, name, image_url, game)
        )
      `)
      .eq('id', tournamentId)
      .single();

    if (error) throw error;
    return { tournament: data };
  },

  async register(tournamentId: string, squadId: string) {
    const { data, error } = await (supabase
      .from('tournament_teams') as any)
      .insert({
        tournament_id: tournamentId,
        squad_id: squadId,
        status: 'registered'
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') throw new Error('Équipe déjà inscrite');
      throw error;
    }
    return { registration: data };
  },

  async withdraw(tournamentId: string, squadId: string) {
    const { error } = await (supabase
      .from('tournament_teams') as any)
      .delete()
      .eq('tournament_id', tournamentId)
      .eq('squad_id', squadId);

    if (error) throw error;
  }
};

// ============================================================
// LEAGUES API
// ============================================================

export const leaguesAPI = {
  async getAll(status?: string) {
    let query = (supabase
      .from('leagues') as any)
      .select('*')
      .order('start_date', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { leagues: data || [] };
  },

  async getLeague(leagueId: string) {
    const { data, error } = await (supabase
      .from('leagues') as any)
      .select(`
        *,
        teams:league_teams(
          *,
          squad:squads(id, name, image_url, game)
        )
      `)
      .eq('id', leagueId)
      .single();

    if (error) throw error;
    return { league: data };
  },

  async getStandings(leagueId: string) {
    const { data, error } = await (supabase
      .from('league_teams') as any)
      .select(`
        *,
        squad:squads(id, name, image_url)
      `)
      .eq('league_id', leagueId)
      .order('points', { ascending: false });

    if (error) throw error;
    return { standings: data || [] };
  }
};

// ============================================================
// AVAILABILITY API
// ============================================================

export const availabilityAPI = {
  async getSlots(startDate: string, endDate: string, userId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    const targetId = userId || user?.id;
    if (!targetId) throw new Error('Not authenticated');

    const { data, error } = await (supabase
      .from('availability_slots') as any)
      .select('*')
      .eq('user_id', targetId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date');

    if (error) throw error;
    return { slots: data || [] };
  },

  async setSlot(date: string, startTime: string, endTime: string, isAvailable: boolean) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await (supabase
      .from('availability_slots') as any)
      .upsert({
        user_id: user.id,
        date,
        start_time: startTime,
        end_time: endTime,
        is_available: isAvailable
      })
      .select()
      .single();

    if (error) throw error;
    return { slot: data };
  },

  async deleteSlot(slotId: string) {
    const { error } = await (supabase
      .from('availability_slots') as any)
      .delete()
      .eq('id', slotId);

    if (error) throw error;
  },

  async getSquadAvailability(squadId: string, date: string) {
    const { data: members } = await (supabase
      .from('squad_members') as any)
      .select('user_id')
      .eq('squad_id', squadId);

    if (!members?.length) return { availability: [] };

    const userIds = members.map((m: any) => m.user_id);

    const { data, error } = await (supabase
      .from('availability_slots') as any)
      .select(`
        *,
        user:profiles(id, username, avatar_url)
      `)
      .in('user_id', userIds)
      .eq('date', date)
      .eq('is_available', true);

    if (error) throw error;
    return { availability: data || [] };
  }
};

// ============================================================
// NOTIFICATIONS API
// ============================================================

export const notificationsAPI = {
  async getNotifications(limit: number = 50) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await (supabase
      .from('notifications') as any)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const unreadCount = data?.filter((n: any) => !n.read).length || 0;
    return { notifications: data || [], unreadCount };
  },

  async markAsRead(notificationId: string) {
    const { data, error } = await (supabase
      .from('notifications') as any)
      .update({
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return { notification: data };
  },

  async markAllAsRead() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await (supabase
      .from('notifications') as any)
      .update({
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('read', false);

    if (error) throw error;
  },

  subscribeToNotifications(callback: (notification: any) => void) {
    return supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return null;

      return supabase
        .channel(`notifications:${user.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          callback(payload.new);
        })
        .subscribe();
    });
  }
};

// ============================================================
// ANALYTICS API
// ============================================================

export const analyticsAPI = {
  async getSquadStats(squadId: string, periodType: 'daily' | 'weekly' | 'monthly' = 'weekly') {
    const { data, error } = await (supabase
      .from('analytics_squad') as any)
      .select('*')
      .eq('squad_id', squadId)
      .eq('period_type', periodType)
      .order('period_start', { ascending: false })
      .limit(10);

    if (error) throw error;
    return { stats: data || [] };
  },

  async getUserStats(periodType: 'daily' | 'weekly' | 'monthly' = 'weekly') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await (supabase
      .from('analytics_user') as any)
      .select('*')
      .eq('user_id', user.id)
      .eq('period_type', periodType)
      .order('period_start', { ascending: false })
      .limit(10);

    if (error) throw error;
    return { stats: data || [] };
  },

  async getLeaderboard(periodType: 'weekly' | 'monthly' = 'weekly', limit: number = 50) {
    const { data, error } = await (supabase
      .from('analytics_user') as any)
      .select(`
        *,
        user:profiles(id, username, display_name, avatar_url)
      `)
      .eq('period_type', periodType)
      .order('xp_earned', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { leaderboard: data || [] };
  }
};

// ============================================================
// WEBHOOKS API
// ============================================================

export const webhooksAPI = {
  async getWebhooks(squadId: string) {
    const { data, error } = await (supabase
      .from('webhooks') as any)
      .select('*')
      .eq('squad_id', squadId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { webhooks: data || [] };
  },

  async createWebhook(squadId: string, url: string, events: string[]) {
    const { data, error } = await (supabase
      .from('webhooks') as any)
      .insert({
        squad_id: squadId,
        url,
        events,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return { webhook: data };
  },

  async updateWebhook(webhookId: string, updates: Partial<{ url: string; events: string[]; is_active: boolean }>) {
    const { data, error } = await (supabase
      .from('webhooks') as any)
      .update(updates)
      .eq('id', webhookId)
      .select()
      .single();

    if (error) throw error;
    return { webhook: data };
  },

  async deleteWebhook(webhookId: string) {
    const { error } = await (supabase
      .from('webhooks') as any)
      .delete()
      .eq('id', webhookId);

    if (error) throw error;
  },

  async testWebhook(webhookId: string) {
    const { data: webhook } = await (supabase
      .from('webhooks') as any)
      .select('url')
      .eq('id', webhookId)
      .single();

    if (!webhook) throw new Error('Webhook non trouvé');

    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'test',
          message: 'Test webhook from Squad Planner',
          timestamp: new Date().toISOString()
        })
      });

      return { success: response.ok, status: response.status };
    } catch (error) {
      return { success: false, error: 'Failed to reach webhook URL' };
    }
  }
};

// ============================================================
// INTEGRATIONS API
// ============================================================

export const integrationsAPI = {
  async getIntegrations() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await (supabase
      .from('integrations') as any)
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;
    return { integrations: data || [] };
  },

  async connectIntegration(service: string, tokens: { access_token: string; refresh_token?: string; expires_at?: string }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await (supabase
      .from('integrations') as any)
      .upsert({
        user_id: user.id,
        service,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: tokens.expires_at,
        is_connected: true,
        connected_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return { integration: data };
  },

  async disconnectIntegration(service: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await (supabase
      .from('integrations') as any)
      .update({
        is_connected: false,
        disconnected_at: new Date().toISOString(),
        access_token: null,
        refresh_token: null
      })
      .eq('user_id', user.id)
      .eq('service', service);

    if (error) throw error;
  }
};

// ============================================================
// INTELLIGENCE API
// ============================================================

export const intelligenceAPI = {
  async getSmartSuggestions(squadId: string) {
    const { sessions } = await sessionsAPI.getSessions(squadId);
    const { data: members } = await (supabase
      .from('squad_members') as any)
      .select(`
        *,
        user:profiles(id, username, reliability_score)
      `)
      .eq('squad_id', squadId);

    const suggestions = [];

    // Suggestion basée sur la fiabilité moyenne
    const avgReliability = members?.reduce((acc: number, m: any) => acc + (m.user?.reliability_score || 0), 0) / (members?.length || 1);
    if (avgReliability < 70) {
      suggestions.push({
        type: 'reliability',
        title: 'Améliorer la fiabilité',
        description: `La fiabilité moyenne est de ${avgReliability.toFixed(0)}%. Envisagez des rappels automatiques.`,
        priority: 'high',
        action: 'enable_reminders'
      });
    }

    // Suggestion basée sur le nombre de sessions récentes
    const recentSessions = sessions?.filter((s: any) => {
      const date = new Date(s.scheduled_date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    });

    if ((recentSessions?.length || 0) < 2) {
      suggestions.push({
        type: 'activity',
        title: 'Planifier plus de sessions',
        description: 'Moins de 2 sessions cette semaine. Proposez une nouvelle session !',
        priority: 'medium',
        action: 'create_session'
      });
    }

    // Suggestion pour les membres inactifs
    const inactiveMembers = members?.filter((m: any) => m.sessions_attended === 0);
    if (inactiveMembers?.length > 0) {
      suggestions.push({
        type: 'engagement',
        title: 'Membres à réengager',
        description: `${inactiveMembers.length} membre(s) n'ont jamais participé. Envoyez-leur un message !`,
        priority: 'low',
        action: 'message_members'
      });
    }

    return { suggestions };
  },

  async getAvailabilityHeatmap(squadId: string) {
    const { sessions } = await sessionsAPI.getSessions(squadId);

    const heatmap = Array(7).fill(null).map(() => Array(24).fill(0));
    let sessionsCount = 0;

    sessions?.forEach((session: any) => {
      if (session.status !== 'completed' && session.status !== 'confirmed') return;

      const date = new Date(`${session.scheduled_date}T${session.scheduled_time}`);
      const day = date.getDay();
      const hour = date.getHours();

      const yesCount = session.attendees?.filter((a: any) => a.response === 'yes').length || 0;
      const participation = Math.min(100, yesCount * 20);

      heatmap[day][hour] = Math.min(100, heatmap[day][hour] + participation);
      sessionsCount++;
    });

    return { heatmap, sessionsCount };
  },

  async getMembersStats(squadId: string) {
    const { data, error } = await (supabase
      .from('squad_members') as any)
      .select(`
        *,
        user:profiles(id, username, display_name, avatar_url, reliability_score, total_sessions, sessions_attended)
      `)
      .eq('squad_id', squadId);

    if (error) throw error;

    const members = data?.map((m: any) => ({
      oduserId: m.user.id,
      username: m.user.username,
      displayName: m.user.display_name,
      avatarUrl: m.user.avatar_url,
      reliabilityScore: m.reliability_score || m.user.reliability_score || 100,
      totalSessions: m.user.total_sessions || 0,
      sessionsAttended: m.sessions_attended || m.user.sessions_attended || 0,
      role: m.role,
      joinedAt: m.joined_at
    })) || [];

    return { members };
  },

  async getOptimalTimes(squadId: string) {
    const { heatmap } = await this.getAvailabilityHeatmap(squadId);

    let bestDay = 0;
    let bestHour = 20;
    let maxValue = 0;

    heatmap.forEach((dayData, dayIndex) => {
      dayData.forEach((value, hourIndex) => {
        if (value > maxValue) {
          maxValue = value;
          bestDay = dayIndex;
          bestHour = hourIndex;
        }
      });
    });

    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    return {
      optimalDay: days[bestDay],
      optimalTime: `${String(bestHour).padStart(2, '0')}:00`,
      confidence: Math.min(100, maxValue)
    };
  }
};

// ============================================================
// INVITES API
// ============================================================

export const invitesAPI = {
  async createInvite(squadId: string) {
    const { data: squad, error } = await (supabase
      .from('squads') as any)
      .select('invite_code, name')
      .eq('id', squadId)
      .single();

    if (error) throw error;
    return { inviteCode: squad.invite_code, squadName: squad.name };
  },

  async regenerateInviteCode(squadId: string) {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const { data, error } = await (supabase
      .from('squads') as any)
      .update({ invite_code: newCode })
      .eq('id', squadId)
      .select('invite_code')
      .single();

    if (error) throw error;
    return { inviteCode: data.invite_code };
  }
};

// ============================================================
// RECURRING SESSIONS API
// ============================================================

export interface RecurringSession {
  id: string;
  squad_id: string;
  title: string;
  description?: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  scheduled_time: string;
  duration?: string;
  timezone: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const recurringSessionsAPI = {
  async getAll(squadId: string) {
    const { data, error } = await (supabase
      .from('recurring_sessions') as any)
      .select('*')
      .eq('squad_id', squadId)
      .order('day_of_week');

    if (error) throw error;
    return { recurringSessions: data || [] };
  },

  async create(data: {
    squad_id: string;
    title: string;
    description?: string;
    day_of_week: number;
    scheduled_time: string;
    duration?: string;
    timezone?: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: session, error } = await (supabase
      .from('recurring_sessions') as any)
      .insert({
        ...data,
        timezone: data.timezone || 'Europe/Paris',
        created_by: user.id,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return { recurringSession: session };
  },

  async update(id: string, updates: Partial<RecurringSession>) {
    const { data, error } = await (supabase
      .from('recurring_sessions') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { recurringSession: data };
  },

  async delete(id: string) {
    const { error } = await (supabase
      .from('recurring_sessions') as any)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },

  async toggle(id: string, isActive: boolean) {
    const { data, error } = await (supabase
      .from('recurring_sessions') as any)
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { recurringSession: data };
  },

  async generateSessions() {
    // Call the database function to generate sessions
    const { data, error } = await (supabase.rpc as any)('generate_recurring_sessions');

    if (error) throw error;
    return { sessionsCreated: data || 0 };
  }
};

// ============================================================
// EXPORT DEFAULT
// ============================================================

const apiReal = {
  auth: authAPI,
  squads: squadsAPI,
  sessions: sessionsAPI,
  messages: messagesAPI,
  friendships: friendshipsAPI,
  achievements: achievementsAPI,
  badges: badgesAPI,
  challenges: challengesAPI,
  tournaments: tournamentsAPI,
  leagues: leaguesAPI,
  availability: availabilityAPI,
  notifications: notificationsAPI,
  analytics: analyticsAPI,
  webhooks: webhooksAPI,
  integrations: integrationsAPI,
  intelligence: intelligenceAPI,
  invites: invitesAPI,
  recurringSessions: recurringSessionsAPI
};

export default apiReal;
