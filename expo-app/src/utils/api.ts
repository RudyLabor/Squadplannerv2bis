import { projectId, publicAnonKey } from './supabase';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e884809f`;

export const api = {
  // Auth
  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  async signup(email: string, password: string, name: string) {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ email, password, name }),
    });
    return response.json();
  },

  // Profile
  async getProfile(accessToken: string) {
    const response = await fetch(`${API_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },

  async updateProfile(accessToken: string, userId: string, data: any) {
    const response = await fetch(`${API_URL}/auth/profile-bypass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ userId, ...data }),
    });
    return response.json();
  },

  // Squads
  async getSquads(accessToken: string) {
    const response = await fetch(`${API_URL}/squads`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },

  async getSquad(accessToken: string, squadId: string) {
    const response = await fetch(`${API_URL}/squads/${squadId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },

  async createSquad(accessToken: string, data: any) {
    const response = await fetch(`${API_URL}/squads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Sessions
  async getSessions(accessToken: string) {
    const response = await fetch(`${API_URL}/sessions`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },

  async createSession(accessToken: string, data: any) {
    const response = await fetch(`${API_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async rsvpSession(accessToken: string, sessionId: string, status: string) {
    const response = await fetch(`${API_URL}/sessions/${sessionId}/rsvp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status }),
    });
    return response.json();
  },
};
