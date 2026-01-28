/**
 * 🤖 SMART SUGGESTIONS - Phase 2
 * Intelligence artificielle pour suggérer les meilleurs créneaux
 * Basé sur l'analyse de l'historique du squad
 */

import { supabase } from '@/lib/supabase';

export interface TimeSlotSuggestion {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  hour: number; // 0-23
  confidence: number; // 0-100
  reason: string;
  historicalData: {
    timesUsed: number;
    averageAttendance: number;
    averageRSVPRate: number;
  };
}

export interface AvailabilityHeatmap {
  [dayOfWeek: number]: {
    [hour: number]: {
      score: number;
      attendees: number;
      sessions: number;
    };
  };
}

/**
 * Analyser l'historique du squad pour trouver les meilleurs créneaux
 */
export async function getSmartSuggestions(
  squadId: string,
  limit: number = 5
): Promise<TimeSlotSuggestion[]> {
  try {
    // Récupérer toutes les sessions passées du squad
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select(`
        id,
        scheduled_date,
        scheduled_time,
        required_players,
        rsvps:session_rsvps(response),
        check_ins:session_check_ins(status)
      `)
      .eq('squad_id', squadId)
      .lte('scheduled_date', new Date().toISOString().split('T')[0])
      .order('scheduled_date', { ascending: false })
      .limit(50); // Analyser les 50 dernières sessions

    if (error) throw error;
    if (!sessions || sessions.length === 0) {
      return getDefaultSuggestions();
    }

    // Créer une heatmap des créneaux
    const heatmap: AvailabilityHeatmap = {};

    sessions.forEach((session) => {
      const date = new Date(session.scheduled_date + 'T' + session.scheduled_time);
      const dayOfWeek = date.getDay();
      const hour = date.getHours();

      if (!heatmap[dayOfWeek]) heatmap[dayOfWeek] = {};
      if (!heatmap[dayOfWeek][hour]) {
        heatmap[dayOfWeek][hour] = { score: 0, attendees: 0, sessions: 0 };
      }

      // Calculer le score basé sur présences
      const yesRSVPs = session.rsvps?.filter(r => r.response === 'yes').length || 0;
      const totalRSVPs = session.rsvps?.length || 0;
      const confirmedCheckIns = session.check_ins?.filter(
        c => c.status === 'confirmed' || c.status === 'on_my_way'
      ).length || 0;

      const rsvpRate = totalRSVPs > 0 ? yesRSVPs / totalRSVPs : 0;
      const attendanceRate = session.required_players > 0
        ? confirmedCheckIns / session.required_players
        : 0;

      heatmap[dayOfWeek][hour].score += rsvpRate * 50 + attendanceRate * 50;
      heatmap[dayOfWeek][hour].attendees += confirmedCheckIns;
      heatmap[dayOfWeek][hour].sessions += 1;
    });

    // Convertir heatmap en suggestions triées
    const suggestions: TimeSlotSuggestion[] = [];

    Object.entries(heatmap).forEach(([day, hours]) => {
      Object.entries(hours).forEach(([hour, data]) => {
        const avgScore = data.score / data.sessions;
        const avgAttendance = data.attendees / data.sessions;
        const avgRSVPRate = (avgScore / 100) * 2; // Approximation

        suggestions.push({
          dayOfWeek: parseInt(day),
          hour: parseInt(hour),
          confidence: Math.min(100, avgScore),
          reason: generateReason(avgScore, data.sessions, avgAttendance),
          historicalData: {
            timesUsed: data.sessions,
            averageAttendance: Math.round(avgAttendance * 10) / 10,
            averageRSVPRate: Math.round(avgRSVPRate * 100) / 100,
          },
        });
      });
    });

    // Trier par confidence et retourner top N
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting smart suggestions:', error);
    return getDefaultSuggestions();
  }
}

/**
 * Générer une raison humaine pour la suggestion
 */
function generateReason(score: number, timesUsed: number, avgAttendance: number): string {
  if (score >= 80) {
    return `Créneau optimal ! ${timesUsed} sessions avec ${avgAttendance.toFixed(1)} joueurs en moyenne`;
  } else if (score >= 60) {
    return `Bon créneau - ${timesUsed} sessions réussies avec forte participation`;
  } else if (score >= 40) {
    return `Créneau correct - ${timesUsed} sessions avec participation moyenne`;
  } else {
    return `Créneau exploré ${timesUsed} fois avec résultats variables`;
  }
}

/**
 * Suggestions par défaut si pas d'historique
 */
function getDefaultSuggestions(): TimeSlotSuggestion[] {
  return [
    {
      dayOfWeek: 6, // Samedi
      hour: 20,
      confidence: 75,
      reason: 'Week-end soir - Créneau populaire pour les gamers',
      historicalData: { timesUsed: 0, averageAttendance: 0, averageRSVPRate: 0 },
    },
    {
      dayOfWeek: 5, // Vendredi
      hour: 21,
      confidence: 70,
      reason: 'Vendredi soir - Disponibilité élevée',
      historicalData: { timesUsed: 0, averageAttendance: 0, averageRSVPRate: 0 },
    },
    {
      dayOfWeek: 0, // Dimanche
      hour: 19,
      confidence: 65,
      reason: 'Dimanche soir - Bon pour sessions longues',
      historicalData: { timesUsed: 0, averageAttendance: 0, averageRSVPRate: 0 },
    },
  ];
}

