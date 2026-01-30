import { ArrowLeft, Users, TrendingUp, Globe, Lock, UserPlus, Search, Star, Sparkles, Zap, Crown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button, Input, IconButton } from '@/design-system';

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

const gameGradients: Record<string, { gradient: string; shadow: string }> = {
  'Valorant': { gradient: 'from-red-500 to-pink-500', shadow: 'shadow-red-500/30' },
  'League of Legends': { gradient: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/30' },
  'CS2': { gradient: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/30' },
  'Apex Legends': { gradient: 'from-red-600 to-orange-500', shadow: 'shadow-red-600/30' },
  'default': { gradient: 'from-indigo-500 to-purple-500', shadow: 'shadow-indigo-500/30' }
};

export function DiscoverSquadsScreen({ onNavigate, showToast }: DiscoverSquadsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<string>('all');

  const mockSquads: Squad[] = [
    {
      id: '1',
      name: 'Elite Warriors',
      game: 'Valorant',
      members: 4,
      maxMembers: 6,
      activityRate: 92,
      avgReliability: 88,
      isPublic: true,
      description: 'Squad compétitive cherchant joueurs sérieux',
      tags: ['Compétitif', 'Ranked', 'Soir'],
    },
    {
      id: '2',
      name: 'Chill Gamers',
      game: 'League of Legends',
      members: 5,
      maxMembers: 5,
      activityRate: 78,
      avgReliability: 85,
      isPublic: true,
      description: 'On joue pour le fun, bonne ambiance garantie',
      tags: ['Casual', 'Fun', 'Tous niveaux'],
    },
    {
      id: '3',
      name: 'Night Owls',
      game: 'CS2',
      members: 3,
      maxMembers: 6,
      activityRate: 95,
      avgReliability: 92,
      isPublic: true,
      description: 'Sessions nocturnes régulières (22h-2h)',
      tags: ['Nuit', 'Régulier', 'Adultes'],
    },
    {
      id: '4',
      name: 'Weekend Warriors',
      game: 'Apex Legends',
      members: 2,
      maxMembers: 4,
      activityRate: 85,
      avgReliability: 79,
      isPublic: true,
      description: 'On joue que le weekend, vibes positives',
      tags: ['Weekend', 'Débutants ok'],
    },
  ];

  const games = ['all', 'Valorant', 'League of Legends', 'CS2', 'Apex Legends'];

  const handleRequestJoin = (squadId: string, squadName: string) => {
    showToast(`Demande envoyée à ${squadName}`, 'success');
  };

  const filteredSquads = mockSquads.filter(squad => {
    const matchesQuery = squad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        squad.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGame = selectedGame === 'all' || squad.game === selectedGame;
    return matchesQuery && matchesGame;
  });

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-[var(--color-primary-50)] via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[var(--color-primary-400)]/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-br from-cyan-400/15 to-blue-400/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
            <IconButton
              variant="secondary"
              size="md"
              icon={<ArrowLeft className="w-5 h-5" strokeWidth={2} />}
              onClick={() => onNavigate('home')}
              aria-label="Retour"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[var(--color-primary-600)] to-purple-600 bg-clip-text text-transparent">
                Découvrir Squads
              </h1>
              <p className="text-sm text-[var(--fg-secondary)] font-medium mt-0.5">
                Trouve ta prochaine équipe
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 flex items-center justify-center shadow-lg shadow-[var(--color-primary-500)]/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Users className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Search Bar */}
          <motion.div variants={itemVariants} className="mb-6">
            <Input
              placeholder="Rechercher une squad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" strokeWidth={2} />}
              size="lg"
            />
          </motion.div>

          {/* Game Filters */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="text-sm font-semibold text-[var(--fg-primary)] mb-3">
              Filtrer par jeu
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {games.map((game) => (
                <motion.button
                  key={game}
                  onClick={() => setSelectedGame(game)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    selectedGame === game
                      ? 'bg-gradient-to-r from-[var(--color-primary-500)] to-purple-500 text-white shadow-lg shadow-[var(--color-primary-500)]/30'
                      : 'bg-[var(--bg-elevated)]/80 backdrop-blur-sm text-[var(--fg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--color-primary-200)]'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {game === 'all' ? 'Tous' : game}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.div variants={itemVariants} className="mb-4">
            <div className="text-sm text-[var(--fg-secondary)] font-semibold">
              {filteredSquads.length} squad{filteredSquads.length > 1 ? 's' : ''} disponible{filteredSquads.length > 1 ? 's' : ''}
            </div>
          </motion.div>

          {/* Squads List */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedGame}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {filteredSquads.map((squad, index) => {
                const spotsLeft = squad.maxMembers - squad.members;
                const isFull = spotsLeft === 0;
                const gameStyle = gameGradients[squad.game] || gameGradients.default;

                return (
                  <motion.div
                    key={squad.id}
                    variants={itemVariants}
                    custom={index}
                    className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl p-5 border border-[var(--border-subtle)] shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.01, y: -2 }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold tracking-tight text-[var(--fg-primary)]">
                            {squad.name}
                          </h3>
                          {squad.isPublic ? (
                            <Globe className="w-4 h-4 text-emerald-500" strokeWidth={2} />
                          ) : (
                            <Lock className="w-4 h-4 text-gray-400" strokeWidth={2} />
                          )}
                        </div>
                        <div className="mb-2">
                          <span className={`inline-flex px-2.5 py-1 rounded-lg bg-gradient-to-r ${gameStyle.gradient} text-white text-xs font-bold`}>
                            {squad.game}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--fg-secondary)] font-medium">
                          {squad.description}
                        </p>
                      </div>
                      <motion.div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gameStyle.gradient} flex items-center justify-center flex-shrink-0 shadow-lg ${gameStyle.shadow}`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Users className="w-7 h-7 text-white" strokeWidth={2} />
                      </motion.div>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2 flex-wrap mb-4">
                      {squad.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 bg-[var(--color-primary-100)] text-[var(--color-primary-600)] rounded-lg text-xs font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-[var(--bg-subtle)] rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-[var(--fg-primary)]">
                          {squad.members}/{squad.maxMembers}
                        </div>
                        <div className="text-[10px] text-[var(--fg-tertiary)] font-semibold uppercase tracking-wider">
                          Membres
                        </div>
                      </div>
                      <div className="bg-[var(--bg-subtle)] rounded-xl p-3 text-center">
                        <div className={`text-lg font-bold ${
                          squad.activityRate >= 85 ? 'text-[var(--color-success-500)]' :
                          squad.activityRate >= 70 ? 'text-[var(--color-primary-500)]' :
                          'text-[var(--fg-tertiary)]'
                        }`}>
                          {squad.activityRate}%
                        </div>
                        <div className="text-[10px] text-[var(--fg-tertiary)] font-semibold uppercase tracking-wider">
                          Activite
                        </div>
                      </div>
                      <div className="bg-[var(--bg-subtle)] rounded-xl p-3 text-center">
                        <div className={`text-lg font-bold ${
                          squad.avgReliability >= 85 ? 'text-[var(--color-success-500)]' :
                          squad.avgReliability >= 70 ? 'text-[var(--color-primary-500)]' :
                          'text-[var(--fg-tertiary)]'
                        }`}>
                          {squad.avgReliability}
                        </div>
                        <div className="text-[10px] text-[var(--fg-tertiary)] font-semibold uppercase tracking-wider">
                          Fiabilite
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    {isFull ? (
                      <Button
                        variant="secondary"
                        size="md"
                        disabled
                        className="w-full"
                      >
                        Squad complete
                      </Button>
                    ) : (
                      <motion.button
                        onClick={() => handleRequestJoin(squad.id, squad.name)}
                        className={`w-full h-11 rounded-xl bg-gradient-to-r ${gameStyle.gradient} text-white font-semibold text-sm shadow-lg ${gameStyle.shadow} flex items-center justify-center gap-2`}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <UserPlus className="w-4 h-4" strokeWidth={2} />
                        Demander à rejoindre ({spotsLeft} place{spotsLeft > 1 ? 's' : ''})
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[var(--color-primary-500)]/30">
                <Search className="w-10 h-10 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-[var(--fg-primary)] mb-2">
                Aucune squad trouvée
              </h3>
              <p className="text-[var(--fg-secondary)] text-sm font-medium max-w-xs mx-auto">
                Essaye une autre recherche
              </p>
            </motion.div>
          )}

          {/* Info Banner */}
          {searchQuery.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 rounded-2xl p-5 mt-8 shadow-xl"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

              <div className="relative z-10 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <div className="text-base font-bold text-white mb-1">
                    Trouve ta squad idéale
                  </div>
                  <div className="text-sm text-white/90 font-medium leading-relaxed">
                    Parcours les squads publiques, filtre par jeu et vérifie leur niveau d'activité avant de rejoindre.
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Create Squad CTA */}
          <motion.div variants={itemVariants} className="mt-6">
            <div className="bg-gradient-to-r from-amber-100/80 to-orange-100/80 backdrop-blur-sm rounded-2xl p-4 border border-amber-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                  <Zap className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-amber-800">
                    Tu ne trouves pas ta squad parfaite ?
                  </p>
                  <p className="text-[10px] text-amber-600 mt-0.5">
                    Crée la tienne et invite tes amis !
                  </p>
                </div>
                <motion.button
                  onClick={() => onNavigate('create-squad')}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-semibold shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Créer
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default DiscoverSquadsScreen;
