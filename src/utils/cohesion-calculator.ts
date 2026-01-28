/**
 * 🎯 COHESION CALCULATOR
 * Calcule le score de cohésion d'équipe basé sur plusieurs métriques
 */

import { supabase } from '@/utils/supabase/client';

export interface MemberStats {
  id: string;
  name: string;
  avatar_url?: string;
  reliabilityScore: number;
  sessionsAttended: number;
  totalSessions: number;
  lastActive: string;
  status: 'active' | 'warning' | 'inactive';
}

export interface CohesionResult {
  score: number; // 0-100 - Score global de cohésion
  stability: number; // 0-100 - Stabilité du groupe
  avgAttendance: number; // 0-100 - Taux de présence moyen
  activeMembers: number;
  inactiveMembers: number;
  avgReliability: number;
  trend: 'up' | 'down' | 'stable';
  recommendations: Recommendation[];
}

export interface Recommendation {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  description: string;
  action?: string;
  actionType?: 'remove' | 'invite' | 'schedule';
}

/**
 * Calcule le score de cohésion pour un squad
 */
export async function calculateSquadCohesion(squadId: string): Promise<{
  cohesion: CohesionResult;
  members: MemberStats[];
}> {
  try {
    // 1. Récupérer les membres du squad avec leurs stats
    const { data: squadMembers, error: membersError } = await supabase
      .from('squad_members')
      .select(`
        id,
        user_id,
        role,
        joined_at,
        sessions_attended,
        reliability_score,
        user:profiles(id, username, display_name, avatar_url, reliability_score, total_sessions, sessions_attended, updated_at)
      `)
      .eq('squad_id', squadId);

    if (membersError) throw membersError;

    // 2. Récupérer les sessions récentes du squad (30 derniers jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentSessions, error: sessionsError } = await supabase
      .from('sessions')
      .select(`
        id,
        scheduled_date,
        status,
        rsvps:session_rsvps(user_id, response)
      `)
      .eq('squad_id', squadId)
      .gte('scheduled_date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('scheduled_date', { ascending: false });

    if (sessionsError) throw sessionsError;

    // 3. Calculer les stats par membre
    const members: MemberStats[] = (squadMembers || []).map(member => {
      const profile = member.user as any;
      const lastUpdated = profile?.updated_at ? new Date(profile.updated_at) : new Date();
      const daysSinceActive = Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));

      // Calculer le nombre de sessions auxquelles le membre a participé
      const memberSessions = (recentSessions || []).filter(session =>
        session.rsvps?.some((rsvp: any) => rsvp.user_id === member.user_id && rsvp.response === 'yes')
      );

      const totalSessions = recentSessions?.length || 0;
      const sessionsAttended = memberSessions.length;

      // Déterminer le statut du membre
      let status: 'active' | 'warning' | 'inactive' = 'active';
      if (daysSinceActive > 14) {
        status = 'inactive';
      } else if (daysSinceActive > 7) {
        status = 'warning';
      }

      // Format de la dernière activité
      let lastActive = "Aujourd'hui";
      if (daysSinceActive === 1) lastActive = 'Hier';
      else if (daysSinceActive > 1 && daysSinceActive <= 7) lastActive = `Il y a ${daysSinceActive}j`;
      else if (daysSinceActive > 7) lastActive = `Il y a ${daysSinceActive}j`;

      return {
        id: member.user_id,
        name: profile?.display_name || profile?.username || 'Joueur',
        avatar_url: profile?.avatar_url,
        reliabilityScore: member.reliability_score || profile?.reliability_score || 100,
        sessionsAttended,
        totalSessions,
        lastActive,
        status,
      };
    });

    // 4. Calculer les métriques globales
    const activeMembers = members.filter(m => m.status === 'active').length;
    const warningMembers = members.filter(m => m.status === 'warning').length;
    const inactiveMembers = members.filter(m => m.status === 'inactive').length;
    const totalMembers = members.length;

    // Taux de présence moyen
    const avgAttendance = totalMembers > 0
      ? Math.round(
          members.reduce((acc, m) => {
            const rate = m.totalSessions > 0 ? (m.sessionsAttended / m.totalSessions) * 100 : 100;
            return acc + rate;
          }, 0) / totalMembers
        )
      : 100;

    // Fiabilité moyenne
    const avgReliability = totalMembers > 0
      ? Math.round(members.reduce((acc, m) => acc + m.reliabilityScore, 0) / totalMembers)
      : 100;

    // Stabilité = % de membres actifs + warning (considérés stables)
    const stability = totalMembers > 0
      ? Math.round(((activeMembers + warningMembers * 0.5) / totalMembers) * 100)
      : 100;

    // 5. Calculer le score de cohésion global
    // Formule: 40% présence + 30% fiabilité + 20% stabilité + 10% taille du groupe
    const sizeBonus = Math.min(totalMembers / 6, 1) * 100; // Bonus si squad a au moins 6 membres

    const score = Math.round(
      avgAttendance * 0.4 +
      avgReliability * 0.3 +
      stability * 0.2 +
      sizeBonus * 0.1
    );

    // 6. Déterminer la tendance (basé sur les 2 dernières semaines vs 2 semaines précédentes)
    let trend: 'up' | 'down' | 'stable' = 'stable';
    const recentSessionCount = (recentSessions || []).filter(s => {
      const sessionDate = new Date(s.scheduled_date);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      return sessionDate >= twoWeeksAgo;
    }).length;

    const olderSessionCount = (recentSessions || []).filter(s => {
      const sessionDate = new Date(s.scheduled_date);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
      return sessionDate < twoWeeksAgo && sessionDate >= fourWeeksAgo;
    }).length;

    if (recentSessionCount > olderSessionCount) trend = 'up';
    else if (recentSessionCount < olderSessionCount) trend = 'down';

    // 7. Générer les recommandations intelligentes
    const recommendations: Recommendation[] = [];

    // Recommandation: Membres inactifs
    const inactiveNames = members.filter(m => m.status === 'inactive').map(m => m.name);
    if (inactiveNames.length > 0) {
      recommendations.push({
        id: 'inactive-members',
        type: 'warning',
        title: `${inactiveNames.length} membre${inactiveNames.length > 1 ? 's' : ''} inactif${inactiveNames.length > 1 ? 's' : ''}`,
        description: `${inactiveNames.join(', ')} n'a pas participé depuis plus de 2 semaines. Pensez à les recontacter ou à revoir la composition du squad.`,
        action: 'Voir les profils',
        actionType: 'remove',
      });
    }

    // Recommandation: Faible présence globale
    if (avgAttendance < 70) {
      recommendations.push({
        id: 'low-attendance',
        type: 'warning',
        title: 'Taux de présence faible',
        description: `Seulement ${avgAttendance}% de présence moyenne. Essayez de proposer des créneaux qui conviennent mieux à tous.`,
        action: 'Planifier une session',
        actionType: 'schedule',
      });
    }

    // Recommandation: Bonne cohésion
    if (score >= 85 && recommendations.length === 0) {
      recommendations.push({
        id: 'great-cohesion',
        type: 'success',
        title: 'Excellente cohésion !',
        description: 'Votre squad fonctionne très bien. Continuez sur cette lancée et invitez de nouveaux membres si vous le souhaitez.',
        action: 'Inviter des amis',
        actionType: 'invite',
      });
    }

    // Recommandation: Squad trop petit
    if (totalMembers < 4) {
      recommendations.push({
        id: 'small-squad',
        type: 'info',
        title: 'Squad en construction',
        description: `Votre squad n'a que ${totalMembers} membre${totalMembers > 1 ? 's' : ''}. Invitez des amis pour former une équipe plus solide !`,
        action: 'Inviter des joueurs',
        actionType: 'invite',
      });
    }

    // Recommandation: Pas de sessions récentes
    if ((recentSessions?.length || 0) < 2) {
      recommendations.push({
        id: 'no-sessions',
        type: 'info',
        title: 'Peu d\'activité récente',
        description: 'Votre squad n\'a pas beaucoup de sessions planifiées. Proposez une session pour remotiver les troupes !',
        action: 'Créer une session',
        actionType: 'schedule',
      });
    }

    return {
      cohesion: {
        score: Math.max(0, Math.min(100, score)),
        stability: Math.max(0, Math.min(100, stability)),
        avgAttendance: Math.max(0, Math.min(100, avgAttendance)),
        activeMembers,
        inactiveMembers,
        avgReliability: Math.max(0, Math.min(100, avgReliability)),
        trend,
        recommendations: recommendations.slice(0, 3), // Max 3 recommandations
      },
      members,
    };
  } catch (error) {
    console.error('Error calculating cohesion:', error);

    // Retourner des valeurs par défaut en cas d'erreur
    return {
      cohesion: {
        score: 80,
        stability: 80,
        avgAttendance: 80,
        activeMembers: 0,
        inactiveMembers: 0,
        avgReliability: 80,
        trend: 'stable',
        recommendations: [{
          id: 'error',
          type: 'info',
          title: 'Données en cours de chargement',
          description: 'Les statistiques de cohésion seront bientôt disponibles.',
        }],
      },
      members: [],
    };
  }
}

/**
 * Calcule un score de cohésion simplifié (pour affichage rapide)
 */
export function calculateSimpleCohesionScore(
  avgAttendance: number,
  avgReliability: number,
  activeRatio: number
): number {
  return Math.round(
    avgAttendance * 0.4 +
    avgReliability * 0.3 +
    activeRatio * 100 * 0.3
  );
}

/**
 * Retourne une couleur basée sur le score
 */
export function getCohesionColor(score: number): 'success' | 'warning' | 'error' {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'error';
}

/**
 * Retourne un label basé sur le score
 */
export function getCohesionLabel(score: number): string {
  if (score >= 90) return 'Excellente';
  if (score >= 80) return 'Très bonne';
  if (score >= 70) return 'Bonne';
  if (score >= 60) return 'Correcte';
  return 'Fragile';
}
