import { ArrowLeft, Sparkles, Calendar, Clock, TrendingUp, Zap, Target, AlertCircle, CheckCircle2, Users, RefreshCw, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { HeatmapAvailability } from '@/app/components/HeatmapAvailability';
import { useSquads } from '@/app/contexts/SquadsContext';
import { generateStrategicAnalysis, type StrategicAnalysis, type Recommendation } from '@/utils/strategic-recommendations';
import { Card, Button, SkeletonPage } from '@/design-system';

interface IntelligenceScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

// Map des icônes par nom
const ICON_MAP: Record<string, any> = {
  Calendar,
  Clock,
  TrendingUp,
  Zap,
  AlertCircle,
  Target,
  Users,
  Sparkles,
};

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

export function IntelligenceScreen({ onNavigate, showToast }: IntelligenceScreenProps) {
  const { squads } = useSquads();
  const [isLoading, setIsLoading] = useState(true);
  const [analysis, setAnalysis] = useState<StrategicAnalysis | null>(null);
  const [selectedSquadId, setSelectedSquadId] = useState<string | null>(null);

  // Charger l'analyse au montage
  useEffect(() => {
    if (squads && squads.length > 0 && !selectedSquadId) {
      setSelectedSquadId(squads[0].id);
    }
  }, [squads]);

  useEffect(() => {
    if (selectedSquadId) {
      loadAnalysis();
    }
  }, [selectedSquadId]);

  const loadAnalysis = async () => {
    if (!selectedSquadId) return;

    setIsLoading(true);
    try {
      const result = await generateStrategicAnalysis(selectedSquadId);
      setAnalysis(result);
    } catch (error) {
      console.error('Error loading analysis:', error);
      showToast('Erreur lors de l\'analyse', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlotClick = (hour: number, day: number) => {
    showToast(`Créer une session pour ${['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][day]} à ${hour}h ?`, 'info');
  };

  const handleRecommendationAction = (recommendation: Recommendation) => {
    switch (recommendation.actionType) {
      case 'schedule':
        onNavigate('propose-session', recommendation.data);
        showToast('Formulaire pré-rempli avec les suggestions !', 'success');
        break;
      case 'configure':
        onNavigate('recurring-sessions');
        break;
      case 'remind':
        showToast('Rappel envoyé !', 'success');
        break;
      case 'invite':
        onNavigate('join-squad');
        break;
      default:
        showToast('Action en cours...', 'info');
    }
  };

  const getIconComponent = (iconName: string) => {
    return ICON_MAP[iconName] || Sparkles;
  };

  // Utiliser les données de l'analyse ou des valeurs par défaut
  const patterns = analysis?.patterns || [];
  const recommendations = analysis?.recommendations || [];
  const stats = analysis?.stats || { avgAttendance: 0, totalSessions: 0, activeMembers: 0, bestDay: 'Samedi', bestTime: '20:00' };

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-[var(--color-primary-50)] via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[var(--color-primary-400)]/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/15 to-yellow-400/15 rounded-full blur-3xl" />
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
              onClick={() => onNavigate('home')}
              className="w-12 h-12 rounded-2xl bg-[var(--bg-elevated)]/80 backdrop-blur-sm border border-[var(--border-subtle)] flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[var(--fg-secondary)]" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[var(--color-primary-600)] to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[var(--color-primary-500)]" strokeWidth={2} />
                Intelligence IA
              </h1>
              <p className="text-sm text-[var(--fg-secondary)] font-medium">
                Recommandations stratégiques
              </p>
            </div>
            <motion.button
              onClick={loadAnalysis}
              disabled={isLoading}
              className="w-11 h-11 rounded-xl bg-[var(--bg-elevated)]/80 backdrop-blur-sm border border-[var(--border-subtle)] flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-5 h-5 text-[var(--fg-secondary)] ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
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
          ) : (
            <>
              {/* Hero Card */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 rounded-3xl p-6 mb-6 text-white shadow-xl shadow-[var(--color-primary-500)]/30 relative overflow-hidden"
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

                <div className="relative z-10 flex items-start gap-4">
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Brain className="w-7 h-7" strokeWidth={2} />
                  </motion.div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold tracking-tight mb-2">Analyse de votre squad</h2>
                    <p className="text-sm text-white/90 leading-relaxed mb-4">
                      Basé sur {stats.totalSessions} sessions analysées. Taux de présence moyen: {stats.avgAttendance}%.
                    </p>
                    <div className="flex items-center gap-2 text-xs flex-wrap">
                      <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-lg font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                        <span>{patterns.length} patterns</span>
                      </div>
                      <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-lg font-semibold">
                        <Target className="w-3.5 h-3.5" strokeWidth={2} />
                        <span>{recommendations.filter(r => r.priority === 'high').length} priorités</span>
                      </div>
                      <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-lg font-semibold">
                        <Users className="w-3.5 h-3.5" strokeWidth={2} />
                        <span>{stats.activeMembers} actifs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Stats Row */}
              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
                <Card className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl p-4 border border-[var(--border-subtle)] shadow-lg text-center">
                  <div className="text-2xl font-bold text-[var(--color-primary-600)]">{stats.avgAttendance}%</div>
                  <div className="text-xs text-[var(--fg-secondary)] font-medium">Présence</div>
                </Card>
                <Card className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl p-4 border border-[var(--border-subtle)] shadow-lg text-center">
                  <div className="text-2xl font-bold text-[var(--color-primary-600)]">{stats.bestDay}</div>
                  <div className="text-xs text-[var(--fg-secondary)] font-medium">Meilleur jour</div>
                </Card>
                <Card className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl p-4 border border-[var(--border-subtle)] shadow-lg text-center">
                  <div className="text-2xl font-bold text-[var(--color-primary-600)]">{stats.bestTime}</div>
                  <div className="text-xs text-[var(--fg-secondary)] font-medium">Meilleure heure</div>
                </Card>
              </motion.div>

              {/* Patterns détectés */}
              {patterns.length > 0 && (
                <motion.div variants={itemVariants} className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-sm font-bold tracking-tight text-[var(--fg-secondary)]">
                      Patterns détectés ({patterns.length})
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {patterns.map((pattern) => {
                      const IconComponent = getIconComponent(pattern.icon);
                      return (
                        <motion.div
                          key={pattern.id}
                          variants={itemVariants}
                          className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl p-4 border border-[var(--border-subtle)] shadow-lg hover:shadow-xl transition-all"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-start gap-3">
                            <motion.div
                              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary-100)] to-purple-100 flex items-center justify-center flex-shrink-0"
                              whileHover={{ scale: 1.1 }}
                            >
                              <IconComponent className="w-5 h-5 text-[var(--color-primary-600)]" strokeWidth={2} />
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h3 className="text-sm font-bold tracking-tight text-[var(--fg-primary)]">
                                  {pattern.title}
                                </h3>
                                <div className="flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded-lg flex-shrink-0">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  <span className="text-xs font-bold text-emerald-700">
                                    {pattern.confidence}%
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-[var(--fg-secondary)] leading-relaxed">
                                {pattern.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Heatmap de disponibilité */}
              <motion.div variants={itemVariants} className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-[var(--color-primary-500)]" />
                  <h3 className="text-sm font-bold tracking-tight text-[var(--fg-secondary)]">
                    Carte de chaleur des disponibilités
                  </h3>
                </div>
                <HeatmapAvailability onSlotClick={handleSlotClick} />
              </motion.div>

              {/* Recommandations stratégiques */}
              {recommendations.length > 0 && (
                <motion.div variants={itemVariants} className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <h3 className="text-sm font-bold tracking-tight text-[var(--fg-secondary)]">
                      Recommandations stratégiques
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {recommendations.map((recommendation) => (
                      <motion.div
                        key={recommendation.id}
                        variants={itemVariants}
                        className={`backdrop-blur-sm rounded-2xl p-5 border shadow-lg ${
                          recommendation.priority === 'high'
                            ? 'bg-gradient-to-br from-amber-100/80 to-orange-100/80 border-amber-200/50'
                            : 'bg-[var(--bg-elevated)]/80 border-[var(--border-subtle)]'
                        }`}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-bold tracking-tight text-[var(--fg-primary)]">
                                {recommendation.title}
                              </h3>
                              {recommendation.priority === 'high' && (
                                <div className="flex items-center gap-1 bg-amber-500 text-white px-2 py-0.5 rounded-lg">
                                  <Zap className="w-3 h-3" strokeWidth={2} />
                                  <span className="text-xs font-bold">Priorité</span>
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-[var(--fg-secondary)] leading-relaxed mb-1">
                              {recommendation.description}
                            </p>
                            <p className="text-xs text-emerald-600 font-semibold">
                              Impact: {recommendation.impact}
                            </p>
                          </div>
                        </div>

                        {recommendation.action && (
                          <Button
                            onClick={() => handleRecommendationAction(recommendation)}
                            fullWidth
                            className={`h-11 rounded-xl text-sm font-semibold ${
                              recommendation.priority === 'high'
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                                : 'bg-gradient-to-r from-[var(--color-primary-500)] to-purple-500 text-white shadow-lg shadow-[var(--color-primary-500)]/30'
                            }`}
                          >
                            {recommendation.action}
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Info Footer */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-[var(--color-primary-100)]/80 to-purple-100/80 backdrop-blur-sm rounded-2xl p-4 border border-[var(--color-primary-200)]/50 mb-6"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[var(--color-primary-600)] flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <div className="flex-1">
                    <div className="text-sm font-bold tracking-tight text-[var(--color-primary-700)] mb-1">
                      Comment ça marche ?
                    </div>
                    <div className="text-xs text-[var(--color-primary-600)] leading-relaxed">
                      L'IA analyse vos sessions passées, les taux de présence, les créneaux qui fonctionnent le mieux,
                      et génère des recommandations personnalisées pour maximiser la participation de votre squad.
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Advanced AI Tools */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-[var(--color-primary-500)]" />
                  <h3 className="text-sm font-bold tracking-tight text-[var(--fg-secondary)]">
                    Outils IA Avancés
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: '🎯', label: 'Composition Optimale', desc: 'Analysez votre squad', screen: 'squad-composition' },
                    { icon: '👑', label: 'Leadership', desc: 'Détectez les leaders', screen: 'leadership-analysis' },
                    { icon: '🔀', label: 'Split & Merge', desc: 'Optimisez vos squads', screen: 'squad-management' },
                    { icon: '🧠', label: 'Coaching Auto', desc: 'Conseils personnalisés', screen: 'auto-coaching' },
                  ].map((tool) => (
                    <motion.button
                      key={tool.screen}
                      onClick={() => onNavigate(tool.screen)}
                      className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl p-4 border border-[var(--border-subtle)] shadow-lg hover:shadow-xl transition-all text-left"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-2xl mb-2">{tool.icon}</div>
                      <div className="text-sm font-bold tracking-tight text-[var(--fg-primary)] mb-1">
                        {tool.label}
                      </div>
                      <div className="text-xs text-[var(--fg-secondary)]">
                        {tool.desc}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default IntelligenceScreen;
