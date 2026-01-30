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

// Custom storage wrapper that bypasses Web Locks completely
// The Supabase SDK v2.93.2 uses Web Locks API which can hang indefinitely
const createNoLockStorage = () => {
  if (typeof window === 'undefined') return undefined;

  return {
    getItem: (key: string) => {
      try {
        return window.localStorage.getItem(key);
      } catch (e) {
        console.warn('[Supabase Storage] getItem error:', e);
        return null;
      }
    },
    setItem: (key: string, value: string) => {
      try {
        window.localStorage.setItem(key, value);
      } catch (e) {
        console.warn('[Supabase Storage] setItem error:', e);
      }
    },
    removeItem: (key: string) => {
      try {
        window.localStorage.removeItem(key);
      } catch (e) {
        console.warn('[Supabase Storage] removeItem error:', e);
      }
    },
  };
};

// Create typed Supabase client with improved error handling
// FIX: detectSessionInUrl: false et pas de flowType PKCE pour éviter le blocage sur getSession()
// lors des rafraîchissements de page (le SDK attendait un code PKCE dans l'URL qui n'arrivait jamais)
export const supabase = createClient<Database>(supabaseUrl, publicAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // ✅ CORRIGÉ: était true, causait blocage sur F5
    storage: createNoLockStorage(), // ✅ Custom storage sans Web Locks
    // @ts-ignore - Option non documentée mais nécessaire pour éviter le blocage Web Lock
    lock: false, // ✅ FIX CRITIQUE: Désactive Web Locks API
    storageKey: `sb-${projectId}-auth-token`, // ✅ Clé explicite pour éviter les conflits
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'x-application-name': 'squad-planner',
    },
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
