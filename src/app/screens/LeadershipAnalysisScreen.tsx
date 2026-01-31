import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Crown, Users, Award, Star, Sparkles, Target, Loader2, RefreshCw, TrendingUp, Shield, Zap } from 'lucide-react';
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
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 28 }
  }
};

export function LeadershipAnalysisScreen({ onNavigate, showToast }: LeadershipAnalysisScreenProps) {
  const { squadId: urlSquadId } = useParams<{ squadId: string }>();
  const { squads } = useSquads();
  const [isLoading, setIsLoading] = useState(true);
  const [leaders, setLeaders] = useState<LeaderCandidate[]>([]);
  const [selectedSquadId, setSelectedSquadId] = useState<string | null>(urlSquadId || null);

  // Initialize squad selection
  useEffect(() => {
    if (squads && squads.length > 0 && !selectedSquadId) {
      setSelectedSquadId(urlSquadId || squads[0].id);
    }
  }, [squads, urlSquadId]);

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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-[#8b8d90]';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/10 border-emerald-500/20';
    if (score >= 60) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.08)]';
  };

  return (
    <div className="min-h-screen bg-[#08090a] pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
            <motion.button
              onClick={() => onNavigate?.('intelligence')}
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.08)] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-[#f7f8f8]">
                Analyse Leadership
              </h1>
              <p className="text-sm text-[#5e6063]">
                Détection IA des profils
              </p>
            </div>
            <motion.button
              onClick={loadLeaders}
              disabled={isLoading}
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.08)] transition-all disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
            <motion.div
              className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <Crown className="w-5 h-5 text-amber-400" strokeWidth={1.5} />
            </motion.div>
          </motion.div>

          {/* Squad Selector */}
          {squads && squads.length > 1 && (
            <motion.div variants={itemVariants} className="mb-6">
              <select
                value={selectedSquadId || ''}
                onChange={(e) => setSelectedSquadId(e.target.value)}
                className="w-full h-12 px-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl text-[#f7f8f8] font-medium focus:outline-none focus:border-[#5e6dd2] transition-colors appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%238b8d90' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
              >
                {squads.map((squad: any) => (
                  <option key={squad.id} value={squad.id} className="bg-[#08090a]">
                    {squad.name}
                  </option>
                ))}
              </select>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center mb-4">
                <Loader2 className="w-6 h-6 text-[#5e6dd2] animate-spin" />
              </div>
              <p className="text-[#8b8d90] font-medium">Analyse en cours...</p>
            </motion.div>
          ) : (
            <>
              {/* Stats Row */}
              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 text-center">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center mx-auto mb-2">
                    <Crown className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xl font-bold text-[#f7f8f8]">{currentLeaders.length}</div>
                  <div className="text-xs text-[#5e6063]">Leaders actifs</div>
                </div>
                <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 text-center">
                  <div className="w-8 h-8 rounded-lg bg-[#5e6dd2]/10 flex items-center justify-center mx-auto mb-2">
                    <Target className="w-4 h-4 text-[#5e6dd2]" />
                  </div>
                  <div className="text-xl font-bold text-[#f7f8f8]">{potentialLeaders.length}</div>
                  <div className="text-xs text-[#5e6063]">Potentiels</div>
                </div>
                <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 text-center">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl font-bold text-[#f7f8f8]">{leaders.length}</div>
                  <div className="text-xs text-[#5e6063]">Total analysés</div>
                </div>
              </motion.div>

              {/* Leaders actifs */}
              {currentLeaders.length > 0 && (
                <motion.div variants={itemVariants} className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
                    <h3 className="text-sm font-semibold text-[#f7f8f8]">
                      Leaders actifs
                    </h3>
                    <span className="text-xs text-[#5e6063]">({currentLeaders.length})</span>
                  </div>
                  <div className="space-y-3">
                    {currentLeaders.map((leader) => (
                      <motion.div
                        key={leader.userId}
                        className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] transition-all"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-start gap-4 mb-3">
                          <motion.div
                            className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center overflow-hidden flex-shrink-0"
                            whileHover={{ scale: 1.05 }}
                          >
                            {leader.avatarUrl ? (
                              <img src={leader.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Crown className="w-6 h-6 text-amber-400" />
                            )}
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-[#f7f8f8] truncate">{leader.username}</h4>
                              <span className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${getScoreBg(leader.leadershipScore)} ${getScoreColor(leader.leadershipScore)}`}>
                                {leader.leadershipScore}/100
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {leader.qualities.slice(0, 4).map((quality, idx) => (
                                <span key={idx} className="px-2 py-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-[#8b8d90] text-xs font-medium rounded-md flex items-center gap-1">
                                  <span>{quality.icon}</span>
                                  {quality.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-lg p-3">
                          <p className="text-sm text-[#8b8d90]">
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
                    <Target className="w-4 h-4 text-[#5e6dd2]" />
                    <h3 className="text-sm font-semibold text-[#f7f8f8]">
                      Potentiels leaders
                    </h3>
                    <span className="text-xs text-[#5e6063]">({potentialLeaders.length})</span>
                  </div>
                  <div className="space-y-3">
                    {potentialLeaders.map((player) => (
                      <motion.div
                        key={player.userId}
                        className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] transition-all"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="w-10 h-10 rounded-xl bg-[#5e6dd2]/10 border border-[#5e6dd2]/20 flex items-center justify-center overflow-hidden flex-shrink-0"
                            whileHover={{ scale: 1.05 }}
                          >
                            {player.avatarUrl ? (
                              <img src={player.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Users className="w-5 h-5 text-[#5e6dd2]" />
                            )}
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-[#f7f8f8] text-sm truncate">{player.username}</h4>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-md border ${
                                player.leadershipScore >= 70
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                  : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                              }`}>
                                {player.leadershipScore >= 70 ? 'Potentiel eleve' : 'Potentiel moyen'}
                              </span>
                            </div>
                            <p className="text-xs text-[#5e6063] mb-1.5 line-clamp-1">{player.recommendation}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {player.qualities.slice(0, 3).map((quality, idx) => (
                                <span key={idx} className="text-xs text-[#8b8d90]">
                                  {quality.icon} {quality.name}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className={`text-lg font-bold ${getScoreColor(player.leadershipScore)}`}>{player.leadershipScore}</div>
                            <div className="text-xs text-[#5e6063]">Score</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Empty State */}
              {leaders.length === 0 && (
                <motion.div variants={itemVariants} className="text-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-[#5e6063]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#f7f8f8] mb-2">Pas encore de donnees</h3>
                  <p className="text-sm text-[#5e6063] max-w-xs mx-auto">
                    L'analyse de leadership necessite plus de donnees de sessions et de participation.
                  </p>
                </motion.div>
              )}

              {/* CTA Card */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-[#5e6dd2]/20 to-[#5e6dd2]/5 border border-[#5e6dd2]/20 rounded-xl p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#5e6dd2]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#5e6dd2]/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#5e6dd2]/20 border border-[#5e6dd2]/30 flex items-center justify-center">
                      <Award className="w-6 h-6 text-[#5e6dd2]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#f7f8f8]">Developpez vos leaders</h3>
                      <p className="text-sm text-[#8b8d90]">
                        Outils de coaching pour developper les competences
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => onNavigate?.('coaching-tools')}
                    className="w-full px-4 py-3 bg-[#5e6dd2] hover:bg-[#6a79db] text-white rounded-lg text-sm font-semibold transition-colors"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    Voir les outils de coaching
                  </motion.button>
                </div>
              </motion.div>

              {/* Info Banner */}
              <motion.div
                variants={itemVariants}
                className="mt-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-amber-400" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#f7f8f8]">
                      Analyse IA en temps reel
                    </p>
                    <p className="text-xs text-[#5e6063] mt-0.5">
                      Basee sur les sessions, check-ins et messages des 3 derniers mois
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
