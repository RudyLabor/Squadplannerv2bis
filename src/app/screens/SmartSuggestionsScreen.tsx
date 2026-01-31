import { ArrowLeft, Sparkles, Calendar, TrendingUp, CheckCircle2, Zap, Brain, Target, Star, Clock, Users } from 'lucide-react';
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
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
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

function SuggestionCard({ suggestion, index, onSelect }: { suggestion: Suggestion; index: number; onSelect: () => void }) {
  const getRankBadge = (rank: number) => {
    if (rank === 0) return { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-400', label: '#1' };
    if (rank === 1) return { bg: 'bg-[rgba(255,255,255,0.05)]', border: 'border-[rgba(255,255,255,0.1)]', text: 'text-[#8b8d90]', label: '#2' };
    return { bg: 'bg-orange-500/20', border: 'border-orange-500/30', text: 'text-orange-400', label: '#3' };
  };

  const rank = getRankBadge(index);

  return (
    <motion.div
      variants={itemVariants}
      className="bg-[rgba(255,255,255,0.02)] backdrop-blur-sm rounded-xl p-4 border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] transition-all duration-200"
      whileHover={{ scale: 1.01 }}
    >
      {/* Header with rank */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${rank.bg} border ${rank.border} flex items-center justify-center`}>
            <span className={`text-sm font-bold ${rank.text}`}>{rank.label}</span>
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#f7f8f8]">
              {suggestion.title}
            </h3>
            <p className="text-xs text-[#5e6063] mt-0.5">
              {suggestion.description}
            </p>
          </div>
        </div>
        {index === 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20"
          >
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-[10px] font-medium text-amber-400">Top Pick</span>
          </motion.div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[rgba(255,255,255,0.03)] rounded-lg p-3 border border-[rgba(255,255,255,0.04)]">
          <div className="flex items-center gap-2 mb-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2} />
            <span className="text-[10px] font-medium text-[#8b8d90] uppercase tracking-wide">Confiance</span>
          </div>
          <div className="text-xl font-bold text-emerald-400">
            {suggestion.confidence}%
          </div>
        </div>
        <div className="bg-[rgba(255,255,255,0.03)] rounded-lg p-3 border border-[rgba(255,255,255,0.04)]">
          <div className="flex items-center gap-2 mb-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5e6dd2]" strokeWidth={2} />
            <span className="text-[10px] font-medium text-[#8b8d90] uppercase tracking-wide">Sessions</span>
          </div>
          <div className="text-xl font-bold text-[#5e6dd2]">
            {suggestion.sessionsCount}
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <motion.button
        onClick={onSelect}
        className="w-full h-10 rounded-lg bg-[#5e6dd2] hover:bg-[#6a79db] text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <Calendar className="w-4 h-4" strokeWidth={2} />
        Creer cette session
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
    if (!data?.squadId && !useMockData) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 1200));
        setSuggestions([
          { id: '1', day: 2, dayName: 'Mardi', hour: 21, time: '21:00', score: 98, confidence: 95, sessionsCount: 12, title: 'Mardi Tryhard', description: 'Creneau historique le plus performant' },
          { id: '2', day: 4, dayName: 'Jeudi', hour: 20, time: '20:00', score: 85, confidence: 82, sessionsCount: 8, title: 'Jeudi Soiree', description: 'Bon taux de reponse avant le week-end' },
          { id: '3', day: 0, dayName: 'Dimanche', hour: 14, time: '14:00', score: 75, confidence: 70, sessionsCount: 5, title: 'Dimanche Apres-midi', description: 'Ideal pour les sessions longues' }
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
              description: `${stat.confirmed} sessions reussies sur ${stat.count} essais`
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
    <div className="min-h-screen pb-24 md:pb-8 pt-safe bg-[#08090a]">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <motion.button
              onClick={() => onNavigate('home')}
              className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.08)] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[#8b8d90]" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-[#f7f8f8]">
                Suggestions IA
              </h1>
              <p className="text-sm text-[#5e6063] mt-0.5">
                Basees sur l'historique de votre squad
              </p>
            </div>
            <motion.div
              className="w-10 h-10 rounded-lg bg-[#5e6dd2]/20 border border-[#5e6dd2]/30 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <Brain className="w-5 h-5 text-[#5e6dd2]" strokeWidth={2} />
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
                className="text-center py-20"
              >
                <div className="relative w-16 h-16 mx-auto mb-6">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#5e6dd2]/30"
                    style={{ borderTopColor: '#5e6dd2' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-[#5e6dd2]" />
                  </div>
                </div>
                <p className="text-[#f7f8f8] font-medium">Analyse IA en cours...</p>
                <p className="text-[#5e6063] text-sm mt-1">L'IA analyse vos sessions passees</p>
              </motion.div>
            ) : suggestions.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-20"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#5e6dd2]/20 border border-[#5e6dd2]/30 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-[#5e6dd2]" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-[#f7f8f8] mb-2">
                  Pas encore de suggestions
                </h3>
                <p className="text-[#5e6063] text-sm max-w-xs mx-auto">
                  Jouez plus de sessions pour debloquer les suggestions intelligentes
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
                  <div className="bg-[rgba(255,255,255,0.02)] rounded-xl p-4 border border-[rgba(255,255,255,0.06)]">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                        <Target className="w-5 h-5 text-amber-400" strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-[#f7f8f8] mb-0.5 flex items-center gap-2">
                          Top 3 Creneaux Recommandes
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        </h3>
                        <p className="text-xs text-[#5e6063] leading-relaxed">
                          Ces creneaux ont historiquement le meilleur taux de participation dans votre squad
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Suggestions List */}
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <SuggestionCard
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
                  <div className="bg-[#5e6dd2]/10 rounded-xl p-4 border border-[#5e6dd2]/20">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#5e6dd2]/20 border border-[#5e6dd2]/30 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-[#5e6dd2]" strokeWidth={2} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-[#f7f8f8]">
                          Propulse par l'Intelligence Artificielle
                        </p>
                        <p className="text-[10px] text-[#5e6063] mt-0.5">
                          Analyse comportementale et prediction de disponibilite
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
