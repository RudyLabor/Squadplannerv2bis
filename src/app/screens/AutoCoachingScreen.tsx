import { useState, useEffect } from 'react';
import { ArrowLeft, Brain, Target, TrendingUp, Lightbulb, AlertCircle, Users, MessageCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSquads } from '../contexts/SquadsContext';
import { intelligenceEngine } from '@/utils/intelligence';

interface AutoCoachingScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface Insight {
  type: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  recommendations?: string[];
}

const getInsightIcon = (type: string) => {
  switch (type) {
    case 'attendance': return AlertCircle;
    case 'engagement': return MessageCircle;
    case 'member_activity': return Users;
    case 'scheduling': return Target;
    default: return Lightbulb;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-50';
    case 'medium': return 'text-orange-600 bg-orange-50';
    case 'low': return 'text-blue-600 bg-blue-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

export function AutoCoachingScreen({ onNavigate, showToast }: AutoCoachingScreenProps) {
  const { selectedSquad } = useSquads();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [healthScore, setHealthScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedSquad?.id) {
      loadCoachingInsights();
    }
  }, [selectedSquad]);

  const loadCoachingInsights = async () => {
    try {
      setLoading(true);
      const result = await intelligenceEngine.getSquadHealth(selectedSquad!.id);
      setHealthScore(result.healthScore);
      setInsights(result.insights);
    } catch (error) {
      console.error('[AutoCoaching] Load error:', error);
      showToast?.('Erreur lors du chargement des insights', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedSquad) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Sélectionnez un squad</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20">
      <div className="sticky top-0 z-10 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={() => onNavigate?.('intelligence')} className="p-2 hover:bg-[var(--background-elevated)] rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" strokeWidth={2} />
          </button>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Coaching Auto</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] mb-4 shadow-lg">
            <Brain className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Coaching Automatisé</h2>
          <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">
            Conseils personnalisés basés sur l'IA pour {selectedSquad?.name}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[var(--primary-600)] animate-spin" />
          </div>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <div className="bg-gradient-to-br from-[var(--primary-50)] to-[var(--secondary-50)] rounded-2xl p-6 border-[0.5px] border-[var(--border-medium)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">Santé du Squad</h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    healthScore >= 80 ? 'bg-green-100 text-green-700' :
                    healthScore >= 60 ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {healthScore}%
                  </div>
                </div>
                <div className="w-full h-3 bg-white rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${healthScore}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full ${
                      healthScore >= 80 ? 'bg-green-500' :
                      healthScore >= 60 ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}
                  />
                </div>
              </div>
            </motion.div>

            {insights.length > 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3 px-1">
                  Recommandations ({insights.length})
                </h3>
                <div className="space-y-3">
                  {insights.map((insight, i) => {
                    const Icon = getInsightIcon(insight.type);
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        className="bg-white rounded-2xl p-4 border border-[var(--border-medium)] shadow-sm"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="p-2 rounded-xl bg-gradient-to-br from-[var(--primary-50)] to-[var(--secondary-50)]">
                            <Icon className="w-5 h-5 text-[var(--primary-600)]" strokeWidth={2} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-[var(--text-primary)]">{insight.title}</h4>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(insight.priority)}`}>
                                {insight.priority === 'high' ? 'Urgent' : insight.priority === 'medium' ? 'Moyen' : 'Faible'}
                              </span>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] mb-3">{insight.description}</p>
                            {insight.recommendations && insight.recommendations.length > 0 && (
                              <div className="space-y-1.5 mb-3">
                                {insight.recommendations.map((rec, idx) => (
                                  <div key={idx} className="flex items-start gap-2">
                                    <Lightbulb className="w-4 h-4 text-[var(--primary-600)] flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-[var(--text-secondary)]">{rec}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => showToast?.('Action notée ! Utilisez ces conseils pour améliorer votre squad.', 'success')}
                          className="w-full py-2 bg-gradient-to-r from-[var(--primary-600)] to-[var(--secondary-600)] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
                        >
                          Prendre en compte
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <Target className="w-8 h-8 text-green-600" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Tout va bien !</h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
                  Votre squad est en excellente santé. Continuez comme ça !
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AutoCoachingScreen;