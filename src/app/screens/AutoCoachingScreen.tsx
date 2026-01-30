import { useState, useEffect } from 'react';
import { ArrowLeft, Brain, Target, TrendingUp, Lightbulb, AlertCircle, Users, MessageCircle, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
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

const getInsightIcon = (type: string) => {
  switch (type) {
    case 'attendance': return AlertCircle;
    case 'engagement': return MessageCircle;
    case 'member_activity': return Users;
    case 'scheduling': return Target;
    default: return Lightbulb;
  }
};

const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case 'high':
      return { bg: 'from-red-100/80 to-orange-100/80', border: 'border-red-200/50', badge: 'bg-red-500 text-white', text: 'text-red-700' };
    case 'medium':
      return { bg: 'from-amber-100/80 to-orange-100/80', border: 'border-amber-200/50', badge: 'bg-amber-500 text-white', text: 'text-amber-700' };
    case 'low':
      return { bg: 'from-blue-100/80 to-indigo-100/80', border: 'border-blue-200/50', badge: 'bg-blue-500 text-white', text: 'text-blue-700' };
    default:
      return { bg: 'from-gray-100/80 to-slate-100/80', border: 'border-gray-200/50', badge: 'bg-gray-500 text-white', text: 'text-gray-700' };
  }
};

export function AutoCoachingScreen({ onNavigate, showToast }: AutoCoachingScreenProps) {
  const { currentSquad } = useSquads();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [healthScore, setHealthScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentSquad?.id) {
      loadCoachingInsights();
    }
  }, [currentSquad]);

  const loadCoachingInsights = async () => {
    try {
      setLoading(true);
      const result = await intelligenceEngine.getSquadHealth(currentSquad!.id);
      setHealthScore(result.healthScore);
      setInsights(result.insights);
    } catch (error) {
      console.error('[AutoCoaching] Load error:', error);
      showToast?.('Erreur lors du chargement des insights', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!currentSquad) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <p className="text-gray-500 font-medium">Sélectionnez un squad</p>
      </div>
    );
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return { gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/30', text: 'text-emerald-700' };
    if (score >= 60) return { gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/30', text: 'text-amber-700' };
    return { gradient: 'from-red-500 to-orange-600', shadow: 'shadow-red-500/30', text: 'text-red-700' };
  };

  const healthColors = getHealthColor(healthScore);

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl" />
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Coaching Auto
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Conseils IA personnalisés
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Brain className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center py-6 mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-xl shadow-indigo-500/30">
              <Brain className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Coaching Automatisé</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Conseils personnalisés basés sur l'IA pour {currentSquad?.name}
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              {/* Loader animation - keep infinite */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-10 h-10 text-indigo-500" />
              </motion.div>
            </div>
          ) : (
            <>
              {/* Health Score Card */}
              <motion.div
                variants={itemVariants}
                className={`bg-gradient-to-br ${healthColors.gradient} rounded-2xl p-6 mb-6 shadow-xl ${healthColors.shadow} relative overflow-hidden`}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Santé du Squad</h3>
                    <div className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-lg font-bold">
                      {healthScore}%
                    </div>
                  </div>
                  <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${healthScore}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                </div>
              </motion.div>

              {insights.length > 0 ? (
                <motion.div variants={itemVariants}>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <h3 className="text-sm font-bold text-gray-700">
                      Recommandations ({insights.length})
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {insights.map((insight, i) => {
                      const Icon = getInsightIcon(insight.type);
                      const styles = getPriorityStyles(insight.priority);
                      return (
                        <motion.div
                          key={i}
                          variants={itemVariants}
                          className={`bg-gradient-to-br ${styles.bg} backdrop-blur-sm rounded-2xl p-5 border ${styles.border}`}
                          whileHover={{ scale: 1.01, y: -2 }}
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <motion.div
                              className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center shadow-md"
                              whileHover={{ scale: 1.1 }}
                            >
                              <Icon className={`w-6 h-6 ${styles.text}`} strokeWidth={2} />
                            </motion.div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-gray-800">{insight.title}</h4>
                                <span className={`px-2 py-0.5 text-xs font-bold rounded-lg ${styles.badge}`}>
                                  {insight.priority === 'high' ? 'Urgent' : insight.priority === 'medium' ? 'Moyen' : 'Faible'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                              {insight.recommendations && insight.recommendations.length > 0 && (
                                <div className="space-y-2 mb-3">
                                  {insight.recommendations.map((rec, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                      <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                      <span className="text-sm text-gray-600">{rec}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <motion.button
                            onClick={() => showToast?.('Action notée ! Utilisez ces conseils pour améliorer votre squad.', 'success')}
                            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                            Prendre en compte
                          </motion.button>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                    <Target className="w-8 h-8 text-emerald-600" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Tout va bien !</h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    Votre squad est en excellente santé. Continuez comme ça !
                  </p>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default AutoCoachingScreen;
