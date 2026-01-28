/**
 * 💡 AUTO-COACHING - Phase 2
 * Insights intelligents pour améliorer l'organisation du squad
 */

import { supabase } from '@/lib/supabase';

export interface CoachingInsight {
  id: string;
  type: 'warning' | 'tip' | 'success' | 'info';
  category: 'attendance' | 'timing' | 'engagement' | 'cohesion';
  title: string;
  message: string;
  actionable: boolean;
  action?: string;
  priority: 'high' | 'medium' | 'low';
  data?: any;
}

/**
 * Analyser un squad et générer des insights
 */
export async function generateSquadInsights(squadId: string): Promise<CoachingInsight[]> {
  const insights: CoachingInsight[] = [];

  try {
    // 1. Analyser taux de présence général
    const attendanceInsight = await analyzeAttendanceRate(squadId);
    if (attendanceInsight) insights.push(attendanceInsight);

    // 2. Analyser régularité des sessions
    const frequencyInsight = await analyzeSessionFrequency(squadId);
    if (frequencyInsight) insights.push(frequencyInsight);

    // 3. Analyser meilleur créneau
    const timingInsight = await analyzeBestTiming(squadId);
    if (timingInsight) insights.push(timingInsight);

    // 4. Analyser membres problématiques
    const memberInsight = await analyzeMemberReliability(squadId);
    if (memberInsight) insights.push(memberInsight);

    // 5. Analyser tendance squad
    const trendInsight = await analyzeSquadTrend(squadId);
    if (trendInsight) insights.push(trendInsight);

    return insights.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    return [];
  }
}

/**
 * 1. Analyser le taux de présence
 */
async function analyzeAttendanceRate(squadId: string): Promise<CoachingInsight | null> {
  const { data: sessions } = await supabase
    .from('sessions')
    .select(`
      id,
      required_players,
      check_ins:session_check_ins(status)
    `)
    .eq('squad_id', squadId)
    .lte('scheduled_date', new Date().toISOString().split('T')[0])
    .limit(10);

  if (!sessions || sessions.length < 3) return null;

  let totalExpected = 0;
  let totalPresent = 0;

  sessions.forEach(session => {
    totalExpected += session.required_players || 5;
    totalPresent += session.check_ins?.filter(
      c => c.status === 'confirmed' || c.status === 'on_my_way'
    ).length || 0;
  });

  const attendanceRate = (totalPresent / totalExpected) * 100;

  if (attendanceRate < 60) {
    return {
      id: 'attendance_low',
      type: 'warning',
      category: 'attendance',
      title: 'Taux de présence faible',
      message: `Seulement ${attendanceRate.toFixed(0)}% de présence sur les dernières sessions. Considérez un check-in obligatoire 1h avant.`,
      actionable: true,
      action: 'Activer rappels automatiques',
      priority: 'high',
      data: { rate: attendanceRate },
    };
  } else if (attendanceRate >= 80) {
    return {
      id: 'attendance_excellent',
      type: 'success',
      category: 'attendance',
      title: 'Excellent taux de présence !',
      message: `${attendanceRate.toFixed(0)}% de présence. Votre squad est très engagée !`,
      actionable: false,
      priority: 'low',
      data: { rate: attendanceRate },
    };
  }

  return null;
}

/**
 * 2. Analyser la régularité des sessions
 */
async function analyzeSessionFrequency(squadId: string): Promise<CoachingInsight | null> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: sessions } = await supabase
    .from('sessions')
    .select('scheduled_date')
    .eq('squad_id', squadId)
    .gte('scheduled_date', thirtyDaysAgo.toISOString().split('T')[0]);

  const sessionCount = sessions?.length || 0;
  const sessionsPerWeek = (sessionCount / 30) * 7;

  if (sessionsPerWeek < 1) {
    return {
      id: 'frequency_low',
      type: 'warning',
      category: 'engagement',
      title: 'Activité faible',
      message: `Moins d'1 session par semaine. Pour maintenir la cohésion, visez au moins 2 sessions/semaine.`,
      actionable: true,
      action: 'Planifier sessions récurrentes',
      priority: 'high',
      data: { sessionsPerWeek },
    };
  } else if (sessionsPerWeek >= 2) {
    return {
      id: 'frequency_good',
      type: 'success',
      category: 'engagement',
      title: 'Rythme optimal !',
      message: `${sessionsPerWeek.toFixed(1)} sessions/semaine. Excellente régularité pour la cohésion du squad.`,
      actionable: false,
      priority: 'low',
      data: { sessionsPerWeek },
    };
  }

  return null;
}

/**
 * 3. Analyser le meilleur créneau
 */
