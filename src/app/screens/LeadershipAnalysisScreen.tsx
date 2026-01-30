import { useState, useEffect } from 'react';
import { ArrowLeft, Crown, TrendingUp, Users, Award, Star, Sparkles, Target, Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSquads } from '@/app/contexts/SquadsContext';
import { teamIntelligenceAPI, type LeaderCandidate } from '@/utils/team-intelligence';

interface LeadershipAnalysisScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
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

export function LeadershipAnalysisScreen({ onNavigate, showToast }: LeadershipAnalysisScreenProps) {
  const { squads } = useSquads();
  const [isLoading, setIsLoading] = useState(true);
  const [leaders, setLeaders] = useState<LeaderCandidate[]>([]);
  const [selectedSquadId, setSelectedSquadId] = useState<string | null>(null);

  // Initialize squad selection
  useEffect(() => {
    if (squads && squads.length > 0 && !selectedSquadId) {
      setSelectedSquadId(squads[0].id);
    }
  }, [squads]);

  // Load leaders when squad changes
  useEffect(() => {
    if (selectedSquadId) {
      loadLeaders();
    }
  }, [selectedSquadId]);

  const loadLeaders = async () => {
    if (!selectedSquadId) return;

    setIsLoading(true);
    try {
      const candidates = await teamIntelligenceAPI.detectLeaders(selectedSquadId);
      setLeaders(candidates);
    } catch (error) {
      console.error('Error loading leaders:', error);
      showToast?.('Erreur lors de l\'analyse', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Separate current leaders from potential leaders
  const currentLeaders = leaders.filter(l => l.currentRole === 'leader' || l.currentRole === 'co_leader');
  const potentialLeaders = leaders.filter(l => l.currentRole === 'member' && l.leadershipScore >= 50);

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-yellow-400/20 to-amber-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
            <motion.button
              onClick={() => onNavigate?.('intelligence')}
              className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Analyse Leadership
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Détection IA des profils
              </p>
            </div>
            <motion.button
              onClick={loadLeaders}
              disabled={isLoading}
              className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-4 h-4 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Crown className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Squad Selector */}
          {squads && squads.length > 1 && (
            <motion.div variants={itemVariants} className="mb-6">
              <select
                value={selectedSquadId || ''}
                onChange={(e) => setSelectedSquadId(e.target.value)}
                className="w-full h-14 px-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 text-gray-900 font-semibold shadow-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                {squads.map((squad: any) => (
                  <option key={squad.id} value={squad.id}>
                    {squad.name}
                  </option>
                ))}
              </select>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Analyse en cours...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Hero Section */}
              <motion.div variants={itemVariants} className="text-center py-6 mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 mb-4 shadow-xl shadow-amber-500/30">
                  <Crown className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Leaders Naturels
                </h2>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  {leaders.length > 0
                    ? `${leaders.length} profils de leadership détectés dans votre squad`
                    : 'Aucun profil de leadership détecté pour le moment'
                  }
                </p>
              </motion.div>

              {/* Leaders actifs */}
              {currentLeaders.length > 0 && (
                <motion.div variants={itemVariants} className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-amber-500" fill="currentColor" />
                    <h3 className="text-sm font-bold text-gray-700">
                      Leaders actifs ({currentLeaders.length})
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {currentLeaders.map((leader) => (
                      <motion.div
                        key={leader.userId}
                        variants={itemVariants}
                        className="bg-gradient-to-br from-amber-100/80 to-orange-100/80 backdrop-blur-sm rounded-2xl p-5 border border-amber-200/50 shadow-lg"
                        whileHover={{ scale: 1.01, y: -2 }}
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <motion.div
                            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30 overflow-hidden"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            {leader.avatarUrl ? (
                              <img src={leader.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Crown className="w-7 h-7 text-white" />
                            )}
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-bold text-gray-800">{leader.username}</h4>
                              <span className="px-2.5 py-1 bg-white text-amber-700 text-xs font-bold rounded-lg shadow-sm">
                                {leader.leadershipScore}/100
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {leader.qualities.slice(0, 4).map((quality, idx) => (
                                <span key={idx} className="px-2 py-1 bg-white text-amber-700 text-xs font-medium rounded-lg shadow-sm flex items-center gap-1">
                                  <span>{quality.icon}</span>
                                  {quality.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                          <p className="text-sm text-gray-600 font-medium">
                            {leader.recommendation}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Potentiels leaders */}
              {potentialLeaders.length > 0 && (
                <motion.div variants={itemVariants} className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-sm font-bold text-gray-700">
                      Potentiels leaders ({potentialLeaders.length})
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {potentialLeaders.map((player) => (
                      <motion.div
                        key={player.userId}
                        variants={itemVariants}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all"
                        whileHover={{ scale: 1.01, y: -2 }}
                      >
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md overflow-hidden"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            {player.avatarUrl ? (
                              <img src={player.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Users className="w-5 h-5 text-white" />
                            )}
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-gray-800 text-sm">{player.username}</h4>
                              <span className={`px-2 py-0.5 text-xs font-bold rounded-lg ${
                                player.leadershipScore >= 70
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}>
                                {player.leadershipScore >= 70 ? 'Potentiel élevé' : 'Potentiel moyen'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 font-medium mb-1">{player.recommendation}</p>
                            <div className="flex flex-wrap gap-1">
                              {player.qualities.slice(0, 3).map((quality, idx) => (
                                <span key={idx} className="text-xs text-indigo-600 font-medium">
                                  {quality.icon} {quality.name}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-indigo-600">{player.leadershipScore}</div>
                            <div className="text-xs text-gray-400">Score</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Empty State */}
              {leaders.length === 0 && (
                <motion.div variants={itemVariants} className="text-center py-10">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-600 mb-2">Pas encore de données</h3>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto">
                    L'analyse de leadership nécessite plus de données de sessions et de participation.
                  </p>
                </motion.div>
              )}

              {/* CTA Card */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-center shadow-xl shadow-indigo-500/30 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

                <div className="relative z-10">
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm mx-auto mb-4 flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Award className="w-7 h-7 text-white" strokeWidth={2} />
                  </motion.div>
                  <h3 className="font-bold text-white text-lg mb-2">Développez vos leaders</h3>
                  <p className="text-sm text-white/90 mb-5 max-w-sm mx-auto">
                    Accédez à des outils de coaching pour développer les compétences de leadership
                  </p>
                  <motion.button
                    onClick={() => onNavigate?.('coaching-tools')}
                    className="px-6 py-3 bg-white text-indigo-600 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Voir les outils de coaching
                  </motion.button>
                </div>
              </motion.div>

              {/* Info Banner */}
              <motion.div
                variants={itemVariants}
                className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">
                      Analyse IA en temps réel
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Basée sur les sessions, check-ins et messages des 3 derniers mois
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default LeadershipAnalysisScreen;
