import type { Hono } from "npm:hono";
import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { getAuthenticatedUser } from "./auth-helper.tsx";
import { getOAuthAuthorizationUrl, exchangeCodeForToken, getUserInfo } from "./oauth-config.ts";

export function registerIntegrationRoutes(app: Hono, supabase: SupabaseClient) {
  // ============================================================
  // WEBHOOKS
  // ============================================================

  // Get webhooks for user
  app.get("/make-server-e884809f/webhooks", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const webhooks = await kv.getByPrefix(`webhook:${user.id}:`);

      return c.json({ webhooks });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la récupération des webhooks' }, 500);
    }
  });

  // Create webhook
  app.post("/make-server-e884809f/webhooks", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const body = await c.req.json();
      const { url, events, name } = body;

      if (!url || !events) {
        return c.json({ error: 'URL et événements requis' }, 400);
      }

      const webhookId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const webhook = {
        id: webhookId,
        userId: user.id,
        url,
        events,
        name: name || 'Webhook sans nom',
        active: true,
        createdAt: new Date().toISOString(),
      };

      await kv.set(`webhook:${user.id}:${webhookId}`, webhook);

      return c.json({ webhook, message: 'Webhook créé avec succès !' });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la création du webhook' }, 500);
    }
  });

  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  // Get notification settings
  app.get("/make-server-e884809f/notifications/settings", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const settings = await kv.get(`notification-settings:${user.id}`) || {
        sessionCreated: true,
        sessionReminder: true,
        rsvpReminder: true,
        squadInvite: true,
      };

      return c.json({ settings });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la récupération des paramètres' }, 500);
    }
  });

  // Update notification settings
  app.put("/make-server-e884809f/notifications/settings", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const body = await c.req.json();

      await kv.set(`notification-settings:${user.id}`, body);

      return c.json({ settings: body });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la mise à jour des paramètres' }, 500);
    }
  });

  // Get user notifications
  app.get("/make-server-e884809f/users/:userId/notifications", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const notifications = await kv.getByPrefix(`notification:${user.id}:`);

      return c.json({ notifications });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la récupération des notifications' }, 500);
    }
  });

  // Mark notification as read
  app.post("/make-server-e884809f/notifications/mark-read", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const body = await c.req.json();
      const { notificationId } = body;

      const notification = await kv.get(`notification:${user.id}:${notificationId}`);

      if (notification) {
        notification.read = true;
        await kv.set(`notification:${user.id}:${notificationId}`, notification);
      }

      return c.json({ message: 'Notification marquée comme lue' });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la mise à jour de la notification' }, 500);
    }
  });

  // ============================================================
  // DISCORD
  // ============================================================

  // Connect Discord
  app.post("/make-server-e884809f/discord/connect", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      // Return mock OAuth URL
      const oauthUrl = `https://discord.com/oauth2/authorize?client_id=mock&scope=identify`;

      return c.json({ oauthUrl });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la connexion à Discord' }, 500);
    }
  });

  // ============================================================
  // USER INTEGRATIONS
  // ============================================================

  // Get user integrations
  app.get("/make-server-e884809f/user/integrations", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const integrations = await kv.get(`user-integrations:${user.id}`) || {};

      return c.json({ integrations });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la récupération des intégrations' }, 500);
    }
  });

  // Save user integrations
  app.post("/make-server-e884809f/user/integrations", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const body = await c.req.json();

      await kv.set(`user-integrations:${user.id}`, body);

      return c.json({ integrations: body });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la sauvegarde des intégrations' }, 500);
    }
  });

  // Connect integration
  app.post("/make-server-e884809f/user/integrations/:platform/connect", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const platform = c.req.param('platform');

      const integrations = await kv.get(`user-integrations:${user.id}`) || {};
      
      integrations[platform] = {
        connected: true,
        connectedAt: new Date().toISOString(),
      };

      await kv.set(`user-integrations:${user.id}`, integrations);

      return c.json({ integrations, message: `${platform} connecté avec succès !` });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la connexion de l\'intégration' }, 500);
    }
  });

  // Disconnect integration
  app.post("/make-server-e884809f/user/integrations/:platform/disconnect", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const platform = c.req.param('platform');

      const integrations = await kv.get(`user-integrations:${user.id}`) || {};
      
      delete integrations[platform];

      await kv.set(`user-integrations:${user.id}`, integrations);

      return c.json({ integrations, message: `${platform} déconnecté avec succès !` });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la déconnexion de l\'intégration' }, 500);
    }
  });

  // ============================================================
  // OAUTH
  // ============================================================

  // Initiate OAuth flow
  app.get("/make-server-e884809f/oauth/:platform/authorize", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const platform = c.req.param('platform');
      const redirectUrl = c.req.query('redirectUrl') || 'http://localhost:8081';

      const authUrl = await getOAuthAuthorizationUrl(platform, redirectUrl);

      return c.json({ authUrl });
    } catch (error: any) {
      return c.json({ error: error.message || 'Erreur lors de l\'initialisation de l\'OAuth' }, 500);
    }
  });

  // OAuth callback handler
  app.get("/make-server-e884809f/oauth/:platform/callback", async (c) => {
    try {
      const platform = c.req.param('platform');
      const code = c.req.query('code');
      const state = c.req.query('state');

      if (!code) {
        return c.json({ error: 'Code manquant' }, 400);
      }

      const redirectUrl = state || 'http://localhost:8081';

      const tokens = await exchangeCodeForToken(platform, code, redirectUrl);
      const userInfo = await getUserInfo(platform, tokens.access_token);

      // In a real app, we would:
      // 1. Verify state parameter
      // 2. Store tokens securely
      // 3. Link to user account

      return c.json({ success: true, tokens, userInfo });
    } catch (error: any) {
      return c.json({ error: error.message || 'Erreur lors du callback OAuth' }, 500);
    }
  });

  // ============================================================
  // PUSH NOTIFICATIONS
  // ============================================================

  // Save push subscription
  app.post("/make-server-e884809f/push/subscribe", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const body = await c.req.json();

      await kv.set(`push-subscription:${user.id}`, body);

      return c.json({ message: 'Abonnement enregistré !' });
    } catch (error) {
      return c.json({ error: 'Erreur lors de l\'enregistrement de l\'abonnement' }, 500);
    }
  });

  // ============================================================
  // CALENDAR
  // ============================================================

  // Sync session to Google Calendar
  app.post("/make-server-e884809f/calendar/sync", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const body = await c.req.json();
      const { sessionId } = body;

      // Mock calendar sync
      return c.json({ message: 'Session synchronisée avec le calendrier !' });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la synchronisation du calendrier' }, 500);
    }
  });

  // ============================================================
  // DEMO/TEST
  // ============================================================

  // Generate demo ecosystem
  app.post("/make-server-e884809f/demo/generate-ecosystem", async (c) => {
    try {
      console.log('🎮 Demo ecosystem generation requested (simplified)...');
      
      return c.json({
        success: true,
        message: 'Écosystème de démo généré avec succès !',
      });
    } catch (error: any) {
      return c.json({ error: error.message || 'Erreur lors de la génération de l\'écosystème de démo' }, 500);
    }
  });

  console.log('✅ Integration routes registered');
}
