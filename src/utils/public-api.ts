/**
 * Public API Management Utilities - Phase 5
 *
 * Handles API key generation, webhook management, and usage tracking
 */

import { supabase } from '@/lib/supabase';

// Types
export interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  permissions: string[];
  rate_limit_per_minute: number;
  rate_limit_per_day: number;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
  total_requests?: number;
  requests_today?: number;
  avg_response_time_ms?: number;
}

export interface ApiKeyWithSecret {
  api_key: string;
  key_id: string;
}

export interface Webhook {
  id: string;
  user_id: string;
  squad_id: string | null;
  name: string;
  url: string;
  events: string[];
  is_active: boolean;
  last_triggered_at: string | null;
  last_status_code: number | null;
  failure_count: number;
  created_at: string;
}

export interface WebhookDelivery {
  id: string;
  webhook_id: string;
  event_type: string;
  payload: any;
  status: 'pending' | 'success' | 'failed' | 'retrying';
  status_code: number | null;
  attempt_count: number;
  created_at: string;
}

export interface RateLimitInfo {
  allowed: boolean;
  requests_this_minute: number;
  requests_today: number;
  limit_per_minute: number;
  limit_per_day: number;
}

// Available webhook events
export const WEBHOOK_EVENTS = [
  { id: 'session.created', label: 'Session créée', icon: '📅', description: 'Quand une nouvelle session est proposée' },
  { id: 'session.updated', label: 'Session modifiée', icon: '✏️', description: 'Quand une session est modifiée' },
  { id: 'session.cancelled', label: 'Session annulée', icon: '❌', description: 'Quand une session est annulée' },
  { id: 'session.completed', label: 'Session terminée', icon: '🎮', description: 'Quand une session est marquée terminée' },
  { id: 'session.starting_soon', label: 'Session imminente', icon: '⏰', description: '1h avant le début de la session' },
  { id: 'rsvp.submitted', label: 'RSVP soumis', icon: '✅', description: 'Quand un membre répond à une session' },
  { id: 'checkin.submitted', label: 'Check-in effectué', icon: '✓', description: 'Quand un membre fait son check-in' },
  { id: 'member.joined', label: 'Membre rejoint', icon: '👋', description: 'Quand un membre rejoint la squad' },
  { id: 'member.left', label: 'Membre parti', icon: '👋', description: 'Quand un membre quitte la squad' },
  { id: 'member.promoted', label: 'Membre promu', icon: '⬆️', description: 'Quand un membre est promu' },
  { id: 'squad.updated', label: 'Squad modifiée', icon: '🛡️', description: 'Quand les infos de la squad changent' },
  { id: 'badge.unlocked', label: 'Badge débloqué', icon: '🏆', description: 'Quand un membre débloque un badge' },
] as const;

// API Permissions
export const API_PERMISSIONS = [
  { id: 'read', label: 'Lecture', description: 'Lire les données (squads, sessions, profils)' },
  { id: 'write', label: 'Écriture', description: 'Créer et modifier des données' },
  { id: 'delete', label: 'Suppression', description: 'Supprimer des données' },
  { id: 'admin', label: 'Admin', description: 'Toutes les permissions + gestion' },
] as const;

/**
 * API Keys Management
 */
export const apiKeysAPI = {
  /**
   * Get all API keys for the current user
   */
  async getAll(): Promise<ApiKey[]> {
    const { data, error } = await (supabase
      .from('api_key_stats') as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[PublicAPI] Error fetching API keys:', error);
      throw error;
    }

    return (data || []).map((key: any) => ({
      id: key.key_id,
      name: key.name,
      key_prefix: key.key_prefix,
      permissions: [], // Not included in view for security
      rate_limit_per_minute: key.rate_limit_per_minute,
      rate_limit_per_day: key.rate_limit_per_day,
      is_active: key.is_active,
      last_used_at: key.last_used_at,
      created_at: key.created_at,
      total_requests: key.total_requests,
      requests_today: key.requests_today,
      avg_response_time_ms: key.avg_response_time_ms,
    }));
  },

  /**
   * Generate a new API key
   * IMPORTANT: The full key is only returned once!
   */
  async generate(
    name: string,
    permissions: string[] = ['read'],
    rateLimitPerMinute: number = 60
  ): Promise<ApiKeyWithSecret> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await (supabase.rpc as any)('generate_api_key', {
      p_user_id: user.id,
      p_name: name,
      p_permissions: permissions,
      p_rate_limit_per_minute: rateLimitPerMinute,
    });

    if (error) {
      console.error('[PublicAPI] Error generating API key:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('Failed to generate API key');
    }

    return {
      api_key: data[0].api_key,
      key_id: data[0].key_id,
    };
  },

  /**
   * Revoke (deactivate) an API key
   */
  async revoke(keyId: string): Promise<void> {
    const { error } = await (supabase
      .from('api_keys') as any)
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', keyId);

    if (error) {
      console.error('[PublicAPI] Error revoking API key:', error);
      throw error;
    }
  },

  /**
   * Reactivate an API key
   */
  async reactivate(keyId: string): Promise<void> {
    const { error } = await (supabase
      .from('api_keys') as any)
      .update({ is_active: true, updated_at: new Date().toISOString() })
      .eq('id', keyId);

    if (error) {
      console.error('[PublicAPI] Error reactivating API key:', error);
      throw error;
    }
  },

  /**
   * Delete an API key permanently
   */
  async delete(keyId: string): Promise<void> {
    const { error } = await (supabase
      .from('api_keys') as any)
      .delete()
      .eq('id', keyId);

    if (error) {
      console.error('[PublicAPI] Error deleting API key:', error);
      throw error;
    }
  },

  /**
   * Update API key settings
   */
  async update(
    keyId: string,
    updates: { name?: string; rate_limit_per_minute?: number; rate_limit_per_day?: number }
  ): Promise<void> {
    const { error } = await (supabase
      .from('api_keys') as any)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', keyId);

    if (error) {
      console.error('[PublicAPI] Error updating API key:', error);
      throw error;
    }
  },

  /**
   * Get usage statistics for an API key
   */
  async getUsage(keyId: string, days: number = 7): Promise<{ date: string; requests: number }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await (supabase
      .from('api_usage') as any)
      .select('created_at')
      .eq('api_key_id', keyId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[PublicAPI] Error fetching usage:', error);
      throw error;
    }

    // Group by date
    const usageByDate: Record<string, number> = {};
    (data || []).forEach((row: any) => {
      const date = new Date(row.created_at).toISOString().split('T')[0];
      usageByDate[date] = (usageByDate[date] || 0) + 1;
    });

    return Object.entries(usageByDate).map(([date, requests]) => ({ date, requests }));
  },
};

