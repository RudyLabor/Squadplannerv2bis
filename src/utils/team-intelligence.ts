/**
 * Team Intelligence - Phase 5 Advanced AI
 *
 * Provides AI-driven insights for:
 * - Optimal team composition
 * - Natural leader detection
 * - Squad split/merge recommendations
 * - Advanced coaching suggestions
 */

import { supabase } from '@/lib/supabase';

// Types
export interface MemberAnalysis {
  userId: string;
  username: string;
  avatarUrl?: string;
  reliabilityScore: number;
  attendanceRate: number;
  punctualityRate: number;
  engagementScore: number;
  leadershipScore: number;
  socialScore: number;
  consistencyScore: number;
  role: 'leader' | 'co_leader' | 'member';
  archetype: PlayerArchetype;
  strengths: string[];
  improvements: string[];
}

export interface TeamComposition {
  squadId: string;
  squadName: string;
  overallHealth: number; // 0-100
  balanceScore: number; // 0-100
  diversityScore: number; // 0-100
  members: MemberAnalysis[];
  recommendations: TeamRecommendation[];
  optimalSize: { min: number; max: number; current: number };
  archetypeDistribution: Record<PlayerArchetype, number>;
}

export interface TeamRecommendation {
  type: 'split' | 'merge' | 'recruit' | 'promote' | 'schedule' | 'engagement';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  actionable: boolean;
  targetUserId?: string;
  targetSquadId?: string;
}

export interface LeaderCandidate {
  userId: string;
  username: string;
  avatarUrl?: string;
  leadershipScore: number;
  qualities: LeaderQuality[];
  currentRole: string;
  recommendation: string;
}

export interface LeaderQuality {
  name: string;
  score: number;
  description: string;
  icon: string;
}

export type PlayerArchetype =
  | 'anchor'      // Very reliable, always shows up
  | 'catalyst'    // Increases team engagement
  | 'organizer'   // Tends to create sessions
  | 'flexible'    // Adapts to any schedule
  | 'specialist'  // Shows up for specific games only
  | 'casual'      // Lower engagement but consistent
  | 'rising_star' // New but improving quickly
  | 'veteran';    // Long-time member with history

/**
 * Calculate member analysis from raw data
 */
function calculateMemberAnalysis(
  member: any,
  sessions: any[],
  checkIns: any[],
  messages: any[]
): MemberAnalysis {
  const userId = member.user_id;

  // Calculate attendance rate
  const memberSessions = sessions.filter(s =>
    s.session_rsvps?.some((r: any) => r.user_id === userId)
  );
  const attendedSessions = memberSessions.filter(s =>
    s.session_rsvps?.some((r: any) => r.user_id === userId && r.response === 'yes')
  );
  const attendanceRate = memberSessions.length > 0
    ? (attendedSessions.length / memberSessions.length) * 100
    : 100;

  // Calculate punctuality rate
  const userCheckIns = checkIns.filter(c => c.user_id === userId);
  const onTimeCheckIns = userCheckIns.filter(c =>
    c.status === 'checked_in' || c.status === 'on_my_way'
  );
  const punctualityRate = userCheckIns.length > 0
    ? (onTimeCheckIns.length / userCheckIns.length) * 100
    : 100;

  // Calculate engagement score (messages, session creation)
  const userMessages = messages.filter(m => m.user_id === userId);
  const sessionsCreated = sessions.filter(s => s.created_by === userId);
  const engagementScore = Math.min(100,
    (userMessages.length * 2) + (sessionsCreated.length * 10) + (attendedSessions.length * 5)
  );

  // Calculate social score (interactions with others)
  const uniqueInteractions = new Set(userMessages.map(m => m.created_at?.split('T')[0]));
  const socialScore = Math.min(100, uniqueInteractions.size * 5);

  // Calculate consistency score
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const recentActivity = attendedSessions.filter(s =>
    new Date(s.scheduled_date) > lastMonth
  );
  const consistencyScore = Math.min(100, recentActivity.length * 15);

  // Calculate leadership score
  const leadershipScore = calculateLeadershipScore({
    isLeader: member.role === 'leader' || member.role === 'co_leader',
    sessionsCreated: sessionsCreated.length,
    messagesCount: userMessages.length,
    attendanceRate,
    punctualityRate,
    memberSince: member.joined_at,
  });

  // Determine archetype
  const archetype = determineArchetype({
    attendanceRate,
    punctualityRate,
    engagementScore,
    sessionsCreated: sessionsCreated.length,
    memberSince: member.joined_at,
    totalSessions: memberSessions.length,
  });

  // Calculate overall reliability
  const reliabilityScore = (attendanceRate * 0.4) + (punctualityRate * 0.3) + (consistencyScore * 0.3);

  // Determine strengths and improvements
  const { strengths, improvements } = analyzeStrengthsAndImprovements({
    attendanceRate,
    punctualityRate,
    engagementScore,
    socialScore,
    consistencyScore,
    leadershipScore,
  });

  return {
    userId,
    username: member.profiles?.username || member.profiles?.display_name || 'Unknown',
    avatarUrl: member.profiles?.avatar_url,
    reliabilityScore: Math.round(reliabilityScore),
    attendanceRate: Math.round(attendanceRate),
    punctualityRate: Math.round(punctualityRate),
    engagementScore: Math.round(engagementScore),
    leadershipScore: Math.round(leadershipScore),
    socialScore: Math.round(socialScore),
    consistencyScore: Math.round(consistencyScore),
    role: member.role || 'member',
    archetype,
    strengths,
    improvements,
  };
}

