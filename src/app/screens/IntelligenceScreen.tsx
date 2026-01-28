import { ArrowLeft, Sparkles, Calendar, Clock, TrendingUp, Zap, Target, AlertCircle, CheckCircle2, Loader2, Users, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { HeatmapAvailability } from '@/app/components/HeatmapAvailability';
import { useSquads } from '@/app/contexts/SquadsContext';
import { generateStrategicAnalysis, type StrategicAnalysis, type Pattern, type Recommendation } from '@/utils/strategic-recommendations';

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'primary';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'tertiary';
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
    <div className="min-h-screen pb-24 pt-safe">
      <div className="px-4 py-8 max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[var(--primary-500)]" strokeWidth={2} />
              Intelligence IA
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium">
              Recommandations stratégiques
            </p>
          </div>
          <button
            onClick={loadAnalysis}
            disabled={isLoading}
            className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50"
          >
            <RefreshCw className={`w-4 h-4 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Squad Selector */}
        {squads && squads.length > 1 && (
          <div className="mb-6">
            <select
              value={selectedSquadId || ''}
              onChange={(e) => setSelectedSquadId(e.target.value)}
              className="w-full h-12 px-4 bg-white rounded-xl border border-gray-200 text-gray-900"
            >
              {squads.map((squad: any) => (
                <option key={squad.id} value={squad.id}>
                  {squad.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Analyse en cours...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Hero Card */}
            <div className="bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] rounded-3xl p-6 mb-6 text-white">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-7 h-7" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">Analyse de votre squad</h2>
                  <p className="text-sm opacity-90 leading-relaxed mb-4">
                    Basé sur {stats.totalSessions} sessions analysées. Taux de présence moyen: {stats.avgAttendance}%.
                  </p>
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                      <span className="font-semibold">{patterns.length} patterns</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-lg">
                      <Target className="w-3.5 h-3.5" strokeWidth={2} />
                      <span className="font-semibold">{recommendations.filter(r => r.priority === 'high').length} priorités</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-lg">
                      <Users className="w-3.5 h-3.5" strokeWidth={2} />
                      <span className="font-semibold">{stats.activeMembers} actifs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.avgAttendance}%</div>
                <div className="text-xs text-gray-500">Présence</div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.bestDay}</div>
                <div className="text-xs text-gray-500">Meilleur jour</div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.bestTime}</div>
                <div className="text-xs text-gray-500">Meilleure heure</div>
              </div>
            </div>

            {/* Patterns détectés */}
            {patterns.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 px-1">
                  Patterns détectés
                </h2>
                <div className="grid gap-3">
                  {patterns.map((pattern, index) => {
                    const IconComponent = getIconComponent(pattern.icon);
                    return (
                      <motion.div
                        key={pattern.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[var(--primary-50)] flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-[var(--primary-600)]" strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="text-sm font-bold text-[var(--fg-primary)]">
                                {pattern.title}
                              </h3>
                              <div className="flex items-center gap-1 bg-[var(--success-50)] px-2 py-0.5 rounded-lg flex-shrink-0">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--success-500)]" />
                                <span className="text-xs font-bold text-[var(--success-700)]">
                                  {pattern.confidence}%
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-[var(--fg-tertiary)] leading-relaxed">
                              {pattern.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Heatmap de disponibilité */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 px-1">
                Carte de chaleur des disponibilités
              </h2>
              <HeatmapAvailability onSlotClick={handleSlotClick} />
            </div>

            {/* Recommandations stratégiques */}
            {recommendations.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 px-1">
                  Recommandations stratégiques
                </h2>
                <div className="space-y-3">
                  {recommendations.map((recommendation, index) => {
                    const priorityColor = getPriorityColor(recommendation.priority);

                    return (
                      <motion.div
                        key={recommendation.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`
                          bg-white rounded-2xl p-4 border-[0.5px] border-gray-200
                          ${recommendation.priority === 'high' ? 'ring-2 ring-amber-200 bg-amber-50' : ''}
                        `}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-bold text-gray-900">
                                {recommendation.title}
                              </h3>
                              {recommendation.priority === 'high' && (
                                <div className="flex items-center gap-1 bg-amber-500 text-white px-2 py-0.5 rounded-lg">
                                  <Zap className="w-3 h-3" strokeWidth={2} />
                                  <span className="text-xs font-bold">Priorité</span>
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed mb-1">
                              {recommendation.description}
                            </p>
                            <p className="text-xs text-green-600 font-medium">
                              Impact: {recommendation.impact}
                            </p>
                          </div>
                        </div>

                        {recommendation.action && (
                          <Button
                            variant={recommendation.priority === 'high' ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => handleRecommendationAction(recommendation)}
                            className="w-full h-11"
                          >
                            {recommendation.action}
                          </Button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Info Footer */}
            <div className="bg-[var(--primary-50)] rounded-2xl p-4 border-[0.5px] border-[var(--primary-200)]">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[var(--primary-600)] flex-shrink-0 mt-0.5" strokeWidth={2} />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[var(--primary-700)] mb-1">
                    Comment ça marche ?
                  </div>
                  <div className="text-xs text-[var(--primary-600)] leading-relaxed">
                    L'IA analyse vos sessions passées, les taux de présence, les créneaux qui fonctionnent le mieux,
                    et génère des recommandations personnalisées pour maximiser la participation de votre squad.
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced AI Tools */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 px-1">
                Outils IA Avancés
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onNavigate('squad-composition')}
                  className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-medium)] shadow-sm hover:shadow-md transition-all text-left"
                >
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                    Composition Optimale
                  </div>
                  <div className="text-xs text-[var(--fg-tertiary)]">
                    Analysez votre squad
                  </div>
                </button>

                <button
                  onClick={() => onNavigate('leadership-analysis')}
                  className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-medium)] shadow-sm hover:shadow-md transition-all text-left"
                >
                  <div className="text-2xl mb-2">👑</div>
                  <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                    Leadership
                  </div>
                  <div className="text-xs text-[var(--fg-tertiary)]">
                    Détectez les leaders
                  </div>
                </button>

                <button
                  onClick={() => onNavigate('squad-management')}
                  className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-medium)] shadow-sm hover:shadow-md transition-all text-left"
                >
                  <div className="text-2xl mb-2">🔀</div>
                  <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                    Split & Merge
                  </div>
                  <div className="text-xs text-[var(--fg-tertiary)]">
                    Optimisez vos squads
                  </div>
                </button>

                <button
                  onClick={() => onNavigate('auto-coaching')}
                  className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-medium)] shadow-sm hover:shadow-md transition-all text-left"
                >
                  <div className="text-2xl mb-2">🧠</div>
                  <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                    Coaching Auto
                  </div>
                  <div className="text-xs text-[var(--fg-tertiary)]">
                    Conseils personnalisés
                  </div>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default IntelligenceScreen;