/**
 * Webhooks Management
 */
export const webhooksAPI = {
  /**
   * Get all webhooks for the current user
   */
  async getAll(): Promise<Webhook[]> {
    const { data, error } = await (supabase
      .from('user_webhooks') as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[PublicAPI] Error fetching webhooks:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get webhooks for a specific squad
   */
  async getBySquad(squadId: string): Promise<Webhook[]> {
    const { data, error } = await (supabase
      .from('user_webhooks') as any)
      .select('*')
      .or(`squad_id.eq.${squadId},squad_id.is.null`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[PublicAPI] Error fetching squad webhooks:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Create a new webhook
   */
  async create(
    name: string,
    url: string,
    events: string[],
    squadId?: string
  ): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await (supabase.rpc as any)('create_user_webhook', {
      p_user_id: user.id,
      p_name: name,
      p_url: url,
      p_events: events,
      p_squad_id: squadId || null,
    });

    if (error) {
      console.error('[PublicAPI] Error creating webhook:', error);
      throw error;
    }

    return data;
  },

  /**
   * Update webhook settings
   */
  async update(
    webhookId: string,
    updates: { name?: string; url?: string; events?: string[]; is_active?: boolean }
  ): Promise<void> {
    const { error } = await (supabase
      .from('user_webhooks') as any)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', webhookId);

    if (error) {
      console.error('[PublicAPI] Error updating webhook:', error);
      throw error;
    }
  },

  /**
   * Toggle webhook active status
   */
  async toggle(webhookId: string): Promise<boolean> {
    const { data: webhook, error: fetchError } = await (supabase
      .from('user_webhooks') as any)
      .select('is_active')
      .eq('id', webhookId)
      .single();

    if (fetchError) throw fetchError;

    const newStatus = !webhook.is_active;

    const { error } = await (supabase
      .from('user_webhooks') as any)
      .update({ is_active: newStatus, updated_at: new Date().toISOString() })
      .eq('id', webhookId);

    if (error) {
      console.error('[PublicAPI] Error toggling webhook:', error);
      throw error;
    }

    return newStatus;
  },

  /**
   * Delete a webhook
   */
  async delete(webhookId: string): Promise<void> {
    const { error } = await (supabase
      .from('user_webhooks') as any)
      .delete()
      .eq('id', webhookId);

    if (error) {
      console.error('[PublicAPI] Error deleting webhook:', error);
      throw error;
    }
  },

  /**
   * Test a webhook by sending a test payload
   */
  async test(webhookId: string): Promise<{ success: boolean; statusCode?: number; error?: string }> {
    // Get webhook details
    const { data: webhook, error: fetchError } = await (supabase
      .from('user_webhooks') as any)
      .select('url, secret')
      .eq('id', webhookId)
      .single();

    if (fetchError || !webhook) {
      return { success: false, error: 'Webhook not found' };
    }

    // Send test payload
    const testPayload = {
      event: 'test.ping',
      data: {
        message: 'This is a test webhook from Squad Planner',
        timestamp: new Date().toISOString(),
      },
    };

    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-SquadPlanner-Event': 'test.ping',
          'X-SquadPlanner-Webhook-ID': webhookId,
        },
        body: JSON.stringify(testPayload),
      });

      // Update last triggered
      await (supabase
        .from('user_webhooks') as any)
        .update({
          last_triggered_at: new Date().toISOString(),
          last_status_code: response.status,
          failure_count: response.ok ? 0 : undefined,
        })
        .eq('id', webhookId);

      return {
        success: response.ok,
        statusCode: response.status,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Network error',
      };
    }
  },

  /**
   * Get delivery history for a webhook
   */
  async getDeliveries(webhookId: string, limit: number = 50): Promise<WebhookDelivery[]> {
    const { data, error } = await (supabase
      .from('webhook_deliveries') as any)
      .select('*')
      .eq('webhook_id', webhookId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[PublicAPI] Error fetching deliveries:', error);
      throw error;
    }

    return data || [];
  },
};

export default {
  apiKeys: apiKeysAPI,
  webhooks: webhooksAPI,
  WEBHOOK_EVENTS,
  API_PERMISSIONS,
};
