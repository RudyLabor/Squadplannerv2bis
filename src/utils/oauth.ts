/**
 * OAuth Helper - Frontend OAuth Flow Management
 *
 * Handles OAuth authentication flows for external services:
 * - Discord, Google Calendar, Twitch, Steam, Riot Games, Battle.net
 */

type OAuthProvider = 'discord' | 'google' | 'twitch' | 'steam' | 'riot' | 'battlenet';

// Backend API URL - adjust based on environment
const API_URL = import.meta.env.VITE_API_URL || 'https://your-supabase-project.supabase.co/functions/v1';

export const oauthHelper = {
  /**
   * Initiate OAuth flow for a provider
   * Stores state in localStorage for CSRF protection
   */
  startFlow: (provider: OAuthProvider) => {
    const redirectUri = `${window.location.origin}/oauth/callback`;
    const state = crypto.randomUUID();

    // Store state and provider for validation on callback
    localStorage.setItem('oauth_state', state);
    localStorage.setItem('oauth_provider', provider);

    // Redirect to backend OAuth authorization endpoint
    const authUrl = `${API_URL}/oauth/${provider}/authorize?redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;

    console.log(`[OAuth] Starting ${provider} flow, redirecting to:`, authUrl);
    window.location.href = authUrl;
  },

  /**
   * Handle OAuth callback after user authorizes
   * Validates state, exchanges code for tokens
   */
  handleCallback: async (): Promise<{ success: boolean; provider: string; data?: any; error?: string }> => {
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const error = params.get('error');
      const errorDescription = params.get('error_description');

      // Check for OAuth errors
      if (error) {
        console.error('[OAuth] Provider returned error:', error, errorDescription);
        throw new Error(errorDescription || error);
      }

      // Validate required params
      if (!code || !state) {
        throw new Error('Missing required OAuth parameters');
      }

      // Validate state (CSRF protection)
      const storedState = localStorage.getItem('oauth_state');
      const provider = localStorage.getItem('oauth_provider');

      if (!storedState || !provider) {
        throw new Error('Invalid OAuth session - missing stored state');
      }

      if (state !== storedState) {
        throw new Error('Invalid OAuth state - possible CSRF attack');
      }

      console.log(`[OAuth] Exchanging code for ${provider} tokens`);

      // Exchange code for tokens via backend
      const redirectUri = `${window.location.origin}/oauth/callback`;
      const response = await fetch(`${API_URL}/oauth/${provider}/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          redirect_uri: redirectUri,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `OAuth exchange failed: ${response.status}`);
      }

      const data = await response.json();

      // Clean up localStorage
      localStorage.removeItem('oauth_state');
      localStorage.removeItem('oauth_provider');

      console.log(`[OAuth] Successfully connected ${provider}`);

      return {
        success: true,
        provider,
        data,
      };
    } catch (error: any) {
      console.error('[OAuth] Callback error:', error);

      // Clean up localStorage even on error
      localStorage.removeItem('oauth_state');
      localStorage.removeItem('oauth_provider');

      return {
        success: false,
        provider: localStorage.getItem('oauth_provider') || 'unknown',
        error: error.message,
      };
    }
  },

  /**
   * Disconnect an OAuth provider
   */
  disconnect: async (provider: OAuthProvider): Promise<void> => {
    const response = await fetch(`${API_URL}/oauth/${provider}/disconnect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to disconnect ${provider}`);
    }

    console.log(`[OAuth] Disconnected ${provider}`);
  },

  /**
   * Get OAuth connection status for a provider
   */
  getStatus: async (provider: OAuthProvider): Promise<{ connected: boolean; data?: any }> => {
    try {
      const response = await fetch(`${API_URL}/oauth/${provider}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return { connected: false };
      }

      const data = await response.json();
      return {
        connected: data.connected || false,
        data: data.data,
      };
    } catch (error) {
      console.error(`[OAuth] Failed to get ${provider} status:`, error);
      return { connected: false };
    }
  },
};

// Export types for use in components
export type { OAuthProvider };