/**
 * Calculate leadership score
 */
function calculateLeadershipScore(data: {
  isLeader: boolean;
  sessionsCreated: number;
  messagesCount: number;
  attendanceRate: number;
  punctualityRate: number;
  memberSince: string;
}): number {
  let score = 0;

  // Base score from current role
  if (data.isLeader) score += 20;

  // Initiative (creating sessions)
  score += Math.min(30, data.sessionsCreated * 5);

  // Communication
  score += Math.min(20, data.messagesCount * 0.5);

  // Leading by example
  score += (data.attendanceRate / 100) * 15;
  score += (data.punctualityRate / 100) * 10;

  // Tenure bonus
  const monthsAsMember = Math.floor(
    (Date.now() - new Date(data.memberSince).getTime()) / (1000 * 60 * 60 * 24 * 30)
  );
  score += Math.min(5, monthsAsMember);

  return Math.min(100, score);
}

/**
 * Determine player archetype
 */
function determineArchetype(data: {
  attendanceRate: number;
  punctualityRate: number;
  engagementScore: number;
  sessionsCreated: number;
  memberSince: string;
  totalSessions: number;
}): PlayerArchetype {
  const monthsAsMember = Math.floor(
    (Date.now() - new Date(data.memberSince).getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  // Anchor: Very reliable
  if (data.attendanceRate >= 90 && data.punctualityRate >= 90) {
    return 'anchor';
  }

  // Organizer: Creates sessions
  if (data.sessionsCreated >= 5) {
    return 'organizer';
  }

  // Catalyst: High engagement
  if (data.engagementScore >= 80) {
    return 'catalyst';
  }

  // Veteran: Long-time member
  if (monthsAsMember >= 6 && data.totalSessions >= 20) {
    return 'veteran';
  }

  // Rising Star: New but improving
  if (monthsAsMember <= 2 && data.attendanceRate >= 70) {
    return 'rising_star';
  }

  // Flexible: Good attendance, varies timing
  if (data.attendanceRate >= 70 && data.punctualityRate < 80) {
    return 'flexible';
  }

  // Casual: Lower but consistent
  if (data.attendanceRate >= 50 && data.attendanceRate < 70) {
    return 'casual';
  }

  // Specialist: Default
  return 'specialist';
}

/**
 * Analyze strengths and areas for improvement
 */
function analyzeStrengthsAndImprovements(scores: {
  attendanceRate: number;
  punctualityRate: number;
  engagementScore: number;
  socialScore: number;
  consistencyScore: number;
  leadershipScore: number;
}): { strengths: string[]; improvements: string[] } {
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (scores.attendanceRate >= 85) {
    strengths.push('Présence exemplaire');
  } else if (scores.attendanceRate < 60) {
    improvements.push('Améliorer la présence aux sessions');
  }

  if (scores.punctualityRate >= 90) {
    strengths.push('Toujours à l\'heure');
  } else if (scores.punctualityRate < 70) {
    improvements.push('Arriver plus souvent à l\'heure');
  }

  if (scores.engagementScore >= 70) {
    strengths.push('Très engagé');
  } else if (scores.engagementScore < 30) {
    improvements.push('Participer davantage');
  }

  if (scores.socialScore >= 60) {
    strengths.push('Bon communicant');
  }

  if (scores.consistencyScore >= 70) {
    strengths.push('Régulier');
  } else if (scores.consistencyScore < 40) {
    improvements.push('Plus de régularité');
  }

  if (scores.leadershipScore >= 60) {
    strengths.push('Qualités de leader');
  }

  return { strengths, improvements };
}

/**
 * Generate team recommendations
 */
function generateTeamRecommendations(
  members: MemberAnalysis[],
  squadData: any
): TeamRecommendation[] {
  const recommendations: TeamRecommendation[] = [];

  // Check team size
  const currentSize = members.length;
  if (currentSize < 4) {
    recommendations.push({
      type: 'recruit',
      priority: 'high',
      title: 'Recruter de nouveaux membres',
      description: `Votre squad n'a que ${currentSize} membres. Une squad idéale a entre 5 et 8 membres.`,
      impact: 'Améliore la diversité des horaires et la résilience de l\'équipe',
      actionable: true,
    });
  } else if (currentSize > 10) {
    recommendations.push({
      type: 'split',
      priority: 'medium',
      title: 'Envisager de diviser la squad',
      description: `Avec ${currentSize} membres, il peut être difficile de coordonner tout le monde.`,
      impact: 'Permet des sessions plus régulières et une meilleure coordination',
      actionable: true,
    });
  }

  // Check for leadership gap
  const leaders = members.filter(m => m.role === 'leader' || m.role === 'co_leader');
  const potentialLeaders = members.filter(m => m.leadershipScore >= 70 && m.role === 'member');

  if (leaders.length < 2 && potentialLeaders.length > 0) {
    const candidate = potentialLeaders[0];
    recommendations.push({
      type: 'promote',
      priority: 'medium',
      title: `Promouvoir ${candidate.username}`,
      description: `${candidate.username} montre d'excellentes qualités de leadership avec un score de ${candidate.leadershipScore}%.`,
      impact: 'Renforce la structure de l\'équipe et la répartition des responsabilités',
      actionable: true,
      targetUserId: candidate.userId,
    });
  }

  // Check for low engagement members
  const lowEngagement = members.filter(m => m.engagementScore < 30);
  if (lowEngagement.length > 0) {
    recommendations.push({
      type: 'engagement',
      priority: 'medium',
      title: 'Réengager les membres inactifs',
      description: `${lowEngagement.length} membre(s) ont un faible engagement. Proposez des sessions à des horaires variés.`,
      impact: 'Améliore la cohésion et l\'activité globale de la squad',
      actionable: true,
    });
  }

  // Check schedule optimization
  const avgAttendance = members.reduce((sum, m) => sum + m.attendanceRate, 0) / members.length;
  if (avgAttendance < 70) {
    recommendations.push({
      type: 'schedule',
      priority: 'high',
      title: 'Optimiser les horaires',
      description: 'Le taux de participation moyen est sous les 70%. Utilisez la heatmap pour trouver des créneaux optimaux.',
      impact: 'Augmente significativement la participation aux sessions',
      actionable: true,
    });
  }

  return recommendations;
}

/**
 * Main API
 */
export const teamIntelligenceAPI = {
  /**
   * Get full team composition analysis
   */
  async analyzeSquad(squadId: string): Promise<TeamComposition> {
    // Fetch squad data
    const { data: squad, error: squadError } = await supabase
      .from('squads')
      .select('*')
      .eq('id', squadId)
      .single();

    if (squadError) throw squadError;

    // Fetch members with profiles
    const { data: members, error: membersError } = await supabase
      .from('squad_members')
      .select('*, profiles(*)')
      .eq('squad_id', squadId);

    if (membersError) throw membersError;

    // Fetch recent sessions (last 3 months)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('*, session_rsvps(*)')
      .eq('squad_id', squadId)
      .gte('scheduled_date', threeMonthsAgo.toISOString().split('T')[0]);

    if (sessionsError) throw sessionsError;

    // Fetch check-ins
    const sessionIds = (sessions || []).map(s => s.id);
    const { data: checkIns } = await supabase
      .from('session_check_ins')
      .select('*')
      .in('session_id', sessionIds);

    // Fetch messages (last month)
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('squad_id', squadId)
      .gte('created_at', oneMonthAgo.toISOString());

    // Analyze each member
    const memberAnalyses = (members || []).map(member =>
      calculateMemberAnalysis(member, sessions || [], checkIns || [], messages || [])
    );

    // Calculate archetype distribution
    const archetypeDistribution = memberAnalyses.reduce((acc, m) => {
      acc[m.archetype] = (acc[m.archetype] || 0) + 1;
      return acc;
    }, {} as Record<PlayerArchetype, number>);

    // Calculate overall health
    const avgReliability = memberAnalyses.reduce((sum, m) => sum + m.reliabilityScore, 0) / memberAnalyses.length;
    const avgEngagement = memberAnalyses.reduce((sum, m) => sum + m.engagementScore, 0) / memberAnalyses.length;
    const overallHealth = (avgReliability * 0.6) + (avgEngagement * 0.4);

    // Calculate balance score (diversity of archetypes)
    const uniqueArchetypes = Object.keys(archetypeDistribution).length;
    const balanceScore = Math.min(100, (uniqueArchetypes / 5) * 100);

    // Calculate diversity score
    const diversityScore = Math.min(100,
      (memberAnalyses.length >= 5 ? 50 : memberAnalyses.length * 10) +
      (uniqueArchetypes * 10)
    );

    // Generate recommendations
    const recommendations = generateTeamRecommendations(memberAnalyses, squad);

    return {
      squadId,
      squadName: squad.name,
      overallHealth: Math.round(overallHealth),
      balanceScore: Math.round(balanceScore),
      diversityScore: Math.round(diversityScore),
      members: memberAnalyses,
      recommendations,
      optimalSize: { min: 5, max: 8, current: memberAnalyses.length },
      archetypeDistribution,
    };
  },

  /**
   * Detect natural leaders in a squad
   */
  async detectLeaders(squadId: string): Promise<LeaderCandidate[]> {
    const composition = await this.analyzeSquad(squadId);

    return composition.members
      .filter(m => m.leadershipScore >= 50)
      .sort((a, b) => b.leadershipScore - a.leadershipScore)
      .map(m => {
        const qualities: LeaderQuality[] = [];

        if (m.attendanceRate >= 85) {
          qualities.push({
            name: 'Présence exemplaire',
            score: m.attendanceRate,
            description: 'Toujours présent aux sessions',
            icon: '✅',
          });
        }

        if (m.punctualityRate >= 90) {
          qualities.push({
            name: 'Ponctualité',
            score: m.punctualityRate,
            description: 'Arrive toujours à l\'heure',
            icon: '⏰',
          });
        }

        if (m.engagementScore >= 60) {
          qualities.push({
            name: 'Engagement',
            score: m.engagementScore,
            description: 'Participe activement',
            icon: '🔥',
          });
        }

        if (m.socialScore >= 50) {
          qualities.push({
            name: 'Communication',
            score: m.socialScore,
            description: 'Communique régulièrement',
            icon: '💬',
          });
        }

        let recommendation = '';
        if (m.role === 'leader') {
          recommendation = 'Leader actuel - Continue d\'exceller';
        } else if (m.role === 'co_leader') {
          recommendation = 'Co-leader efficace';
        } else if (m.leadershipScore >= 80) {
          recommendation = 'Excellent candidat pour promotion';
        } else if (m.leadershipScore >= 60) {
          recommendation = 'Potentiel de leadership à développer';
        } else {
          recommendation = 'Qualités émergentes';
        }

        return {
          userId: m.userId,
          username: m.username,
          avatarUrl: m.avatarUrl,
          leadershipScore: m.leadershipScore,
          qualities,
          currentRole: m.role,
          recommendation,
        };
      });
  },

  /**
   * Get archetype description
   */
  getArchetypeInfo(archetype: PlayerArchetype): { name: string; description: string; emoji: string } {
    const archetypes = {
      anchor: {
        name: 'L\'Ancre',
        description: 'Toujours présent et fiable. La fondation de l\'équipe.',
        emoji: '⚓',
      },
      catalyst: {
        name: 'Le Catalyseur',
        description: 'Motive les autres et augmente l\'énergie du groupe.',
        emoji: '⚡',
      },
      organizer: {
        name: 'L\'Organisateur',
        description: 'Prend l\'initiative de créer des sessions.',
        emoji: '📋',
      },
      flexible: {
        name: 'Le Flexible',
        description: 'S\'adapte à tous les horaires.',
        emoji: '🌊',
      },
      specialist: {
        name: 'Le Spécialiste',
        description: 'Présent pour certains jeux ou créneaux.',
        emoji: '🎯',
      },
      casual: {
        name: 'Le Casual',
        description: 'Engagement régulier mais modéré.',
        emoji: '🎮',
      },
      rising_star: {
        name: 'L\'Étoile Montante',
        description: 'Nouveau membre prometteur.',
        emoji: '⭐',
      },
      veteran: {
        name: 'Le Vétéran',
        description: 'Membre de longue date avec expérience.',
        emoji: '🏆',
      },
    };

    return archetypes[archetype] || archetypes.specialist;
  },
};

export default teamIntelligenceAPI;
