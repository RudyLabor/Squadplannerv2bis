/**
 * Typed Supabase Client
 *
 * This file provides a strongly-typed Supabase client instance
 * and type helpers for working with database tables.
 */

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;

// Storage adapter explicite pour éviter les problèmes SSR
const customStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  },
};

// Create typed Supabase client avec storage explicite
export const supabase = createClient<Database>(supabaseUrl, publicAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storage: customStorage,
    storageKey: `sb-${projectId}-auth-token`,
    flowType: 'implicit',
    // Désactive Web Locks API qui cause le deadlock sur F5
    // @ts-ignore - Option non documentée mais fonctionnelle
    lock: false,
  },
});

// Type helpers for easy access to table types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Specific table types for convenience
export type User = Tables<'users'>;
export type Squad = Tables<'squads'>;
export type Session = Tables<'sessions'>;
export type Message = Tables<'messages'>;
export type Notification = Tables<'notifications'>;
export type SquadMember = Tables<'squad_members'>;
export type SessionRSVP = Tables<'session_rsvps'>;
export type Friendship = Tables<'friendships'>;
export type Achievement = Tables<'achievements'>;
export type Badge = Tables<'badges'>;
export type Challenge = Tables<'challenges'>;
export type Tournament = Tables<'tournaments'>;
export type League = Tables<'leagues'>;
export type Integration = Tables<'integrations'>;
export type Webhook = Tables<'webhooks'>;

// Backwards compatibility export
export const getSupabase = () => supabase;

// Export default for direct imports
export default supabase;
