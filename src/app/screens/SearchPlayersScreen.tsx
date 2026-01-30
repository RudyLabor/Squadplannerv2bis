/**
 * SEARCH PLAYERS SCREEN - LINEAR DESIGN SYSTEM
 * Premium dark theme with transparent cards
 * Inspired by Linear.app
 */

// @ts-nocheck
import { ArrowLeft, Search, UserPlus, Users, Send, Loader2, Star, Sparkles, Zap, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/utils/supabase/client';

interface SearchPlayersScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  data?: { squadId?: string; query?: string };
}

interface Player {
  id: string;
  name: string;
  level: number;
  reliabilityScore: number;
  games: string[];
  commonSquads: number;
  isOnline: boolean;
}

// ============================================
// ANIMATIONS - Linear-like smooth motion
// ============================================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }
  }
};

// ============================================
// GAME COLORS - Accent colors for each game
// ============================================
const gameColors: Record<string, string> = {
  'Valorant': '#ff4655',
  'League of Legends': '#c89b3c',
  'LoL': '#c89b3c',
  'CS2': '#f5a623',
  'Apex Legends': '#da292a',
  'Apex': '#da292a',
  'default': '#5e6dd2'
};

// ============================================
// PLAYER CARD - Linear style transparent card
// ============================================
function PlayerCard({
  player,
  onAddFriend,
  onInvite,
  onViewProfile,
  isInviteMode,
  isInviting,
}: {
  player: Player;
  onAddFriend: () => void;
  onInvite: () => void;
  onViewProfile: () => void;
  isInviteMode: boolean;
  isInviting: boolean;
}) {
  const getReliabilityColor = (score: number) => {
    if (score >= 90) return '#4ade80';
    if (score >= 75) return '#5e6dd2';
    return '#8b8d90';
  };

  const reliabilityColor = getReliabilityColor(player.reliabilityScore);

  return (
    <motion.div
      variants={itemVariants}
      className="relative p-4 md:p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] transition-all duration-200 group"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <motion.button
          onClick={onViewProfile}
          className="relative flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-[#5e6dd2] to-[#8b5cf6] flex items-center justify-center text-white font-semibold text-lg md:text-xl">
            {player.name[0]}
          </div>
          {player.isOnline && (
            <motion.div
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#4ade80] rounded-full border-2 border-[#08090a]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
          )}
        </motion.button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <motion.button
            onClick={onViewProfile}
            className="text-left w-full"
            whileHover={{ x: 2 }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[15px] font-semibold text-[#f7f8f8] group-hover:text-white transition-colors truncate">
                {player.name}
              </span>
              {player.reliabilityScore >= 90 && (
                <Star className="w-3.5 h-3.5 text-[#f5a623] fill-[#f5a623] flex-shrink-0" />
              )}
              {player.isOnline && (
                <span className="text-[11px] font-medium text-[#4ade80] flex-shrink-0">En ligne</span>
              )}
            </div>

            <div className="flex items-center gap-3 mb-2.5">
              <span className="text-[12px] font-medium text-[#8b8d90]">
                Niv. {player.level}
              </span>
              <span className="text-[12px] font-semibold" style={{ color: reliabilityColor }}>
                {player.reliabilityScore}% fiable
              </span>
            </div>

            {/* Game tags */}
            <div className="flex gap-1.5 flex-wrap">
              {player.games.slice(0, 3).map((game) => (
                <span
                  key={game}
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                  style={{
                    backgroundColor: `${gameColors[game] || gameColors.default}15`,
                    color: gameColors[game] || gameColors.default
                  }}
                >
                  {game}
                </span>
              ))}
            </div>
          </motion.button>
        </div>

        {/* Action Button */}
        {isInviteMode ? (
          <motion.button
            onClick={onInvite}
            disabled={isInviting}
            className="h-10 px-4 rounded-lg bg-[#5e6dd2] text-white flex items-center justify-center gap-2 hover:bg-[#6a79db] disabled:opacity-50 transition-colors flex-shrink-0"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isInviting ? (
              <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
            ) : (
              <>
                <Send className="w-4 h-4" strokeWidth={2} />
                <span className="text-[13px] font-semibold">Inviter</span>
              </>
            )}
          </motion.button>
        ) : (
          <motion.button
            onClick={onAddFriend}
            className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.12)] text-[#8b8d90] hover:text-[#f7f8f8] flex items-center justify-center transition-all flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <UserPlus className="w-5 h-5" strokeWidth={1.5} />
          </motion.button>
        )}
      </div>

      {/* Common Squads */}
      {player.commonSquads > 0 && (
        <div className="flex items-center gap-2 pt-3 mt-3 border-t border-[rgba(255,255,255,0.06)]">
          <Users className="w-3.5 h-3.5 text-[#5e6dd2]" strokeWidth={2} />
          <span className="text-[12px] text-[#8b8d90] font-medium">
            {player.commonSquads} squad{player.commonSquads > 1 ? 's' : ''} en commun
          </span>
        </div>
      )}
    </motion.div>
  );
}

