import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

const API_SIGNUP_URL = `${supabaseUrl}/functions/v1/server/make-server-e884809f/auth/signup`;
const API_ME_URL = `${supabaseUrl}/functions/v1/server/make-server-e884809f/auth/me`;

export const authService = {
  // Sign up (utilise le backend pour créer l'utilisateur dans la table users)
  signUp: async (email: string, password: string, username: string, displayName?: string) => {
    // Le signup est géré par le backend pour créer à la fois auth.users et public.users
    const response = await fetch(API_SIGNUP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ email, password, username, displayName }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Signup failed' }));
      throw new Error(error.error || 'Signup failed');
    }

    const data = await response.json();
    
    // Se connecter automatiquement après inscription
    const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) throw signInError;

    // Stocker le token
    if (sessionData.session) {
      localStorage.setItem('supabase_access_token', sessionData.session.access_token);
    }

    return { user: data.user, session: sessionData.session };
  },

  // Sign in
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Stocker le token
    if (data.session) {
      localStorage.setItem('supabase_access_token', data.session.access_token);
    }

    return data;
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    localStorage.removeItem('supabase_access_token');
  },

  // Get current session
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;

    // Mettre à jour le token si présent
    if (data.session) {
      localStorage.setItem('supabase_access_token', data.session.access_token);
    }

    return data.session;
  },

  // Get current user (depuis le backend pour avoir les données complètes)
  getCurrentUser: async () => {
    const token = localStorage.getItem('supabase_access_token');
    if (!token) return null;

    const response = await fetch(API_ME_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('supabase_access_token');
        return null;
      }
      throw new Error('Failed to get current user');
    }

    const { user } = await response.json();
    return user;
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (user: any) => void) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        localStorage.setItem('supabase_access_token', session.access_token);
        // Récupérer les données complètes de l'utilisateur
        try {
            const user = await authService.getCurrentUser();
            callback(user);
        } catch (err) {
            console.error('Auth change user fetch error:', err);
            callback(null);
        }
      } else {
        localStorage.removeItem('supabase_access_token');
        callback(null);
      }
    });

    return subscription;
  },
};
