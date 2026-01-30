/**
 * Squad Planner JavaScript/TypeScript SDK
 * Official SDK for integrating with Squad Planner API
 * @version 1.0.0
 */

export interface SquadPlannerConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export interface Squad {
  id: string;
  name: string;
  description?: string;
  game: string;
  avatar_url?: string;
  member_count: number;
  created_at: string;
}

export interface Session {
  id: string;
  squad_id: string;
  title: string;
  description?: string;
  scheduled_date: string;
  scheduled_time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_by: string;
  max_players?: number;
}

export interface Member {
  id: string;
  user_id: string;
  squad_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
  display_name: string;
  avatar_url?: string;
}

export interface RSVP {
  id: string;
  session_id: string;
  user_id: string;
  response: 'going' | 'maybe' | 'not_going';
  responded_at: string;
}

export interface Webhook {
  id: string;
  squad_id: string;
  url: string;
  events: string[];
  is_active: boolean;
  secret?: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

export class SquadPlannerSDK {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  constructor(config: SquadPlannerConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.squadplanner.app/v1';
    this.timeout = config.timeout || 30000;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-SDK-Version': '1.0.0',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        return {
          data: null as T,
          error: data.message || 'An error occurred',
          status: response.status,
        };
      }

      return { data, status: response.status };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // ============ SQUADS ============

  /**
   * Get all squads for the authenticated user
   */
  async getSquads(): Promise<ApiResponse<Squad[]>> {
    return this.request<Squad[]>('/squads');
  }

  /**
   * Get a specific squad by ID
   */
  async getSquad(squadId: string): Promise<ApiResponse<Squad>> {
    return this.request<Squad>(`/squads/${squadId}`);
  }

  /**
   * Create a new squad
   */
  async createSquad(data: {
    name: string;
    description?: string;
    game: string;
    avatar_url?: string;
  }): Promise<ApiResponse<Squad>> {
    return this.request<Squad>('/squads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update a squad
   */
  async updateSquad(
    squadId: string,
    data: Partial<Squad>
  ): Promise<ApiResponse<Squad>> {
    return this.request<Squad>(`/squads/${squadId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a squad
   */
  async deleteSquad(squadId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/squads/${squadId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get squad members
   */
  async getSquadMembers(squadId: string): Promise<ApiResponse<Member[]>> {
    return this.request<Member[]>(`/squads/${squadId}/members`);
  }

  /**
   * Invite a member to squad
   */
  async inviteMember(
    squadId: string,
    email: string
  ): Promise<ApiResponse<{ invite_code: string }>> {
    return this.request<{ invite_code: string }>(`/squads/${squadId}/invite`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // ============ SESSIONS ============

  /**
   * Get all sessions for a squad
   */
  async getSessions(squadId: string): Promise<ApiResponse<Session[]>> {
    return this.request<Session[]>(`/squads/${squadId}/sessions`);
  }

  /**
   * Get a specific session
   */
  async getSession(sessionId: string): Promise<ApiResponse<Session>> {
    return this.request<Session>(`/sessions/${sessionId}`);
  }

  /**
   * Create a new session
   */
  async createSession(
    squadId: string,
    data: {
      title: string;
      description?: string;
      scheduled_date: string;
      scheduled_time: string;
      duration: number;
      max_players?: number;
    }
  ): Promise<ApiResponse<Session>> {
    return this.request<Session>(`/squads/${squadId}/sessions`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update a session
   */
  async updateSession(
    sessionId: string,
    data: Partial<Session>
  ): Promise<ApiResponse<Session>> {
    return this.request<Session>(`/sessions/${sessionId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Cancel a session
   */
  async cancelSession(sessionId: string): Promise<ApiResponse<Session>> {
    return this.request<Session>(`/sessions/${sessionId}/cancel`, {
      method: 'POST',
    });
  }

  /**
   * Get RSVPs for a session
   */
  async getSessionRSVPs(sessionId: string): Promise<ApiResponse<RSVP[]>> {
    return this.request<RSVP[]>(`/sessions/${sessionId}/rsvps`);
  }

  /**
   * Submit an RSVP
   */
  async submitRSVP(
    sessionId: string,
    response: 'going' | 'maybe' | 'not_going'
  ): Promise<ApiResponse<RSVP>> {
    return this.request<RSVP>(`/sessions/${sessionId}/rsvp`, {
      method: 'POST',
      body: JSON.stringify({ response }),
    });
  }

  // ============ WEBHOOKS ============

  /**
   * Get all webhooks for a squad
   */
  async getWebhooks(squadId: string): Promise<ApiResponse<Webhook[]>> {
    return this.request<Webhook[]>(`/squads/${squadId}/webhooks`);
  }

  /**
   * Create a webhook
   */
  async createWebhook(
    squadId: string,
    data: {
      url: string;
      events: string[];
    }
  ): Promise<ApiResponse<Webhook>> {
    return this.request<Webhook>(`/squads/${squadId}/webhooks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a webhook
   */
  async deleteWebhook(webhookId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/webhooks/${webhookId}`, {
      method: 'DELETE',
    });
  }

  // ============ ANALYTICS ============

  /**
   * Get squad analytics
   */
  async getSquadAnalytics(
    squadId: string,
    period: 'daily' | 'weekly' | 'monthly' = 'weekly'
  ): Promise<ApiResponse<{
    sessions_count: number;
    avg_attendance: number;
    total_hours: number;
    member_activity: Record<string, number>;
  }>> {
    return this.request(`/squads/${squadId}/analytics?period=${period}`);
  }

  /**
   * Get user analytics
   */
  async getUserAnalytics(
    period: 'daily' | 'weekly' | 'monthly' = 'weekly'
  ): Promise<ApiResponse<{
    sessions_attended: number;
    reliability_score: number;
    total_hours: number;
    streak: number;
  }>> {
    return this.request(`/me/analytics?period=${period}`);
  }
}

// Default export for CommonJS compatibility
export default SquadPlannerSDK;
