/**
 * Squad Planner OAuth Provider
 * Allows Squad Planner to act as an OAuth 2.0 provider for third-party applications
 */

import { supabase } from '@/utils/supabase/client';

// OAuth Provider Configuration
export interface OAuthClientConfig {
  client_id: string;
  client_secret: string;
  name: string;
  redirect_uris: string[];
  allowed_scopes: string[];
  logo_url?: string;
  website_url?: string;
}

export interface OAuthAuthorizationRequest {
  client_id: string;
  redirect_uri: string;
  response_type: 'code' | 'token';
  scope: string;
  state: string;
  code_challenge?: string;
  code_challenge_method?: 'S256' | 'plain';
}

export interface OAuthTokenRequest {
  grant_type: 'authorization_code' | 'refresh_token' | 'client_credentials';
  client_id: string;
  client_secret?: string;
  code?: string;
  redirect_uri?: string;
  refresh_token?: string;
  code_verifier?: string;
}

export interface OAuthToken {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export interface OAuthUserInfo {
  sub: string;
  name: string;
  email?: string;
  email_verified?: boolean;
  picture?: string;
  preferred_username?: string;
  profile?: string;
}

// Available OAuth Scopes
export const OAUTH_SCOPES = {
  'openid': 'Basic identity information',
  'profile': 'Read user profile (username, avatar)',
  'email': 'Read user email address',
  'squads:read': 'Read user squads',
  'squads:write': 'Create and manage squads',
  'sessions:read': 'Read session information',
  'sessions:write': 'Create and manage sessions',
  'friends:read': 'Read friends list',
  'analytics:read': 'Read user analytics',
} as const;

export type OAuthScope = keyof typeof OAUTH_SCOPES;

// Generate authorization code
function generateAuthorizationCode(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Generate access token
function generateAccessToken(): string {
  const array = new Uint8Array(48);
  crypto.getRandomValues(array);
  return 'sp_' + Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Hash for PKCE
async function sha256(plain: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export const oauthProvider = {
  /**
   * Register a new OAuth client application
   */
  async registerClient(config: Omit<OAuthClientConfig, 'client_id' | 'client_secret'>): Promise<OAuthClientConfig> {
    const client_id = 'sp_client_' + generateAuthorizationCode().slice(0, 16);
    const client_secret = 'sp_secret_' + generateAuthorizationCode();

    const { data, error } = await supabase
      .from('oauth_clients')
      .insert({
        client_id,
        client_secret_hash: await sha256(client_secret),
        name: config.name,
        redirect_uris: config.redirect_uris,
        allowed_scopes: config.allowed_scopes,
        logo_url: config.logo_url,
        website_url: config.website_url,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to register client: ${error.message}`);

    return {
      client_id,
      client_secret, // Only returned once at registration
      name: config.name,
      redirect_uris: config.redirect_uris,
      allowed_scopes: config.allowed_scopes,
      logo_url: config.logo_url,
      website_url: config.website_url,
    };
  },

  /**
   * Validate an authorization request
   */
  async validateAuthorizationRequest(request: OAuthAuthorizationRequest): Promise<{
    valid: boolean;
    client?: OAuthClientConfig;
    error?: string;
  }> {
    // Fetch client
    const { data: client, error } = await supabase
      .from('oauth_clients')
      .select('*')
      .eq('client_id', request.client_id)
      .eq('is_active', true)
      .single();

    if (error || !client) {
      return { valid: false, error: 'Invalid client_id' };
    }

    // Validate redirect URI
    if (!client.redirect_uris.includes(request.redirect_uri)) {
      return { valid: false, error: 'Invalid redirect_uri' };
    }

    // Validate scopes
    const requestedScopes = request.scope.split(' ');
    const invalidScopes = requestedScopes.filter(s => !client.allowed_scopes.includes(s));
    if (invalidScopes.length > 0) {
      return { valid: false, error: `Invalid scopes: ${invalidScopes.join(', ')}` };
    }

    return { valid: true, client: client as OAuthClientConfig };
  },

  /**
   * Generate an authorization code after user consent
   */
  async generateAuthorizationCode(
    userId: string,
    clientId: string,
    redirectUri: string,
    scope: string,
    codeChallenge?: string,
    codeChallengeMethod?: string
  ): Promise<string> {
    const code = generateAuthorizationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const { error } = await supabase
      .from('oauth_authorization_codes')
      .insert({
        code,
        user_id: userId,
        client_id: clientId,
        redirect_uri: redirectUri,
        scope,
        code_challenge: codeChallenge,
        code_challenge_method: codeChallengeMethod,
        expires_at: expiresAt.toISOString(),
        used: false,
      });

    if (error) throw new Error(`Failed to generate authorization code: ${error.message}`);

    return code;
  },

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(request: OAuthTokenRequest): Promise<OAuthToken> {
    if (request.grant_type !== 'authorization_code') {
      throw new Error('Unsupported grant_type');
    }

    if (!request.code) {
      throw new Error('Missing authorization code');
    }

    // Fetch and validate authorization code
    const { data: authCode, error } = await supabase
      .from('oauth_authorization_codes')
      .select('*')
      .eq('code', request.code)
      .eq('client_id', request.client_id)
      .single();

    if (error || !authCode) {
      throw new Error('Invalid authorization code');
    }

    if (authCode.used) {
      throw new Error('Authorization code already used');
    }

    if (new Date(authCode.expires_at) < new Date()) {
      throw new Error('Authorization code expired');
    }

    if (authCode.redirect_uri !== request.redirect_uri) {
      throw new Error('Redirect URI mismatch');
    }

    // Validate PKCE if used
    if (authCode.code_challenge) {
      if (!request.code_verifier) {
        throw new Error('Missing code_verifier');
      }

      let expectedChallenge: string;
      if (authCode.code_challenge_method === 'S256') {
        expectedChallenge = await sha256(request.code_verifier);
      } else {
        expectedChallenge = request.code_verifier;
      }

      if (expectedChallenge !== authCode.code_challenge) {
        throw new Error('Invalid code_verifier');
      }
    }

    // Mark code as used
    await supabase
      .from('oauth_authorization_codes')
      .update({ used: true })
      .eq('code', request.code);

    // Generate tokens
    const accessToken = generateAccessToken();
    const refreshToken = generateAccessToken();
    const expiresIn = 3600; // 1 hour

    // Store tokens
    await supabase
      .from('oauth_access_tokens')
      .insert({
        token: accessToken,
        user_id: authCode.user_id,
        client_id: request.client_id,
        scope: authCode.scope,
        expires_at: new Date(Date.now() + expiresIn * 1000).toISOString(),
      });

    await supabase
      .from('oauth_refresh_tokens')
      .insert({
        token: refreshToken,
        user_id: authCode.user_id,
        client_id: request.client_id,
        scope: authCode.scope,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      });

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: expiresIn,
      refresh_token: refreshToken,
      scope: authCode.scope,
    };
  },

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string, clientId: string): Promise<OAuthToken> {
    const { data: tokenData, error } = await supabase
      .from('oauth_refresh_tokens')
      .select('*')
      .eq('token', refreshToken)
      .eq('client_id', clientId)
      .single();

    if (error || !tokenData) {
      throw new Error('Invalid refresh token');
    }

    if (new Date(tokenData.expires_at) < new Date()) {
      throw new Error('Refresh token expired');
    }

    // Generate new access token
    const accessToken = generateAccessToken();
    const expiresIn = 3600;

    await supabase
      .from('oauth_access_tokens')
      .insert({
        token: accessToken,
        user_id: tokenData.user_id,
        client_id: clientId,
        scope: tokenData.scope,
        expires_at: new Date(Date.now() + expiresIn * 1000).toISOString(),
      });

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: expiresIn,
      scope: tokenData.scope,
    };
  },

  /**
   * Validate access token and get user info
   */
  async validateAccessToken(token: string): Promise<{
    valid: boolean;
    userId?: string;
    scope?: string;
    clientId?: string;
  }> {
    const { data, error } = await supabase
      .from('oauth_access_tokens')
      .select('*')
      .eq('token', token)
      .single();

    if (error || !data) {
      return { valid: false };
    }

    if (new Date(data.expires_at) < new Date()) {
      return { valid: false };
    }

    return {
      valid: true,
      userId: data.user_id,
      scope: data.scope,
      clientId: data.client_id,
    };
  },

  /**
   * Get user info for OpenID Connect
   */
  async getUserInfo(userId: string, scope: string): Promise<OAuthUserInfo> {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      throw new Error('User not found');
    }

    const scopes = scope.split(' ');
    const userInfo: OAuthUserInfo = {
      sub: userId,
      name: profile.display_name || profile.username,
    };

    if (scopes.includes('profile')) {
      userInfo.preferred_username = profile.username;
      userInfo.picture = profile.avatar_url;
      userInfo.profile = `https://squadplanner.app/u/${profile.username}`;
    }

    if (scopes.includes('email')) {
      userInfo.email = profile.email;
      userInfo.email_verified = profile.email_verified || false;
    }

    return userInfo;
  },

  /**
   * Revoke a token
   */
  async revokeToken(token: string): Promise<void> {
    // Try revoking as access token
    const { error: accessError } = await supabase
      .from('oauth_access_tokens')
      .delete()
      .eq('token', token);

    // Try revoking as refresh token
    const { error: refreshError } = await supabase
      .from('oauth_refresh_tokens')
      .delete()
      .eq('token', token);

    if (accessError && refreshError) {
      throw new Error('Token not found');
    }
  },

  /**
   * Get all authorized applications for a user
   */
  async getAuthorizedApps(userId: string): Promise<Array<{
    client_id: string;
    name: string;
    logo_url?: string;
    authorized_at: string;
    scope: string;
  }>> {
    const { data, error } = await supabase
      .from('oauth_access_tokens')
      .select(`
        client_id,
        scope,
        created_at,
        oauth_clients (name, logo_url)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch authorized apps: ${error.message}`);

    // Deduplicate by client_id
    const uniqueApps = new Map();
    for (const token of data || []) {
      if (!uniqueApps.has(token.client_id)) {
        uniqueApps.set(token.client_id, {
          client_id: token.client_id,
          name: (token.oauth_clients as any)?.name,
          logo_url: (token.oauth_clients as any)?.logo_url,
          authorized_at: token.created_at,
          scope: token.scope,
        });
      }
    }

    return Array.from(uniqueApps.values());
  },

  /**
   * Revoke all tokens for a client
   */
  async revokeClientAccess(userId: string, clientId: string): Promise<void> {
    await supabase
      .from('oauth_access_tokens')
      .delete()
      .eq('user_id', userId)
      .eq('client_id', clientId);

    await supabase
      .from('oauth_refresh_tokens')
      .delete()
      .eq('user_id', userId)
      .eq('client_id', clientId);

    await supabase
      .from('oauth_authorization_codes')
      .delete()
      .eq('user_id', userId)
      .eq('client_id', clientId);
  },
};

export default oauthProvider;
