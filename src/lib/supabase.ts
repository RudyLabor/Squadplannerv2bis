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
const storageKey = `sb-${projectId}-auth-token`;

// Custom storage qui évite les problèmes de Web Locks
// Le SDK Supabase peut bloquer avec les Web Locks lors du getSession/getUser
// Ce custom storage permet de lire/écrire directement sans bloquer
const customStorage = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
};

// Create typed Supabase client avec configuration optimisée
export const supabase = createClient<Database>(supabaseUrl, publicAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true, // Activé pour rafraîchir automatiquement les tokens
    detectSessionInUrl: false, // Désactiver pour éviter les redirections
    storage: customStorage,
    storageKey: storageKey,
    flowType: 'implicit',
  },
  global: {
    headers: {
      'x-client-info': 'squad-planner',
    },
  },
});

// Helper pour restaurer et rafraîchir la session
// Utilise une requête HTTP directe pour éviter les blocages Web Locks du SDK
let sessionInitialized = false;
let sessionInitPromise: Promise<void> | null = null;

export const initializeSession = async (): Promise<void> => {
  if (sessionInitialized) return;
  if (sessionInitPromise) return sessionInitPromise;

  sessionInitPromise = (async () => {
    try {
      const storedData = localStorage.getItem(storageKey);
      if (!storedData) {
        console.log('[Supabase] Pas de token stocké');
        sessionInitialized = true;
        return;
      }

      const tokenData = JSON.parse(storedData);

      // Vérifier si on a les tokens nécessaires
      if (!tokenData.refresh_token) {
        console.log('[Supabase] Pas de refresh_token');
        sessionInitialized = true;
        return;
      }

      console.log('[Supabase] 🔄 Refresh du token via HTTP...');

      // Refresh direct via HTTP - évite les Web Locks du SDK
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': publicAnonKey,
          },
          body: JSON.stringify({
            refresh_token: tokenData.refresh_token,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const newTokens = await response.json();

          // Mettre à jour le localStorage avec les nouveaux tokens
          const updatedData = {
            ...tokenData,
            access_token: newTokens.access_token,
            refresh_token: newTokens.refresh_token,
            expires_at: newTokens.expires_at || Math.floor(Date.now() / 1000) + 3600,
          };

          localStorage.setItem(storageKey, JSON.stringify(updatedData));
          console.log('[Supabase] ✅ Token rafraîchi via HTTP');
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.warn('[Supabase] Refresh HTTP error:', response.status, errorData);
        }
      } catch (e: any) {
        if (e.name === 'AbortError') {
          console.warn('[Supabase] Refresh timeout');
        } else {
          console.warn('[Supabase] Refresh error:', e.message);
        }
      }
    } catch (e) {
      console.warn('[Supabase] Init error:', e);
    } finally {
      sessionInitialized = true;
    }
  })();

  return sessionInitPromise;
};

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
