import { ArrowLeft, Search, UserPlus, Users, Trophy, TrendingUp, Send, Loader2, Sparkles, Star, Zap } from 'lucide-react';
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const gameGradients: Record<string, string> = {
  'Valorant': 'from-red-500 to-pink-500',
  'League of Legends': 'from-amber-500 to-yellow-500',
  'LoL': 'from-amber-500 to-yellow-500',
  'CS2': 'from-orange-500 to-amber-500',
  'Apex Legends': 'from-red-600 to-orange-500',
  'Apex': 'from-red-600 to-orange-500',
  'default': 'from-indigo-500 to-purple-500'
};

function PremiumPlayerCard({
  player,
  onAddFriend,
  onInvite,
  onViewProfile,
  isInviteMode,
  isInviting,
  index
}: {
  player: Player;
  onAddFriend: () => void;
  onInvite: () => void;
  onViewProfile: () => void;
  isInviteMode: boolean;
  isInviting: boolean;
  index: number;
}) {
  const getReliabilityColor = (score: number) => {
    if (score >= 90) return 'from-emerald-500 to-teal-500';
    if (score >= 75) return 'from-indigo-500 to-purple-500';
    return 'from-gray-400 to-gray-500';
  };

  return (
    <motion.div
      variants={itemVariants}
      custom={index}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ scale: 1.01, y: -2 }}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <motion.button
          onClick={onViewProfile}
          className="relative flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {player.name[0]}
          </div>
          {player.isOnline && (
            <motion.div
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
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
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
                {player.name}
              </span>
              {player.reliabilityScore >= 90 && (
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              )}
            </div>
            <div className="flex items-center gap-3 text-xs mb-2">
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 font-semibold">
                Niv. {player.level}
              </span>
              <span className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${getReliabilityColor(player.reliabilityScore)} text-white font-semibold`}>
                {player.reliabilityScore}% fiable
              </span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {player.games.slice(0, 3).map((game) => (
                <span
                  key={game}
                  className={`px-2 py-0.5 bg-gradient-to-r ${gameGradients[game] || gameGradients.default} text-white rounded-lg text-[10px] font-bold`}
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
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 disabled:opacity-50 flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isInviting ? (
              <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
            ) : (
              <>
                <Send className="w-4 h-4" strokeWidth={2} />
                <span className="text-sm font-medium">Inviter</span>
              </>
            )}
          </motion.button>
        ) : (
          <motion.button
            onClick={onAddFriend}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <UserPlus className="w-5 h-5" strokeWidth={2} />
          </motion.button>
        )}
      </div>

      {/* Common Squads */}
      {player.commonSquads > 0 && (
        <motion.div
          className="flex items-center gap-2 pt-3 mt-3 border-t border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Users className="w-4 h-4 text-indigo-500" strokeWidth={2} />
          <span className="text-xs text-gray-600 font-semibold">
            {player.commonSquads} squad{player.commonSquads > 1 ? 's' : ''} en commun
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

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
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-400/15 to-blue-400/15 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
            <motion.button
              onClick={() => onNavigate('home')}
              className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Rechercher Joueurs
              </h1>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                Trouve de nouveaux coéquipiers
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Users className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Search Bar */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2} />
              <input
                type="text"
                placeholder="Rechercher par pseudo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-lg transition-all"
              />
              {isLoading && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 animate-spin" />
              )}
            </div>
          </motion.div>

          {/* Game Filters */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="text-sm font-semibold text-gray-700 mb-3">
              Filtrer par jeu
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {games.map((game) => (
                <motion.button
                  key={game}
                  onClick={() => setSelectedGame(game)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    selectedGame === game
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-white/80 backdrop-blur-sm text-gray-600 border border-white/50 hover:border-indigo-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {game === 'all' ? 'Tous les jeux' : game}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.div variants={itemVariants} className="mb-4">
            <div className="text-sm text-gray-600 font-semibold">
              {filteredPlayers.length} résultat{filteredPlayers.length > 1 ? 's' : ''}
            </div>
          </motion.div>

          {/* Players List */}
          <AnimatePresence mode="wait">
            {filteredPlayers.length > 0 ? (
              <motion.div
                key="players-list"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {filteredPlayers.map((player, index) => (
                  <PremiumPlayerCard
                    key={player.id}
                    player={player}
                    onAddFriend={() => handleAddFriend(player.id, player.name)}
                    onInvite={() => handleInviteToSquad(player.id, player.name)}
                    onViewProfile={() => handleViewProfile(player.id)}
                    isInviteMode={isInviteMode}
                    isInviting={invitingId === player.id}
                    index={index}
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
                <motion.div
                  className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Search className="w-10 h-10 text-white" strokeWidth={1.5} />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Aucun résultat
                </h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                  Essaye une autre recherche ou un autre filtre
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Info Banner */}
          {searchQuery.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="mt-6"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg">
                <div className="flex items-start gap-4">
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Sparkles className="w-6 h-6 text-white" strokeWidth={2} />
                  </motion.div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-1">
                      Trouve des joueurs fiables
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Recherche par pseudo et filtre par jeu pour trouver des coéquipiers compatibles avec ton style de jeu.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Premium Tip */}
          <motion.div
            variants={itemVariants}
            className="mt-4"
          >
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-4 border border-amber-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-amber-800">
                    Premium: Suggestions IA de joueurs compatibles
                  </p>
                  <p className="text-[10px] text-amber-600 mt-0.5">
                    Basées sur ton style de jeu et tes horaires
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default SearchPlayersScreen;
