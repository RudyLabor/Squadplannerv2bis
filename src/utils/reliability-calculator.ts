/**
 * 📊 RELIABILITY CALCULATOR - Phase 1
 * Calcul et affichage du score de fiabilité
 */

import { supabase } from '@/lib/supabase';

export interface UserStats {
  user_id: string;
  display_name: string;
  reliability_score: number;
  total_sessions: number;
  sessions_attended: number;
  sessions_late: number;
  sessions_no_show: number;
  attendance_rate: number;
  late_rate: number;
  no_show_rate: number;
  last_updated: string;
}

export interface ReliabilityTier {
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  min: number;
  max: number;
  emoji: string;
}

/**
 * Tiers de fiabilité avec couleurs
 */
export const RELIABILITY_TIERS: ReliabilityTier[] = [
  {
    name: 'Légende',
    color: 'amber',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-700',
    min: 95,
    max: 100,
    emoji: '🏆',
  },
  {
    name: 'Excellent',
    color: 'emerald',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-500',
    textColor: 'text-emerald-700',
    min: 85,
    max: 94,
    emoji: '⭐',
  },
  {
    name: 'Bon',
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    textColor: 'text-green-700',
    min: 75,
    max: 84,
    emoji: '✅',
  },
  {
    name: 'Moyen',
    color: 'yellow',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-700',
    min: 60,
    max: 74,
    emoji: '⚠️',
  },
  {
    name: 'Faible',
    color: 'orange',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-500',
    textColor: 'text-orange-700',
    min: 40,
    max: 59,
    emoji: '⚠️',
  },
  {
    name: 'Critique',
    color: 'red',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    textColor: 'text-red-700',
    min: 0,
    max: 39,
    emoji: '❌',
  },
];

/**
 * Obtenir le tier basé sur le score
 */
export function getReliabilityTier(score: number): ReliabilityTier {
  const tier = RELIABILITY_TIERS.find(
    (t) => score >= t.min && score <= t.max
  );
  return tier || RELIABILITY_TIERS[RELIABILITY_TIERS.length - 1];
}

/**
 * Calculer le score de fiabilité côté client (pour preview)
 * Formule: (attended - (no_show * 2) - (late * 0.5)) / total * 100
 */
export function calculateReliabilityScore(
  totalSessions: number,
  attended: number,
  late: number,
  noShow: number
): number {
  if (totalSessions === 0) return 100;

  const score =
    ((attended - noShow * 2 - late * 0.5) / totalSessions) * 100;

  return Math.max(0, Math.min(100, Math.round(score * 10) / 10));
}

/**
 * Obtenir les statistiques détaillées d'un utilisateur
 */
export async function getUserDetailedStats(
  userId: string
): Promise<UserStats | null> {
  try {
    // Type assertion needed for custom RPC function
    const { data, error } = await (supabase.rpc as any)('get_user_detailed_stats', {
      user_uuid: userId,
    });

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }
}

/**
 * Obtenir le leaderboard de fiabilité
 */
export async function getReliabilityLeaderboard(limit: number = 10): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('reliability_leaderboard')
      .select('*')
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

/**
 * Recalculer la fiabilité de tous les utilisateurs (admin only)
 */
export async function recalculateAllReliability(): Promise<{
  success: boolean;
  count: number;
}> {
  try {
    // Type assertion needed for custom RPC function
    const { data, error } = await (supabase.rpc as any)('recalculate_all_reliability');

    if (error) throw error;

    return {
      success: true,
      count: Array.isArray(data) ? data.length : 0,
    };
  } catch (error) {
    console.error('Error recalculating reliability:', error);
    return { success: false, count: 0 };
  }
}

/**
 * Formater le score pour affichage
 */
export function formatReliabilityScore(score: number): string {
  return `${Math.round(score)}%`;
}

/**
 * Obtenir le message de feedback basé sur le score
 */
export function getReliabilityFeedback(score: number): string {
  if (score >= 95) return 'Incroyable! Tu es un pilier de ta squad.';
  if (score >= 85) return 'Excellent! Continue comme ça.';
  if (score >= 75) return 'Bon joueur, tes coéquipiers te font confiance.';
  if (score >= 60) return 'Pas mal, mais tu peux mieux faire.';
  if (score >= 40) return 'Attention, ton score baisse. Sois plus présent!';
  return 'Score critique! Tes absences impactent l\'équipe.';
}

/**
 * Obtenir la couleur du badge basée sur le score
 */
export function getReliabilityColor(score: number): {
  bg: string;
  text: string;
  border: string;
} {
  const tier = getReliabilityTier(score);
  return {
    bg: tier.bgColor,
    text: tier.textColor,
    border: tier.borderColor,
  };
}

/**
 * Calculer la tendance (hausse/baisse) entre 2 scores
 */
export function calculateTrend(
  currentScore: number,
  previousScore: number
): {
  direction: 'up' | 'down' | 'stable';
  change: number;
} {
  const diff = currentScore - previousScore;

  if (Math.abs(diff) < 1) {
    return { direction: 'stable', change: 0 };
  }

  return {
    direction: diff > 0 ? 'up' : 'down',
    change: Math.abs(diff),
  };
}

/**
 * Estimer l'impact d'une action future sur le score
 */
export function estimateScoreImpact(
  currentStats: {
    total: number;
    attended: number;
    late: number;
    noShow: number;
  },
  action: 'attend' | 'late' | 'no_show' | 'cancel'
): {
  newScore: number;
  change: number;
  message: string;
} {
  const { total, attended, late, noShow } = currentStats;

  let newAttended = attended;
  let newLate = late;
  let newNoShow = noShow;
  const newTotal = total + 1;

  switch (action) {
    case 'attend':
      newAttended += 1;
      break;
    case 'late':
      newAttended += 1;
      newLate += 1;
      break;
    case 'no_show':
    case 'cancel':
      newNoShow += 1;
      break;
  }

  const currentScore = calculateReliabilityScore(
    total,
    attended,
    late,
    noShow
  );
  const newScore = calculateReliabilityScore(
    newTotal,
    newAttended,
    newLate,
    newNoShow
  );

  const change = newScore - currentScore;

  let message = '';
  if (action === 'attend') {
    message = `+${change.toFixed(1)}% si tu viens`;
  } else if (action === 'late') {
    message = `${change.toFixed(1)}% si tu arrives en retard`;
  } else {
    message = `${change.toFixed(1)}% si tu annules`;
  }

  return { newScore, change, message };
}
