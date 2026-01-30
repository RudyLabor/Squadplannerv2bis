// 🔗 SQUAD PLANNER - API Client
// Centralized API calls to Supabase backend
// REFACTORED: Using REAL RELATIONAL DATABASE (Phase A complete)
// Phase 2 Complete: All APIs fully implemented with Supabase
// This uses clean SQL tables (public.squads, public.profiles) properly secured with RLS.

import apiReal from './api-real';

// Re-export all APIs from api-real.ts
export const authAPI = apiReal.auth;
export const squadsAPI = apiReal.squads;
export const sessionsAPI = apiReal.sessions;
export const messagesAPI = apiReal.messages;
export const notificationsAPI = apiReal.notifications;
export const invitesAPI = apiReal.invites;
export const intelligenceAPI = apiReal.intelligence;

// NEW Phase 2 APIs - Fully implemented
export const friendshipsAPI = apiReal.friendships;
export const achievementsAPI = apiReal.achievements;
export const badgesAPI = apiReal.badges;
export const challengesAPI = apiReal.challenges;
export const tournamentsAPI = apiReal.tournaments;
export const leaguesAPI = apiReal.leagues;
export const availabilityAPI = apiReal.availability;
export const analyticsAPI = apiReal.analytics;
export const webhooksAPI = apiReal.webhooks;
export const integrationsAPI = apiReal.integrations;

// Phase 5 APIs - Advanced features
export const recurringSessionsAPI = apiReal.recurringSessions;

// Phase 5 APIs - Public API & Developer Tools
import publicAPI from './public-api';
export const apiKeysAPI = publicAPI.apiKeys;
export const userWebhooksAPI = publicAPI.webhooks;
export const WEBHOOK_EVENTS = publicAPI.WEBHOOK_EVENTS;
export const API_PERMISSIONS = publicAPI.API_PERMISSIONS;

// Phase 4 B2B APIs - Organizations
import organizationsAPI, { ORG_ROLE_LABELS, SQUAD_TIER_LABELS, ORG_TYPE_LABELS } from './organizations-api';
export { organizationsAPI, ORG_ROLE_LABELS, SQUAD_TIER_LABELS, ORG_TYPE_LABELS };

// Phase 5 APIs - Team Intelligence
import teamIntelligenceAPI from './team-intelligence';
export { teamIntelligenceAPI };

// Legacy statsAPI - uses analyticsAPI under the hood
export const statsAPI = {
  getUserStats: async () => {
    const result = await apiReal.analytics.getUserStats('monthly');
    return { stats: result.stats[0] || {} };
  },
  getSquadStats: async (squadId: string) => {
    const result = await apiReal.analytics.getSquadStats(squadId, 'monthly');
    return { stats: result.stats[0] || {} };
  },
  getReliabilityScore: async () => {
    const { stats } = await apiReal.analytics.getUserStats('monthly');
    return { score: stats[0]?.avg_reliability || 100 };
  }
};

// Export default object with all APIs
export default {
  auth: authAPI,
  squads: squadsAPI,
  sessions: sessionsAPI,
  messages: messagesAPI,
  notifications: notificationsAPI,
  invites: invitesAPI,
  intelligence: intelligenceAPI,
  friendships: friendshipsAPI,
  achievements: achievementsAPI,
  badges: badgesAPI,
  challenges: challengesAPI,
  tournaments: tournamentsAPI,
  leagues: leaguesAPI,
  availability: availabilityAPI,
  analytics: analyticsAPI,
  webhooks: webhooksAPI,
  integrations: integrationsAPI,
  recurringSessions: recurringSessionsAPI,
  stats: statsAPI,
  // Phase 5 - Public API
  apiKeys: apiKeysAPI,
  userWebhooks: userWebhooksAPI,
};
