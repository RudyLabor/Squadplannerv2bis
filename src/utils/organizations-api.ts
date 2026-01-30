/**
 * Organizations B2B API - Phase 4
 *
 * Handles organization management for esport teams,
 * communities, and content creators.
 */

import { supabase } from '@/lib/supabase';

// Types
export type OrgType = 'esport' | 'community' | 'academy' | 'content_creator' | 'enterprise';
export type OrgPlan = 'starter' | 'pro' | 'enterprise';
export type OrgRole = 'owner' | 'admin' | 'manager' | 'coach' | 'player' | 'staff';
export type SquadTier = 'main' | 'academy' | 'content' | 'casual';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  website?: string;
  discord_server_id?: string;
  type: OrgType;
  plan: OrgPlan;
  max_squads: number;
  max_members: number;
  primary_color: string;
  secondary_color: string;
  custom_domain?: string;
  is_verified: boolean;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Computed from dashboard view
  member_count?: number;
  squad_count?: number;
}

export interface OrgMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrgRole;
  title?: string;
  department?: string;
  permissions: string[];
  is_active: boolean;
  joined_at: string;
  // Joined from profiles
  username?: string;
  display_name?: string;
  avatar_url?: string;
}

export interface OrgSquad {
  id: string;
  organization_id: string;
  squad_id: string;
  tier: SquadTier;
  display_order: number;
  is_public: boolean;
  added_at: string;
  // Joined from squads
  squad_name?: string;
  squad_game?: string;
  squad_members_count?: number;
}

export interface OrgStats {
  total_squads: number;
  total_members: number;
  active_members: number;
  total_sessions_this_month: number;
  avg_attendance_rate: number;
  avg_reliability_score: number;
}

export interface OrgInvite {
  id: string;
  organization_id: string;
  email?: string;
  role: OrgRole;
  invite_code: string;
  expires_at: string;
  created_at: string;
}

/**
 * Organizations API
 */
