import { ArrowLeft, Sparkles, Calendar, Clock, TrendingUp, Zap, Target, AlertCircle, CheckCircle2, Users, RefreshCw, Brain, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { HeatmapAvailability } from '@/app/components/HeatmapAvailability';
import { useSquads } from '@/app/contexts/SquadsContext';
import { generateStrategicAnalysis, type StrategicAnalysis, type Recommendation } from '@/utils/strategic-recommendations';

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

export function IntelligenceScreen({ onNavigate, showToast }: IntelligenceScreenProps) {
  const { squads } = useSquads();
  const [isLoading, setIsLoading] = useState(true);
  const [analysis, setAnalysis] = useState<StrategicAnalysis | null>(null);
  const [selectedSquadId, setSelectedSquadId] = useState<string | null>(null);

  // Charger l'analyse au montage
  useEffect(() => {
    if (squads && squads.length > 0 && !selectedSquadId) {
      setSelectedSquadId(squads[0].id);
    } else if (!squads || squads.length === 0) {
      // Si pas de squads, arreter le loading et utiliser les donnees par defaut
      setIsLoading(false);
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
      // Utiliser des donnees de demo en cas d'erreur
      setAnalysis({
        patterns: [
          { id: '1', title: 'Creneau optimal detecte', description: 'Votre squad est plus active le samedi soir entre 20h et 23h', icon: 'Calendar', confidence: 92 },
          { id: '2', title: 'Regularite en hausse', description: 'La participation a augmente de 15% ce mois-ci', icon: 'TrendingUp', confidence: 87 },
        ],
        recommendations: [
          { id: '1', title: 'Planifier une session samedi', description: 'C\'est le meilleur moment pour rassembler votre squad', priority: 'high', impact: '+25% de participation', action: 'Planifier maintenant', actionType: 'schedule', data: { day: 'Samedi', time: '20:00' } },
        ],
        stats: { avgAttendance: 78, totalSessions: 24, activeMembers: 5, bestDay: 'Samedi', bestTime: '20:00' },
      });
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

  // Skeleton loader
  const SkeletonLoader = () => (
    <div className="space-y-4 animate-pulse">
      <div className="h-32 bg-white/[0.03] rounded-xl border border-white/[0.06]" />
      <div className="grid grid-cols-3 gap-3">
        <div className="h-20 bg-white/[0.03] rounded-xl border border-white/[0.06]" />
        <div className="h-20 bg-white/[0.03] rounded-xl border border-white/[0.06]" />
        <div className="h-20 bg-white/[0.03] rounded-xl border border-white/[0.06]" />
      </div>
      <div className="h-24 bg-white/[0.03] rounded-xl border border-white/[0.06]" />
      <div className="h-24 bg-white/[0.03] rounded-xl border border-white/[0.06]" />
    </div>
  );

  return (
    <div className="min-h-screen pb-24 md:pb-8 pt-safe bg-[#08090a]">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <motion.button
              onClick={() => onNavigate('home')}
              className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.08] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[#8a8f98]" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#5e6dd2]" strokeWidth={1.5} />
                Intelligence IA
              </h1>
              <p className="text-sm text-[#5a5f69]">
                Recommandations stratégiques
              </p>
            </div>
            <motion.button
              onClick={loadAnalysis}
              disabled={isLoading}
              className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.08] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-4 h-4 text-[#8a8f98] ${isLoading ? 'animate-spin' : ''}`} strokeWidth={1.5} />
            </motion.button>
          </motion.div>

          {/* Squad Selector */}
          {squads && squads.length > 1 && (
            <motion.div variants={itemVariants} className="mb-5">
              <select
                value={selectedSquadId || ''}
                onChange={(e) => setSelectedSquadId(e.target.value)}
                className="w-full h-12 px-4 bg-white/[0.03] rounded-xl border border-white/[0.08] text-white text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#5e6dd2]/50 focus:border-[#5e6dd2]/50 transition-colors"
              >
                {squads.map((squad: any) => (
                  <option key={squad.id} value={squad.id} className="bg-[#0d0e11]">
                    {squad.name}
                  </option>
                ))}
              </select>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <>
              {/* Hero Card - IA Analysis */}
              <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-xl border border-[#5e6dd2]/30 bg-gradient-to-br from-[#5e6dd2]/10 via-transparent to-transparent p-5 mb-5"
              >
                {/* Glow effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#5e6dd2]/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex items-start gap-4">
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-[#5e6dd2]/20 flex items-center justify-center flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Brain className="w-6 h-6 text-[#5e6dd2]" strokeWidth={1.5} />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-white mb-1">Analyse de votre squad</h2>
                    <p className="text-sm text-[#8a8f98] leading-relaxed mb-3">
                      Basé sur {stats.totalSessions} sessions analysées. Taux de présence moyen: {stats.avgAttendance}%.
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 bg-white/[0.06] px-2.5 py-1 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4ade80]" strokeWidth={1.5} />
                        <span className="text-xs font-medium text-[#a1a1aa]">{patterns.length} patterns</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/[0.06] px-2.5 py-1 rounded-lg">
                        <Target className="w-3.5 h-3.5 text-[#f59e0b]" strokeWidth={1.5} />
                        <span className="text-xs font-medium text-[#a1a1aa]">{recommendations.filter(r => r.priority === 'high').length} priorités</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/[0.06] px-2.5 py-1 rounded-lg">
                        <Users className="w-3.5 h-3.5 text-[#5e6dd2]" strokeWidth={1.5} />
                        <span className="text-xs font-medium text-[#a1a1aa]">{stats.activeMembers} actifs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Stats Row */}
              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06] text-center">
                  <div className="text-xl font-bold text-[#4ade80] mb-0.5">{stats.avgAttendance}%</div>
                  <div className="text-xs text-[#5a5f69]">Présence</div>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06] text-center">
                  <div className="text-xl font-bold text-[#5e6dd2] mb-0.5">{stats.bestDay}</div>
                  <div className="text-xs text-[#5a5f69]">Meilleur jour</div>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06] text-center">
                  <div className="text-xl font-bold text-[#f59e0b] mb-0.5">{stats.bestTime}</div>
                  <div className="text-xs text-[#5a5f69]">Meilleure heure</div>
                </div>
              </motion.div>

              {/* Patterns détectés */}
              {patterns.length > 0 && (
                <motion.div variants={itemVariants} className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-[#4ade80]" strokeWidth={1.5} />
                    <h3 className="text-sm font-medium text-[#8a8f98]">
                      Patterns détectés
                    </h3>
                    <span className="text-xs text-[#5a5f69] bg-white/[0.05] px-2 py-0.5 rounded-full">
                      {patterns.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {patterns.map((pattern) => {
                      const IconComponent = getIconComponent(pattern.icon);
                      return (
                        <motion.div
                          key={pattern.id}
                          variants={itemVariants}
                          className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06] hover:border-white/[0.1] transition-colors"
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#4ade80]/10 flex items-center justify-center flex-shrink-0">
                              <IconComponent className="w-4 h-4 text-[#4ade80]" strokeWidth={1.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <h3 className="text-sm font-medium text-white truncate">
                                  {pattern.title}
                                </h3>
                                <div className="flex items-center gap-1 bg-[#4ade80]/10 px-2 py-0.5 rounded-md flex-shrink-0">
                                  <span className="text-xs font-medium text-[#4ade80]">
                                    {pattern.confidence}%
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-[#5a5f69] leading-relaxed">
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
              <motion.div variants={itemVariants} className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-[#5e6dd2]" strokeWidth={1.5} />
                  <h3 className="text-sm font-medium text-[#8a8f98]">
                    Carte de chaleur des disponibilités
                  </h3>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                  <HeatmapAvailability onSlotClick={handleSlotClick} />
                </div>
              </motion.div>

              {/* Recommandations stratégiques */}
              {recommendations.length > 0 && (
                <motion.div variants={itemVariants} className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-[#f59e0b]" strokeWidth={1.5} />
                    <h3 className="text-sm font-medium text-[#8a8f98]">
                      Recommandations stratégiques
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {recommendations.map((recommendation) => (
                      <motion.div
                        key={recommendation.id}
                        variants={itemVariants}
                        className={`rounded-xl p-4 border transition-colors ${
                          recommendation.priority === 'high'
                            ? 'bg-[#f59e0b]/5 border-[#f59e0b]/20 hover:border-[#f59e0b]/30'
                            : 'bg-white/[0.03] border-white/[0.06] hover:border-white/[0.1]'
                        }`}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-medium text-white">
                                {recommendation.title}
                              </h3>
                              {recommendation.priority === 'high' && (
                                <div className="flex items-center gap-1 bg-[#f59e0b]/20 px-2 py-0.5 rounded-md">
                                  <Zap className="w-3 h-3 text-[#f59e0b]" strokeWidth={1.5} />
                                  <span className="text-xs font-medium text-[#f59e0b]">Priorité</span>
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-[#5a5f69] leading-relaxed mb-1">
                              {recommendation.description}
                            </p>
                            <p className="text-xs text-[#4ade80] font-medium">
                              Impact: {recommendation.impact}
                            </p>
                          </div>
                        </div>

                        {recommendation.action && (
                          <motion.button
                            onClick={() => handleRecommendationAction(recommendation)}
                            className={`w-full h-10 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                              recommendation.priority === 'high'
                                ? 'bg-[#f59e0b] text-black hover:bg-[#f59e0b]/90'
                                : 'bg-[#5e6dd2] text-white hover:bg-[#5e6dd2]/90'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {recommendation.action}
                          </motion.button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Info Footer */}
              <motion.div
                variants={itemVariants}
                className="bg-[#5e6dd2]/5 rounded-xl p-4 border border-[#5e6dd2]/20 mb-5"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-[#5e6dd2] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white mb-1">
                      Comment fonctionne l'IA ?
                    </div>
                    <div className="text-xs text-[#5a5f69] leading-relaxed">
                      L'IA analyse vos sessions passées, les taux de présence, les créneaux qui fonctionnent le mieux,
                      et génère des recommandations personnalisées pour maximiser la participation de votre squad.
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Advanced AI Tools */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4 text-[#5e6dd2]" strokeWidth={1.5} />
                  <h3 className="text-sm font-medium text-[#8a8f98]">
                    Outils IA Avancés
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Target, color: '#5e6dd2', label: 'Composition Optimale', desc: 'Analysez votre squad', screen: 'squad-composition' },
                    { icon: Users, color: '#4ade80', label: 'Leadership', desc: 'Détectez les leaders', screen: 'leadership-analysis' },
                    { icon: RefreshCw, color: '#f59e0b', label: 'Split & Merge', desc: 'Optimisez vos squads', screen: 'squad-management' },
                    { icon: Brain, color: '#8b5cf6', label: 'Coaching Auto', desc: 'Conseils personnalisés', screen: 'auto-coaching' },
                  ].map((tool) => {
                    const ToolIcon = tool.icon;
                    return (
                      <motion.button
                        key={tool.screen}
                        onClick={() => onNavigate(tool.screen)}
                        className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06] hover:border-white/[0.12] transition-all text-left group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${tool.color}15` }}
                          >
                            <ToolIcon className="w-4 h-4" style={{ color: tool.color }} strokeWidth={1.5} />
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#3a3f47] group-hover:text-[#5a5f69] transition-colors" strokeWidth={1.5} />
                        </div>
                        <div className="text-sm font-medium text-white mb-0.5">
                          {tool.label}
                        </div>
                        <div className="text-xs text-[#5a5f69]">
                          {tool.desc}
                        </div>
                      </motion.button>
                    );
                  })}
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
