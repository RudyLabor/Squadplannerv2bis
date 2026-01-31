import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Users, TrendingUp, AlertTriangle, Sparkles, CheckCircle2, Brain, UserPlus, Search, RefreshCw, Shield, Zap, Target, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSquads } from '@/app/contexts/SquadsContext';
import { teamIntelligenceAPI, type TeamComposition, type TeamRecommendation } from '@/utils/team-intelligence';

interface SquadCompositionScreenProps {
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

export function SquadCompositionScreen({ onNavigate, showToast }: SquadCompositionScreenProps) {
  const { squadId: urlSquadId } = useParams<{ squadId: string }>();
  const { squads } = useSquads();
  const [isLoading, setIsLoading] = useState(true);
  const [composition, setComposition] = useState<TeamComposition | null>(null);
  const [selectedSquadId, setSelectedSquadId] = useState<string | null>(urlSquadId || null);

  useEffect(() => {
    if (squads && squads.length > 0 && !selectedSquadId) {
      setSelectedSquadId(urlSquadId || squads[0].id);
    }
  }, [squads, urlSquadId]);

  useEffect(() => {
    if (selectedSquadId) {
      loadComposition();
    }
  }, [selectedSquadId]);

  const loadComposition = async () => {
    if (!selectedSquadId) return;

    setIsLoading(true);
    try {
      const result = await teamIntelligenceAPI.analyzeSquad(selectedSquadId);
      setComposition(result);
    } catch (error) {
      console.error('Error loading composition:', error);
      showToast?.('Erreur lors de l\'analyse', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getReliabilityColor = (value: number) => {
    if (value >= 80) return 'text-emerald-400';
    if (value >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getHealthGradient = (value: number) => {
    if (value >= 80) return 'from-emerald-500 to-teal-500';
    if (value >= 60) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-orange-500';
  };

  const getRecommendationStyle = (rec: TeamRecommendation) => {
    if (rec.priority === 'high') {
      return {
        border: 'border-red-500/30',
        iconBg: 'bg-red-500/20',
        iconColor: 'text-red-400',
        badge: 'bg-red-500/20 text-red-400',
      };
    }
    if (rec.priority === 'medium') {
      return {
        border: 'border-amber-500/30',
        iconBg: 'bg-amber-500/20',
        iconColor: 'text-amber-400',
        badge: 'bg-amber-500/20 text-amber-400',
      };
    }
    return {
      border: 'border-[#5e6dd2]/30',
      iconBg: 'bg-[#5e6dd2]/20',
      iconColor: 'text-[#5e6dd2]',
      badge: 'bg-[#5e6dd2]/20 text-[#5e6dd2]',
    };
  };

  const getArchetypeInfo = (archetype: string) => {
    return teamIntelligenceAPI.getArchetypeInfo(archetype as any);
  };

  // Skeleton Loader
  const SkeletonLoader = () => (
    <div className="space-y-6 animate-pulse">
      <div className="h-48 bg-[rgba(255,255,255,0.02)] rounded-2xl" />
      <div className="h-32 bg-[rgba(255,255,255,0.02)] rounded-2xl" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-[rgba(255,255,255,0.02)] rounded-2xl" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#08090a] pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <motion.button
              onClick={() => onNavigate?.('intelligence')}
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.05)] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-[#f7f8f8]">
                Composition Optimale
              </h1>
              <p className="text-sm text-[#5e6063]">
                IA Squad Optimizer
              </p>
            </div>
            <motion.button
              onClick={loadComposition}
              disabled={isLoading}
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.05)] transition-all disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
            <motion.div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5e6dd2] to-purple-600 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <Brain className="w-6 h-6 text-white" />
            </motion.div>
          </motion.div>

          {/* Squad Selector */}
          {squads && squads.length > 1 && (
            <motion.div variants={itemVariants} className="mb-6">
              <select
                value={selectedSquadId || ''}
                onChange={(e) => setSelectedSquadId(e.target.value)}
                className="w-full h-12 px-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl text-[#f7f8f8] font-medium focus:outline-none focus:border-[#5e6dd2]/50 transition-colors"
              >
                {squads.map((squad: any) => (
                  <option key={squad.id} value={squad.id} className="bg-[#08090a]">
                    {squad.name}
                  </option>
                ))}
              </select>
            </motion.div>
          )}

          {/* Content */}
          {isLoading ? (
            <SkeletonLoader />
          ) : composition ? (
            <>
              {/* Hero Card - Squad Health */}
              <motion.div
                variants={itemVariants}
                className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 mb-6 relative overflow-hidden"
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getHealthGradient(composition.overallHealth)} opacity-10`} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-[#f7f8f8] mb-1">
                        {composition.squadName}
                      </h2>
                      <p className="text-sm text-[#5e6063]">
                        {composition.members.length} membres analyses
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-4xl font-bold bg-gradient-to-r ${getHealthGradient(composition.overallHealth)} bg-clip-text text-transparent`}>
                        {composition.overallHealth}
                      </div>
                      <div className="text-xs text-[#5e6063]">Score global</div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[rgba(255,255,255,0.03)] rounded-xl p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <Target className="w-4 h-4 text-[#5e6dd2]" />
                        <span className="text-lg font-bold text-[#f7f8f8]">{composition.balanceScore}%</span>
                      </div>
                      <div className="text-xs text-[#5e6063]">Equilibre</div>
                    </div>
                    <div className="bg-[rgba(255,255,255,0.03)] rounded-xl p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span className="text-lg font-bold text-[#f7f8f8]">{composition.diversityScore}%</span>
                      </div>
                      <div className="text-xs text-[#5e6063]">Diversite</div>
                    </div>
                    <div className="bg-[rgba(255,255,255,0.03)] rounded-xl p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <Users className="w-4 h-4 text-emerald-400" />
                        <span className="text-lg font-bold text-[#f7f8f8]">{composition.optimalSize.current}/{composition.optimalSize.max}</span>
                      </div>
                      <div className="text-xs text-[#5e6063]">Taille</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Members Section */}
              <motion.div variants={itemVariants} className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-[#5e6dd2]" />
                  <h3 className="text-sm font-semibold text-[#f7f8f8]">
                    Membres ({composition.members.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {composition.members.map((member, index) => {
                    const archetypeInfo = getArchetypeInfo(member.archetype);
                    return (
                      <motion.div
                        key={member.userId}
                        variants={itemVariants}
                        className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 hover:bg-[rgba(255,255,255,0.04)] transition-all"
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5e6dd2] to-purple-600 flex items-center justify-center overflow-hidden">
                              {member.avatarUrl ? (
                                <img src={member.avatarUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xl">{archetypeInfo.emoji}</span>
                              )}
                            </div>
                            {index === 0 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                                <Crown className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-[#f7f8f8] text-sm truncate">
                                {member.username}
                              </h4>
                              <span className="px-2 py-0.5 bg-[#5e6dd2]/20 text-[#5e6dd2] text-xs font-medium rounded-md">
                                {archetypeInfo.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                              <div className="flex items-center gap-1">
                                <span className="text-[#5e6063]">Fiabilite:</span>
                                <span className={`font-semibold ${getReliabilityColor(member.reliabilityScore)}`}>
                                  {member.reliabilityScore}%
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-[#5e6063]">Presence:</span>
                                <span className={`font-semibold ${getReliabilityColor(member.attendanceRate)}`}>
                                  {member.attendanceRate}%
                                </span>
                              </div>
                            </div>
                            {member.strengths.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {member.strengths.slice(0, 2).map((strength, idx) => (
                                  <span key={idx} className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-medium rounded">
                                    {strength}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${getReliabilityColor(member.leadershipScore)}`}>
                              {member.leadershipScore}
                            </div>
                            <div className="text-[10px] text-[#5e6063]">Leadership</div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Recommendations Section */}
              {composition.recommendations.length > 0 && (
                <motion.div variants={itemVariants} className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-semibold text-[#f7f8f8]">
                      Recommandations IA ({composition.recommendations.length})
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {composition.recommendations.map((rec, index) => {
                      const style = getRecommendationStyle(rec);
                      return (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          className={`bg-[rgba(255,255,255,0.02)] border ${style.border} rounded-xl p-4`}
                          whileHover={{ x: 4 }}
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-xl ${style.iconBg} flex items-center justify-center flex-shrink-0`}>
                              {rec.type === 'split' && <Users className={`w-5 h-5 ${style.iconColor}`} />}
                              {rec.type === 'recruit' && <UserPlus className={`w-5 h-5 ${style.iconColor}`} />}
                              {rec.type === 'promote' && <TrendingUp className={`w-5 h-5 ${style.iconColor}`} />}
                              {rec.type === 'engagement' && <Sparkles className={`w-5 h-5 ${style.iconColor}`} />}
                              {rec.type === 'schedule' && <AlertTriangle className={`w-5 h-5 ${style.iconColor}`} />}
                              {rec.type === 'merge' && <Shield className={`w-5 h-5 ${style.iconColor}`} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-[#f7f8f8] text-sm">{rec.title}</h4>
                                {rec.priority === 'high' && (
                                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-semibold rounded-md">
                                    Urgent
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-[#8b8d90] mb-2">{rec.description}</p>
                              <div className="flex items-center gap-1.5">
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-xs font-medium text-emerald-400">
                                  {rec.impact}
                                </span>
                              </div>
                            </div>
                          </div>
                          {rec.actionable && (
                            <motion.button
                              onClick={() => showToast?.('Action en cours...', 'info')}
                              className="w-full py-2.5 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl text-sm font-medium text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.06)] transition-all flex items-center justify-center gap-2"
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              Appliquer
                            </motion.button>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Archetype Distribution */}
              {Object.keys(composition.archetypeDistribution).length > 0 && (
                <motion.div variants={itemVariants} className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <h3 className="text-sm font-semibold text-[#f7f8f8]">
                      Distribution des archetypes
                    </h3>
                  </div>
                  <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(composition.archetypeDistribution).map(([archetype, count]) => {
                        const info = getArchetypeInfo(archetype);
                        return (
                          <motion.div
                            key={archetype}
                            className="flex items-center gap-2 px-3 py-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl"
                            whileHover={{ scale: 1.05 }}
                          >
                            <span className="text-lg">{info.emoji}</span>
                            <div>
                              <div className="text-xs font-medium text-[#f7f8f8]">{info.name}</div>
                              <div className="text-[10px] text-[#5e6063]">{count} membre{count > 1 ? 's' : ''}</div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* CTA Button */}
              <motion.div variants={itemVariants} className="pt-4">
                <motion.button
                  onClick={() => onNavigate?.('search-players')}
                  className="w-full py-3.5 bg-[#5e6dd2] hover:bg-[#6a79db] rounded-xl text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Search className="w-5 h-5" />
                  Rechercher plus de joueurs
                </motion.button>
              </motion.div>
            </>
          ) : (
            /* Empty State */
            <motion.div
              variants={itemVariants}
              className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-[rgba(255,255,255,0.03)] flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-[#5e6063]" />
              </div>
              <h3 className="text-lg font-semibold text-[#8b8d90] mb-2">
                Aucune squad selectionnee
              </h3>
              <p className="text-sm text-[#5e6063]">
                Selectionnez une squad pour analyser sa composition.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default SquadCompositionScreen;
