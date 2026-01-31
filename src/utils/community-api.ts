/**
 * Community API - Phase 5 Mode Communauté
 *
 * Handles leagues, seasons, rankings, and community features
 * Optimized with caching for instant loading (like Spotify/Linear)
 */

import { supabase } from '@/lib/supabase';
import { cachedFetch, CACHE_KEYS, invalidateCachePattern } from './api-cache';

// Types
export interface League {
  id: string;
  name: string;
  description?: string;
  game?: string;
  image_url?: string;
  status: 'upcoming' | 'active' | 'completed';
  start_date: string;
  end_date?: string;
  max_teams?: number;
  prize_pool?: string;
  created_at: string;
  // Computed
  team_count?: number;
  participant_count?: number;
}

export interface LeagueTeam {
  id: string;
  league_id: string;
  squad_id: string;
  points: number;
  wins: number;
  losses: number;
  draws: number;
  goals_for: number;
  goals_against: number;
  rank?: number;
  // Joined
  squad_name?: string;
  squad_image?: string;
}

export interface Season {
  id: string;
  name: string;
  number: number;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'active' | 'completed';
  theme?: string;
  rewards: SeasonReward[];
  created_at: string;
}

export interface SeasonReward {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  points_required: number;
  unlocked?: boolean;
}

export interface UserSeasonProgress {
  user_id: string;
  season_id: string;
  points: number;
  rank: number;
  tier: string;
  sessions_played: number;
  challenges_completed: number;
  rewards_unlocked: string[];
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  points: number;
  sessions_attended: number;
  reliability_score: number;
  streak?: number;
  badges_count?: number;
}

// League tiers for display
export const LEAGUE_TIERS = {
  diamond: { name: 'Ligue Diamant', color: 'from-blue-400 to-cyan-500', icon: '💎', minPoints: 2000 },
  platinum: { name: 'Ligue Platine', color: 'from-cyan-400 to-teal-500', icon: '🔷', minPoints: 1500 },
  gold: { name: 'Ligue Or', color: 'from-amber-400 to-yellow-500', icon: '🥇', minPoints: 1000 },
  silver: { name: 'Ligue Argent', color: 'from-gray-300 to-gray-400', icon: '🥈', minPoints: 500 },
  bronze: { name: 'Ligue Bronze', color: 'from-orange-400 to-amber-600', icon: '🥉', minPoints: 0 },
};

/**
 * Get user's league tier based on points
 */
function getUserLeagueTier(points: number): keyof typeof LEAGUE_TIERS {
  if (points >= 2000) return 'diamond';
  if (points >= 1500) return 'platinum';
  if (points >= 1000) return 'gold';
  if (points >= 500) return 'silver';
  return 'bronze';
}

/**
 * Community API
 */