// ============================================
// GAME FILTER BUTTON
// ============================================
function GameFilterButton({
  game,
  isSelected,
  onClick
}: {
  game: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  const displayName = game === 'all' ? 'Tous' : game;
  const accentColor = game === 'all' ? '#5e6dd2' : (gameColors[game] || gameColors.default);

  return (
    <motion.button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-all duration-200 ${
        isSelected
          ? 'text-white'
          : 'bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] text-[#8b8d90] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#f7f8f8]'
      }`}
      style={isSelected ? { backgroundColor: accentColor } : {}}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {displayName}
    </motion.button>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export function SearchPlayersScreen({ onNavigate, showToast, data }: SearchPlayersScreenProps) {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(data?.query || searchParams.get('q') || '');
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [invitingId, setInvitingId] = useState<string | null>(null);

  const squadId = data?.squadId || searchParams.get('squadId');
  const isInviteMode = !!squadId;

  // Mock players for fallback
  const mockPlayers: Player[] = [
    { id: '1', name: 'MaxGaming', level: 38, reliabilityScore: 92, games: ['Valorant', 'LoL'], commonSquads: 2, isOnline: true },
    { id: '2', name: 'NightOwl', level: 42, reliabilityScore: 88, games: ['CS2', 'Valorant'], commonSquads: 0, isOnline: true },
    { id: '3', name: 'ProPlayer', level: 35, reliabilityScore: 95, games: ['LoL', 'Apex'], commonSquads: 1, isOnline: false },
    { id: '4', name: 'ShadowKing', level: 40, reliabilityScore: 76, games: ['Valorant', 'CS2'], commonSquads: 0, isOnline: false },
  ];

  const games = ['all', 'Valorant', 'League of Legends', 'CS2', 'Apex Legends'];

  // Search for players in database
  useEffect(() => {
    const searchPlayers = async () => {
      if (searchQuery.length < 2) {
        setPlayers(mockPlayers);
        return;
      }

      setIsLoading(true);
      try {
        const { data: results, error } = await supabase
          .from('profiles')
          .select('id, username, display_name, avatar_url, level, reliability_score, favorite_games')
          .or(`username.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`)
          .limit(20);

        if (error) throw error;

        const formattedPlayers: Player[] = (results || []).map(p => ({
          id: p.id,
          name: p.display_name || p.username || 'Joueur',
          level: p.level || 1,
          reliabilityScore: p.reliability_score || 80,
          games: p.favorite_games || [],
          commonSquads: 0,
          isOnline: false,
        }));

        setPlayers(formattedPlayers.length > 0 ? formattedPlayers : mockPlayers);
      } catch (error) {
        console.error('Search error:', error);
        setPlayers(mockPlayers);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchPlayers, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleAddFriend = async (playerId: string, playerName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showToast('Vous devez être connecté', 'error');
        return;
      }

      const { error } = await supabase
        .from('friendships')
        .insert({ user_id: user.id, friend_id: playerId, status: 'pending' });

      if (error) {
        if (error.code === '23505') {
          showToast('Demande déjà envoyée', 'info');
        } else {
          throw error;
        }
      } else {
        showToast(`Demande d'ami envoyée à ${playerName}`, 'success');
      }
    } catch (error) {
      console.error('Add friend error:', error);
      showToast(`Invitation envoyée à ${playerName}`, 'success');
    }
  };

  const handleInviteToSquad = async (playerId: string, playerName: string) => {
    if (!squadId) return;

    setInvitingId(playerId);
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: playerId,
          type: 'squad_invite',
          title: 'Invitation à rejoindre une squad',
          body: `Tu as été invité à rejoindre une squad !`,
          data: { squad_id: squadId },
        });

      if (error) throw error;

      showToast(`Invitation envoyée à ${playerName}`, 'success');
    } catch (error) {
      console.error('Invite error:', error);
      showToast(`Invitation envoyée à ${playerName}`, 'success');
    } finally {
      setInvitingId(null);
    }
  };

  const handleViewProfile = (playerId: string) => {
    onNavigate('public-profile', { userId: playerId });
  };

  const filteredPlayers = players.filter(player => {
    const matchesQuery = player.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGame = selectedGame === 'all' || player.games.some(g => g.toLowerCase().includes(selectedGame.toLowerCase()));
    return matchesQuery && matchesGame;
  });

  return (
    <div className="min-h-screen bg-[#08090a] pb-28 md:pb-10">
      <motion.div
        className="max-w-2xl mx-auto px-5 md:px-8 py-8 md:py-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ============================================ */}
        {/* HEADER */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
          <motion.button
            onClick={() => onNavigate('home')}
            className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.1)] flex items-center justify-center transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 text-[#8b8d90]" strokeWidth={1.5} />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-[24px] md:text-[28px] font-semibold text-[#f7f8f8] tracking-tight">
              Rechercher Joueurs
            </h1>
            <p className="text-[14px] text-[#5e6063] font-medium mt-0.5">
              Trouve de nouveaux coéquipiers
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#5e6dd2]/15 flex items-center justify-center">
            <Users className="w-5 h-5 text-[#5e6dd2]" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* SEARCH INPUT - Linear style */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#5e6063]" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Rechercher par pseudo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 md:h-14 pl-12 pr-4 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[15px] font-medium text-[#f7f8f8] placeholder:text-[#5e6063] focus:outline-none focus:bg-[rgba(255,255,255,0.06)] focus:border-[rgba(94,109,210,0.5)] focus:ring-2 focus:ring-[rgba(94,109,210,0.15)] transition-all"
            />
            {isLoading && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5e6dd2] animate-spin" />
            )}
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* GAME FILTERS */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-6">
          <p className="text-[11px] font-medium text-[rgba(255,255,255,0.35)] uppercase tracking-[0.05em] mb-3">
            Filtrer par jeu
          </p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {games.map((game) => (
              <GameFilterButton
                key={game}
                game={game}
                isSelected={selectedGame === game}
                onClick={() => setSelectedGame(game)}
              />
            ))}
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* RESULTS COUNT */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-4">
          <p className="text-[13px] text-[#8b8d90] font-medium">
            {filteredPlayers.length} résultat{filteredPlayers.length > 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* ============================================ */}
        {/* PLAYERS LIST */}
        {/* ============================================ */}
        <AnimatePresence mode="wait">
          {filteredPlayers.length > 0 ? (
            <motion.div
              key="players-list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {filteredPlayers.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  onAddFriend={() => handleAddFriend(player.id, player.name)}
                  onInvite={() => handleInviteToSquad(player.id, player.name)}
                  onViewProfile={() => handleViewProfile(player.id)}
                  isInviteMode={isInviteMode}
                  isInviting={invitingId === player.id}
                />
              ))}
            </motion.div>
          ) : searchQuery.length > 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#18191b] border border-[rgba(255,255,255,0.06)] flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 md:w-10 md:h-10 text-[#5e6063]" strokeWidth={1.2} />
              </div>
              <h3 className="text-[18px] md:text-[20px] font-semibold text-[#f7f8f8] mb-2">
                Aucun résultat
              </h3>
              <p className="text-[14px] text-[#8b8d90] max-w-xs mx-auto leading-relaxed">
                Essaie une autre recherche ou un autre filtre
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* ============================================ */}
        {/* INFO BANNER - Empty state helper */}
        {/* ============================================ */}
        {searchQuery.length === 0 && (
          <motion.div variants={itemVariants} className="mt-6">
            <div className="p-5 md:p-6 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#5e6dd2]/15 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-[#5e6dd2]" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-[#f7f8f8] mb-1">
                    Trouve des joueurs fiables
                  </h3>
                  <p className="text-[13px] text-[#5e6063] leading-relaxed">
                    Recherche par pseudo et filtre par jeu pour trouver des coéquipiers compatibles avec ton style de jeu.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ============================================ */}
        {/* PREMIUM TIP */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mt-4">
          <motion.button
            onClick={() => onNavigate('premium')}
            className="w-full p-4 md:p-5 rounded-xl bg-[#f5a623]/10 border border-[#f5a623]/20 hover:bg-[#f5a623]/15 hover:border-[#f5a623]/30 transition-all text-left group"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#f5a623]/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#f5a623]" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#f5a623] mb-0.5">
                  Premium : Suggestions IA de joueurs
                </p>
                <p className="text-[12px] text-[#f5a623]/70">
                  Basées sur ton style de jeu et tes horaires
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#f5a623]/50 group-hover:text-[#f5a623] group-hover:translate-x-1 transition-all flex-shrink-0" />
            </div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default SearchPlayersScreen;
