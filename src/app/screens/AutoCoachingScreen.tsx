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
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-16 h-16 rounded-2xl bg-[rgba(94,109,210,0.1)] flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-[#5e6dd2]" strokeWidth={1.5} />
          </div>
          <h2 className="text-[18px] font-semibold text-[#f7f8f8] mb-2">Aucun squad sélectionné</h2>
          <p className="text-[14px] text-[#8b8d90] mb-6">Sélectionnez un squad pour accéder au coaching automatisé</p>
          <button
            onClick={() => onNavigate?.('squads')}
            className="px-6 py-3 bg-[#5e6dd2] hover:bg-[#6a79db] text-white rounded-xl font-medium transition-colors"
          >
            Voir mes squads
          </button>
        </div>
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
    <div className="min-h-screen pb-24 md:pb-8 bg-[#08090a]">
      <motion.div
        className="max-w-2xl mx-auto px-4 md:px-6 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header - Linear style */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
          <motion.button
            onClick={() => onNavigate?.('intelligence')}
            className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8b8d90] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#f7f8f8] transition-all"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-[24px] md:text-[28px] font-semibold text-[#f7f8f8]">
              Coaching Auto
            </h1>
            <p className="text-[13px] text-[#5e6063]">
              Conseils IA pour {currentSquad?.name}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[rgba(94,109,210,0.1)] flex items-center justify-center">
            <Brain className="w-5 h-5 text-[#8b93ff]" strokeWidth={1.5} />
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-[#5e6dd2]/30 border-t-[#5e6dd2] rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Health Score Card - Linear dark style */}
            <motion.div
              variants={itemVariants}
              className="rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] p-5 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    healthScore >= 80 ? 'bg-[rgba(74,222,128,0.1)]' :
                    healthScore >= 60 ? 'bg-[rgba(245,166,35,0.1)]' :
                    'bg-[rgba(248,113,113,0.1)]'
                  }`}>
                    <TrendingUp className={`w-5 h-5 ${
                      healthScore >= 80 ? 'text-[#4ade80]' :
                      healthScore >= 60 ? 'text-[#f5a623]' :
                      'text-[#f87171]'
                    }`} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#f7f8f8]">Santé du Squad</h3>
                    <p className="text-[12px] text-[#5e6063]">Score global de performance</p>
                  </div>
                </div>
                <div className={`text-[28px] font-bold tabular-nums ${
                  healthScore >= 80 ? 'text-[#4ade80]' :
                  healthScore >= 60 ? 'text-[#f5a623]' :
                  'text-[#f87171]'
                }`}>
                  {healthScore}%
                </div>
              </div>
              <div className="h-2 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${healthScore}%` }}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  className={`h-full rounded-full ${
                    healthScore >= 80 ? 'bg-[#4ade80]' :
                    healthScore >= 60 ? 'bg-[#f5a623]' :
                    'bg-[#f87171]'
                  }`}
                />
              </div>
            </motion.div>

            {insights.length > 0 ? (
              <motion.div variants={itemVariants}>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[#f5a623]" strokeWidth={1.5} />
                  <h3 className="text-[15px] font-semibold text-[#f7f8f8]">
                    Recommandations ({insights.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {insights.map((insight, i) => {
                    const Icon = getInsightIcon(insight.type);
                    const priorityColors = {
                      high: { bg: 'bg-[rgba(248,113,113,0.1)]', border: 'border-[rgba(248,113,113,0.2)]', icon: 'text-[#f87171]', badge: 'bg-[rgba(248,113,113,0.15)] text-[#f87171]' },
                      medium: { bg: 'bg-[rgba(245,166,35,0.1)]', border: 'border-[rgba(245,166,35,0.2)]', icon: 'text-[#f5a623]', badge: 'bg-[rgba(245,166,35,0.15)] text-[#f5a623]' },
                      low: { bg: 'bg-[rgba(96,165,250,0.1)]', border: 'border-[rgba(96,165,250,0.2)]', icon: 'text-[#60a5fa]', badge: 'bg-[rgba(96,165,250,0.15)] text-[#60a5fa]' },
                    };
                    const colors = priorityColors[insight.priority] || priorityColors.low;

                    return (
                      <motion.div
                        key={i}
                        variants={itemVariants}
                        className="rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] p-4 hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                        whileHover={{ y: -2 }}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-5 h-5 ${colors.icon}`} strokeWidth={1.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h4 className="text-[14px] font-semibold text-[#f7f8f8]">{insight.title}</h4>
                              <span className={`px-2 py-0.5 text-[10px] font-medium rounded-md uppercase ${colors.badge}`}>
                                {insight.priority === 'high' ? 'Urgent' : insight.priority === 'medium' ? 'Moyen' : 'Faible'}
                              </span>
                            </div>
                            <p className="text-[13px] text-[#8b8d90] mb-3">{insight.description}</p>
                            {insight.recommendations && insight.recommendations.length > 0 && (
                              <div className="space-y-2 mb-3">
                                {insight.recommendations.map((rec, idx) => (
                                  <div key={idx} className="flex items-start gap-2">
                                    <Lightbulb className="w-4 h-4 text-[#f5a623] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                                    <span className="text-[12px] text-[#8b8d90]">{rec}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <motion.button
                          onClick={() => showToast?.('Action notée !', 'success')}
                          className="w-full h-10 rounded-lg bg-[rgba(94,109,210,0.1)] text-[#8b93ff] text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-[rgba(94,109,210,0.15)] transition-colors"
                          whileTap={{ scale: 0.98 }}
                        >
                          <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
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
                className="text-center py-12 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]"
              >
                <div className="w-16 h-16 rounded-xl bg-[rgba(74,222,128,0.1)] flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-[#4ade80]" strokeWidth={1.5} />
                </div>
                <h3 className="text-[16px] font-semibold text-[#f7f8f8] mb-2">Tout va bien !</h3>
                <p className="text-[13px] text-[#8b8d90] max-w-md mx-auto">
                  Votre squad est en excellente santé. Continuez comme ça !
                </p>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}

export default AutoCoachingScreen;
