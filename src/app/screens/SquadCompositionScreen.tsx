import { useState, useEffect } from 'react';
import { ArrowLeft, Users, TrendingUp, AlertTriangle, Sparkles, CheckCircle2, Brain, UserPlus, Search, Loader2, RefreshCw, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSquads } from '@/app/contexts/SquadsContext';
import { teamIntelligenceAPI, type TeamComposition, type TeamRecommendation, type MemberAnalysis } from '@/utils/team-intelligence';
import { Button, Card, Badge, IconButton, SkeletonPage } from '@/design-system';

interface SquadCompositionScreenProps {
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

export function SquadCompositionScreen({ onNavigate, showToast }: SquadCompositionScreenProps) {
  const { squads } = useSquads();
  const [isLoading, setIsLoading] = useState(true);
  const [composition, setComposition] = useState<TeamComposition | null>(null);
  const [selectedSquadId, setSelectedSquadId] = useState<string | null>(null);

  // Initialize squad selection
  useEffect(() => {
    if (squads && squads.length > 0 && !selectedSquadId) {
      setSelectedSquadId(squads[0].id);
    }
  }, [squads]);

  // Load composition when squad changes
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
    if (value >= 80) return 'text-emerald-600';
    if (value >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getHealthColor = (value: number) => {
    if (value >= 80) return { gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/30' };
    if (value >= 60) return { gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/30' };
    return { gradient: 'from-red-500 to-orange-600', shadow: 'shadow-red-500/30' };
  };

  const getRecommendationStyle = (rec: TeamRecommendation) => {
    if (rec.priority === 'high') {
      return {
        bgGradient: 'from-red-100/80 to-orange-100/80',
        borderColor: 'border-red-200/50',
        iconGradient: 'from-red-500 to-orange-500',
      };
    }
    if (rec.priority === 'medium') {
      return {
        bgGradient: 'from-amber-100/80 to-orange-100/80',
        borderColor: 'border-amber-200/50',
        iconGradient: 'from-amber-500 to-orange-500',
      };
    }
    return {
      bgGradient: 'from-indigo-100/80 to-purple-100/80',
      borderColor: 'border-indigo-200/50',
      iconGradient: 'from-indigo-500 to-purple-500',
    };
  };

  const getArchetypeInfo = (archetype: string) => {
    return teamIntelligenceAPI.getArchetypeInfo(archetype as any);
  };

  const healthColors = composition ? getHealthColor(composition.overallHealth) : getHealthColor(0);

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-[var(--color-primary-50)] via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[var(--color-primary-400)]/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
            <IconButton
              variant="secondary"
              size="md"
              icon={<ArrowLeft className="w-5 h-5" strokeWidth={2} />}
              onClick={() => onNavigate?.('intelligence')}
              aria-label="Retour"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[var(--color-primary-600)] to-purple-600 bg-clip-text text-transparent">
                Composition Optimale
              </h1>
              <p className="text-sm text-[var(--fg-secondary)] font-medium">
                IA Squad Optimizer
              </p>
            </div>
            <IconButton
              variant="secondary"
              size="sm"
              icon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
              onClick={loadComposition}
              disabled={isLoading}
              aria-label="Rafraichir"
            />
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 flex items-center justify-center shadow-lg shadow-[var(--color-primary-500)]/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Brain className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Squad Selector */}
          {squads && squads.length > 1 && (
            <motion.div variants={itemVariants} className="mb-6">
              <select
                value={selectedSquadId || ''}
                onChange={(e) => setSelectedSquadId(e.target.value)}
                className="w-full h-14 px-4 bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl border border-[var(--border-subtle)] text-[var(--fg-primary)] font-semibold shadow-lg focus:ring-2 focus:ring-[var(--color-primary-500)]/20 focus:border-[var(--color-primary-500)]"
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
            <SkeletonPage />
          ) : composition ? (
            <>
              {/* Hero Section */}
              <motion.div variants={itemVariants} className="text-center py-6 mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 mb-4 shadow-xl shadow-[var(--color-primary-500)]/30">
                  <Sparkles className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-[var(--fg-primary)] mb-2">
                  {composition.squadName}
                </h2>
                <p className="text-[var(--fg-secondary)] text-sm max-w-md mx-auto">
                  {composition.members.length} membres analysés
                </p>
              </motion.div>

              {/* Squad Health Score */}
              <motion.div
                variants={itemVariants}
                className={`bg-gradient-to-br ${healthColors.gradient} rounded-2xl p-6 text-center mb-6 shadow-xl ${healthColors.shadow} relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

                <div className="relative z-10">
                  <div className="text-6xl font-bold text-white mb-2">
                    {composition.overallHealth}<span className="text-3xl text-white/80">/100</span>
                  </div>
                  <div className="text-sm text-white/90 font-medium mb-4">
                    Score de santé globale
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="px-3 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                      <div className="text-lg font-bold text-white">{composition.balanceScore}%</div>
                      <div className="text-xs text-white/80">Équilibre</div>
                    </div>
                    <div className="px-3 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                      <div className="text-lg font-bold text-white">{composition.diversityScore}%</div>
                      <div className="text-xs text-white/80">Diversité</div>
                    </div>
                    <div className="px-3 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                      <div className="text-lg font-bold text-white">{composition.optimalSize.current}/{composition.optimalSize.max}</div>
                      <div className="text-xs text-white/80">Taille</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Current Composition */}
              <motion.div variants={itemVariants} className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-[var(--color-primary-500)]" />
                  <h3 className="text-sm font-bold tracking-tight text-[var(--fg-primary)]">
                    Membres ({composition.members.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {composition.members.map((member) => {
                    const archetypeInfo = getArchetypeInfo(member.archetype);
                    return (
                      <motion.div
                        key={member.userId}
                        variants={itemVariants}
                        className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl p-4 border border-[var(--border-subtle)] shadow-lg hover:shadow-xl transition-all"
                        whileHover={{ scale: 1.01, y: -2 }}
                      >
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 flex items-center justify-center shadow-md overflow-hidden"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            {member.avatarUrl ? (
                              <img src={member.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl">{archetypeInfo.emoji}</span>
                            )}
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold tracking-tight text-[var(--fg-primary)] text-sm">
                                {member.username}
                              </h4>
                              <span className="px-2 py-0.5 bg-[var(--color-primary-100)] text-[var(--color-primary-700)] text-xs font-medium rounded-lg">
                                {archetypeInfo.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                              <div className="flex items-center gap-1">
                                <span className="text-[var(--fg-tertiary)]">Fiabilite:</span>
                                <span className={`font-bold ${getReliabilityColor(member.reliabilityScore)}`}>
                                  {member.reliabilityScore}%
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-[var(--fg-tertiary)]">Presence:</span>
                                <span className={`font-bold ${getReliabilityColor(member.attendanceRate)}`}>
                                  {member.attendanceRate}%
                                </span>
                              </div>
                            </div>
                            {member.strengths.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {member.strengths.slice(0, 2).map((strength, idx) => (
                                  <span key={idx} className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-medium rounded">
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
                            <div className="text-[10px] text-[var(--fg-muted)]">Leadership</div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Recommendations */}
              {composition.recommendations.length > 0 && (
                <motion.div variants={itemVariants} className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <h3 className="text-sm font-bold text-gray-700">
                      Recommandations IA ({composition.recommendations.length})
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {composition.recommendations.map((rec, index) => {
                      const style = getRecommendationStyle(rec);
                      return (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          className={`bg-gradient-to-br ${style.bgGradient} backdrop-blur-sm rounded-2xl p-5 border ${style.borderColor}`}
                          whileHover={{ scale: 1.01, y: -2 }}
                        >
                          <div className="flex items-start gap-4 mb-3">
                            <motion.div
                              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${style.iconGradient} flex items-center justify-center shadow-lg flex-shrink-0`}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              {rec.type === 'split' && <Users className="w-6 h-6 text-white" />}
                              {rec.type === 'recruit' && <UserPlus className="w-6 h-6 text-white" />}
                              {rec.type === 'promote' && <TrendingUp className="w-6 h-6 text-white" />}
                              {rec.type === 'engagement' && <Sparkles className="w-6 h-6 text-white" />}
                              {rec.type === 'schedule' && <AlertTriangle className="w-6 h-6 text-white" />}
                              {rec.type === 'merge' && <Shield className="w-6 h-6 text-white" />}
                            </motion.div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold tracking-tight text-[var(--fg-primary)]">{rec.title}</h4>
                                {rec.priority === 'high' && (
                                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-lg">
                                    Urgent
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-[var(--fg-secondary)] font-medium mb-2">{rec.description}</p>
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                                <span className="text-xs font-semibold text-emerald-700">
                                  {rec.impact}
                                </span>
                              </div>
                            </div>
                          </div>
                          {rec.actionable && (
                            <Button
                              variant="secondary"
                              size="md"
                              onClick={() => showToast?.('Action en cours...', 'info')}
                              className="w-full"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[var(--color-success-500)]" strokeWidth={2} />
                              Appliquer
                            </Button>
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
                    <Brain className="w-5 h-5 text-purple-500" />
                    <h3 className="text-sm font-bold tracking-tight text-[var(--fg-primary)]">
                      Distribution des archetypes
                    </h3>
                  </div>
                  <div className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl p-4 border border-[var(--border-subtle)] shadow-lg">
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(composition.archetypeDistribution).map(([archetype, count]) => {
                        const info = getArchetypeInfo(archetype);
                        return (
                          <div
                            key={archetype}
                            className="flex items-center gap-2 px-3 py-2 bg-[var(--color-primary-50)] rounded-xl"
                          >
                            <span className="text-lg">{info.emoji}</span>
                            <div>
                              <div className="text-xs font-bold text-[var(--fg-primary)]">{info.name}</div>
                              <div className="text-[10px] text-[var(--fg-tertiary)]">{count} membre{count > 1 ? 's' : ''}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* CTA */}
              <motion.div variants={itemVariants} className="text-center py-4">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => onNavigate?.('search-players')}
                >
                  <Search className="w-5 h-5" strokeWidth={2} />
                  Rechercher plus de joueurs
                </Button>
              </motion.div>
            </>
          ) : (
            <motion.div variants={itemVariants} className="text-center py-10">
              <div className="w-20 h-20 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-[var(--fg-muted)]" />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-[var(--fg-secondary)] mb-2">Aucune squad selectionnee</h3>
              <p className="text-sm text-[var(--fg-tertiary)]">
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
