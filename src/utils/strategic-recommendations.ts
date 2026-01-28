/**
 * Strategic Recommendations Engine
 * Génère des recommandations stratégiques basées sur l'analyse des données du squad
 */

import { supabase } from '@/utils/supabase/client';

export interface Pattern {
  id: string;
  type: 'time' | 'day' | 'player' | 'game' | 'attendance';
  title: string;
  description: string;
  confidence: number; // 0-100
  icon: string; // Icon name
  data?: any;
}

export interface Recommendation {
  id: string;
  type: 'optimal-slot' | 'risk-alert' | 'recurring' | 'member-alert' | 'game-suggestion' | 'growth';
  title: string;
  description: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
  action?: string;
  actionType?: 'schedule' | 'remind' | 'configure' | 'invite';
  data?: any;
}

export interface StrategicAnalysis {
  patterns: Pattern[];
  recommendations: Recommendation[];
  stats: {
    avgAttendance: number;
    totalSessions: number;
    activeMembers: number;
    bestDay: string;
    bestTime: string;
  };
}

const DAY_NAMES = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

/**
 * Génère une analyse stratégique complète pour un squad
 */
export async function generateStrategicAnalysis(squadId: string): Promise<StrategicAnalysis> {
  try {
    // 1. Récupérer les sessions des 60 derniers jours
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select(`
        id,
        title,
        scheduled_date,
        scheduled_time,
        status,
        game,
        rsvps:session_rsvps(user_id, response)
      `)
      .eq('squad_id', squadId)
      .gte('scheduled_date', sixtyDaysAgo.toISOString().split('T')[0])
      .order('scheduled_date', { ascending: false });

    if (sessionsError) throw sessionsError;

    // 2. Récupérer les membres du squad
    const { data: members, error: membersError } = await supabase
      .from('squad_members')
      .select(`
        user_id,
        role,
        reliability_score,
        user:profiles(id, username, display_name, avatar_url, reliability_score, updated_at)
      `)
      .eq('squad_id', squadId);

    if (membersError) throw membersError;

    // 3. Analyser les patterns
    const patterns = analyzePatterns(sessions || [], members || []);

    // 4. Générer les recommandations
    const recommendations = generateRecommendations(sessions || [], members || [], patterns);

    // 5. Calculer les stats globales
    const stats = calculateStats(sessions || [], members || []);

    return {
      patterns,
      recommendations,
      stats,
    };
  } catch (error) {
    console.error('Error generating strategic analysis:', error);
    return getDefaultAnalysis();
  }
}

/**
 * Analyse les patterns dans les données
 */
