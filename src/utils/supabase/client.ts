/**
 * Supabase Client - Legacy Export
 *
 * This file maintains backwards compatibility for existing code.
 * New code should import from '@/lib/supabase' instead.
 */

// Re-export from the new typed client
export { supabase, getSupabase } from '@/lib/supabase';

// Also export all type helpers for convenience
export type {
  Tables,
  TablesInsert,
  TablesUpdate,
  User,
  Squad,
  Session,
  Message,
  Notification,
  SquadMember,
  SessionRSVP,
  Friendship,
  Achievement,
  Badge,
  Challenge,
  Tournament,
  League,
  Integration,
  Webhook,
} from '@/lib/supabase';