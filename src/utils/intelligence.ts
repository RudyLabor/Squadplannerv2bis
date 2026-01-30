/**
 * Intelligence Engine - Smart Suggestions & AI Features
 *
 * Provides AI-powered recommendations for:
 * - Optimal session times
 * - Squad member compatibility
 * - Reliability predictions
 */

import { supabase } from '@/lib/supabase';

interface OptimalTimeResult {
  bestDay: string;
  bestTime: string;
  confidence: number;
  attendanceRate: number;
}

interface CompatibilityResult {
  optimalSlots: Array<{
    date: string;
    time: string;
    availableMembers: number;
    coverage: number;
  }>;
  averageCoverage: number;
}

export const intelligenceEngine = {
  /**
   * Analyze past sessions to find optimal time slots
   */
  async getOptimalTimes(squadId: string): Promise<OptimalTimeResult> {
    try {
      // Fetch past sessions with RSVPs
      const { data: sessions, error } = await supabase
        .from('sessions')
        .select(`
          scheduled_date,
          scheduled_time,
          status,
          rsvps:session_rsvps(response)
        `)
        .eq('squad_id', squadId)
        .in('status', ['completed', 'confirmed'])
        .order('scheduled_date', { ascending: false })
        .limit(50);

      if (error) throw error;

      if (!sessions || sessions.length === 0) {
        return {
          bestDay: 'Samedi',
          bestTime: '20:00',
          confidence: 0,
          attendanceRate: 0,
        };
      }

      // Analyze by day of week
      const dayStats: Record<string, { total: number; yesCount: number }> = {};
      const timeStats: Record<string, { total: number; yesCount: number }> = {};

      const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

      sessions.forEach((session: any) => {
        const date = new Date(session.scheduled_date);
        const dayName = dayNames[date.getDay()];
        const time = session.scheduled_time.slice(0, 5); // HH:MM

        const yesCount = session.rsvps?.filter((r: any) => r.response === 'yes').length || 0;
        const total = session.rsvps?.length || 1;

        // Track day stats
        if (!dayStats[dayName]) {
          dayStats[dayName] = { total: 0, yesCount: 0 };
        }
        dayStats[dayName].total += total;
        dayStats[dayName].yesCount += yesCount;

        // Track time stats
        if (!timeStats[time]) {
          timeStats[time] = { total: 0, yesCount: 0 };
        }
        timeStats[time].total += total;
        timeStats[time].yesCount += yesCount;
      });

      // Find best day
      let bestDay = 'Samedi';
      let bestDayRate = 0;
      Object.entries(dayStats).forEach(([day, stats]) => {
        const rate = stats.yesCount / stats.total;
        if (rate > bestDayRate) {
          bestDayRate = rate;
          bestDay = day;
        }
      });

      // Find best time
      let bestTime = '20:00';
      let bestTimeRate = 0;
      Object.entries(timeStats).forEach(([time, stats]) => {
        const rate = stats.yesCount / stats.total;
        if (rate > bestTimeRate) {
          bestTimeRate = rate;
          bestTime = time;
        }
      });

      const confidence = Math.min((sessions.length / 20) * 100, 100); // More sessions = higher confidence

      return {
        bestDay,
        bestTime,
        confidence: Math.round(confidence),
        attendanceRate: Math.round(bestDayRate * 100),
      };
    } catch (error) {
      console.error('[Intelligence] Optimal times error:', error);
      return {
        bestDay: 'Samedi',
        bestTime: '20:00',
        confidence: 0,
        attendanceRate: 0,
      };
    }
  },

  /**
   * Analyze squad member availability for compatibility
   */
  async getMemberCompatibility(squadId: string, startDate: string, endDate: string): Promise<CompatibilityResult> {
    try {
      // Get squad members
      const { data: members, error: membersError } = await supabase
        .from('squad_members')
        .select('user_id')
        .eq('squad_id', squadId);

      if (membersError) throw membersError;

      const memberIds = members?.map(m => m.user_id) || [];

      if (memberIds.length === 0) {
        return {
          optimalSlots: [],
          averageCoverage: 0,
        };
      }

      // Get availability slots
      const { data: slots, error: slotsError } = await supabase
        .from('availability_slots')
        .select('date, start_time, end_time, user_id')
        .in('user_id', memberIds)
        .gte('date', startDate)
        .lte('date', endDate)
        .eq('is_available', true);

      if (slotsError) throw slotsError;

      // Group by date and time
      const timeSlots: Record<string, Set<string>> = {};

      slots?.forEach((slot: any) => {
        const key = `${slot.date} ${slot.start_time}`;
        if (!timeSlots[key]) {
          timeSlots[key] = new Set();
        }
        timeSlots[key].add(slot.user_id);
      });

      // Convert to array and calculate coverage
      const optimalSlots = Object.entries(timeSlots)
        .map(([key, userIds]) => {
          const [date, time] = key.split(' ');
          const availableMembers = userIds.size;
          const coverage = Math.round((availableMembers / memberIds.length) * 100);

          return {
            date,
            time,
            availableMembers,
            coverage,
          };
        })
        .sort((a, b) => b.coverage - a.coverage)
        .slice(0, 10); // Top 10 slots

      const averageCoverage = optimalSlots.length > 0
        ? Math.round(optimalSlots.reduce((sum, slot) => sum + slot.coverage, 0) / optimalSlots.length)
        : 0;

      return {
        optimalSlots,
        averageCoverage,
      };
    } catch (error) {
      console.error('[Intelligence] Member compatibility error:', error);
      return {
        optimalSlots: [],
        averageCoverage: 0,
      };
    }
  },

  /**
   * Predict no-shows based on reliability scores
   */
  async predictNoShows(sessionId: string): Promise<Array<{ userId: string; probability: number; username: string }>> {
    try {
      const { data: rsvps, error } = await supabase
        .from('session_rsvps')
        .select(`
          user_id,
          response,
          user:users(id, username, reliability_score)
        `)
        .eq('session_id', sessionId);

      if (error) throw error;

      return (rsvps || []).map((rsvp: any) => {
        const reliabilityScore = rsvp.user?.reliability_score || 100;

        let probability = 0;
        if (rsvp.response === 'yes') {
          // Lower reliability = higher no-show probability
          probability = Math.max(0, 100 - reliabilityScore) / 100;
        } else if (rsvp.response === 'maybe') {
          probability = 0.5;
        } else {
          probability = 0.95; // "no" response
        }

        return {
          userId: rsvp.user_id,
          username: rsvp.user?.username || 'Unknown',
          probability: Math.round(probability * 100),
        };
      });
    } catch (error) {
      console.error('[Intelligence] Predict no-shows error:', error);
      return [];
    }
  },

  /**
   * Generate squad health insights
   */
  async getSquadHealth(squadId: string): Promise<{
    healthScore: number;
    insights: Array<{ type: string; title: string; description: string; priority: 'high' | 'medium' | 'low'; recommendations?: string[] }>;
  }> {
    try {
      const insights: Array<{ type: string; title: string; description: string; priority: 'high' | 'medium' | 'low'; recommendations?: string[] }> = [];
      let healthScore = 100;

      // Check recent session attendance
      const { data: recentSessions } = await supabase
        .from('sessions')
        .select(`
          id,
          status,
          rsvps:session_rsvps(response)
        `)
        .eq('squad_id', squadId)
        .gte('scheduled_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .limit(10);

      if (recentSessions && recentSessions.length > 0) {
        const totalRsvps = recentSessions.reduce((sum: number, s: any) => sum + (s.rsvps?.length || 0), 0);
        const yesRsvps = recentSessions.reduce(
          (sum: number, s: any) => sum + (s.rsvps?.filter((r: any) => r.response === 'yes').length || 0),
          0
        );

        const attendanceRate = totalRsvps > 0 ? (yesRsvps / totalRsvps) * 100 : 0;

        if (attendanceRate < 50) {
          healthScore -= 30;
          insights.push({
            type: 'attendance',
            title: 'Taux de participation faible',
            description: `Seulement ${Math.round(attendanceRate)}% des membres confirment leur présence`,
            priority: 'high',
          });
        }
      }

      // Check message activity
      const { count: messageCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('squad_id', squadId)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if ((messageCount || 0) < 5) {
        healthScore -= 20;
        insights.push({
          type: 'engagement',
          title: 'Faible activité dans le chat',
          description: 'Moins de 5 messages cette semaine',
          priority: 'medium',
        });
      }

      // Check member activity (last active)
      const { data: members } = await supabase
        .from('squad_members')
        .select(`
          user_id,
          user:profiles(last_seen_at)
        `)
        .eq('squad_id', squadId);

      if (members && members.length > 0) {
        const now = new Date();
        const inactiveMembers = members.filter((m: any) => {
          if (!m.user?.last_seen_at) return true;
          const lastSeen = new Date(m.user.last_seen_at);
          const daysSinceActive = (now.getTime() - lastSeen.getTime()) / (1000 * 60 * 60 * 24);
          return daysSinceActive > 14;
        });

        if (inactiveMembers.length > members.length * 0.3) {
          healthScore -= 25;
          insights.push({
            type: 'member_activity',
            title: 'Membres inactifs',
            description: `${inactiveMembers.length} membre(s) inactif(s) depuis 2+ semaines`,
            priority: 'medium',
          });
        }
      }

      // Add recommendations based on insights
      insights.forEach(insight => {
        const recommendations: string[] = [];

        switch (insight.type) {
          case 'attendance':
            insight.recommendations = [
              'Proposez des créneaux plus flexibles',
              'Envoyez des rappels 24h avant',
              'Récompensez la régularité avec des badges',
            ];
            break;
          case 'engagement':
            insight.recommendations = [
              'Lancez des discussions sur les prochaines sessions',
              'Partagez du contenu (clips, actualités)',
              'Organisez des events sociaux',
            ];
            break;
          case 'member_activity':
            insight.recommendations = [
              'Contactez les membres inactifs',
              'Proposez des sessions adaptées à leurs horaires',
              'Créez des sous-groupes par disponibilité',
            ];
            break;
        }
      });

      return {
        healthScore: Math.max(0, healthScore),
        insights,
      };
    } catch (error) {
      console.error('[Intelligence] Squad health error:', error);
      return {
        healthScore: 50,
        insights: [],
      };
    }
  },

  /**
   * Generate smart session recommendations
   */
  async getSessionRecommendations(squadId: string): Promise<Array<{
    type: string;
    title: string;
    description: string;
    actionLabel: string;
    data?: any;
  }>> {
    const recommendations: Array<{
      type: string;
      title: string;
      description: string;
      actionLabel: string;
      data?: any;
    }> = [];

    try {
      // Get optimal times
      const optimalTimes = await this.getOptimalTimes(squadId);

      if (optimalTimes.confidence > 30) {
        recommendations.push({
          type: 'optimal_time',
          title: 'Créneau optimal détecté',
          description: `${optimalTimes.bestDay} à ${optimalTimes.bestTime} - ${optimalTimes.attendanceRate}% de présence historique`,
          actionLabel: 'Créer une session',
          data: { day: optimalTimes.bestDay, time: optimalTimes.bestTime },
        });
      }

      // Check for upcoming weekend
      const today = new Date();
      const daysUntilWeekend = (6 - today.getDay() + 7) % 7;

      if (daysUntilWeekend <= 3) {
        recommendations.push({
          type: 'weekend_reminder',
          title: 'Weekend à venir',
          description: 'Le weekend approche, c\'est le moment idéal pour planifier une session !',
          actionLabel: 'Proposer une session',
        });
      }

      // Check session frequency
      const { data: recentSessions } = await supabase
        .from('sessions')
        .select('id')
        .eq('squad_id', squadId)
        .gte('scheduled_date', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (!recentSessions || recentSessions.length < 2) {
        recommendations.push({
          type: 'activity_boost',
          title: 'Boost d\'activité conseillé',
          description: 'Moins de 2 sessions ces 2 dernières semaines. Gardez le momentum !',
          actionLabel: 'Créer une session',
        });
      }

      return recommendations;
    } catch (error) {
      console.error('[Intelligence] Session recommendations error:', error);
      return recommendations;
    }
  },

  /**
   * Calculate member cohesion score
   */
  async getMemberCohesion(squadId: string): Promise<{
    score: number;
    topPairs: Array<{ user1: string; user2: string; sessionsTogerther: number }>;
    suggestions: string[];
  }> {
    try {
      // Get sessions with attendees
      const { data: sessions } = await supabase
        .from('sessions')
        .select(`
          id,
          rsvps:session_rsvps(user_id, response)
        `)
        .eq('squad_id', squadId)
        .eq('status', 'completed')
        .limit(20);

      if (!sessions || sessions.length === 0) {
        return {
          score: 50,
          topPairs: [],
          suggestions: ['Organisez plus de sessions pour mesurer la cohésion'],
        };
      }

      // Calculate co-attendance matrix
      const coAttendance: Record<string, Record<string, number>> = {};

      sessions.forEach((session: any) => {
        const yesMembers = session.rsvps
          ?.filter((r: any) => r.response === 'yes')
          .map((r: any) => r.user_id) || [];

        yesMembers.forEach((userId1: string) => {
          yesMembers.forEach((userId2: string) => {
            if (userId1 >= userId2) return;

            if (!coAttendance[userId1]) coAttendance[userId1] = {};
            if (!coAttendance[userId1][userId2]) coAttendance[userId1][userId2] = 0;
            coAttendance[userId1][userId2]++;
          });
        });
      });

      // Find top pairs
      const pairs: Array<{ user1: string; user2: string; sessionsTogerther: number }> = [];
      Object.entries(coAttendance).forEach(([user1, users]) => {
        Object.entries(users).forEach(([user2, count]) => {
          pairs.push({ user1, user2, sessionsTogerther: count });
        });
      });

      const topPairs = pairs
        .sort((a, b) => b.sessionsTogerther - a.sessionsTogerther)
        .slice(0, 5);

      // Calculate cohesion score (based on average co-attendance)
      const avgCoAttendance = pairs.length > 0
        ? pairs.reduce((sum, p) => sum + p.sessionsTogerther, 0) / pairs.length
        : 0;

      const cohesionScore = Math.min(100, Math.round((avgCoAttendance / sessions.length) * 100 * 2));

      const suggestions: string[] = [];
      if (cohesionScore < 40) {
        suggestions.push('Organisez des sessions plus fréquentes pour renforcer les liens');
      }
      if (cohesionScore >= 40 && cohesionScore < 70) {
        suggestions.push('Essayez des formats de jeu différents pour mixer les interactions');
      }
      if (cohesionScore >= 70) {
        suggestions.push('Excellente cohésion ! Maintenez le rythme actuel');
      }

      return {
        score: cohesionScore,
        topPairs,
        suggestions,
      };
    } catch (error) {
      console.error('[Intelligence] Member cohesion error:', error);
      return {
        score: 50,
        topPairs: [],
        suggestions: [],
      };
    }
  },
};

export default intelligenceEngine;
