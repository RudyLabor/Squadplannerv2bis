import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback, useMemo } from 'react';
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
  authError: string | null;
  signUp: (email: string, password: string, username: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearAllCache: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  isAuthenticated: boolean;
  resetAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Login screen re-enabled
const BYPASS_AUTH = false;

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

// Simple in-memory cache for user profile - prevents redundant API calls
const userProfileCache = {
  data: null as User | null,
  userId: null as string | null,
  timestamp: 0,
  maxAge: 60000, // 60 seconds cache

  set(userId: string, user: User) {
    this.data = user;
    this.userId = userId;
    this.timestamp = Date.now();
  },

  get(userId: string): User | null {
    if (this.userId !== userId) return null;
    if (Date.now() - this.timestamp > this.maxAge) {
      this.clear();
      return null;
    }
    return this.data;
  },

  clear() {
    this.data = null;
    this.userId = null;
    this.timestamp = 0;
  }
};

// Fonction pour nettoyer le cache (uniquement sur demande explicite)
const clearAllAppCache = async (redirectToLogin = false) => {
  if (typeof window === 'undefined') return;

  console.log('[Auth] 🧹 Nettoyage complet du cache...');
  userProfileCache.clear();

  // 1. Déconnecter de Supabase
  try {
    await supabase.auth.signOut({ scope: 'local' });
  } catch (e) {
    // Silent fail
  }

  // 2. Nettoyer localStorage des clés Supabase - TOUT supprimer
  const allKeys = Object.keys(localStorage);
  allKeys.forEach(key => {
    if (key.startsWith('sb-') ||
        key.startsWith('supabase') ||
        key.includes('squad-planner') ||
        key.includes('auth-token')) {
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

  console.log('[Auth] ✅ Cache nettoyé');

  // 4. Optionnel: Forcer la redirection vers login après nettoyage
  if (redirectToLogin && typeof window !== 'undefined') {
    window.location.href = '/';
  }
};

// Optimized profile fetch with cache
const fetchUserProfile = async (userId: string, forceRefresh = false): Promise<User | null> => {
  // Check cache first
  if (!forceRefresh) {
    const cached = userProfileCache.get(userId);
    if (cached) return cached;
  }

  // Fonction helper pour créer un user depuis les métadonnées de session
  const createFallbackUser = async (): Promise<User | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const metadata = session.user.user_metadata || {};
        const fallbackUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          username: metadata.username || session.user.email?.split('@')[0] || 'user',
          display_name: metadata.display_name,
          avatar_url: metadata.avatar_url,
        };
        userProfileCache.set(userId, fallbackUser);
        return fallbackUser;
      }
    } catch (e) {
      console.warn('[Auth] Fallback user creation failed:', e);
    }
    return null;
  };

  try {
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id' as any, userId)
      .single();

    if (error) {
      // Erreurs attendues (profil non créé, table non accessible) - utiliser fallback silencieusement
      // Codes d'erreur: PGRST116 = pas de résultat, 400/406 = problème de requête/permission
      const isExpectedError = error.code === 'PGRST116' ||
                              error.message?.includes('not found') ||
                              error.code === '406' ||
                              error.code === '400';

      if (!isExpectedError) {
        console.warn('[Auth] Profile fetch warning:', error.message);
      }

      return await createFallbackUser();
    }

    if (!user) {
      return await createFallbackUser();
    }

    // @ts-ignore - Types Supabase non synchronisés
    userProfileCache.set(userId, user);
    // @ts-ignore - Types Supabase non synchronisés
    return user;
  } catch (err: any) {
    // Erreurs réseau ou autres - log et fallback
    console.warn('[Auth] Profile fetch exception:', err?.message || err);
    return await createFallbackUser();
  }
};

// Timeout pour l'authentification (20 secondes max - augmenté pour connexions lentes)
const AUTH_TIMEOUT_MS = 20000;

// Timeout pour les opérations individuelles (10 secondes)
const OPERATION_TIMEOUT_MS = 10000;

