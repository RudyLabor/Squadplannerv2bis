import { ArrowLeft, Sparkles, Calendar, TrendingUp, CheckCircle2, Zap, Brain, Target, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sessionsAPI } from '@/utils/api';

interface SmartSuggestionsScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  useMockData?: boolean;
  data?: {
    squadId?: string;
  };
}

interface Suggestion {
  id: string;
  day: number;
  dayName: string;
  hour: number;
  time: string;
  score: number;
  confidence: number;
  sessionsCount: number;
  title: string;
  description: string;
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

function PremiumSuggestionCard({ suggestion, index, onSelect }: { suggestion: Suggestion; index: number; onSelect: () => void }) {
  const getRankGradient = (rank: number) => {
    if (rank === 0) return 'from-amber-500 to-yellow-500';
    if (rank === 1) return 'from-gray-400 to-gray-500';
    return 'from-orange-400 to-amber-500';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 0) return '🥇';
    if (rank === 1) return '🥈';
    return '🥉';
  };

  return (
    <motion.div
      variants={itemVariants}
      custom={index}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ scale: 1.01, y: -2 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getRankGradient(index)} flex items-center justify-center text-xl shadow-lg`}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            {getRankIcon(index)}
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {suggestion.title}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {suggestion.description}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-100">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-500" strokeWidth={2} />
            <span className="text-xs font-semibold text-emerald-700">Confiance</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {suggestion.confidence}%
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-3 border border-indigo-100">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-indigo-500" strokeWidth={2} />
            <span className="text-xs font-semibold text-indigo-700">Sessions</span>
          </div>
          <div className="text-2xl font-bold text-indigo-600">
            {suggestion.sessionsCount}
          </div>
        </div>
      </div>

      {/* CTA */}
      <motion.button
        onClick={onSelect}
        className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <Calendar className="w-4 h-4" strokeWidth={2} />
        Créer cette session
      </motion.button>
    </motion.div>
  );
}

export function SmartSuggestionsScreen({ onNavigate, showToast, data, useMockData = false }: SmartSuggestionsScreenProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuggestions();
  }, [data?.squadId]);

  const loadSuggestions = async () => {
    if (!data?.squadId && !useMockData) return;

    setLoading(true);
    try {
      if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuggestions([
          { id: '1', day: 2, dayName: 'Mardi', hour: 21, time: '21:00', score: 98, confidence: 95, sessionsCount: 12, title: 'Mardi Tryhard', description: 'Créneau historique le plus performant' },
          { id: '2', day: 4, dayName: 'Jeudi', hour: 20, time: '20:00', score: 85, confidence: 82, sessionsCount: 8, title: 'Jeudi Soirée', description: 'Bon taux de réponse avant le week-end' },
          { id: '3', day: 0, dayName: 'Dimanche', hour: 14, time: '14:00', score: 75, confidence: 70, sessionsCount: 5, title: 'Dimanche Après-midi', description: 'Idéal pour les sessions longues' }
        ]);
      } else {
        const { sessions } = await sessionsAPI.getSessions(data?.squadId);

        const slotStats: Record<string, { count: number, confirmed: number, day: number, hour: number }> = {};

        sessions.forEach((session: any) => {
          if (session.status !== 'confirmed') return;

          const confirmedSlot = session.slots.find((s: any) => s.id === session.selectedSlotId);
          if (!confirmedSlot) return;

          const date = new Date(`${confirmedSlot.date}T${confirmedSlot.time}:00`);
          const day = date.getDay();
          const hour = date.getHours();
          const key = `${day}-${hour}`;

          if (!slotStats[key]) {
            slotStats[key] = { count: 0, confirmed: 0, day, hour };
          }

          slotStats[key].count++;
          const yesCount = confirmedSlot.responses?.filter((r: any) => r.response === 'yes').length || 0;
          if (yesCount >= (session.playersNeeded || 5) * 0.5) {
            slotStats[key].confirmed++;
          }
        });

        const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

        const calculatedSuggestions = Object.values(slotStats)
          .map(stat => {
            const score = (stat.confirmed / stat.count) * 100;
            const confidence = Math.min(stat.count * 10, 100);

            return {
              id: `${stat.day}-${stat.hour}`,
              day: stat.day,
              dayName: dayNames[stat.day],
              hour: stat.hour,
              time: `${String(stat.hour).padStart(2, '0')}:00`,
              score,
              confidence,
              sessionsCount: stat.count,
              title: `${dayNames[stat.day]} ${stat.hour}h`,
              description: `${stat.confirmed} sessions réussies sur ${stat.count} essais`
            };
          })
          .filter(s => s.sessionsCount >= 1)
          .sort((a, b) => (b.score * b.confidence) - (a.score * a.confidence))
          .slice(0, 3);

        setSuggestions(calculatedSuggestions);
      }
    } catch (error: any) {
      console.error('Load suggestions error:', error);
      showToast(error.message || 'Erreur d\'analyse', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    onNavigate('create-session', {
      squadId: data?.squadId,
      prefilledDay: suggestion.day,
      prefilledTime: suggestion.time,
    });
  };

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-400/15 to-blue-400/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
            <motion.button
              onClick={() => onNavigate('home')}
              className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Suggestions IA
              </h1>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                Basées sur l'historique de votre squad
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Brain className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-indigo-200"
                    style={{ borderTopColor: 'transparent' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-indigo-500" />
                  </div>
                </div>
                <p className="text-gray-600 font-semibold">Analyse en cours...</p>
                <p className="text-gray-400 text-sm mt-1">L'IA analyse vos sessions passées</p>
              </motion.div>
            ) : suggestions.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30">
                  <Sparkles className="w-12 h-12 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Pas encore de suggestions
                </h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                  Jouez plus de sessions pour débloquer les suggestions intelligentes
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="suggestions"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Info Banner */}
                <motion.div variants={itemVariants} className="mb-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg">
                    <div className="flex items-start gap-4">
                      <motion.div
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Target className="w-6 h-6 text-white" strokeWidth={2} />
                      </motion.div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-1 flex items-center gap-2">
                          Top 3 Créneaux Recommandés
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          Ces créneaux ont historiquement le meilleur taux de participation dans votre squad
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Suggestions List */}
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <PremiumSuggestionCard
                      key={suggestion.id}
                      suggestion={suggestion}
                      index={index}
                      onSelect={() => handleSelectSuggestion(suggestion)}
                    />
                  ))}
                </div>

                {/* AI Powered Badge */}
                <motion.div
                  variants={itemVariants}
                  className="mt-6"
                >
                  <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-4 border border-indigo-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" strokeWidth={2} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-indigo-800">
                          Propulsé par l'Intelligence Artificielle
                        </p>
                        <p className="text-[10px] text-indigo-600 mt-0.5">
                          Analyse comportementale et prédiction de disponibilité
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default SmartSuggestionsScreen;
