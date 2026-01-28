import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

// Initialiser le client Supabase
const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

export const authService = {
  // Sign up
  signUp: async (email: string, password: string, username: string, displayName?: string) => {
    // 1. Créer le compte Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          display_name: displayName || username,
        }
      }
    });

    if (authError) throw authError;

    if (authData.user) {
      // 2. Créer l'entrée dans la table publique users si elle n'existe pas déjà (géré par trigger idéalement, mais on le force ici au cas où)
      // Note: On vérifie d'abord si l'utilisateur existe pour éviter les doublons si le trigger est actif
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', authData.user.id)
        .single();

      if (!existingUser) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id, // Important: Lier l'ID auth à l'ID public
            email: email,
            username: username,
            display_name: displayName || username,
            auth_id: authData.user.id
          });
          
        if (profileError) {
          console.error('Error creating user profile:', profileError);
          // On ne throw pas ici car le compte auth est créé, on pourra réessayer plus tard
        }
      }
    }

    return { user: authData.user, session: authData.session };
  },

  // Sign in
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
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
    return data.session;
  },

  // Get current user (Profil complet depuis la DB)
  getCurrentUser: async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) return null;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', sessionData.session.user.id)
      .single();

    if (error) {
        // Fallback: si pas de profil public, on renvoie les metadata de l'user auth
        console.warn('User profile not found, falling back to auth metadata');
        return {
            id: sessionData.session.user.id,
            email: sessionData.session.user.email,
            ...sessionData.session.user.user_metadata
        };
    }

    return user;
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (user: any) => void) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await authService.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });

    return subscription;
  },
};
