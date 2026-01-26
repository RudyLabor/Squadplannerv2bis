import type { Hono } from "npm:hono";
import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { getAuthenticatedUser } from "./auth-helper.tsx";

export function registerAuthRoutes(app: Hono, supabase: SupabaseClient) {
  // Debug route to check JWT token validity
  app.post("/make-server-e884809f/auth/verify-token", async (c) => {
    try {
      const authHeader = c.req.header('Authorization');
      
      if (!authHeader) {
        return c.json({ valid: false, error: 'No Authorization header' }, 401);
      }
      
      const user = await getAuthenticatedUser(authHeader);
      
      if (!user) {
        return c.json({ valid: false, error: 'Token invalide ou expiré' }, 401);
      }
      
      return c.json({ valid: true, user: { id: user.id, email: user.email } });
    } catch (error: any) {
      return c.json({ valid: false, error: error.message }, 500);
    }
  });

  // Sign Up
  app.post("/make-server-e884809f/auth/signup", async (c) => {
    try {
      const body = await c.req.json();
      const { email, password, name, avatar } = body;

      if (!email || !password || !name) {
        return c.json({ error: 'Email, password et nom requis' }, 400);
      }

      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: { name, avatar },
        email_confirm: true
      });

      if (error) {
        return c.json({ error: error.message }, 400);
      }

      await kv.set(`user:${data.user.id}`, {
        id: data.user.id,
        email: data.user.email,
        name,
        avatar,
        reliabilityScore: 100,
        totalSessions: 0,
        attendedSessions: 0,
        createdAt: new Date().toISOString(),
      });

      return c.json({ user: data.user, message: 'Compte créé avec succès !' });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la création du compte' }, 500);
    }
  });

  // Get User Profile
  app.get("/make-server-e884809f/auth/profile", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      let profile = await kv.get(`user:${user.id}`);
      
      if (!profile) {
        const isPremium = user.email === 'rudylabor@hotmail.fr';
        
        profile = {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'Joueur',
          avatar: user.user_metadata?.avatar || '🎮',
          isPremium,
          reliabilityScore: 100,
          totalSessions: 0,
          attendedSessions: 0,
          createdAt: new Date().toISOString(),
        };
        
        await kv.set(`user:${user.id}`, profile);
      } else if (user.email === 'rudylabor@hotmail.fr' && !profile.isPremium) {
        profile.isPremium = true;
        await kv.set(`user:${user.id}`, profile);
      }

      const integrations = await kv.get(`user-integrations:${user.id}`);
      if (integrations) {
        profile.integrations = integrations;
      }

      return c.json({ profile });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la récupération du profil' }, 500);
    }
  });

  // Update User Profile
  app.put("/make-server-e884809f/auth/profile", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const body = await c.req.json();
      const currentProfile = await kv.get(`user:${user.id}`);

      const updatedProfile = {
        ...currentProfile,
        ...body,
        id: user.id,
        updatedAt: new Date().toISOString(),
      };

      await kv.set(`user:${user.id}`, updatedProfile);

      return c.json({ profile: updatedProfile });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la mise à jour du profil' }, 500);
    }
  });

  // Update User Profile - BYPASS Route (temporary workaround)
  app.put("/make-server-e884809f/auth/profile-bypass", async (c) => {
    try {
      const body = await c.req.json();
      const { userId, ...updates } = body;
      
      if (!userId) {
        return c.json({ error: 'userId is required' }, 400);
      }

      const currentProfile = await kv.get(`user:${userId}`);

      const updatedProfile = {
        ...currentProfile,
        ...updates,
        id: userId,
        updatedAt: new Date().toISOString(),
      };

      await kv.set(`user:${userId}`, updatedProfile);

      return c.json({ profile: updatedProfile });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la mise à jour du profil' }, 500);
    }
  });

  // Check if user exists
  app.post("/make-server-e884809f/auth/check-user", async (c) => {
    try {
      const body = await c.req.json();
      const { email } = body;

      if (!email) {
        return c.json({ error: 'Email requis' }, 400);
      }

      const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
      
      if (userError) {
        return c.json({ error: 'Erreur lors de la vérification' }, 500);
      }

      const user = userData.users.find(u => u.email === email);
      
      if (!user) {
        return c.json({ exists: false, message: 'Aucun compte trouvé avec cet email' });
      }

      return c.json({ 
        exists: true,
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        },
        message: 'Compte trouvé' 
      });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la vérification du compte' }, 500);
    }
  });

  // Reset user password (admin)
  app.post("/make-server-e884809f/auth/reset-password-admin", async (c) => {
    try {
      const body = await c.req.json();
      const { email, newPassword } = body;

      if (!email || !newPassword) {
        return c.json({ error: 'Email et nouveau mot de passe requis' }, 400);
      }

      const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
      
      if (userError) {
        return c.json({ error: 'Erreur lors de la vérification' }, 500);
      }

      const user = userData.users.find(u => u.email === email);
      
      if (!user) {
        return c.json({ error: 'Aucun compte trouvé avec cet email' }, 404);
      }

      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { password: newPassword }
      );

      if (updateError) {
        return c.json({ error: 'Erreur lors de la mise à jour du mot de passe' }, 500);
      }

      return c.json({ message: 'Mot de passe réinitialisé avec succès', email });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la réinitialisation du mot de passe' }, 500);
    }
  });

  console.log('✅ Auth routes registered');
}