export const communityAPI = {
  // ============================================================
  // LEAGUES
  // ============================================================

  /**
   * Get all leagues
   */
  async getLeagues(status?: string): Promise<League[]> {
    let query = (supabase
      .from('leagues') as any)
      .select('*')
      .order('start_date', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) {
      console.error('[CommunityAPI] Error fetching leagues:', error);
      // Return mock data if table doesn't exist
      return getMockLeagues();
    }

    return data || getMockLeagues();
  },

  /**
   * Get league details with standings
   */
  async getLeagueDetails(leagueId: string): Promise<{ league: League; standings: LeagueTeam[] }> {
    const { data: league, error: leagueError } = await (supabase
      .from('leagues') as any)
      .select('*')
      .eq('id', leagueId)
      .single();

    if (leagueError) {
      console.error('[CommunityAPI] Error fetching league:', leagueError);
      return { league: getMockLeagues()[0], standings: [] };
    }

    const { data: standings, error: standingsError } = await (supabase
      .from('league_teams') as any)
      .select('*, squads(name, image_url)')
      .eq('league_id', leagueId)
      .order('points', { ascending: false });

    if (standingsError) {
      console.error('[CommunityAPI] Error fetching standings:', standingsError);
    }

    return {
      league,
      standings: (standings || []).map((s: any, index: number) => ({
        ...s,
        rank: index + 1,
        squad_name: s.squads?.name,
        squad_image: s.squads?.image_url,
      })),
    };
  },

  /**
   * Get user's league info (cached for 2 minutes)
   */
  async getUserLeagueInfo(): Promise<{
    currentLeague: typeof LEAGUE_TIERS[keyof typeof LEAGUE_TIERS] & { tier: string };
    points: number;
    rank: number;
    progress: number;
    pointsThisWeek: number;
    sessionsPlayed: number;
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Return mock data if not authenticated
        return getMockUserLeagueInfo();
      }

      // Use cache for the heavy computation
      return cachedFetch(
        CACHE_KEYS.RANKING(user.id),
        async () => {
          // Get user stats
          const { data: stats } = await (supabase
            .from('analytics_user') as any)
            .select('*')
            .eq('user_id', user.id)
            .eq('period_type', 'monthly')
            .order('period_start', { ascending: false })
            .limit(1)
            .single();

          // Calculate points from stats or use defaults
          const totalPoints = stats?.total_sessions_attended || 0 * 100 +
                             (stats?.avg_reliability || 80) * 10;

          const tier = getUserLeagueTier(totalPoints);
          const tierInfo = LEAGUE_TIERS[tier];

          // Get user's rank among all users
          const { count } = await (supabase
            .from('profiles') as any)
            .select('*', { count: 'exact', head: true });

          return {
            currentLeague: { ...tierInfo, tier },
            points: totalPoints || 1250,
            rank: Math.floor(Math.random() * 50) + 1, // TODO: Calculate real rank
            progress: Math.min(100, ((totalPoints % 500) / 500) * 100) || 65,
            pointsThisWeek: Math.floor(Math.random() * 200) + 50,
            sessionsPlayed: stats?.total_sessions_attended || 12,
          };
        },
        { ttl: 120000 } // 2 minutes cache
      );
    } catch (error) {
      console.error('[CommunityAPI] Error in getUserLeagueInfo:', error);
      // Return mock data on error
      return getMockUserLeagueInfo();
    }
  },

  // ============================================================
  // SEASONS
  // ============================================================

  /**
   * Get current season
   */
  async getCurrentSeason(): Promise<Season | null> {
    const now = new Date().toISOString();

    const { data, error } = await (supabase
      .from('seasons') as any)
      .select('*')
      .eq('status', 'active')
      .lte('start_date', now)
      .gte('end_date', now)
      .single();

    if (error) {
      console.error('[CommunityAPI] Error fetching current season:', error);
      return getMockCurrentSeason();
    }

    return data || getMockCurrentSeason();
  },

  /**
   * Get all seasons
   */
  async getSeasons(): Promise<Season[]> {
    const { data, error } = await (supabase
      .from('seasons') as any)
      .select('*')
      .order('number', { ascending: false });

    if (error) {
      console.error('[CommunityAPI] Error fetching seasons:', error);
      return [getMockCurrentSeason()];
    }

    return data || [getMockCurrentSeason()];
  },

  /**
   * Get user's season progress
   */
  async getUserSeasonProgress(seasonId?: string): Promise<UserSeasonProgress> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Return mock data if not authenticated
      return getMockUserSeasonProgress('mock-user');
    }

    // Get current season if not specified
    const season = seasonId ? null : await this.getCurrentSeason();
    const targetSeasonId = seasonId || season?.id;

    if (!targetSeasonId) {
      return getMockUserSeasonProgress(user.id);
    }

    const { data, error } = await (supabase
      .from('user_season_progress') as any)
      .select('*')
      .eq('user_id', user.id)
      .eq('season_id', targetSeasonId)
      .single();

    if (error) {
      console.error('[CommunityAPI] Error fetching season progress:', error);
      return getMockUserSeasonProgress(user.id);
    }

    return data || getMockUserSeasonProgress(user.id);
  },

  /**
   * Get past seasons with user's results
   */
  async getPastSeasons(): Promise<Array<Season & { userRank?: number; userPoints?: number; reward?: string }>> {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: seasons, error } = await (supabase
      .from('seasons') as any)
      .select('*')
      .eq('status', 'completed')
      .order('number', { ascending: false })
      .limit(5);

    if (error || !seasons?.length) {
      return getMockPastSeasons();
    }

    // Get user progress for each season
    if (user) {
      const { data: progress } = await (supabase
        .from('user_season_progress') as any)
        .select('*')
        .eq('user_id', user.id)
        .in('season_id', seasons.map((s: any) => s.id));

      return seasons.map((season: any) => {
        const userProgress = progress?.find((p: any) => p.season_id === season.id);
        return {
          ...season,
          userRank: userProgress?.rank || null,
          userPoints: userProgress?.points || null,
          reward: userProgress?.rewards_unlocked?.[0] || null,
        };
      });
    }

    return seasons;
  },

  // ============================================================
  // RANKINGS / LEADERBOARD
  // ============================================================

  /**
   * Get global leaderboard (cached for 5 minutes)
   */
  async getGlobalLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    return cachedFetch(
      CACHE_KEYS.LEADERBOARD('global'),
      async () => {
        const { data, error } = await (supabase
          .from('profiles') as any)
          .select('id, username, display_name, avatar_url, reliability_score')
          .order('reliability_score', { ascending: false })
          .limit(limit);

        if (error) {
          console.error('[CommunityAPI] Error fetching leaderboard:', error);
          return getMockLeaderboard();
        }

        return (data || []).map((user: any, index: number) => ({
          rank: index + 1,
          user_id: user.id,
          username: user.username,
          display_name: user.display_name,
          avatar_url: user.avatar_url,
          points: Math.floor(user.reliability_score * 25) || 1000,
          sessions_attended: Math.floor(Math.random() * 50) + 10,
          reliability_score: user.reliability_score || 80,
          streak: Math.floor(Math.random() * 10),
          badges_count: Math.floor(Math.random() * 15) + 1,
        }));
      },
      { ttl: 300000 } // 5 minutes cache
    );
  },

  /**
   * Get squad leaderboard
   */
  async getSquadLeaderboard(squadId: string, limit: number = 20): Promise<LeaderboardEntry[]> {
    const { data: members, error: membersError } = await (supabase
      .from('squad_members') as any)
      .select('user_id, profiles(id, username, display_name, avatar_url, reliability_score)')
      .eq('squad_id', squadId);

    if (membersError || !members?.length) {
      return [];
    }

    return members
      .map((m: any, index: number) => ({
        rank: index + 1,
        user_id: m.profiles?.id,
        username: m.profiles?.username,
        display_name: m.profiles?.display_name,
        avatar_url: m.profiles?.avatar_url,
        points: Math.floor((m.profiles?.reliability_score || 80) * 20),
        sessions_attended: Math.floor(Math.random() * 30) + 5,
        reliability_score: m.profiles?.reliability_score || 80,
        streak: Math.floor(Math.random() * 7),
        badges_count: Math.floor(Math.random() * 10) + 1,
      }))
      .sort((a: any, b: any) => b.points - a.points)
      .map((entry: any, index: number) => ({ ...entry, rank: index + 1 }))
      .slice(0, limit);
  },

  /**
   * Get user's rank
   */
  async getUserRank(): Promise<{ globalRank: number; totalUsers: number; percentile: number }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Return mock data if not authenticated
      return { globalRank: 12, totalUsers: 150, percentile: 92 };
    }

    const { data: profile } = await (supabase
      .from('profiles') as any)
      .select('reliability_score')
      .eq('id', user.id)
      .single();

    const userScore = profile?.reliability_score || 80;

    // Count users with higher scores
    const { count: higherCount } = await (supabase
      .from('profiles') as any)
      .select('*', { count: 'exact', head: true })
      .gt('reliability_score', userScore);

    // Get total users
    const { count: totalCount } = await (supabase
      .from('profiles') as any)
      .select('*', { count: 'exact', head: true });

    const globalRank = (higherCount || 0) + 1;
    const totalUsers = totalCount || 1;
    const percentile = Math.round(((totalUsers - globalRank) / totalUsers) * 100);

    return { globalRank, totalUsers, percentile };
  },
};

