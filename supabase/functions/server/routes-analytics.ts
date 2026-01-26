import type { Hono } from "npm:hono";
import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { getAuthenticatedUser } from "./auth-helper.tsx";

export function registerAnalyticsRoutes(app: Hono, supabase: SupabaseClient) {
  // Get leaderboard
  app.get("/make-server-e884809f/leaderboard", async (c) => {
    try {
      const authUser = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!authUser) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const allUsers = await kv.getByPrefix('user:');
      
      const sortedUsers = allUsers
        .filter((u: any) => u.reliabilityScore !== undefined)
        .sort((a: any, b: any) => b.reliabilityScore - a.reliabilityScore)
        .slice(0, 50)
        .map((u: any, index: number) => ({
          rank: index + 1,
          id: u.id,
          name: u.name,
          avatar: u.avatar,
          reliabilityScore: u.reliabilityScore,
          totalSessions: u.totalSessions || 0,
        }));

      return c.json({ leaderboard: sortedUsers });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la récupération du classement' }, 500);
    }
  });

  // Get heatmap data (availability patterns)
  app.get("/make-server-e884809f/analytics/heatmap", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const squadId = c.req.query('squadId');
      
      if (!squadId) {
        return c.json({ error: 'Squad ID requis' }, 400);
      }

      const sessions = await kv.getByPrefix(`session:${squadId}:`);
      
      // Generate heatmap data (simplified)
      const heatmap = Array(7).fill(null).map(() => Array(24).fill(0));
      
      sessions.forEach((session: any) => {
        session.slots?.forEach((slot: any) => {
          const date = new Date(slot.datetime);
          const dayOfWeek = date.getDay();
          const hour = date.getHours();
          
          if (heatmap[dayOfWeek] && heatmap[dayOfWeek][hour] !== undefined) {
            heatmap[dayOfWeek][hour]++;
          }
        });
      });

      return c.json({ heatmap });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la génération de la heatmap' }, 500);
    }
  });

  // Get AI suggestions
  app.get("/make-server-e884809f/analytics/suggestions", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const squadId = c.req.query('squadId');
      
      if (!squadId) {
        return c.json({ error: 'Squad ID requis' }, 400);
      }

      // Return mock suggestions
      const suggestions = [
        {
          type: 'best_time',
          message: 'Les vendredis soirs à 20h semblent être le meilleur créneau pour votre squad',
          confidence: 0.85,
        },
        {
          type: 'inactive_member',
          message: 'Certains membres n\'ont pas répondu aux 3 dernières propositions',
          confidence: 0.92,
        },
      ];

      return c.json({ suggestions });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la génération des suggestions' }, 500);
    }
  });

  // Get weekly recap
  app.get("/make-server-e884809f/analytics/weekly-recap", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const squads = await kv.getByPrefix('squad:');
      const userSquads = squads.filter((squad: any) => 
        squad.members?.some((m: any) => m.id === user.id)
      );

      const recap = {
        totalSquads: userSquads.length,
        totalSessions: 0,
        attendanceRate: 100,
        mostActiveSquad: userSquads[0]?.name || 'N/A',
      };

      return c.json({ recap });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la génération du récapitulatif' }, 500);
    }
  });

  // Get availability heatmap for squad
  app.get("/make-server-e884809f/squads/:squadId/availability-heatmap", async (c) => {
    try {
      const user = await getAuthenticatedUser(c.req.header('Authorization'));
      
      if (!user) {
        return c.json({ error: 'Non autorisé' }, 401);
      }

      const squadId = c.req.param('squadId');
      const sessions = await kv.getByPrefix(`session:${squadId}:`);
      
      // Generate availability heatmap (simplified)
      const heatmap = Array(7).fill(null).map(() => Array(24).fill(0));
      
      return c.json({ heatmap });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la génération de la heatmap de disponibilité' }, 500);
    }
  });

  // Get smart time slot suggestions
  app.get("/make-server-e884809f/squads/:squadId/smart-suggestions", async (c) => {
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

      // Return mock smart suggestions
      const suggestions = [
        {
          datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          confidence: 0.9,
          expectedAttendance: squad.members.length,
        },
      ];

      return c.json({ suggestions });
    } catch (error) {
      return c.json({ error: 'Erreur lors de la génération des suggestions intelligentes' }, 500);
    }
  });

  console.log('✅ Analytics routes registered');
}
