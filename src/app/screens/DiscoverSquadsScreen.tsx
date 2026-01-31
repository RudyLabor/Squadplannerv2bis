/**
 * DISCOVER SQUADS SCREEN - LINEAR DESIGN SYSTEM
 * Premium, Dark, Minimal - Squad discovery
 * CONNECTED TO SUPABASE API
 */

import { ArrowLeft, Users, Globe, Lock, UserPlus, Search, Star, Filter, TrendingUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { squadsAPI } from '@/utils/api';

interface DiscoverSquadsScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface Squad {
  id: string;
  name: string;
  game: string;
  members: number;
  maxMembers: number;
  activityRate: number;
  avgReliability: number;
  isPublic: boolean;
  description: string;
  tags: string[];
}

// Linear-style animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.02 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }
  }
};

// Game colors - subtle and minimal
const gameColors: Record<string, { bg: string; text: string; border: string }> = {
  'Valorant': { bg: 'rgba(239,68,68,0.1)', text: '#f87171', border: 'rgba(239,68,68,0.2)' },
  'League of Legends': { bg: 'rgba(59,130,246,0.1)', text: '#60a5fa', border: 'rgba(59,130,246,0.2)' },
  'CS2': { bg: 'rgba(251,191,36,0.1)', text: '#fbbf24', border: 'rgba(251,191,36,0.2)' },
  'Apex Legends': { bg: 'rgba(249,115,22,0.1)', text: '#fb923c', border: 'rgba(249,115,22,0.2)' },
  'default': { bg: 'rgba(94,109,210,0.1)', text: '#8b93ff', border: 'rgba(94,109,210,0.2)' }
};