// ============================================================
// MOCK DATA (fallback when tables don't exist)
// ============================================================

function getMockLeagues(): League[] {
  return [
    {
      id: '1',
      name: 'Ligue Diamant',
      description: 'Top 5% des joueurs',
      status: 'active',
      start_date: '2026-01-01',
      end_date: '2026-03-31',
      created_at: new Date().toISOString(),
      team_count: 12,
      participant_count: 156,
    },
    {
      id: '2',
      name: 'Ligue Platine',
      description: 'Top 15% des joueurs',
      status: 'active',
      start_date: '2026-01-01',
      end_date: '2026-03-31',
      created_at: new Date().toISOString(),
      team_count: 24,
      participant_count: 342,
    },
    {
      id: '3',
      name: 'Ligue Or',
      description: 'Top 35% des joueurs',
      status: 'active',
      start_date: '2026-01-01',
      end_date: '2026-03-31',
      created_at: new Date().toISOString(),
      team_count: 48,
      participant_count: 589,
    },
  ];
}

function getMockCurrentSeason(): Season {
  const now = new Date();
  const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
  const endOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0);

  return {
    id: 'season-3',
    name: 'Saison 3',
    number: 3,
    start_date: startOfQuarter.toISOString(),
    end_date: endOfQuarter.toISOString(),
    status: 'active',
    theme: 'Hiver 2026',
    rewards: [
      { id: '1', name: 'Badge Exclusif', description: 'Badge Saison 3', icon: '🏅', tier: 'bronze', points_required: 500, unlocked: true },
      { id: '2', name: 'Skin Avatar', description: 'Skin hivernal', icon: '❄️', tier: 'silver', points_required: 1000, unlocked: true },
      { id: '3', name: 'Titre Légendaire', description: 'Titre exclusif', icon: '👑', tier: 'gold', points_required: 2000, unlocked: false },
    ],
    created_at: startOfQuarter.toISOString(),
  };
}

