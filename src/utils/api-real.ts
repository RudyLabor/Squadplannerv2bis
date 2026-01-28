
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
        // Fallback if trigger didn't run (due to migration error)
        // Auto-create profile on the fly
        if (error.code === 'PGRST116') { // No rows found
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

    const { data, error } = await(supabase
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
     // User sees squads they are members of (managed by RLS, but explicit query helps)
    const { data, error } = await (supabase
      .from('squads') as any)
      .select('*, members:squad_members(count)'); // Get count as basic info

    if (error) {
        console.error('Error fetching squads:', error);
        return [];
    }
    
    // Transform to match UI expectation if needed
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

    // 1. Create Squad
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

    // 2. Add Owner as Member (Admin)
    await (supabase.from('squad_members') as any).insert({
        squad_id: squad.id,
        user_id: user.id,
        role: 'owner'
    });

    return squad;
  }
};

// ============================================================
// SESSIONS API
// ============================================================

export const sessionsAPI = {
  async getSessions(squadId?: string) {
    let query = (supabase.from('sessions') as any).select(`
        *,
        attendees:session_attendees (
            status,
            user:profiles (id, username, avatar_url)
        )
    `);

    if (squadId) {
        query = query.eq('squad_id', squadId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createSession(squadId: string, sessionData: any) {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await (supabase
      .from('sessions') as any)
      .insert({
        squad_id: squadId,
        created_by: user?.id,
        title: sessionData.title,
        start_time: sessionData.start_time,
        end_time: sessionData.end_time,
        status: 'planned'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  
  async rsvp(sessionId: string, status: string) { // status: 'yes', 'no', 'maybe'
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await (supabase
        .from('session_attendees') as any)
        .upsert({
            session_id: sessionId,
            user_id: user.id,
            status: status
        });
      
      if (error) throw error;
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
            .order('created_at', { ascending: true });
            
        if (error) throw error;
        return data;
    },

    async sendMessage(squadId: string, content: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await (supabase
            .from('messages') as any)
            .insert({
                squad_id: squadId,
                user_id: user.id,
                content: content
            });

        if (error) throw error;
    }
}

const apiReal = {
  auth: authAPI,
  squads: squadsAPI,
  sessions: sessionsAPI,
  messages: messagesAPI,
  // Placeholders for other APIs to match interface
  notifications: { getNotifications: async () => [] },
  invites: { createInvite: async () => ({}) },
  intelligence: { getSmartSuggestions: async () => ({}) }
};

export default apiReal;