export const organizationsAPI = {
  /**
   * Get all organizations for current user
   */
  async getMyOrganizations(): Promise<Organization[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await (supabase
      .from('organization_dashboard') as any)
      .select('*')
      .in('id', (
        await (supabase
          .from('organization_members') as any)
          .select('organization_id')
          .eq('user_id', user.id)
      ).data?.map((m: any) => m.organization_id) || []);

    if (error) {
      console.error('[OrgsAPI] Error fetching organizations:', error);
      throw error;
    }

    return (data || []) as Organization[];
  },

  /**
   * Get organization by ID
   */
  async getById(orgId: string): Promise<Organization | null> {
    const { data, error } = await (supabase
      .from('organizations') as any)
      .select('*')
      .eq('id', orgId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data as Organization;
  },

  /**
   * Get organization by slug
   */
  async getBySlug(slug: string): Promise<Organization | null> {
    const { data, error } = await (supabase
      .from('organizations') as any)
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  },

  /**
   * Create a new organization
   */
  async create(
    name: string,
    type: OrgType = 'esport',
    description?: string
  ): Promise<string> {
    const { data, error } = await (supabase.rpc as any)('create_organization', {
      p_name: name,
      p_type: type,
      p_description: description,
    });

    if (error) {
      console.error('[OrgsAPI] Error creating organization:', error);
      throw error;
    }

    return data;
  },

  /**
   * Update organization
   */
  async update(
    orgId: string,
    updates: Partial<Pick<Organization, 'name' | 'description' | 'logo_url' | 'banner_url' | 'website' | 'primary_color' | 'secondary_color'>>
  ): Promise<void> {
    const { error } = await (supabase
      .from('organizations') as any)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', orgId);

    if (error) {
      console.error('[OrgsAPI] Error updating organization:', error);
      throw error;
    }
  },

  /**
   * Get organization stats
   */
  async getStats(orgId: string): Promise<OrgStats> {
    const { data, error } = await (supabase.rpc as any)('get_organization_stats', { p_org_id: orgId });

    if (error) {
      console.error('[OrgsAPI] Error fetching stats:', error);
      throw error;
    }

    return data?.[0] || {
      total_squads: 0,
      total_members: 0,
      active_members: 0,
      total_sessions_this_month: 0,
      avg_attendance_rate: 0,
      avg_reliability_score: 0,
    };
  },

  /**
   * Get organization members
   */
  async getMembers(orgId: string): Promise<OrgMember[]> {
    const { data, error } = await (supabase
      .from('organization_members') as any)
      .select('*, profiles:user_id(username, display_name, avatar_url)')
      .eq('organization_id', orgId)
      .eq('is_active', true)
      .order('role', { ascending: true });

    if (error) {
      console.error('[OrgsAPI] Error fetching members:', error);
      throw error;
    }

    return (data || []).map((m: any) => ({
      ...m,
      username: m.profiles?.username,
      display_name: m.profiles?.display_name,
      avatar_url: m.profiles?.avatar_url,
    }));
  },

  /**
   * Add member to organization
   */
  async addMember(
    orgId: string,
    userId: string,
    role: OrgRole = 'player',
    title?: string
  ): Promise<void> {
    const { error } = await (supabase
      .from('organization_members') as any)
      .insert({
        organization_id: orgId,
        user_id: userId,
        role,
        title,
      });

    if (error) {
      console.error('[OrgsAPI] Error adding member:', error);
      throw error;
    }
  },

  /**
   * Update member role
   */
  async updateMember(
    memberId: string,
    updates: Partial<Pick<OrgMember, 'role' | 'title' | 'department' | 'is_active'>>
  ): Promise<void> {
    const { error } = await (supabase
      .from('organization_members') as any)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', memberId);

    if (error) {
      console.error('[OrgsAPI] Error updating member:', error);
      throw error;
    }
  },

  /**
   * Remove member from organization
   */
  async removeMember(memberId: string): Promise<void> {
    const { error } = await (supabase
      .from('organization_members') as any)
      .delete()
      .eq('id', memberId);

    if (error) {
      console.error('[OrgsAPI] Error removing member:', error);
      throw error;
    }
  },

  /**
   * Get organization squads
   */
  async getSquads(orgId: string): Promise<OrgSquad[]> {
    const { data, error } = await (supabase
      .from('organization_squads') as any)
      .select('*, squads:squad_id(name, game, member_count)')
      .eq('organization_id', orgId)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('[OrgsAPI] Error fetching squads:', error);
      throw error;
    }

    return (data || []).map((s: any) => ({
      ...s,
      squad_name: s.squads?.name,
      squad_game: s.squads?.game,
      squad_members_count: s.squads?.member_count,
    }));
  },

  /**
   * Add squad to organization
   */
  async addSquad(
    orgId: string,
    squadId: string,
    tier: SquadTier = 'main'
  ): Promise<boolean> {
    const { data, error } = await (supabase.rpc as any)('add_squad_to_organization', {
      p_org_id: orgId,
      p_squad_id: squadId,
      p_tier: tier,
    });

    if (error) {
      console.error('[OrgsAPI] Error adding squad:', error);
      throw error;
    }

    return data;
  },

  /**
   * Remove squad from organization
   */
  async removeSquad(orgSquadId: string): Promise<void> {
    const { error } = await (supabase
      .from('organization_squads') as any)
      .delete()
      .eq('id', orgSquadId);

    if (error) {
      console.error('[OrgsAPI] Error removing squad:', error);
      throw error;
    }
  },

  /**
   * Update squad tier
   */
  async updateSquadTier(orgSquadId: string, tier: SquadTier): Promise<void> {
    const { error } = await (supabase
      .from('organization_squads') as any)
      .update({ tier })
      .eq('id', orgSquadId);

    if (error) {
      console.error('[OrgsAPI] Error updating squad tier:', error);
      throw error;
    }
  },

  /**
   * Generate invite link
   */
  async generateInvite(
    orgId: string,
    role: OrgRole = 'player',
    email?: string
  ): Promise<string> {
    const { data, error } = await (supabase.rpc as any)('generate_org_invite', {
      p_org_id: orgId,
      p_role: role,
      p_email: email,
    });

    if (error) {
      console.error('[OrgsAPI] Error generating invite:', error);
      throw error;
    }

    return data;
  },

  /**
   * Accept invite
   */
  async acceptInvite(inviteCode: string): Promise<string> {
    const { data, error } = await (supabase.rpc as any)('accept_org_invite', { p_code: inviteCode });

    if (error) {
      console.error('[OrgsAPI] Error accepting invite:', error);
      throw error;
    }

    return data;
  },

  /**
   * Get pending invites
   */
  async getPendingInvites(orgId: string): Promise<OrgInvite[]> {
    const { data, error } = await (supabase
      .from('organization_invites') as any)
      .select('*')
      .eq('organization_id', orgId)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[OrgsAPI] Error fetching invites:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Check if user is org admin
   */
  async isAdmin(orgId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await (supabase
      .from('organization_members') as any)
      .select('role')
      .eq('organization_id', orgId)
      .eq('user_id', user.id)
      .single();

    if (error) return false;

    return ['owner', 'admin'].includes(data?.role);
  },

  /**
   * Check if user is org manager
   */
  async isManager(orgId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await (supabase
      .from('organization_members') as any)
      .select('role')
      .eq('organization_id', orgId)
      .eq('user_id', user.id)
      .single();

    if (error) return false;

    return ['owner', 'admin', 'manager'].includes(data?.role);
  },

  /**
   * Get user's role in organization
   */
  async getUserRole(orgId: string): Promise<OrgRole | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await (supabase
      .from('organization_members') as any)
      .select('role')
      .eq('organization_id', orgId)
      .eq('user_id', user.id)
      .single();

    if (error) return null;

    return data?.role;
  },
};

// Role labels for display
export const ORG_ROLE_LABELS: Record<OrgRole, string> = {
  owner: 'Propriétaire',
  admin: 'Administrateur',
  manager: 'Manager',
  coach: 'Coach',
  player: 'Joueur',
  staff: 'Staff',
};

// Tier labels for display
export const SQUAD_TIER_LABELS: Record<SquadTier, string> = {
  main: 'Équipe Principale',
  academy: 'Académie',
  content: 'Contenu',
  casual: 'Casual',
};

// Org type labels
export const ORG_TYPE_LABELS: Record<OrgType, string> = {
  esport: 'Organisation Esport',
  community: 'Communauté',
  academy: 'Académie',
  content_creator: 'Créateur de contenu',
  enterprise: 'Entreprise',
};

export default organizationsAPI;
