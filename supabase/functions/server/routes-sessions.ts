import type { Hono } from "npm:hono";
import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { getAuthenticatedUser } from "./auth-helper.tsx";
import { triggerWebhooks, schedulePushNotifications } from "./route-helpers.ts";

export function registerSessionRoutes(app: Hono, supabase: SupabaseClient) {
  // Get sessions for a squad
  app.get("/make-server-e884809f/squads/:squadId/sessions", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const squadId = c.req.param('squadId');
      const squad = await kv.get(`squad:${squadId}`);

      if (!squad) {
        return c.json({ error: 'Squad non trouvé' }, 404);
      }

      const sessions = await kv.getByPrefix(`session:${squadId}:`);

      return c.json({ sessions });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la récupération des sessions' }, 500);
    }
  });

  // Get all sessions for user
  app.get("/make-server-e884809f/sessions", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const allSessions = await kv.getByPrefix('session:');
      
      const userSessions = allSessions.filter((session: any) =>
        session.proposedBy === user.id ||
        session.slots?.some((slot: any) => 
          slot.responses?.some((r: any) => r.playerId === user.id)
        )
      );

      return c.json({ sessions: userSessions });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la récupération des sessions' }, 500);
    }
  });

  // Create session
  app.post("/make-server-e884809f/squads/:squadId/sessions", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const squadId = c.req.param('squadId');
      const squad = await kv.get(`squad:${squadId}`);

      if (!squad) {
        return c.json({ error: 'Squad non trouvé' }, 404);
      }

      const body = await c.req.json();
      const { title, game, slots, playersNeeded } = body;

      if (!title || !game || !slots || !playersNeeded) {
        return c.json({ error: 'Titre, jeu, créneaux et nombre de joueurs requis' }, 400);
      }

      const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const userProfile = await kv.get(`user:${user.id}`);

      const session = {
        id: sessionId,
        squadId,
        squadName: squad.name,
        title,
        game,
        proposedBy: user.id,
        proposedByName: userProfile?.name || user.email,
        proposedByAvatar: userProfile?.avatar,
        playersNeeded,
        slots: slots.map((slot: any) => ({
          ...slot,
          responses: [],
        })),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await kv.set(`session:${squadId}:${sessionId}`, session);

      squad.stats.totalSessions = (squad.stats.totalSessions || 0) + 1;
      await kv.set(`squad:${squadId}`, squad);

      await triggerWebhooks(user.id, 'session.created', { session });
      await schedulePushNotifications(session);

      return c.json({ session, message: 'Session créée avec succès !' });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la création de la session' }, 500);
    }
  });

  // RSVP to session slot
  app.post("/make-server-e884809f/sessions/:sessionId/rsvp", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const sessionId = c.req.param('sessionId');
      const body = await c.req.json();
      const { slotId, response } = body;

      if (!slotId || !response) {
        return c.json({ error: 'Créneau et réponse requis' }, 400);
      }

      // Find session across all squads
      const allSessions = await kv.getByPrefix('session:');
      const session = allSessions.find((s: any) => s.id === sessionId);

      if (!session) {
        return c.json({ error: 'Session non trouvée' }, 404);
      }

      const userProfile = await kv.get(`user:${user.id}`);

      const slot = session.slots.find((s: any) => s.id === slotId);
      
      if (!slot) {
        return c.json({ error: 'Créneau non trouvé' }, 404);
      }

      // Remove existing response from this user
      slot.responses = slot.responses.filter((r: any) => r.playerId !== user.id);

      // Add new response
      slot.responses.push({
        playerId: user.id,
        playerName: userProfile?.name || user.email,
        playerAvatar: userProfile?.avatar,
        response,
        timestamp: new Date().toISOString(),
      });

      session.updatedAt = new Date().toISOString();

      await kv.set(`session:${session.squadId}:${sessionId}`, session);

      await triggerWebhooks(user.id, 'session.rsvp', { session, slotId, response });

      return c.json({ session, message: 'Réponse enregistrée !' });
    } catch (error) {
      return c.json({ error: 'Erreur lors de l\'enregistrement de la réponse' }, 500);
    }
  });

  // Update session status
  app.put("/make-server-e884809f/sessions/:sessionId/status", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const sessionId = c.req.param('sessionId');
      const body = await c.req.json();
      const { status } = body;

      if (!status) {
        return c.json({ error: 'Statut requis' }, 400);
      }

      const allSessions = await kv.getByPrefix('session:');
      const session = allSessions.find((s: any) => s.id === sessionId);

      if (!session) {
        return c.json({ error: 'Session non trouvée' }, 404);
      }

      if (session.proposedBy !== user.id) {
        return c.json({ error: 'Seul le créateur peut modifier le statut' }, 403);
      }

      session.status = status;
      session.updatedAt = new Date().toISOString();

      await kv.set(`session:${session.squadId}:${sessionId}`, session);

      await triggerWebhooks(user.id, 'session.status_updated', { session });

      return c.json({ session });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la mise à jour du statut' }, 500);
    }
  });

  // Submit check-in for a session
  app.post("/make-server-e884809f/sessions/:sessionId/check-in", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const sessionId = c.req.param('sessionId');
      const body = await c.req.json();
      const { attended } = body;

      if (attended === undefined) {
        return c.json({ error: 'Statut de présence requis' }, 400);
      }

      const checkInId = `${sessionId}-${user.id}`;
      const userProfile = await kv.get(`user:${user.id}`);

      const checkIn = {
        id: checkInId,
        sessionId,
        playerId: user.id,
        playerName: userProfile?.name || user.email,
        attended,
        timestamp: new Date().toISOString(),
      };

      await kv.set(`checkin:${sessionId}:${user.id}`, checkIn);

      // Update user reliability score
      if (userProfile) {
        userProfile.totalSessions = (userProfile.totalSessions || 0) + 1;
        
        if (attended) {
          userProfile.attendedSessions = (userProfile.attendedSessions || 0) + 1;
        }
        
        const attendanceRate = userProfile.attendedSessions / userProfile.totalSessions;
        userProfile.reliabilityScore = Math.round(attendanceRate * 100);
        
        await kv.set(`user:${user.id}`, userProfile);
      }

      return c.json({ checkIn, message: 'Check-in enregistré !' });
    } catch (error) {
      return c.json({ error: 'Erreur lors de l\'enregistrement du check-in' }, 500);
    }
  });

  // Get check-ins for a session
  app.get("/make-server-e884809f/sessions/:sessionId/check-ins", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const sessionId = c.req.param('sessionId');
      const checkIns = await kv.getByPrefix(`checkin:${sessionId}:`);

      return c.json({ checkIns });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la récupération des check-ins' }, 500);
    }
  });

  // Get user's reliability stats and badges
  app.get("/make-server-e884809f/users/:userId/stats", async (c) => {
    try {
      const authUser = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!authUser) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const userId = c.req.param('userId');
      const userProfile = await kv.get(`user:${userId}`);

      if (!userProfile) {
        return c.json({ error: 'Utilisateur non trouvé' }, 404);
      }

      const stats = {
        reliabilityScore: userProfile.reliabilityScore || 100,
        totalSessions: userProfile.totalSessions || 0,
        attendedSessions: userProfile.attendedSessions || 0,
        attendanceRate: userProfile.totalSessions > 0 
          ? (userProfile.attendedSessions / userProfile.totalSessions) * 100 
          : 100,
      };

      return c.json({ stats });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la récupération des statistiques' }, 500);
    }
  });

  console.log('✅ Session routes registered');
}
