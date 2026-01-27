import { projectId, publicAnonKey } from '@/utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e884809f`;

export interface Integration {
  connected: boolean;
  username?: string;
  email?: string;
  connectedAt?: string;
}

export interface Integrations {
  discord: Integration;
  googleCalendar: Integration;
  twitch: Integration;
  steam: Integration;
  riot: Integration;
  battlenet: Integration;
}

export const integrationsAPI = {
  // Get user integrations
  async getUserIntegrations(accessToken: string): Promise<Integrations> {
    const response = await fetch(`${API_URL}/user/integrations`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get integrations');
    }

    const data = await response.json();
    return data.integrations;
  },

  // Connect integration
  async connectIntegration(
    accessToken: string,
    platform: string,
    credentials: { username?: string; email?: string }
  ): Promise<Integrations> {
    const response = await fetch(`${API_URL}/user/integrations/${platform}/connect`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to connect integration');
    }

    const data = await response.json();
    return data.integrations;
  },

  // Disconnect integration
  async disconnectIntegration(
    accessToken: string,
    platform: string
  ): Promise<Integrations> {
    const response = await fetch(`${API_URL}/user/integrations/${platform}/disconnect`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to disconnect integration');
    }

    const data = await response.json();
    return data.integrations;
  },
};