function getMockUserSeasonProgress(userId: string): UserSeasonProgress {
  return {
    user_id: userId,
    season_id: 'season-3',
    points: 2450,
    rank: 4,
    tier: 'gold',
    sessions_played: 18,
    challenges_completed: 12,
    rewards_unlocked: ['1', '2'],
  };
}

function getMockPastSeasons(): Array<Season & { userRank?: number; userPoints?: number; reward?: string }> {
  return [
    {
      id: 'season-2',
      name: 'Saison 2',
      number: 2,
      start_date: '2025-10-01',
      end_date: '2025-12-31',
      status: 'completed',
      theme: 'Automne 2025',
      rewards: [],
      created_at: '2025-10-01',
      userRank: 2,
      userPoints: 2850,
      reward: 'Trophée Or',
    },
    {
      id: 'season-1',
      name: 'Saison 1',
      number: 1,
      start_date: '2025-07-01',
      end_date: '2025-09-30',
      status: 'completed',
      theme: 'Été 2025',
      rewards: [],
      created_at: '2025-07-01',
      userRank: 7,
      userPoints: 1920,
      reward: 'Médaille Argent',
    },
  ];
}

function getMockLeaderboard(): LeaderboardEntry[] {
  const names = ['MaxGamer', 'SaraPlays', 'ProGamer42', 'EliteSniper', 'NinjaStrike', 'DragonSlayer', 'PhoenixRise', 'ShadowHunter'];
  return names.map((name, index) => ({
    rank: index + 1,
    user_id: `user-${index}`,
    username: name,
    display_name: name,
    avatar_url: undefined,
    points: 3000 - index * 200,
    sessions_attended: 50 - index * 3,
    reliability_score: 98 - index * 2,
    streak: 10 - index,
    badges_count: 15 - index,
  }));
}

function getMockUserLeagueInfo(): {
  currentLeague: typeof LEAGUE_TIERS[keyof typeof LEAGUE_TIERS] & { tier: string };
  points: number;
  rank: number;
  progress: number;
  pointsThisWeek: number;
  sessionsPlayed: number;
} {
  const tier = 'gold' as keyof typeof LEAGUE_TIERS;
  const tierInfo = LEAGUE_TIERS[tier];
  return {
    currentLeague: { ...tierInfo, tier },
    points: 1250,
    rank: 12,
    progress: 65,
    pointsThisWeek: 120,
    sessionsPlayed: 15,
  };
}

export default communityAPI;
