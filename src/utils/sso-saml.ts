/**
 * Squad Planner Enterprise SSO/SAML Authentication
 * Provides SAML 2.0 and OIDC enterprise authentication
 */

import { supabase } from '@/utils/supabase/client';

export interface SSOProvider {
  id: string;
  organization_id: string;
  name: string;
  type: 'saml' | 'oidc';
  status: 'active' | 'pending' | 'disabled';
  domain: string;

  // SAML Configuration
  saml_metadata_url?: string;
  saml_entity_id?: string;
  saml_sso_url?: string;
  saml_slo_url?: string;
  saml_certificate?: string;
  saml_signature_algorithm?: 'SHA256' | 'SHA384' | 'SHA512';
  saml_name_id_format?: 'emailAddress' | 'persistent' | 'transient';

  // OIDC Configuration
  oidc_issuer?: string;
  oidc_client_id?: string;
  oidc_client_secret?: string;
  oidc_authorization_url?: string;
  oidc_token_url?: string;
  oidc_userinfo_url?: string;
  oidc_scopes?: string[];

  // Attribute Mapping
  attribute_mapping: {
    email: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    groups?: string;
  };

  // Settings
  auto_provision_users: boolean;
  auto_sync_groups: boolean;
  default_role: 'member' | 'admin';
  allowed_groups?: string[];

  created_at: string;
  updated_at: string;
}

export interface SSOSession {
  id: string;
  provider_id: string;
  user_id: string;
  session_index?: string;
  expires_at: string;
  created_at: string;
}

export interface SSOUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  groups?: string[];
  raw_attributes: Record<string, any>;
}

export interface SAMLResponse {
  nameId: string;
  sessionIndex?: string;
  attributes: Record<string, string | string[]>;
}

// Squad Planner SAML Service Provider metadata
export const SP_METADATA = {
  entityId: 'https://squadplanner.app/saml/metadata',
  assertionConsumerServiceUrl: 'https://squadplanner.app/saml/acs',
  singleLogoutServiceUrl: 'https://squadplanner.app/saml/slo',
  nameIdFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
  wantAssertionsSigned: true,
  wantAuthnResponseSigned: true,
  signatureAlgorithm: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
};

