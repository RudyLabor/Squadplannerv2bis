import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { authService } from '@/app/services/auth';
import { supabase } from '@/utils/supabase/client';

interface User {
  id: string;
  email: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  role?: string;
  reliability_score?: number;
  xp_points?: number;
  level?: number;
  is_premium?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearAllCache: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// TEMPORARY: Bypass auth for development - set to false to re-enable auth
const BYPASS_AUTH = true;

// Mock user for development when auth is bypassed
const MOCK_USER: User = {
  id: 'dev-user-001',
  email: 'dev@squadplanner.app',
  username: 'DevUser',
  display_name: 'Développeur Test',
  avatar_url: undefined,
  role: 'admin',
  reliability_score: 95,
  xp_points: 1500,
  level: 10,
  is_premium: true,
};

// Fonction pour nettoyer le cache (uniquement sur demande explicite)
const clearAllAppCache = async () => {
  if (typeof window === 'undefined') return;

  console.log('[AuthContext] Clearing all cache...');

  // 1. Déconnecter de Supabase
  try {
    await supabase.auth.signOut({ scope: 'local' });
  } catch (e) {
    console.warn('[AuthContext] Error signing out:', e);
  }

  // 2. Nettoyer localStorage des clés Supabase
  const allKeys = Object.keys(localStorage);
  allKeys.forEach(key => {
    if (key.startsWith('sb-') ||
        key.startsWith('supabase') ||
        key.includes('squad-planner')) {
      localStorage.removeItem(key);
    }
  });

  // 3. Nettoyer sessionStorage
  const sessionKeys = Object.keys(sessionStorage);
  sessionKeys.forEach(key => {
    if (key.startsWith('sb-') || key.startsWith('supabase')) {
      sessionStorage.removeItem(key);
    }
  });

  console.log('[AuthContext] Cache cleared');
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // Use mock user if auth is bypassed
  const [user, setUser] = useState<User | null>(BYPASS_AUTH ? MOCK_USER : null);
  const [loading, setLoading] = useState(BYPASS_AUTH ? false : true);
  const initDone = useRef(BYPASS_AUTH ? true : false);

  useEffect(() => {
    // Prevent double initialization in StrictMode
    if (initDone.current) return;
    initDone.current = true;

    let isMounted = true;

    const initAuth = async () => {
      console.log('[AuthContext] Starting auth initialization...');

      try {
        // Récupérer la session existante
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (error) {
          console.error('[AuthContext] getSession error:', error);
          setUser(null);
          setLoading(false);
          return;
        }

        if (!session) {
          console.log('[AuthContext] No existing session');
          setUser(null);
          setLoading(false);
          return;
        }

        console.log('[AuthContext] Session found, loading user profile...');

        // Session trouvée, récupérer le profil
        const currentUser = await authService.getCurrentUser();

        if (!isMounted) return;

        if (currentUser && currentUser.id) {
          console.log('[AuthContext] User loaded:', currentUser.username || currentUser.email);
          setUser(currentUser as User);
        } else {
          console.log('[AuthContext] No user profile found');
          setUser(null);
        }
        setLoading(false);
      } catch (error) {
        console.error('[AuthContext] Init error:', error);
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    // Écouter les changements d'auth APRÈS l'initialisation
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthContext] Auth state changed:', event, 'hasSession:', !!session);

      if (!isMounted) return;

      // Ignorer l'événement INITIAL_SESSION car on le gère déjà dans initAuth
      if (event === 'INITIAL_SESSION') {
        return;
      }

      if (event === 'SIGNED_OUT') {
        setUser(null);
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
          try {
            const currentUser = await authService.getCurrentUser();
            if (isMounted && currentUser && currentUser.id) {
              setUser(currentUser as User);
            }
          } catch (e) {
            console.error('[AuthContext] Error loading user after auth change:', e);
          }
        }
      }
    });

    // Lancer l'initialisation
    initAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, username: string, displayName?: string) => {
    setLoading(true);
    try {
      await authService.signUp(email, password, username, displayName);
      const newUser = await authService.getCurrentUser();
      if (newUser) {
        setUser(newUser as User);
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('[AuthContext] signIn started');
    setLoading(true);
    try {
      await authService.signIn(email, password);
      console.log('[AuthContext] signIn completed, getting user profile...');

      const currentUser = await authService.getCurrentUser();
      console.log('[AuthContext] currentUser:', currentUser);

      if (currentUser && currentUser.id) {
        setUser(currentUser as User);
      }
      console.log('[AuthContext] User state updated');
    } catch (error) {
      console.error('[AuthContext] Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      setUser(null);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser && currentUser.id) {
        setUser(currentUser as User);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const clearAllCache = async () => {
    setLoading(true);
    try {
      await clearAllAppCache();
      setUser(null);
      window.location.reload();
    } catch (error) {
      console.error('[AuthContext] Clear cache error:', error);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut,
      refreshUser,
      clearAllCache,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
