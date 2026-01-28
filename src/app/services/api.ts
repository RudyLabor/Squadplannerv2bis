import { projectId, publicAnonKey } from '@/utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/server/make-server-e884809f`;

// Récupérer le token d'authentification depuis localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('supabase_access_token');
}

// Helper pour les requêtes API
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : `Bearer ${publicAnonKey}`,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============================================================================
// AUTH API
// ============================================================================

export const authAPI = {
  signup: async (data: {
    email: string;
    password: string;
    username: string;
    displayName?: string;
  }) => {
    return apiRequest<{ user: any; authUser: any }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getCurrentUser: async () => {
    return apiRequest<{ user: any }>('/auth/me');
  },
};

// ============================================================================
// USERS API
// ============================================================================

export const usersAPI = {
  getProfile: async (userId: string) => {
    return apiRequest<{ user: any }>(`/users/${userId}`);
  },

  updateProfile: async (userId: string, data: any) => {
    return apiRequest<{ user: any }>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  searchUsers: async (query: string) => {
    return apiRequest<{ users: any[] }>(`/users/search?q=${encodeURIComponent(query)}`);
  },

  getStats: async (userId: string) => {
    return apiRequest<{ stats: any }>(`/users/${userId}/stats`);
  },

  getAchievements: async (userId: string) => {
    return apiRequest<{ achievements: any[] }>(`/users/${userId}/achievements`);
  },
};

// ============================================================================
// SQUADS API
// ============================================================================

export const squadsAPI = {
  getAll: async () => {
    return apiRequest<{ squads: any[] }>('/squads');
  },

  getById: async (squadId: string) => {
    return apiRequest<{ squad: any }>(`/squads/${squadId}`);
  },

  create: async (data: {
    name: string;
    description?: string;
    game: string;
    gameMode?: string;
    maxMembers?: number;
    isPublic?: boolean;
  }) => {
    return apiRequest<{ squad: any }>('/squads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (squadId: string, data: any) => {
    return apiRequest<{ squad: any }>(`/squads/${squadId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  join: async (inviteCode: string) => {
    return apiRequest<{ squad: any }>('/squads/join', {
      method: 'POST',
      body: JSON.stringify({ inviteCode }),
    });
  },

  leave: async (squadId: string) => {
    return apiRequest<{ success: boolean }>(`/squads/${squadId}/leave`, {
      method: 'DELETE',
    });
  },

  getStats: async (squadId: string) => {
    return apiRequest<{ stats: any }>(`/squads/${squadId}/stats`);
  },

  getSessions: async (squadId: string, status?: 'upcoming' | 'past' | 'all') => {
    const query = status ? `?status=${status}` : '';
    return apiRequest<{ sessions: any[] }>(`/squads/${squadId}/sessions${query}`);
  },

  getMessages: async (squadId: string, limit = 50) => {
    return apiRequest<{ messages: any[] }>(`/squads/${squadId}/messages?limit=${limit}`);
  },
};

// ============================================================================
// SESSIONS API
// ============================================================================

export const sessionsAPI = {
  getById: async (sessionId: string) => {
    return apiRequest<{ session: any }>(`/sessions/${sessionId}`);
  },

  create: async (data: {
    squadId: string;
    title: string;
    description?: string;
    scheduledDate: string;
    scheduledTime: string;
    duration?: string;
    requiredPlayers?: number;
  }) => {
    return apiRequest<{ session: any }>('/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (sessionId: string, data: any) => {
    return apiRequest<{ session: any }>(`/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  rsvp: async (sessionId: string, response: 'yes' | 'no' | 'maybe', notes?: string) => {
    return apiRequest<{ rsvp: any }>(`/sessions/${sessionId}/rsvp`, {
      method: 'POST',
      body: JSON.stringify({ response, notes }),
    });
  },
};

// ============================================================================
// NOTIFICATIONS API
// ============================================================================

export const notificationsAPI = {
  getAll: async () => {
    return apiRequest<{ notifications: any[] }>('/notifications');
  },

  markAsRead: async (notificationId: string) => {
    return apiRequest<{ notification: any }>(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  },

  markAllAsRead: async () => {
    return apiRequest<{ success: boolean }>('/notifications/read-all', {
      method: 'POST',
    });
  },
};

// ============================================================================
// MESSAGES API
// ============================================================================

export const messagesAPI = {
  send: async (data: {
    squadId: string;
    content: string;
    type?: 'text' | 'system' | 'image' | 'file';
  }) => {
    return apiRequest<{ message: any }>('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ============================================================================
// HEALTH CHECK
// ============================================================================

export const healthCheck = async () => {
  return apiRequest<{ status: string; message: string }>('/health');
};