export const ssoService = {
  /**
   * Configure a new SSO provider for an organization
   */
  async configureProvider(
    organizationId: string,
    config: Omit<SSOProvider, 'id' | 'organization_id' | 'status' | 'created_at' | 'updated_at'>
  ): Promise<SSOProvider> {
    const { data, error } = await (supabase
      .from('sso_providers') as any)
      .insert({
        organization_id: organizationId,
        ...config,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to configure SSO provider: ${error.message}`);
    return data;
  },

  /**
   * Get SSO provider for a domain
   */
  async getProviderByDomain(domain: string): Promise<SSOProvider | null> {
    const { data, error } = await (supabase
      .from('sso_providers') as any)
      .select('*')
      .eq('domain', domain)
      .eq('status', 'active')
      .single();

    if (error) return null;
    return data;
  },

  /**
   * Get all SSO providers for an organization
   */
  async getOrganizationProviders(organizationId: string): Promise<SSOProvider[]> {
    const { data, error } = await (supabase
      .from('sso_providers') as any)
      .select('*')
      .eq('organization_id', organizationId);

    if (error) return [];
    return data || [];
  },

  /**
   * Update SSO provider configuration
   */
  async updateProvider(providerId: string, updates: Partial<SSOProvider>): Promise<SSOProvider> {
    const { data, error } = await (supabase
      .from('sso_providers') as any)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', providerId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update SSO provider: ${error.message}`);
    return data;
  },

  /**
   * Generate SAML authentication request
   */
  async generateSAMLRequest(providerId: string): Promise<{
    url: string;
    request: string;
    relayState: string;
  }> {
    const { data: provider, error } = await (supabase
      .from('sso_providers') as any)
      .select('*')
      .eq('id', providerId)
      .eq('type', 'saml')
      .single();

    if (error || !provider) throw new Error('SAML provider not found');

    // Generate relay state for CSRF protection
    const relayState = crypto.randomUUID();

    // Store relay state
    await (supabase
      .from('sso_relay_states') as any)
      .insert({
        state: relayState,
        provider_id: providerId,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      });

    // In production, this would generate a proper SAML AuthnRequest
    // Using a simplified version for demo
    const samlRequest = btoa(JSON.stringify({
      id: `_${crypto.randomUUID()}`,
      issueInstant: new Date().toISOString(),
      destination: provider.saml_sso_url,
      issuer: SP_METADATA.entityId,
      assertionConsumerServiceUrl: SP_METADATA.assertionConsumerServiceUrl,
      nameIdPolicy: {
        format: SP_METADATA.nameIdFormat,
        allowCreate: true,
      },
    }));

    const url = `${provider.saml_sso_url}?SAMLRequest=${encodeURIComponent(samlRequest)}&RelayState=${relayState}`;

    return { url, request: samlRequest, relayState };
  },

  /**
   * Process SAML response after IdP authentication
   */
  async processSAMLResponse(
    samlResponse: string,
    relayState: string
  ): Promise<{ user: SSOUser; session: SSOSession }> {
    // Validate relay state
    const { data: relayData, error: relayError } = await (supabase
      .from('sso_relay_states') as any)
      .select('*')
      .eq('state', relayState)
      .single();

    if (relayError || !relayData) {
      throw new Error('Invalid or expired relay state');
    }

    if (new Date(relayData.expires_at) < new Date()) {
      throw new Error('Relay state expired');
    }

    // Delete used relay state
    await (supabase
      .from('sso_relay_states') as any)
      .delete()
      .eq('state', relayState);

    // Get provider
    const { data: provider, error: providerError } = await (supabase
      .from('sso_providers') as any)
      .select('*')
      .eq('id', relayData.provider_id)
      .single();

    if (providerError || !provider) {
      throw new Error('SSO provider not found');
    }

    // In production, this would properly validate and parse the SAML response
    // Using a simplified version for demo
    let parsedResponse: SAMLResponse;
    try {
      parsedResponse = JSON.parse(atob(samlResponse));
    } catch {
      throw new Error('Invalid SAML response');
    }

    // Map attributes to user
    const user: SSOUser = {
      id: parsedResponse.nameId,
      email: this.extractAttribute(parsedResponse.attributes, provider.attribute_mapping.email),
      firstName: provider.attribute_mapping.firstName
        ? this.extractAttribute(parsedResponse.attributes, provider.attribute_mapping.firstName)
        : undefined,
      lastName: provider.attribute_mapping.lastName
        ? this.extractAttribute(parsedResponse.attributes, provider.attribute_mapping.lastName)
        : undefined,
      displayName: provider.attribute_mapping.displayName
        ? this.extractAttribute(parsedResponse.attributes, provider.attribute_mapping.displayName)
        : undefined,
      groups: provider.attribute_mapping.groups
        ? this.extractAttributeArray(parsedResponse.attributes, provider.attribute_mapping.groups)
        : undefined,
      raw_attributes: parsedResponse.attributes,
    };

    // Check if user's groups are allowed
    if (provider.allowed_groups && provider.allowed_groups.length > 0) {
      const userGroups = user.groups || [];
      const hasAllowedGroup = userGroups.some(g => provider.allowed_groups!.includes(g));
      if (!hasAllowedGroup) {
        throw new Error('User is not in an allowed group');
      }
    }

    // Provision or update user
    const supabaseUser = await this.provisionUser(user, provider);

    // Create SSO session
    const session = await this.createSession(provider.id, supabaseUser.id, parsedResponse.sessionIndex);

    return { user, session };
  },

  /**
   * Generate OIDC authorization URL
   */
  async generateOIDCAuthUrl(providerId: string): Promise<{
    url: string;
    state: string;
    nonce: string;
  }> {
    const { data: provider, error } = await (supabase
      .from('sso_providers') as any)
      .select('*')
      .eq('id', providerId)
      .eq('type', 'oidc')
      .single();

    if (error || !provider) throw new Error('OIDC provider not found');

    const state = crypto.randomUUID();
    const nonce = crypto.randomUUID();

    // Store state and nonce
    await (supabase
      .from('sso_relay_states') as any)
      .insert({
        state,
        provider_id: providerId,
        nonce,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      });

    const params = new URLSearchParams({
      client_id: provider.oidc_client_id!,
      redirect_uri: 'https://squadplanner.app/sso/oidc/callback',
      response_type: 'code',
      scope: (provider.oidc_scopes || ['openid', 'email', 'profile']).join(' '),
      state,
      nonce,
    });

    const url = `${provider.oidc_authorization_url}?${params.toString()}`;

    return { url, state, nonce };
  },

  /**
   * Process OIDC callback
   */
  async processOIDCCallback(
    code: string,
    state: string
  ): Promise<{ user: SSOUser; session: SSOSession }> {
    // Validate state
    const { data: stateData, error: stateError } = await (supabase
      .from('sso_relay_states') as any)
      .select('*')
      .eq('state', state)
      .single();

    if (stateError || !stateData) {
      throw new Error('Invalid or expired state');
    }

    // Get provider
    const { data: provider, error: providerError } = await (supabase
      .from('sso_providers') as any)
      .select('*')
      .eq('id', stateData.provider_id)
      .single();

    if (providerError || !provider) {
      throw new Error('OIDC provider not found');
    }

    // Exchange code for tokens
    const tokenResponse = await fetch(provider.oidc_token_url!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: provider.oidc_client_id!,
        client_secret: provider.oidc_client_secret!,
        code,
        redirect_uri: 'https://squadplanner.app/sso/oidc/callback',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    const tokens = await tokenResponse.json();

    // Get user info
    const userInfoResponse = await fetch(provider.oidc_userinfo_url!, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userInfoResponse.ok) {
      throw new Error('Failed to get user info');
    }

    const userInfo = await userInfoResponse.json();

    // Map to SSOUser
    const user: SSOUser = {
      id: userInfo.sub,
      email: this.extractAttribute(userInfo, provider.attribute_mapping.email),
      firstName: provider.attribute_mapping.firstName
        ? this.extractAttribute(userInfo, provider.attribute_mapping.firstName)
        : undefined,
      lastName: provider.attribute_mapping.lastName
        ? this.extractAttribute(userInfo, provider.attribute_mapping.lastName)
        : undefined,
      displayName: provider.attribute_mapping.displayName
        ? this.extractAttribute(userInfo, provider.attribute_mapping.displayName)
        : undefined,
      groups: provider.attribute_mapping.groups
        ? this.extractAttributeArray(userInfo, provider.attribute_mapping.groups)
        : undefined,
      raw_attributes: userInfo,
    };

    // Delete used state
    await (supabase
      .from('sso_relay_states') as any)
      .delete()
      .eq('state', state);

    // Provision or update user
    const supabaseUser = await this.provisionUser(user, provider);

    // Create session
    const session = await this.createSession(provider.id, supabaseUser.id);

    return { user, session };
  },

  /**
   * Provision or update a user from SSO
   */
  async provisionUser(user: SSOUser, provider: SSOProvider): Promise<{ id: string }> {
    // Check if user exists
    const { data: existingUser } = await (supabase
      .from('profiles') as any)
      .select('id')
      .eq('email', user.email)
      .single();

    if (existingUser) {
      // Update existing user
      await (supabase
        .from('profiles') as any)
        .update({
          display_name: user.displayName || `${user.firstName} ${user.lastName}`.trim(),
          sso_provider_id: provider.id,
          sso_last_login: new Date().toISOString(),
        })
        .eq('id', existingUser.id);

      return { id: existingUser.id };
    }

    // Create new user if auto-provisioning is enabled
    if (!provider.auto_provision_users) {
      throw new Error('User not found and auto-provisioning is disabled');
    }

    // Create auth user via Supabase Admin API (would need server-side implementation)
    // For demo, we'll just return a placeholder
    const newUserId = crypto.randomUUID();

    // In production, this would create the auth user and profile
    await (supabase
      .from('profiles') as any)
      .insert({
        id: newUserId,
        email: user.email,
        username: user.email.split('@')[0],
        display_name: user.displayName || `${user.firstName} ${user.lastName}`.trim(),
        sso_provider_id: provider.id,
        sso_last_login: new Date().toISOString(),
      });

    return { id: newUserId };
  },

  /**
   * Create an SSO session
   */
  async createSession(providerId: string, userId: string, sessionIndex?: string): Promise<SSOSession> {
    const session: SSOSession = {
      id: crypto.randomUUID(),
      provider_id: providerId,
      user_id: userId,
      session_index: sessionIndex,
      expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours
      created_at: new Date().toISOString(),
    };

    await (supabase
      .from('sso_sessions') as any)
      .insert(session);

    return session;
  },

  /**
   * Single Logout (SLO)
   */
  async logout(userId: string): Promise<void> {
    // Get user's SSO sessions
    const { data: sessions } = await (supabase
      .from('sso_sessions') as any)
      .select('*, sso_providers(*)')
      .eq('user_id', userId);

    // For each session, initiate SLO if supported
    for (const session of sessions || []) {
      if (session.sso_providers?.saml_slo_url && session.session_index) {
        // In production, would send SAML LogoutRequest to IdP
        console.log(`Initiating SLO for session ${session.id}`);
      }
    }

    // Delete all SSO sessions for user
    await (supabase
      .from('sso_sessions') as any)
      .delete()
      .eq('user_id', userId);
  },

  /**
   * Get SP metadata XML for SAML configuration
   */
  getSPMetadataXML(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="${SP_METADATA.entityId}">
  <md:SPSSODescriptor AuthnRequestsSigned="true" WantAssertionsSigned="true" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:NameIDFormat>${SP_METADATA.nameIdFormat}</md:NameIDFormat>
    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="${SP_METADATA.assertionConsumerServiceUrl}" index="0" isDefault="true"/>
    <md:SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="${SP_METADATA.singleLogoutServiceUrl}"/>
  </md:SPSSODescriptor>
</md:EntityDescriptor>`;
  },

  // Helper methods
  extractAttribute(attributes: Record<string, any>, path: string): string {
    const value = attributes[path];
    if (Array.isArray(value)) return value[0] || '';
    return value || '';
  },

  extractAttributeArray(attributes: Record<string, any>, path: string): string[] {
    const value = attributes[path];
    if (Array.isArray(value)) return value;
    if (value) return [value];
    return [];
  },
};

export default ssoService;