async function analyzeBestTiming(squadId: string): Promise<CoachingInsight | null> {
  const { data: sessions } = await supabase
    .from('sessions')
    .select(`
      scheduled_date,
      scheduled_time,
      required_players,
      check_ins:session_check_ins(status)
    `)
    .eq('squad_id', squadId)
    .lte('scheduled_date', new Date().toISOString().split('T')[0])
    .limit(20);

  if (!sessions || sessions.length < 5) return null;

  // Grouper par jour de la semaine
  const dayStats: { [key: number]: { total: number; present: number } } = {};

  sessions.forEach(session => {
    const date = new Date(session.scheduled_date);
    const day = date.getDay();

    if (!dayStats[day]) dayStats[day] = { total: 0, present: 0 };

    dayStats[day].total += session.required_players || 5;
    dayStats[day].present += session.check_ins?.filter(
      c => c.status === 'confirmed' || c.status === 'on_my_way'
    ).length || 0;
  });

  // Trouver le meilleur jour
  let bestDay = -1;
  let bestRate = 0;

  Object.entries(dayStats).forEach(([day, stats]) => {
    const rate = stats.present / stats.total;
    if (rate > bestRate) {
      bestRate = rate;
      bestDay = parseInt(day);
    }
  });

  if (bestDay >= 0 && bestRate > 0.7) {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    return {
      id: 'timing_optimal',
      type: 'tip',
      category: 'timing',
      title: 'Créneau optimal identifié',
      message: `Le ${days[bestDay]} a ${(bestRate * 100).toFixed(0)}% de présence. Ritualisez ce créneau pour une meilleure régularité.`,
      actionable: true,
      action: 'Créer session récurrente',
      priority: 'medium',
      data: { bestDay, rate: bestRate },
    };
  }

  return null;
}

/**
 * 4. Analyser membres peu fiables
 */
async function analyzeMemberReliability(squadId: string): Promise<CoachingInsight | null> {
  const { data: members } = await supabase
    .from('squad_members')
    .select(`
      user:users(id, display_name, reliability_score)
    `)
    .eq('squad_id', squadId);

  if (!members || members.length === 0) return null;

  const unreliableMembers = members.filter(
    m => m.user && m.user.reliability_score < 50
  );

  if (unreliableMembers.length > 0) {
    return {
      id: 'members_unreliable',
      type: 'warning',
      category: 'cohesion',
      title: `${unreliableMembers.length} membre(s) peu fiable(s)`,
      message: `Certains membres ont un score de fiabilité < 50%. Discutez avec eux ou ajustez les attentes.`,
      actionable: true,
      action: 'Voir membres',
      priority: 'medium',
      data: { count: unreliableMembers.length },
    };
  }

  return null;
}

/**
 * 5. Analyser tendance du squad
 */
async function analyzeSquadTrend(squadId: string): Promise<CoachingInsight | null> {
  const { data: recentSessions } = await supabase
    .from('sessions')
    .select('scheduled_date, check_ins:session_check_ins(status), required_players')
    .eq('squad_id', squadId)
    .lte('scheduled_date', new Date().toISOString().split('T')[0])
    .order('scheduled_date', { ascending: false })
    .limit(10);

  if (!recentSessions || recentSessions.length < 5) return null;

  // Comparer première moitié vs deuxième moitié
  const half = Math.floor(recentSessions.length / 2);
  const recent = recentSessions.slice(0, half);
  const older = recentSessions.slice(half);

  const recentRate = calculateAttendanceRate(recent);
  const olderRate = calculateAttendanceRate(older);

  const trend = recentRate - olderRate;

  if (trend < -15) {
    return {
      id: 'trend_declining',
      type: 'warning',
      category: 'cohesion',
      title: 'Engagement en baisse',
      message: `La présence a baissé de ${Math.abs(trend).toFixed(0)}%. Vérifiez que le créneau convient toujours à tous.`,
      actionable: true,
      action: 'Ajuster horaires',
      priority: 'high',
      data: { trend },
    };
  } else if (trend > 15) {
    return {
      id: 'trend_improving',
      type: 'success',
      category: 'cohesion',
      title: 'Engagement en hausse !',
      message: `La présence a augmenté de ${trend.toFixed(0)}%. Continuez sur cette lancée !`,
      actionable: false,
      priority: 'low',
      data: { trend },
    };
  }

  return null;
}

/**
 * Helper: Calculer taux de présence d'un ensemble de sessions
 */
function calculateAttendanceRate(sessions: any[]): number {
  let totalExpected = 0;
  let totalPresent = 0;

  sessions.forEach(session => {
    totalExpected += session.required_players || 5;
    totalPresent += session.check_ins?.filter(
      (c: any) => c.status === 'confirmed' || c.status === 'on_my_way'
    ).length || 0;
  });

  return totalExpected > 0 ? (totalPresent / totalExpected) * 100 : 0;
}

/**
 * Obtenir insights pour un utilisateur individuel
 */
export async function generateUserInsights(userId: string): Promise<CoachingInsight[]> {
  const insights: CoachingInsight[] = [];

  try {
    const { data: user } = await supabase
      .from('users')
      .select('reliability_score, total_sessions, sessions_attended, sessions_no_show')
      .eq('id', userId)
      .single();

    if (!user) return [];

    // Insight score
    if (user.reliability_score < 60) {
      insights.push({
        id: 'user_reliability_low',
        type: 'warning',
        category: 'engagement',
        title: 'Score de fiabilité à améliorer',
        message: `Ton score est de ${user.reliability_score.toFixed(0)}%. Confirme tes présences et évite les absences de dernière minute.`,
        actionable: true,
        action: 'Voir conseils',
        priority: 'high',
        data: { score: user.reliability_score },
      });
    }

    // Insight streak
    if (user.total_sessions >= 5 && user.sessions_no_show === 0) {
      insights.push({
        id: 'user_perfect_attendance',
        type: 'success',
        category: 'engagement',
        title: 'Présence parfaite !',
        message: `${user.total_sessions} sessions sans aucune absence. Continue comme ça !`,
        actionable: false,
        priority: 'low',
        data: {},
      });
    }

    return insights;
  } catch (error) {
    console.error('Error generating user insights:', error);
    return [];
  }
}