function analyzePatterns(sessions: any[], members: any[]): Pattern[] {
  const patterns: Pattern[] = [];

  if (sessions.length === 0) {
    return patterns;
  }

  // Pattern 1: Meilleur jour de la semaine
  const dayStats: Record<number, { total: number; yes: number }> = {};
  sessions.forEach(session => {
    const date = new Date(session.scheduled_date);
    const day = date.getDay();
    if (!dayStats[day]) {
      dayStats[day] = { total: 0, yes: 0 };
    }
    dayStats[day].total++;
    dayStats[day].yes += session.rsvps?.filter((r: any) => r.response === 'yes').length || 0;
  });

  let bestDay = 0;
  let bestDayRate = 0;
  Object.entries(dayStats).forEach(([day, stats]) => {
    const rate = stats.total > 0 ? (stats.yes / stats.total) * 100 : 0;
    if (rate > bestDayRate) {
      bestDayRate = rate;
      bestDay = parseInt(day);
    }
  });

  if (bestDayRate > 0) {
    patterns.push({
      id: 'best-day',
      type: 'day',
      title: `${DAY_NAMES[bestDay]} soir = succès garanti`,
      description: `Vos sessions du ${DAY_NAMES[bestDay].toLowerCase()} ont ${Math.round(bestDayRate)}% de taux de présence.`,
      confidence: Math.round(bestDayRate),
      icon: 'Calendar',
    });
  }

  // Pattern 2: Meilleure plage horaire
  const timeStats: Record<string, { total: number; yes: number }> = {};
  sessions.forEach(session => {
    const hour = parseInt(session.scheduled_time?.split(':')[0] || '20');
    const timeRange = hour < 18 ? 'après-midi' : hour < 21 ? 'début de soirée' : 'soirée';
    if (!timeStats[timeRange]) {
      timeStats[timeRange] = { total: 0, yes: 0 };
    }
    timeStats[timeRange].total++;
    timeStats[timeRange].yes += session.rsvps?.filter((r: any) => r.response === 'yes').length || 0;
  });

  let bestTimeRange = 'soirée';
  let bestTimeRate = 0;
  Object.entries(timeStats).forEach(([range, stats]) => {
    const rate = stats.total > 0 ? (stats.yes / stats.total) * 100 : 0;
    if (rate > bestTimeRate) {
      bestTimeRate = rate;
      bestTimeRange = range;
    }
  });

  if (bestTimeRate > 0) {
    const timeLabels: Record<string, string> = {
      'après-midi': '14h-18h',
      'début de soirée': '18h-21h',
      'soirée': '21h-23h',
    };
    patterns.push({
      id: 'best-time',
      type: 'time',
      title: `${timeLabels[bestTimeRange]} : La zone de confort`,
      description: `${Math.round(bestTimeRate)}% de vos sessions réussies se déroulent en ${bestTimeRange}.`,
      confidence: Math.round(bestTimeRate),
      icon: 'Clock',
    });
  }

  // Pattern 3: Duo de joueurs fiables
  if (members.length >= 2) {
    // Trouver les joueurs avec le meilleur score de fiabilité
    const reliableMembers = members
      .filter((m: any) => m.reliability_score >= 90 || m.user?.reliability_score >= 90)
      .slice(0, 2);

    if (reliableMembers.length >= 2) {
      const name1 = reliableMembers[0].user?.display_name || reliableMembers[0].user?.username || 'Joueur 1';
      const name2 = reliableMembers[1].user?.display_name || reliableMembers[1].user?.username || 'Joueur 2';
      patterns.push({
        id: 'player-synergy',
        type: 'player',
        title: `${name1} + ${name2} = duo fiable`,
        description: `Ces deux joueurs ont une excellente fiabilité et jouent souvent ensemble.`,
        confidence: 95,
        icon: 'TrendingUp',
      });
    }
  }

  // Pattern 4: Jeu le plus populaire
  const gameStats: Record<string, number> = {};
  sessions.forEach(session => {
    const game = session.game || 'Non spécifié';
    gameStats[game] = (gameStats[game] || 0) + 1;
  });

  const sortedGames = Object.entries(gameStats).sort((a, b) => b[1] - a[1]);
  if (sortedGames.length > 0) {
    const [topGame, topCount] = sortedGames[0];
    const percentage = Math.round((topCount / sessions.length) * 100);
    patterns.push({
      id: 'game-trend',
      type: 'game',
      title: `${topGame} en hausse`,
      description: `${percentage}% de vos sessions sont sur ${topGame}.`,
      confidence: percentage,
      icon: 'Zap',
    });
  }

  // Pattern 5: Tendance de participation
  const recentSessions = sessions.slice(0, 5);
  const olderSessions = sessions.slice(5, 10);

  if (recentSessions.length > 0 && olderSessions.length > 0) {
    const recentAvg = recentSessions.reduce((sum, s) =>
      sum + (s.rsvps?.filter((r: any) => r.response === 'yes').length || 0), 0) / recentSessions.length;
    const olderAvg = olderSessions.reduce((sum, s) =>
      sum + (s.rsvps?.filter((r: any) => r.response === 'yes').length || 0), 0) / olderSessions.length;

    if (recentAvg > olderAvg * 1.1) {
      patterns.push({
        id: 'attendance-trend',
        type: 'attendance',
        title: 'Participation en hausse',
        description: `La participation a augmenté de ${Math.round((recentAvg / olderAvg - 1) * 100)}% récemment.`,
        confidence: 80,
        icon: 'TrendingUp',
      });
    } else if (recentAvg < olderAvg * 0.9) {
      patterns.push({
        id: 'attendance-trend',
        type: 'attendance',
        title: 'Attention : baisse de participation',
        description: `La participation a baissé de ${Math.round((1 - recentAvg / olderAvg) * 100)}% récemment.`,
        confidence: 75,
        icon: 'AlertCircle',
      });
    }
  }

  return patterns;
}

