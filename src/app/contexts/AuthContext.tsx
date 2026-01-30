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
    let timeoutId: NodeJS.Timeout | null = null;

    const initAuth = async () => {
      console.log('[Auth] 🚀 Initialisation de l\'authentification...');

      // FAST-PATH: Vérification synchrone du token AVANT l'appel async
      const tokenCheck = checkAuthTokenSync();

      if (!tokenCheck.hasToken) {
        // Pas de token = pas connecté, on peut terminer immédiatement
        console.log('[Auth] ⚡ Fast-path: Aucun token trouvé - utilisateur non connecté');
        setUser(null);
        setLoading(false);
        return;
      }

      if (tokenCheck.isExpired) {
        // Token expiré, on nettoie et on redirige vers login
        console.log('[Auth] ⚡ Fast-path: Token expiré - nettoyage...');
        userProfileCache.clear();
        setUser(null);
        setLoading(false);
        return;
      }

      // Token présent et non expiré, on continue avec la vérification async
      console.log('[Auth] ✅ Token valide trouvé, vérification de la session...');

      // Timeout de sécurité - avec tentative de récupération automatique
      timeoutId = setTimeout(async () => {
        if (!isMounted) return;

        console.warn('[Auth] ⏱️ Timeout - tentative de récupération automatique...');

        // Tenter un refresh du token avant d'abandonner
        try {
          const { data, error } = await supabase.auth.refreshSession();
          if (!error && data.session && isMounted) {
            console.log('[Auth] ✅ Récupération réussie après timeout');
            const currentUser = await fetchUserProfile(data.session.user.id);
            if (isMounted && currentUser) {
              setUser(currentUser);
              setLoading(false);
              setAuthError(null);
              return;
            }
          }
        } catch (e) {
          console.error('[Auth] Échec de la récupération après timeout:', e);
        }

        // Si la récupération échoue, nettoyer et afficher l'erreur
        if (isMounted) {
          userProfileCache.clear();
          setAuthError('L\'authentification prend trop de temps. Veuillez réessayer.');
          setLoading(false);
          setUser(null);
        }
      }, AUTH_TIMEOUT_MS);

      try {
        console.log('[Auth] 📡 Vérification de la session Supabase...');

        // Créer une promesse avec timeout pour getSession
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Session check timeout')), OPERATION_TIMEOUT_MS)
        );

        let session;
        let sessionError;

        try {
          const result = await Promise.race([sessionPromise, timeoutPromise]);
          session = result.data?.session;
          sessionError = result.error;
        } catch (raceError: any) {
          // Ignorer AbortError (causé par React StrictMode double-mount/unmount)
          if (raceError?.name === 'AbortError' || raceError?.message?.includes('aborted')) {
            console.log('[Auth] ℹ️ Request aborted (StrictMode) - ignoré');
            if (!isMounted) return;
            // Tenter quand même un refresh silencieux
          }

          // Timeout sur getSession - tenter un refresh
          console.warn('[Auth] ⚠️ Timeout/erreur sur getSession, tentative refresh...');
          try {
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

            if (refreshError || !refreshData.session) {
              // Si pas de session, l'utilisateur n'est pas connecté
              if (!isMounted) return;
              console.log('[Auth] ℹ️ Pas de session après refresh - utilisateur non connecté');
              setUser(null);
              setLoading(false);
              return;
            }

            session = refreshData.session;
            sessionError = null;
          } catch (refreshErr: any) {
            // Ignorer AbortError sur le refresh aussi
            if (refreshErr?.name === 'AbortError' || refreshErr?.message?.includes('aborted')) {
              console.log('[Auth] ℹ️ Refresh aborted - ignoré');
              if (!isMounted) return;
            }
            throw new Error('Session timeout et refresh échoué');
          }
        }

        if (!isMounted) return;

        if (sessionError) {
          console.warn('[Auth] ⚠️ Erreur session, tentative refresh...', sessionError.message);
          // Tenter un refresh en cas d'erreur
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

          if (refreshError || !refreshData.session) {
            console.error('[Auth] ❌ Refresh échoué:', refreshError?.message);
            setAuthError(`Erreur de session: ${sessionError.message}`);
            setUser(null);
            setLoading(false);
            return;
          }

          // Refresh réussi
          console.log('[Auth] ✅ Refresh réussi après erreur session');
          session = refreshData.session;
        }

        if (!session) {
          console.log('[Auth] ℹ️ Aucune session trouvée - utilisateur non connecté');
          setUser(null);
          setLoading(false);
          return;
        }

        console.log('[Auth] ✅ Session trouvée, chargement du profil...');
        // Session found - load profile (uses cache)
        const currentUser = await fetchUserProfile(session.user.id);

        if (isMounted) {
          if (currentUser) {
            console.log('[Auth] ✅ Profil chargé:', currentUser.email);
          } else {
            console.warn('[Auth] ⚠️ Profil non trouvé, utilisation des données de session');
          }
          setUser(currentUser);
          setLoading(false);
          setAuthError(null); // Clear any previous error
        }
      } catch (error: any) {
        // Ignorer AbortError silencieusement (React StrictMode)
        if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
          console.log('[Auth] ℹ️ Init aborted (StrictMode cleanup) - ignoré');
          return; // Ne pas modifier l'état si le composant est démonté
        }

        console.error('[Auth] ❌ Erreur initAuth:', error);
        if (isMounted) {
          // Tenter une dernière récupération silencieuse
          try {
            const { data } = await supabase.auth.refreshSession();
            if (data.session) {
              const currentUser = await fetchUserProfile(data.session.user.id);
              if (isMounted && currentUser) {
                console.log('[Auth] ✅ Récupération de dernière chance réussie');
                setUser(currentUser);
                setLoading(false);
                setAuthError(null);
                return;
              }
            }
          } catch (e: any) {
            // Ignorer AbortError sur la récupération aussi
            if (e?.name === 'AbortError' || e?.message?.includes('aborted')) {
              console.log('[Auth] ℹ️ Recovery aborted - ignoré');
              return;
            }
            console.error('[Auth] ❌ Dernière tentative échouée:', e);
          }

          setAuthError(`Erreur d'authentification: ${error?.message || 'Erreur inconnue'}`);
          setUser(null);
          setLoading(false);
        }
      } finally {
        // Annuler le timeout si on a terminé normalement
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
    };

    // Listen to auth changes - but skip when we're handling it in signIn
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      // Skip if we're currently signing in (we handle it there)
      if (isSigningIn.current && event === 'SIGNED_IN') {
        return;
      }

      // Skip initial session (handled in initAuth)
      if (event === 'INITIAL_SESSION') {
        return;
      }

      if (event === 'SIGNED_OUT') {
        userProfileCache.clear();
        setUser(null);
        return;
      }

      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
        const currentUser = await fetchUserProfile(session.user.id);
        if (isMounted && currentUser) {
          setUser(currentUser);
        }
      }
    });

    initAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
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

      if (data.user) {
        // Fetch profile immediately - don't wait for onAuthStateChange
        const currentUser = await fetchUserProfile(data.user.id, true);
        if (currentUser) {
          setUser(currentUser);
        } else {
          // Créer un utilisateur minimal à partir des données de session
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            username: data.user.email?.split('@')[0] || 'user',
            display_name: data.user.user_metadata?.name,
          });
        }
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
      // Small delay before allowing onAuthStateChange to process
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
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      setUser(null);
      throw error;
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