/**
 * Créer la heatmap complète (7 jours x 24 heures)
 */
export async function generateAvailabilityHeatmap(
  squadId: string
): Promise<AvailabilityHeatmap> {
  try {
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select(`
        scheduled_date,
        scheduled_time,
        required_players,
        check_ins:session_check_ins(status)
      `)
      .eq('squad_id', squadId)
      .lte('scheduled_date', new Date().toISOString().split('T')[0])
      .order('scheduled_date', { ascending: false })
      .limit(100);

    if (error) throw error;

    const heatmap: AvailabilityHeatmap = {};

    // Initialiser toutes les cases
    for (let day = 0; day < 7; day++) {
      heatmap[day] = {};
      for (let hour = 0; hour < 24; hour++) {
        heatmap[day][hour] = { score: 0, attendees: 0, sessions: 0 };
      }
    }

    // Remplir avec données historiques
    sessions?.forEach((session) => {
      const date = new Date(session.scheduled_date + 'T' + session.scheduled_time);
      const dayOfWeek = date.getDay();
      const hour = date.getHours();

      const confirmedCheckIns = session.check_ins?.filter(
        c => c.status === 'confirmed' || c.status === 'on_my_way'
      ).length || 0;

      const attendanceRate = session.required_players > 0
        ? (confirmedCheckIns / session.required_players) * 100
        : 0;

      heatmap[dayOfWeek][hour].score += attendanceRate;
      heatmap[dayOfWeek][hour].attendees += confirmedCheckIns;
      heatmap[dayOfWeek][hour].sessions += 1;
    });

    // Normaliser les scores
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const cell = heatmap[day][hour];
        if (cell.sessions > 0) {
          cell.score = cell.score / cell.sessions;
        }
      }
    }

    return heatmap;
  } catch (error) {
    console.error('Error generating heatmap:', error);
    return {};
  }
}

/**
 * Trouver le meilleur créneau dans la prochaine semaine
 */
export async function findBestSlotNextWeek(squadId: string): Promise<{
  date: Date;
  confidence: number;
  reason: string;
} | null> {
  const suggestions = await getSmartSuggestions(squadId, 10);

  if (suggestions.length === 0) return null;

  // Trouver la prochaine occurrence du meilleur créneau
  const bestSlot = suggestions[0];
  const today = new Date();
  const currentDay = today.getDay();

  let daysUntil = bestSlot.dayOfWeek - currentDay;
  if (daysUntil <= 0) daysUntil += 7; // Semaine prochaine

  const suggestedDate = new Date(today);
  suggestedDate.setDate(today.getDate() + daysUntil);
  suggestedDate.setHours(bestSlot.hour, 0, 0, 0);

  return {
    date: suggestedDate,
    confidence: bestSlot.confidence,
    reason: bestSlot.reason,
  };
}

/**
 * Analyser les patterns de disponibilité d'un membre
 */
export async function analyzeMemberAvailability(
  userId: string
): Promise<{
  bestDays: number[];
  bestHours: number[];
  consistency: number;
}> {
  try {
    const { data: checkIns, error } = await supabase
      .from('session_check_ins')
      .select(`
        checked_in_at,
        status,
        session:sessions(scheduled_date, scheduled_time)
      `)
      .eq('user_id', userId)
      .eq('status', 'confirmed')
      .order('checked_in_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    const dayCount: { [day: number]: number } = {};
    const hourCount: { [hour: number]: number } = {};

    checkIns?.forEach((checkIn) => {
      if (!checkIn.session) return;

      const date = new Date(
        checkIn.session.scheduled_date + 'T' + checkIn.session.scheduled_time
      );
      const day = date.getDay();
      const hour = date.getHours();

      dayCount[day] = (dayCount[day] || 0) + 1;
      hourCount[hour] = (hourCount[hour] || 0) + 1;
    });

    const bestDays = Object.entries(dayCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([day]) => parseInt(day));

    const bestHours = Object.entries(hourCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));

    // Calculer consistency (variance des jours)
    const totalSessions = checkIns?.length || 0;
    const uniqueDays = Object.keys(dayCount).length;
    const consistency = totalSessions > 0
      ? (uniqueDays / 7) * 100
      : 0;

    return { bestDays, bestHours, consistency };
  } catch (error) {
    console.error('Error analyzing member availability:', error);
    return { bestDays: [], bestHours: [], consistency: 0 };
  }
}

/**
 * Formater le jour de la semaine
 */
export function formatDayOfWeek(day: number, short: boolean = false): string {
  const days = [
    'Dimanche',
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
  ];

  const shortDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return short ? shortDays[day] : days[day];
}

/**
 * Formater l'heure
 */
export function formatHour(hour: number): string {
  return `${hour.toString().padStart(2, '0')}:00`;
}