/**
 * Génère des recommandations basées sur les patterns
 */
function generateRecommendations(sessions: any[], members: any[], patterns: Pattern[]): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Recommandation 1: Créneau optimal basé sur le pattern du meilleur jour
  const bestDayPattern = patterns.find(p => p.id === 'best-day');
  if (bestDayPattern) {
    const dayIndex = DAY_NAMES.indexOf(bestDayPattern.title.split(' ')[0]);
    recommendations.push({
      id: 'optimal-slot',
      type: 'optimal-slot',
      title: 'Créneau optimal détecté',
      description: `${bestDayPattern.title.split(' ')[0]} 21h donne ${bestDayPattern.confidence}% de présence`,
      impact: `+${Math.max(5, Math.round(bestDayPattern.confidence - 70))}% participation`,
      priority: 'high',
      action: 'Planifier la session',
      actionType: 'schedule',
      data: {
        suggestedDay: bestDayPattern.title.split(' ')[0],
        suggestedTime: '21:00',
        expectedAttendance: bestDayPattern.confidence,
      },
    });
  }

  // Recommandation 2: Alertes sur membres inactifs
  const inactiveMembers = members.filter((m: any) => {
    const lastUpdate = m.user?.updated_at ? new Date(m.user.updated_at) : new Date();
    const daysSince = Math.floor((Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSince > 14;
  });

  if (inactiveMembers.length > 0) {
    const member = inactiveMembers[0];
    const memberName = member.user?.display_name || member.user?.username || 'Un membre';
    recommendations.push({
      id: 'member-inactive',
      type: 'member-alert',
      title: 'Activité en baisse',
      description: `${memberName} n'a pas joué depuis 2+ semaines`,
      impact: 'Risque de départ',
      priority: 'medium',
      action: 'Envoyer un message',
      actionType: 'remind',
      data: {
        member: memberName,
        userId: member.user_id,
      },
    });
  }

  // Recommandation 3: Sessions récurrentes si pas de pattern régulier
  if (sessions.length < 4) {
    recommendations.push({
      id: 'start-recurring',
      type: 'recurring',
      title: 'Créer un rituel hebdomadaire',
      description: 'Automatisez une session régulière pour fidéliser vos joueurs',
      impact: '+25% régularité',
      priority: 'high',
      action: 'Configurer la récurrence',
      actionType: 'configure',
      data: {
        frequency: 'weekly',
      },
    });
  }

  // Recommandation 4: Risque de no-show pour membres peu fiables
  const unreliableMembers = members.filter((m: any) =>
    (m.reliability_score || m.user?.reliability_score || 100) < 75
  );

  if (unreliableMembers.length > 0) {
    const member = unreliableMembers[0];
    const memberName = member.user?.display_name || member.user?.username || 'Un joueur';
    const score = member.reliability_score || member.user?.reliability_score || 70;
    recommendations.push({
      id: 'noshow-risk',
      type: 'risk-alert',
      title: 'Risque de no-show détecté',
      description: `${memberName} a ${100 - score}% de probabilité d'absence (historique)`,
      impact: 'Alerte moyenne',
      priority: 'medium',
      action: 'Envoyer un rappel',
      actionType: 'remind',
      data: {
        player: memberName,
        probability: 100 - score,
      },
    });
  }

  // Recommandation 5: Inviter plus de membres si squad petit
  if (members.length < 5) {
    recommendations.push({
      id: 'grow-squad',
      type: 'growth',
      title: 'Agrandir votre squad',
      description: `Votre squad n'a que ${members.length} membres. Invitez des amis !`,
      impact: '+40% flexibilité',
      priority: 'low',
      action: 'Inviter des joueurs',
      actionType: 'invite',
      data: {
        currentSize: members.length,
        recommendedSize: 6,
      },
    });
  }

  // Recommandation 6: Alternative weekend
  if (sessions.length >= 5) {
    recommendations.push({
      id: 'weekend-alternative',
      type: 'optimal-slot',
      title: 'Alternative weekend',
      description: 'Samedi 19h fonctionne aussi pour la majorité',
      impact: '+10% flexibilité',
      priority: 'low',
      action: 'Proposer samedi',
      actionType: 'schedule',
      data: {
        suggestedDay: 'Samedi',
        suggestedTime: '19:00',
        expectedAttendance: 80,
      },
    });
  }

  return recommendations.slice(0, 5); // Limiter à 5 recommandations
}

/**
 * Calcule les statistiques globales
 */
function calculateStats(sessions: any[], members: any[]): StrategicAnalysis['stats'] {
  let totalYes = 0;
  let totalRsvps = 0;

  sessions.forEach(session => {
    const rsvps = session.rsvps || [];
    totalRsvps += rsvps.length;
    totalYes += rsvps.filter((r: any) => r.response === 'yes').length;
  });

  const avgAttendance = totalRsvps > 0 ? Math.round((totalYes / totalRsvps) * 100) : 0;

  // Trouver le meilleur jour
  const dayStats: Record<number, number> = {};
  sessions.forEach(session => {
    const day = new Date(session.scheduled_date).getDay();
    dayStats[day] = (dayStats[day] || 0) + 1;
  });

  let bestDay = 'Samedi';
  let bestDayCount = 0;
  Object.entries(dayStats).forEach(([day, count]) => {
    if (count > bestDayCount) {
      bestDayCount = count;
      bestDay = DAY_NAMES[parseInt(day)];
    }
  });

  // Trouver la meilleure heure
  const timeStats: Record<string, number> = {};
  sessions.forEach(session => {
    const time = session.scheduled_time?.slice(0, 5) || '20:00';
    timeStats[time] = (timeStats[time] || 0) + 1;
  });

  let bestTime = '20:00';
  let bestTimeCount = 0;
  Object.entries(timeStats).forEach(([time, count]) => {
    if (count > bestTimeCount) {
      bestTimeCount = count;
      bestTime = time;
    }
  });

  // Compter les membres actifs (actifs dans les 14 derniers jours)
  const activeMembers = members.filter((m: any) => {
    const lastUpdate = m.user?.updated_at ? new Date(m.user.updated_at) : new Date();
    const daysSince = Math.floor((Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSince <= 14;
  }).length;

  return {
    avgAttendance,
    totalSessions: sessions.length,
    activeMembers,
    bestDay,
    bestTime,
  };
}

/**
 * Retourne une analyse par défaut si les données ne sont pas disponibles
 */
function getDefaultAnalysis(): StrategicAnalysis {
  return {
    patterns: [
      {
        id: 'default-1',
        type: 'day',
        title: 'Pas assez de données',
        description: 'Créez plus de sessions pour obtenir des insights personnalisés.',
        confidence: 0,
        icon: 'AlertCircle',
      },
    ],
    recommendations: [
      {
        id: 'default-rec',
        type: 'recurring',
        title: 'Commencez par créer une session',
        description: 'Planifiez votre première session pour débloquer les recommandations IA.',
        impact: 'Démarrer',
        priority: 'high',
        action: 'Créer une session',
        actionType: 'schedule',
      },
    ],
    stats: {
      avgAttendance: 0,
      totalSessions: 0,
      activeMembers: 0,
      bestDay: 'Samedi',
      bestTime: '20:00',
    },
  };
}