// Vérification synchrone du token pour fast-path
const checkAuthTokenSync = (): { hasToken: boolean; isExpired: boolean } => {
  if (typeof window === 'undefined') return { hasToken: false, isExpired: true };

  try {
    // Chercher la clé du token Supabase dans localStorage
    const allKeys = Object.keys(localStorage);
    const tokenKey = allKeys.find(key => key.startsWith('sb-') && key.endsWith('-auth-token'));

    if (!tokenKey) {
      return { hasToken: false, isExpired: true };
    }

    const tokenData = localStorage.getItem(tokenKey);
    if (!tokenData) {
      return { hasToken: false, isExpired: true };
    }

    const parsed = JSON.parse(tokenData);
    const now = Math.floor(Date.now() / 1000);

    // Vérifier si le token a expiré
    if (parsed.expires_at && parsed.expires_at < now) {
      console.log('[Auth] ⚠️ Token expiré détecté (sync check)');
      return { hasToken: true, isExpired: true };
    }

    return { hasToken: true, isExpired: false };
  } catch (e) {
    console.warn('[Auth] Erreur vérification sync token:', e);
    return { hasToken: false, isExpired: true };
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(BYPASS_AUTH ? MOCK_USER : null);
  const [loading, setLoading] = useState(BYPASS_AUTH ? false : true);
  const [authError, setAuthError] = useState<string | null>(null);
  const initDone = useRef(BYPASS_AUTH);
  const isSigningIn = useRef(false); // Prevent duplicate calls during signIn

  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    let isMounted = true;

    console.log('[Auth] 🚀 Initialisation...');

    // WORKAROUND: Le SDK Supabase ne restaure pas la session correctement
    // On lit le token manuellement et on crée l'utilisateur si valide
    const restoreFromLocalStorage = async (): Promise<boolean> => {
      try {
        const storageKey = 'sb-cwtoprbowdqcemdjrtir-auth-token';
        const storedData = localStorage.getItem(storageKey);

        if (!storedData) {
          console.log('[Auth] ℹ️ Pas de token stocké');
          return false;
        }

        const tokenData = JSON.parse(storedData);
        const now = Math.floor(Date.now() / 1000);

        // Vérifier si le token est expiré
        if (tokenData.expires_at && tokenData.expires_at < now) {
          console.log('[Auth] ⚠️ Token expiré');
          localStorage.removeItem(storageKey);
          return false;
        }

        if (!tokenData.user?.id) {
          console.log('[Auth] ⚠️ Pas de user dans le token');
          return false;
        }

        console.log('[Auth] ✅ Token valide trouvé, restauration...');

        // Créer l'utilisateur depuis les données du token
        const fallbackUser: User = {
          id: tokenData.user.id,
          email: tokenData.user.email || '',
          username: tokenData.user.user_metadata?.username || tokenData.user.email?.split('@')[0] || 'user',
          display_name: tokenData.user.user_metadata?.display_name,
          avatar_url: tokenData.user.user_metadata?.avatar_url,
        };

        if (isMounted) {
          setUser(fallbackUser);
          setLoading(false);
          console.log('[Auth] ✅ Session restaurée:', fallbackUser.email);
        }

        // Essayer de charger le profil complet en arrière-plan
        fetchUserProfile(tokenData.user.id).then(profile => {
          if (isMounted && profile) {
            setUser(profile);
          }
        }).catch(() => {});

        return true;
      } catch (e) {
        console.warn('[Auth] Erreur restauration localStorage:', e);
        return false;
      }
    };

    // Écouter les changements d'auth pour les futures connexions/déconnexions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      console.log('[Auth] Event:', event);

      if (event === 'SIGNED_OUT') {
        userProfileCache.clear();
        setUser(null);
        setLoading(false);
        return;
      }

      if (event === 'SIGNED_IN' && session && !isSigningIn.current) {
        const currentUser = await fetchUserProfile(session.user.id);
        if (isMounted && currentUser) {
          setUser(currentUser);
          setLoading(false);
        }
      }

      if (event === 'TOKEN_REFRESHED' && session) {
        const currentUser = await fetchUserProfile(session.user.id);
        if (isMounted && currentUser) {
          setUser(currentUser);
        }
      }
    });

    // Essayer de restaurer depuis localStorage
    restoreFromLocalStorage().then(restored => {
      if (!restored && isMounted) {
        // Pas de token valide - utilisateur non connecté
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    isSigningIn.current = true;
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user && data.session) {
        // Créer l'utilisateur immédiatement avec les données de session
        const newUser: User = {
          id: data.user.id,
          email: data.user.email || '',
          username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'user',
          display_name: data.user.user_metadata?.display_name || data.user.user_metadata?.name,
        };

        // Mettre à jour l'état AVANT de mettre loading à false
        setUser(newUser);

        // Essayer de charger le profil complet en background (non-bloquant)
        fetchUserProfile(data.user.id, true).then(profile => {
          if (profile) {
            setUser(profile);
          }
        }).catch(() => {});
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
      setTimeout(() => { isSigningIn.current = false; }, 100);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, username: string, displayName?: string) => {
    setLoading(true);
    try {
      await authService.signUp(email, password, username, displayName);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const newUser = await fetchUserProfile(session.user.id, true);
        if (newUser) {
          setUser(newUser);
        }
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      userProfileCache.clear();

      // Clear localStorage directly (workaround for Web Locks blocking)
      const storageKey = `sb-cwtoprbowdqcemdjrtir-auth-token`;
      localStorage.removeItem(storageKey);

      // Try SDK signOut with timeout (may block due to Web Locks)
      const signOutPromise = supabase.auth.signOut();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('SignOut timeout')), 3000)
      );

      try {
        await Promise.race([signOutPromise, timeoutPromise]);
      } catch (e) {
        console.warn('[Auth] SignOut timeout, localStorage already cleared');
      }

      setUser(null);
    } catch (error) {
      // Even on error, clear user state
      setUser(null);
      console.error('[Auth] SignOut error:', error);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user?.id) return;
    try {
      const currentUser = await fetchUserProfile(user.id, true);
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  }, [user?.id]);

  const clearAllCache = useCallback(async () => {
    try {
      await clearAllAppCache();
      setUser(null);
      setAuthError(null);
      // Ne PAS faire de reload ici - laisser le code appelant décider
    } catch (error) {
      console.error('[Auth] Erreur clearAllCache:', error);
      throw error;
    }
  }, []);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || null;
    } catch (error) {
      return null;
    }
  }, []);

  const resetAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    authError,
    signUp,
    signIn,
    signOut,
    refreshUser,
    clearAllCache,
    getAccessToken,
    isAuthenticated: !!user,
    resetAuthError
  }), [user, loading, authError, signUp, signIn, signOut, refreshUser, clearAllCache, getAccessToken, resetAuthError]);

  return (
    <AuthContext.Provider value={value}>
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
