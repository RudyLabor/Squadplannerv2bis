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
    insights: Array<{ type: string; title: string; description: string; priority: 'high' | 'medium' | 'low' }>;
  }> {
    try {
      const insights: Array<{ type: string; title: string; description: string; priority: 'high' | 'medium' | 'low' }> = [];
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
};

export default intelligenceEngine;
