import { supabase } from '@/utils/supabase/client';

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
        },
        // Add email redirect URL for confirmation
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      }
    });

    if (authError) throw authError;

    // Check if email confirmation is required
    const emailConfirmationRequired = authData.user && !authData.session;

    if (emailConfirmationRequired) {
      // Return user without session - email confirmation needed
      return {
        user: authData.user,
        session: null,
        emailConfirmationRequired: true,
      };
    }

    if (authData.user && authData.session) {
      // 2. Only create profile if we have a session (user is confirmed)
      // Try to create profile, but don't fail if it exists (trigger should handle this)
      try {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', authData.user.id)
          .maybeSingle(); // Use maybeSingle to avoid error if not found

        if (!existingProfile) {
          await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              email: email,
              username: username,
              display_name: displayName || username,
            });
        }
      } catch (profileError) {
        // Log but don't throw - profile creation is not critical at signup
        console.warn('Could not create profile, will be created on first login:', profileError);
      }
    }

    return {
      user: authData.user,
      session: authData.session,
      emailConfirmationRequired: false,
    };
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
      .from('profiles')
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
