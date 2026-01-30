/**
 * Integrations API - External Service Connections
 *
 * Manages connections to external platforms:
 * - Discord, Google Calendar, Twitch, Steam, Riot Games, Battle.net
 *
 * Uses Supabase Edge Functions for OAuth token exchange,
 * with direct Supabase fallback for status queries.
 */

import { supabase } from '@/lib/supabase';
import { projectId } from '@/utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e884809f`;

export interface Integration {
  connected: boolean;
  username?: string;
  email?: string;
  connectedAt?: string;
  externalId?: string;
}

export interface Integrations {
  discord: Integration;
  googleCalendar: Integration;
  twitch: Integration;
  steam: Integration;
  riot: Integration;
  battlenet: Integration;
}

// Default empty integrations state
const defaultIntegrations: Integrations = {
  discord: { connected: false },
  googleCalendar: { connected: false },
  twitch: { connected: false },
  steam: { connected: false },
  riot: { connected: false },
  battlenet: { connected: false },
};

// Map database service names to frontend keys
const serviceToKey: Record<string, keyof Integrations> = {
  'discord': 'discord',
  'google': 'googleCalendar',
  'google_calendar': 'googleCalendar',
  'twitch': 'twitch',
  'steam': 'steam',
  'riot': 'riot',
  'battlenet': 'battlenet',
};

export const integrationsAPI = {
  /**
   * Get user integrations from Supabase
   * Falls back to direct DB query if edge function fails
   */
  async getUserIntegrations(accessToken?: string): Promise<Integrations> {
    try {
      // Try edge function first if access token provided
      if (accessToken) {
        const response = await fetch(`${API_URL}/user/integrations`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          return data.integrations;
        }
      }

      // Fallback: Direct Supabase query
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('[IntegrationsAPI] No user, returning defaults');
        return { ...defaultIntegrations };
      }

      const { data: dbIntegrations, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('[IntegrationsAPI] DB error:', error);
        return { ...defaultIntegrations };
      }

      // Transform DB records to Integrations format
      const integrations = { ...defaultIntegrations };

      for (const integration of dbIntegrations || []) {
        const key = serviceToKey[integration.service];
        if (key && integration.is_connected) {
          integrations[key] = {
            connected: true,
            username: integration.external_username || undefined,
            email: integration.external_email || undefined,
            connectedAt: integration.connected_at || undefined,
            externalId: integration.external_id || undefined,
          };
        }
      }

      return integrations;
    } catch (error) {
      console.error('[IntegrationsAPI] getUserIntegrations error:', error);
      return { ...defaultIntegrations };
    }
  },

  /**
   * Connect an integration (for non-OAuth connections or post-OAuth storage)
   */
  async connectIntegration(
    accessToken: string | undefined,
    platform: string,
    credentials: { username?: string; email?: string; accessToken?: string; refreshToken?: string; expiresAt?: string }
  ): Promise<Integrations> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const serviceKey = platform === 'googleCalendar' ? 'google' : platform.toLowerCase();

    // Try edge function first
    if (accessToken) {
      try {
        const response = await fetch(`${API_URL}/user/integrations/${platform}/connect`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });

        if (response.ok) {
          const data = await response.json();
          return data.integrations;
        }
      } catch (e) {
        console.warn('[IntegrationsAPI] Edge function failed, using Supabase:', e);
      }
    }

    // Fallback: Direct Supabase upsert
    const { error } = await supabase
      .from('integrations')
      .upsert({
        user_id: user.id,
        service: serviceKey,
        is_connected: true,
        external_username: credentials.username,
        external_email: credentials.email,
        access_token: credentials.accessToken,
        refresh_token: credentials.refreshToken,
        token_expires_at: credentials.expiresAt,
        connected_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,service'
      });

    if (error) {
      console.error('[IntegrationsAPI] Connect error:', error);
      throw new Error(`Failed to connect ${platform}`);
    }

    // Return updated integrations
    return this.getUserIntegrations();
  },

  /**
   * Disconnect an integration
   */
  async disconnectIntegration(
    accessToken: string | undefined,
    platform: string
  ): Promise<Integrations> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const serviceKey = platform === 'googleCalendar' ? 'google' : platform.toLowerCase();

    // Try edge function first
    if (accessToken) {
      try {
        const response = await fetch(`${API_URL}/user/integrations/${platform}/disconnect`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          return data.integrations;
        }
      } catch (e) {
        console.warn('[IntegrationsAPI] Edge function failed, using Supabase:', e);
      }
    }

    // Fallback: Direct Supabase update
    const { error } = await supabase
      .from('integrations')
      .update({
        is_connected: false,
        access_token: null,
        refresh_token: null,
        disconnected_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('service', serviceKey);

    if (error) {
      console.error('[IntegrationsAPI] Disconnect error:', error);
      throw new Error(`Failed to disconnect ${platform}`);
    }

    // Return updated integrations
    return this.getUserIntegrations();
  },

  /**
   * Store OAuth tokens after successful authentication
   */
  async storeOAuthTokens(
    provider: string,
    tokens: {
      access_token: string;
      refresh_token?: string;
      expires_at?: number;
      external_id?: string;
      external_username?: string;
    }
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('integrations')
      .upsert({
        user_id: user.id,
        service: provider,
        is_connected: true,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: tokens.expires_at
          ? new Date(tokens.expires_at * 1000).toISOString()
          : null,
        external_id: tokens.external_id,
        external_username: tokens.external_username,
        connected_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,service'
      });

    if (error) {
      console.error('[IntegrationsAPI] Store tokens error:', error);
      throw error;
    }
  },

  /**
   * Check if a specific integration is connected
   */
  async isConnected(platform: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const serviceKey = platform === 'googleCalendar' ? 'google' : platform.toLowerCase();

    const { data, error } = await supabase
      .from('integrations')
      .select('is_connected')
      .eq('user_id', user.id)
      .eq('service', serviceKey)
      .single();

    if (error || !data) return false;
    return data.is_connected;
  },

  /**
   * Get access token for an integration (for API calls)
   */
  async getAccessToken(platform: string): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const serviceKey = platform === 'googleCalendar' ? 'google' : platform.toLowerCase();

    const { data, error } = await supabase
      .from('integrations')
      .select('access_token, refresh_token, token_expires_at')
      .eq('user_id', user.id)
      .eq('service', serviceKey)
      .eq('is_connected', true)
      .single();

    if (error || !data) return null;

    // Check if token is expired
    if (data.token_expires_at) {
      const expiresAt = new Date(data.token_expires_at).getTime();
      if (Date.now() >= expiresAt - 60000) { // 1 minute buffer
        // Token expired, need to refresh
        console.log(`[IntegrationsAPI] Token expired for ${platform}, refresh needed`);
        // TODO: Implement token refresh via backend
        return null;
      }
    }

    return data.access_token;
  },
};

export default integrationsAPI;
