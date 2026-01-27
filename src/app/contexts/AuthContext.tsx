import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSupabase } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { debugAuth } from '@/utils/auth-debug';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, name: string, avatar?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = getSupabase();

  // Check for existing session on mount
  useEffect(() => {
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔐 Auth state change:', _event, 'Has session:', !!session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    try {
      console.log('🔍 Checking session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Error getting session:', error);
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      if (session) {
        console.log('✅ Session found:', session.user.id);
        setUser(session.user);
      } else {
        console.log('⚠️ No session found');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Exception in checkSession:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, avatar?: string) => {
    try {
      console.log('📝 Creating new user with Supabase Auth...');
      
      // Use Supabase Auth directly for signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            avatar: avatar || '🎮',
            display_name: name,
          }
        }
      });
      
      if (error) {
        console.error('❌ Supabase signUp error:', error);
        throw error;
      }
      
      if (!data.user) {
        throw new Error('Aucun utilisateur créé');
      }
      
      console.log('✅ User created successfully:', data.user.id);
      
      // If email confirmation is disabled, user is automatically logged in
      if (data.session) {
        console.log('✅ User automatically logged in');
        setUser(data.user);
        return;
      }
      
      // If email confirmation is required, try to sign in
      console.log('⏳ Waiting for Supabase to sync...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Now sign in with those credentials
      console.log('🔑 Attempting sign in after signup...');
      await signIn(email, password);
      console.log('✅ Sign in successful!');
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Erreur lors de la création du compte');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 SignIn attempt for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Supabase signIn error:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        throw error;
      }
      
      if (!data.user) {
        console.error('❌ No user returned from signIn');
        throw new Error('Aucun utilisateur retourné');
      }
      
      if (!data.session) {
        console.error('❌ No session returned from signIn');
        throw new Error('Aucune session créée');
      }
      
      console.log('✅ SignIn successful:', {
        userId: data.user.id,
        email: data.user.email,
        hasAccessToken: !!data.session.access_token,
        tokenLength: data.session.access_token?.length,
        tokenPrefix: data.session.access_token?.substring(0, 20) + '...',
        expiresAt: data.session.expires_at
      });
      
      setUser(data.user);
      
      // Run auth debug after successful sign in
      setTimeout(() => {
        console.log('🔍 Running auth debug after sign in...');
        debugAuth();
      }, 1000);
    } catch (error: any) {
      console.error('❌ Sign in error:', error);
      throw new Error(error.message || 'Erreur lors de la connexion');
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Signing out...');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error from Supabase:', error);
        // Continue anyway to clear local state
      }
      
      setUser(null);
      
      // Clear ALL localStorage items related to auth and Supabase
      console.log('🧹 Clearing localStorage...');
      localStorage.removeItem('squadplanner_user_profile');
      
      // Clear all Supabase auth storage items
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => {
        console.log(`🧹 Removing: ${key}`);
        localStorage.removeItem(key);
      });
      
      console.log('✅ Signed out successfully');
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Erreur lors de la déconnexion');
    }
  };

  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      setUser(session?.user ?? null);
    } catch (error) {
      console.error('Refresh session error:', error);
    }
  };

  const getAccessToken = async () => {
    try {
      console.log('🔑 Getting access token...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Error getting session:', error);
        throw error;
      }
      
      if (!session) {
        console.log('⚠️ No session found');
        return null;
      }
      
      // Check if token is expired or will expire soon (within 5 minutes)
      const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
      if (expiresAt < now + fiveMinutes) {
        console.log('🔄 Token expired or expiring soon, refreshing...');
        const { data: { session: newSession }, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error('❌ Error refreshing session:', refreshError);
          return null;
        }
        
        if (newSession) {
          console.log('✅ Session refreshed successfully');
          setUser(newSession.user);
          return newSession.access_token;
        }
        
        return null;
      }
      
      console.log('✅ Token valid, expires at:', new Date(expiresAt).toISOString());
      return session.access_token;
    } catch (error) {
      console.error('❌ Get access token error:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signUp,
        signIn,
        signOut,
        refreshSession,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // En mode développement avec hot-reload, on peut avoir ce cas temporairement
    if (process.env.NODE_ENV === 'development') {
      // Don't log warning - this is normal during hot-reload
      // Return a dummy context in dev mode to prevent crashes
      return {
        user: null,
        isLoading: true,
        isAuthenticated: false,
        signUp: async () => {},
        signIn: async () => {},
        signOut: async () => {},
        refreshSession: async () => {},
        getAccessToken: async () => null,
      } as AuthContextType;
    }
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}