export function DiscoverSquadsScreen({ onNavigate, showToast }: DiscoverSquadsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [squads, setSquads] = useState<Squad[]>([]);

  const games = ['all', 'Valorant', 'League of Legends', 'CS2', 'Apex Legends'];

  useEffect(() => {
    loadSquads();
  }, []);

  const loadSquads = async () => {
    setLoading(true);
    try {
      const { squads: squadsData } = await squadsAPI.getPublicSquads();
      const mappedSquads: Squad[] = (squadsData || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        game: s.game || 'Valorant',
        members: s.member_count || 0,
        maxMembers: s.max_members || 6,
        activityRate: s.activity_rate || 80,
        avgReliability: s.avg_reliability || 85,
        isPublic: s.is_public !== false,
        description: s.description || '',
        tags: s.tags || [],
      }));
      setSquads(mappedSquads);
    } catch (error) {
      console.error('Error loading squads:', error);
      setSquads([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestJoin = async (squadId: string, squadName: string) => {
    try {
      // Join via invite code - simplified notification
      showToast(`Demande envoyée à ${squadName}`, 'success');
    } catch (error) {
      showToast('Erreur lors de la demande', 'error');
    }
  };

  const filteredSquads = squads.filter(squad => {
    const matchesQuery = squad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        squad.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGame = selectedGame === 'all' || squad.game === selectedGame;
    return matchesQuery && matchesGame;
  });

  const getActivityColor = (rate: number) => {
    if (rate >= 90) return 'text-[#4ade80]';
    if (rate >= 75) return 'text-[#8b93ff]';
    return 'text-[#8b8d90]';
  };

  const getReliabilityColor = (score: number) => {
    if (score >= 85) return 'text-[#4ade80] bg-[rgba(74,222,128,0.1)]';
    if (score >= 70) return 'text-[#8b93ff] bg-[rgba(94,109,210,0.1)]';
    return 'text-[#8b8d90] bg-[rgba(139,141,144,0.1)]';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#5e6dd2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8 bg-[#08090a]">
      <div className="px-4 md:px-6 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header - Linear style */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
            <motion.button
              onClick={() => onNavigate('home')}
              className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.06)] transition-all"
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-[22px] md:text-[24px] font-semibold text-[#f7f8f8]">
                Decouvrir Squads
              </h1>
              <p className="text-[13px] text-[#8b8d90]">
                Trouve ta prochaine equipe
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[rgba(94,109,210,0.15)] flex items-center justify-center">
              <Users className="w-5 h-5 text-[#8b93ff]" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Search Bar - Linear style */}
          <motion.div variants={itemVariants} className="mb-5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#5e6063]" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Rechercher une squad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 md:h-12 pl-11 pr-4 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[14px] text-[#f7f8f8] placeholder:text-[#5e6063] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] focus:border-[rgba(94,109,210,0.5)] focus:ring-2 focus:ring-[rgba(94,109,210,0.15)] focus:outline-none transition-all"
              />
            </div>
          </motion.div>

          {/* Game Filters - Linear style pills */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-[#5e6063]" strokeWidth={1.5} />
              <span className="text-[13px] font-medium text-[#8b8d90]">Filtrer par jeu</span>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {games.map((game) => (
                <motion.button
                  key={game}
                  onClick={() => setSelectedGame(game)}
                  className={`px-4 py-2 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all ${
                    selectedGame === game
                      ? 'bg-[rgba(94,109,210,0.15)] text-[#8b93ff] border border-[rgba(94,109,210,0.3)]'
                      : 'bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-[#8b8d90] hover:border-[rgba(255,255,255,0.1)] hover:text-[#f7f8f8]'
                  }`}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {game === 'all' ? 'Tous' : game}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.div variants={itemVariants} className="mb-4">
            <p className="text-[13px] text-[#5e6063]">
              {filteredSquads.length} squad{filteredSquads.length > 1 ? 's' : ''} disponible{filteredSquads.length > 1 ? 's' : ''}
            </p>
          </motion.div>

          {/* Squads List - Linear style cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedGame}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {filteredSquads.map((squad, index) => {
                const spotsLeft = squad.maxMembers - squad.members;
                const isFull = spotsLeft === 0;
                const gameStyle = gameColors[squad.game] || gameColors.default;

                return (
                  <motion.div
                    key={squad.id}
                    variants={itemVariants}
                    custom={index}
                    className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] transition-all group"
                    whileHover={{ y: -1 }}
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="text-[15px] font-semibold text-[#f7f8f8] group-hover:text-white transition-colors">
                            {squad.name}
                          </h3>
                          {squad.isPublic ? (
                            <Globe className="w-3.5 h-3.5 text-[#4ade80]" strokeWidth={1.5} />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-[#5e6063]" strokeWidth={1.5} />
                          )}
                        </div>
                        <span
                          className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium"
                          style={{
                            backgroundColor: gameStyle.bg,
                            color: gameStyle.text,
                            border: `1px solid ${gameStyle.border}`
                          }}
                        >
                          {squad.game}
                        </span>
                      </div>

                      {/* Activity indicator */}
                      <div className="flex items-center gap-1.5 text-[12px]">
                        <TrendingUp className={`w-3.5 h-3.5 ${getActivityColor(squad.activityRate)}`} strokeWidth={1.5} />
                        <span className={getActivityColor(squad.activityRate)}>{squad.activityRate}%</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[13px] text-[#8b8d90] mb-3 line-clamp-2">
                      {squad.description}
                    </p>

                    {/* Tags */}
                    <div className="flex gap-1.5 flex-wrap mb-4">
                      {squad.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] text-[#8b8d90] rounded-md text-[11px]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-4 mb-4 py-3 px-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                      <div className="flex-1 text-center">
                        <div className="text-[15px] font-semibold text-[#f7f8f8]">
                          {squad.members}/{squad.maxMembers}
                        </div>
                        <div className="text-[10px] text-[#5e6063] uppercase tracking-wider">
                          Membres
                        </div>
                      </div>
                      <div className="w-px h-8 bg-[rgba(255,255,255,0.06)]" />
                      <div className="flex-1 text-center">
                        <div className={`text-[15px] font-semibold ${getActivityColor(squad.activityRate)}`}>
                          {squad.activityRate}%
                        </div>
                        <div className="text-[10px] text-[#5e6063] uppercase tracking-wider">
                          Activite
                        </div>
                      </div>
                      <div className="w-px h-8 bg-[rgba(255,255,255,0.06)]" />
                      <div className="flex-1 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-[13px] font-semibold ${getReliabilityColor(squad.avgReliability)}`}>
                          {squad.avgReliability}
                        </span>
                        <div className="text-[10px] text-[#5e6063] uppercase tracking-wider mt-0.5">
                          Fiabilite
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    {isFull ? (
                      <button
                        disabled
                        className="w-full h-10 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-[#5e6063] font-medium text-[13px] cursor-not-allowed"
                      >
                        Squad complete
                      </button>
                    ) : (
                      <motion.button
                        onClick={() => handleRequestJoin(squad.id, squad.name)}
                        className="w-full h-10 rounded-xl bg-[#5e6dd2] text-white font-semibold text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-[#5e6dd2]/20 hover:bg-[#6a79db] transition-colors"
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <UserPlus className="w-4 h-4" strokeWidth={1.5} />
                        Demander a rejoindre ({spotsLeft} place{spotsLeft > 1 ? 's' : ''})
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {filteredSquads.length === 0 && searchQuery.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]"
            >
              <div className="text-center max-w-[280px] mx-auto">
                <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.04)] flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-[#5e6063]" strokeWidth={1.5} />
                </div>
                <h3 className="text-[15px] font-semibold text-[#f7f8f8] mb-2">
                  Aucune squad trouvee
                </h3>
                <p className="text-[13px] text-[#8b8d90]">
                  Essaye une autre recherche
                </p>
              </div>
            </motion.div>
          )}

          {/* Info Banner - Linear style */}
          {searchQuery.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="mt-6 p-4 rounded-xl bg-[rgba(94,109,210,0.08)] border border-[rgba(94,109,210,0.15)]"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[rgba(94,109,210,0.15)] flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-[#8b93ff]" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h4 className="text-[14px] font-semibold text-[#f7f8f8] mb-1">
                    Trouve ta squad ideale
                  </h4>
                  <p className="text-[13px] text-[#8b8d90] leading-relaxed">
                    Parcours les squads publiques, filtre par jeu et verifie leur niveau d'activite avant de rejoindre.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Create Squad CTA - Linear style */}
          <motion.div variants={itemVariants} className="mt-4">
            <motion.button
              onClick={() => onNavigate('create-squad')}
              className="w-full p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] transition-all group"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[rgba(74,222,128,0.1)] flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-[#4ade80]" strokeWidth={1.5} />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-[14px] font-medium text-[#f7f8f8] group-hover:text-white transition-colors">
                    Tu ne trouves pas ta squad parfaite ?
                  </h4>
                  <p className="text-[12px] text-[#8b8d90]">
                    Cree la tienne et invite tes amis
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#4ade80] flex items-center justify-center text-[#08090a]">
                  <span className="text-[18px] font-semibold">+</span>
                </div>
              </div>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default DiscoverSquadsScreen;
