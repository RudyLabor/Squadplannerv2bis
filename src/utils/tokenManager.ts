/**
 * Token Manager - OAuth Token Storage & Refresh
 *
 * Manages OAuth tokens for external integrations:
 * - Storage in Supabase integrations table
 * - Token refresh when expired
 * - Secure token retrieval
 */

import { supabase } from '@/lib/supabase';

interface TokenData {
  access_token: string;
  refresh_token?: string;
  expires_at: number; // Unix timestamp in seconds
  provider: string;
  scope?: string;
  token_type?: string;
}

interface StoredIntegration {
  id: string;
  user_id: string;
  service: string;
  access_token: string;
  refresh_token: string | null;
  token_expires_at: string;
  is_connected: boolean;
  external_id?: string;
  external_username?: string;
}

// Backend API URL
const API_URL = import.meta.env.VITE_API_URL || 'https://your-supabase-project.supabase.co/functions/v1';

export const tokenManager = {
  /**
   * Store OAuth tokens in database
   */
  async storeTokens(provider: string, tokens: TokenData): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    console.log(`[Token Manager] Storing tokens for ${provider}`);

    const expiresAt = tokens.expires_at
      ? new Date(tokens.expires_at * 1000).toISOString()
      : new Date(Date.now() + 3600 * 1000).toISOString(); // Default: 1 hour

    const { error } = await supabase
      .from('integrations')
      .upsert({
        user_id: user.id,
        service: provider,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || null,
        token_expires_at: expiresAt,
        is_connected: true,
        last_sync_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,service'
      });

    if (error) {
      console.error('[Token Manager] Store error:', error);
      throw error;
    }

    console.log(`[Token Manager] Tokens stored successfully for ${provider}`);
  },

  /**
   * Get valid access token (refreshes if expired)
   */
  async getToken(provider: string): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    console.log(`[Token Manager] Getting token for ${provider}`);

    // Fetch integration from database
    const { data, error } = await supabase
      .from('integrations')
      .select('access_token, refresh_token, token_expires_at')
      .eq('user_id', user.id)
      .eq('service', provider)
      .eq('is_connected', true)
      .single();

    if (error || !data) {
      console.error('[Token Manager] Integration not found:', error);
      throw new Error(`Integration ${provider} not connected`);
    }

    // Check if token is expired
    const expiresAt = new Date(data.token_expires_at).getTime();
    const now = Date.now();

    // Refresh if expired or expiring in next 5 minutes
    if (now >= expiresAt - 5 * 60 * 1000) {
      console.log(`[Token Manager] Token expired or expiring soon for ${provider}, refreshing...`);

      if (!data.refresh_token) {
        throw new Error(`Token expired and no refresh token available for ${provider}`);
      }

      // Refresh the token
      const newAccessToken = await this.refreshToken(provider, data.refresh_token);
      return newAccessToken;
    }

    console.log(`[Token Manager] Returning valid token for ${provider}`);
    return data.access_token;
  },

  /**
   * Refresh an expired OAuth token
   */
  async refreshToken(provider: string, refreshToken: string): Promise<string> {
    console.log(`[Token Manager] Refreshing token for ${provider}`);

    try {
      const response = await fetch(`${API_URL}/oauth/${provider}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Token refresh failed: ${response.status}`);
      }

      const tokens: TokenData = await response.json();

      // Store the new tokens
      await this.storeTokens(provider, tokens);

      console.log(`[Token Manager] Token refreshed successfully for ${provider}`);
      return tokens.access_token;
    } catch (error: any) {
      console.error('[Token Manager] Refresh error:', error);

      // If refresh fails, mark integration as disconnected
      await this.markDisconnected(provider);

      throw new Error(`Failed to refresh ${provider} token: ${error.message}`);
    }
  },

  /**
   * Mark an integration as disconnected
   */
  async markDisconnected(provider: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    console.log(`[Token Manager] Marking ${provider} as disconnected`);

    await supabase
      .from('integrations')
      .update({
        is_connected: false,
        disconnected_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('service', provider);
  },

  /**
   * Delete integration (revoke tokens)
   */
  async deleteIntegration(provider: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    console.log(`[Token Manager] Deleting integration for ${provider}`);

    // Try to revoke tokens on provider side first (optional)
    try {
      await fetch(`${API_URL}/oauth/${provider}/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.warn('[Token Manager] Could not revoke tokens on provider:', error);
      // Continue anyway
    }

    // Delete from database
    const { error } = await supabase
      .from('integrations')
      .delete()
      .eq('user_id', user.id)
      .eq('service', provider);

    if (error) {
      console.error('[Token Manager] Delete error:', error);
      throw error;
    }

    console.log(`[Token Manager] Integration deleted for ${provider}`);
  },

  /**
   * Get all user's integrations with their connection status
   */
  async getAllIntegrations(): Promise<StoredIntegration[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', user.id)
      .order('connected_at', { ascending: false });

    if (error) {
      console.error('[Token Manager] Get all error:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Check if an integration is connected
   */
  async isConnected(provider: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('integrations')
      .select('is_connected')
      .eq('user_id', user.id)
      .eq('service', provider)
      .single();

    if (error) return false;
    return data?.is_connected || false;
  },
};

export default tokenManager;
