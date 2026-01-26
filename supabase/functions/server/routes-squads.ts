import type { Hono } from "npm:hono";
import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { getAuthenticatedUser } from "./auth-helper.tsx";
import { triggerWebhooks } from "./route-helpers.ts";

export function registerSquadRoutes(app: Hono, supabase: SupabaseClient) {
  // Get all squads
  app.get("/make-server-e884809f/squads", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const squads = await kv.getByPrefix('squad:');
      
      const userSquads = squads.filter((squad: any) => 
        squad.members?.some((m: any) => m.id === user.id)
      );

      return c.json({ squads: userSquads });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la récupération des squads' }, 500);
    }
  });

  // Get squad by ID
  app.get("/make-server-e884809f/squads/:id", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const squadId = c.req.param('id');
      const squad = await kv.get(`squad:${squadId}`);

      if (!squad) {
        return c.json({ error: 'Squad non trouvé' }, 404);
      }

      const isMember = squad.members?.some((m: any) => m.id === user.id);
      
      if (!isMember) {
        return c.json({ error: 'Accès refusé' }, 403);
      }

      return c.json({ squad });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la récupération du squad' }, 500);
    }
  });

  // Create squad
  app.post("/make-server-e884809f/squads", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const body = await c.req.json();
      const { name, game, description, avatar, members = [] } = body;

      if (!name || !game) {
        return c.json({ error: 'Nom et jeu requis' }, 400);
      }

      const squadId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const inviteCode = Math.random().toString(36).substr(2, 8).toUpperCase();
      const userProfile = await kv.get(`user:${user.id}`);

      const squad = {
        id: squadId,
        name,
        game,
        description,
        avatar,
        ownerId: user.id,
        inviteCode,
        members: [
          {
            id: user.id,
            name: userProfile?.name || user.email,
            avatar: userProfile?.avatar,
            role: 'owner',
            reliabilityScore: userProfile?.reliabilityScore || 100,
          },
          ...members,
        ],
        stats: {
          totalSessions: 0,
          activePlayers: 1,
          avgReliability: userProfile?.reliabilityScore || 100,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await kv.set(`squad:${squadId}`, squad);
      await kv.set(`invite:${inviteCode}`, { squadId, createdAt: new Date().toISOString() });

      await triggerWebhooks(user.id, 'squad.created', { squad });

      return c.json({ squad, message: 'Squad créé avec succès !' });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la création du squad' }, 500);
    }
  });

  // Join squad by invite code
  app.post("/make-server-e884809f/squads/join", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const body = await c.req.json();
      const { inviteCode } = body;

      if (!inviteCode) {
        return c.json({ error: 'Code d\'invitation requis' }, 400);
      }

      const invite = await kv.get(`invite:${inviteCode.toUpperCase()}`);
      
      if (!invite || !invite.squadId) {
        return c.json({ error: 'Code d\'invitation invalide' }, 404);
      }

      const squad = await kv.get(`squad:${invite.squadId}`);

      if (!squad) {
        return c.json({ error: 'Squad non trouvé' }, 404);
      }

      const isMember = squad.members?.some((m: any) => m.id === user.id);
      
      if (isMember) {
        return c.json({ error: 'Vous êtes déjà membre de cette squad' }, 400);
      }

      const userProfile = await kv.get(`user:${user.id}`);
      
      const newMember = {
        id: user.id,
        name: userProfile?.name || user.email,
        avatar: userProfile?.avatar,
        role: 'member',
        reliabilityScore: userProfile?.reliabilityScore || 100,
        joinedAt: new Date().toISOString(),
      };

      squad.members.push(newMember);
      squad.stats.activePlayers = squad.members.length;
      squad.updatedAt = new Date().toISOString();

      await kv.set(`squad:${squad.id}`, squad);

      await triggerWebhooks(user.id, 'squad.member_joined', { squad, member: newMember });

      return c.json({ squad, message: 'Vous avez rejoint la squad !' });
    } catch (error) {
      return c.json({ error: 'Erreur lors de l\'adhésion à la squad' }, 500);
    }
  });

  // Update squad
  app.put("/make-server-e884809f/squads/:id", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const squadId = c.req.param('id');
      const squad = await kv.get(`squad:${squadId}`);

      if (!squad) {
        return c.json({ error: 'Squad non trouvé' }, 404);
      }

      if (squad.ownerId !== user.id) {
        return c.json({ error: 'Seul le propriétaire peut modifier le squad' }, 403);
      }

      const body = await c.req.json();
      const updatedSquad = {
        ...squad,
        ...body,
        id: squadId,
        ownerId: squad.ownerId,
        updatedAt: new Date().toISOString(),
      };

      await kv.set(`squad:${squadId}`, updatedSquad);

      await triggerWebhooks(user.id, 'squad.updated', { squad: updatedSquad });

      return c.json({ squad: updatedSquad });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la mise à jour du squad' }, 500);
    }
  });

  // Delete squad
  app.delete("/make-server-e884809f/squads/:id", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const squadId = c.req.param('id');
      const squad = await kv.get(`squad:${squadId}`);

      if (!squad) {
        return c.json({ error: 'Squad non trouvé' }, 404);
      }

      if (squad.ownerId !== user.id) {
        return c.json({ error: 'Seul le propriétaire peut supprimer le squad' }, 403);
      }

      await kv.del(`squad:${squadId}`);

      const sessions = await kv.getByPrefix(`session:${squadId}:`);
      for (const session of sessions) {
        await kv.del(`session:${squadId}:${session.id}`);
      }

      return c.json({ message: 'Squad supprimé avec succès' });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la suppression du squad' }, 500);
    }
  });

  // Get squad cohesion metrics
  app.get("/make-server-e884809f/squads/:squadId/cohesion", async (c) => {
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
      
      // Calculate cohesion metrics (simplified)
      const cohesionScore = Math.min(100, squad.stats?.avgReliability || 75);
      const playTogetherFrequency = sessions.length > 0 ? Math.min(100, sessions.length * 5) : 0;
      
      return c.json({ 
        cohesionScore,
        playTogetherFrequency,
        totalSessions: sessions.length,
        avgReliability: squad.stats?.avgReliability || 0,
      });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la récupération des métriques de cohésion' }, 500);
    }
  });

  // Get members stats in batch
  app.get("/make-server-e884809f/squads/:squadId/members-stats", async (c) => {
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

      const membersStats = await Promise.all(
        squad.members.map(async (member: any) => {
          const profile = await kv.get(`user:${member.id}`);
          return {
            id: member.id,
            name: member.name,
            avatar: member.avatar,
            reliabilityScore: profile?.reliabilityScore || 100,
            totalSessions: profile?.totalSessions || 0,
            attendedSessions: profile?.attendedSessions || 0,
          };
        })
      );

      return c.json({ membersStats });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la récupération des statistiques des membres' }, 500);
    }
  });

  // Get squad messages
  app.get("/make-server-e884809f/squads/:squadId/messages", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const squadId = c.req.param('squadId');
      const messages = await kv.getByPrefix(`message:${squadId}:`);

      return c.json({ messages });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la récupération des messages' }, 500);
    }
  });

  // Send message
  app.post("/make-server-e884809f/squads/:squadId/messages", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const squadId = c.req.param('squadId');
      const body = await c.req.json();
      const { content } = body;

      if (!content) {
        return c.json({ error: 'Contenu requis' }, 400);
      }

      const messageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const userProfile = await kv.get(`user:${user.id}`);

      const message = {
        id: messageId,
        squadId,
        authorId: user.id,
        authorName: userProfile?.name || user.email,
        authorAvatar: userProfile?.avatar,
        content,
        reactions: [],
        createdAt: new Date().toISOString(),
      };

      await kv.set(`message:${squadId}:${messageId}`, message);

      return c.json({ message });
    } catch (error) {
      return c.json({ error: 'Erreur lors de l\'envoi du message' }, 500);
    }
  });

  console.log('✅ Squad routes registered');
}
