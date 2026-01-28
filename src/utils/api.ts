// 🔗 SQUAD PLANNER - API Client
// Centralized API calls to Supabase backend
// REFACTORED: Using REAL RELATIONAL DATABASE (Phase A complete)
// This uses clean SQL tables (public.squads, public.profiles) properly secured with RLS.

import apiReal from './api-real';

// Re-export specific APIs for component usage
export const authAPI = apiReal.auth;
export const squadsAPI = apiReal.squads;
export const sessionsAPI = apiReal.sessions;
export const messagesAPI = apiReal.messages;
export const statsAPI = { 
  getUserStats: async () => ({ stats: {} }), 
  getSquadStats: async () => ({ stats: {} }),
  getReliabilityScore: async () => ({ score: 100 })
};
export const analyticsAPI = {
  trackEvent: async () => ({}),
  getDashboard: async () => ({})
};
export const notificationsAPI = apiReal.notifications;
export const invitesAPI = apiReal.invites;
export const intelligenceAPI = apiReal.intelligence;

export const webhooksAPI = {
  getWebhooks: async () => ({ webhooks: [] }),
  createWebhook: async () => ({}),
  deleteWebhook: async () => ({}),
  testWebhook: async () => ({})
};

// Export default object
export default {
  auth: authAPI,
  squads: squadsAPI,
  sessions: sessionsAPI,
  stats: statsAPI,
  analytics: analyticsAPI,
  notifications: notificationsAPI,
  invites: invitesAPI,
  webhooks: webhooksAPI,
  intelligence: intelligenceAPI,
};
