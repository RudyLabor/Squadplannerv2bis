import { ArrowLeft, Calendar, TrendingUp, Sparkles, MousePointer, Zap, Users, Heart, Clock, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sessionsAPI } from '@/utils/api';

interface AvailabilityHeatmapScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  useMockData?: boolean;
  data?: {
    squadId?: string;
  };
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

export function AvailabilityHeatmapScreen({ onNavigate, showToast, data, useMockData = false }: AvailabilityHeatmapScreenProps) {
  const [heatmap, setHeatmap] = useState<number[][]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionsCount, setSessionsCount] = useState(0);
  const [topSlots, setTopSlots] = useState<Array<{ day: number; hour: number; score: number }>>([]);
  const [cohesionScore, setCohesionScore] = useState(0);

  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}h`);

  useEffect(() => {
    loadHeatmap();
  }, [data?.squadId]);

  const loadHeatmap = async () => {
    if (!data?.squadId && !useMockData) {
      setLoading(false);
      setHeatmap(Array(7).fill(null).map(() => Array(24).fill(0)));
      return;
    }

    setLoading(true);
    try {
      if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockHeatmap = Array(7).fill(null).map(() =>
          Array(24).fill(0).map(() => {
            const r = Math.random();
            if (r > 0.8) return Math.floor(Math.random() * 25) + 75;
            if (r > 0.6) return Math.floor(Math.random() * 25) + 50;
            if (r > 0.4) return Math.floor(Math.random() * 25) + 25;
            if (r > 0.2) return Math.floor(Math.random() * 25);
            return 0;
          })
        );

        setHeatmap(mockHeatmap);
        setSessionsCount(42);

        // Calculate top 3 slots
        const slots: Array<{ day: number; hour: number; score: number }> = [];
        mockHeatmap.forEach((dayData, dayIndex) => {
          dayData.forEach((score, hourIndex) => {
            if (score > 50) slots.push({ day: dayIndex, hour: hourIndex, score });
          });
        });
        slots.sort((a, b) => b.score - a.score);
        setTopSlots(slots.slice(0, 3));

        // Calculate cohesion score
        const avgScore = mockHeatmap.flat().reduce((a, b) => a + b, 0) / (7 * 24);
        setCohesionScore(Math.round(avgScore * 1.5));
      } else {
        const { sessions } = await sessionsAPI.getSessions(data?.squadId);

        const map = Array(7).fill(null).map(() => Array(24).fill(0));
        let count = 0;

        sessions.forEach((session: any) => {
          if (session.status !== 'confirmed') return;
          const slot = session.slots.find((s: any) => s.id === session.selectedSlotId);
          if (!slot) return;

          const date = new Date(`${slot.date}T${slot.time}:00`);
          const day = date.getDay();
          const hour = date.getHours();

          const yesCount = slot.responses?.filter((r: any) => r.response === 'yes').length || 0;
          const participation = yesCount / (session.playersNeeded || 5);

          map[day][hour] += participation * 25;
          if (map[day][hour] > 100) map[day][hour] = 100;

          count++;
        });

        setHeatmap(map);
        setSessionsCount(count);

        // Calculate top 3 slots from real data
        const slots: Array<{ day: number; hour: number; score: number }> = [];
        map.forEach((dayData, dayIndex) => {
          dayData.forEach((score, hourIndex) => {
            if (score > 50) slots.push({ day: dayIndex, hour: hourIndex, score });
          });
        });
        slots.sort((a, b) => b.score - a.score);
        setTopSlots(slots.slice(0, 3));

        // Calculate cohesion score from real data
        const avgScore = map.flat().reduce((a, b) => a + b, 0) / (7 * 24);
        setCohesionScore(Math.round(avgScore * 1.5));
      }
    } catch (error: any) {
      console.error('Load heatmap error:', error);
      showToast(error.message || 'Erreur lors du chargement de la heatmap', 'error');
      setHeatmap(Array(7).fill(null).map(() => Array(24).fill(0)));
    } finally {
      setLoading(false);
    }
  };

  const getColor = (value: number) => {
    if (value === 0) return 'bg-[rgba(255,255,255,0.02)]';
    if (value < 25) return 'bg-red-500/20';
    if (value < 50) return 'bg-amber-500/30';
    if (value < 75) return 'bg-emerald-500/40';
    return 'bg-emerald-500/70';
  };

  const handleCellClick = (day: number, hour: number, value: number) => {
    if (value > 0) {
      onNavigate('create-session', {
        squadId: data?.squadId,
        prefilledDay: day,
        prefilledTime: `${String(hour).padStart(2, '0')}:00`,
      });
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 pt-safe bg-[#08090a] relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#60a5fa]/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 px-4 py-6 max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <motion.button
              onClick={() => onNavigate('home')}
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.05)] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[#8b8d90]" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-[#f7f8f8]">
                Heatmap Disponibilité
              </h1>
              <p className="text-sm text-[#5e6063]">
                {sessionsCount} session{sessionsCount > 1 ? 's' : ''} analysée{sessionsCount > 1 ? 's' : ''}
              </p>
            </div>
            <motion.div
              className="w-10 h-10 rounded-xl bg-[#60a5fa]/10 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <Clock className="w-5 h-5 text-[#60a5fa]" strokeWidth={1.5} />
            </motion.div>
          </motion.div>

          {loading ? (
            <motion.div variants={itemVariants} className="text-center py-20">
              {/* Loader animation - keep infinite */}
              <motion.div
                className="w-16 h-16 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] mx-auto mb-4 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <TrendingUp className="w-8 h-8 text-[#60a5fa]" strokeWidth={1.5} />
              </motion.div>
              <p className="text-[#8b8d90] text-sm">Analyse IA en cours...</p>
            </motion.div>
          ) : (
            <>
              {/* Info Banner */}
              <motion.div
                variants={itemVariants}
                className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 mb-5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#60a5fa]/10 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-[#60a5fa]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#f7f8f8] mb-1">
                      Visualisation des Créneaux
                    </h3>
                    <p className="text-xs text-[#5e6063] leading-relaxed">
                      Les cases vertes indiquent une forte participation. Cliquez pour créer une session.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Legend */}
              <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 mb-5 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]"></div>
                  <span className="text-[10px] text-[#5e6063]">Aucune</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-red-500/20"></div>
                  <span className="text-[10px] text-[#5e6063]">Faible</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-amber-500/30"></div>
                  <span className="text-[10px] text-[#5e6063]">Moyen</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-emerald-500/40"></div>
                  <span className="text-[10px] text-[#5e6063]">Bon</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-emerald-500/70"></div>
                  <span className="text-[10px] text-[#5e6063]">Excellent</span>
                </div>
              </motion.div>

              {/* Heatmap Grid */}
              <motion.div
                variants={itemVariants}
                className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 overflow-x-auto"
              >
                <div className="min-w-[600px]">
                  {/* Days Header */}
                  <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-1 mb-2">
                    <div className="w-10"></div>
                    {days.map((day, index) => (
                      <div key={index} className="text-center text-[10px] font-medium text-[#8b8d90] py-1.5">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Heatmap Rows */}
                  {hours.map((hour, hourIndex) => (
                    <div key={hourIndex} className="grid grid-cols-[auto_repeat(7,1fr)] gap-1 mb-0.5">
                      <div className="w-10 flex items-center justify-end pr-2 text-[10px] text-[#5e6063]">
                        {hour}
                      </div>

                      {days.map((_, dayIndex) => {
                        const value = heatmap[dayIndex]?.[hourIndex] || 0;
                        return (
                          <motion.button
                            key={dayIndex}
                            onClick={() => handleCellClick(dayIndex, hourIndex, value)}
                            whileHover={{ scale: value > 0 ? 1.15 : 1 }}
                            whileTap={{ scale: value > 0 ? 0.95 : 1 }}
                            className={`aspect-square rounded ${getColor(value)} ${
                              value > 0 ? 'cursor-pointer hover:ring-1 hover:ring-[#60a5fa]/50' : 'cursor-default'
                            } transition-all duration-150 border border-[rgba(255,255,255,0.03)]`}
                            title={value > 0 ? `${value}% d'efficacité` : 'Aucune donnée'}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* AI Suggestions - Top 3 Slots */}
              {topSlots.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="mt-5 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#a78bfa]/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-[#a78bfa]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[#f7f8f8]">Suggestions IA</h3>
                      <p className="text-xs text-[#5e6063]">Top 3 créneaux optimaux</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {topSlots.map((slot, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleCellClick(slot.day, slot.hour, slot.score)}
                        className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg p-3 flex items-center justify-between hover:bg-[rgba(255,255,255,0.04)] transition-all"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold ${
                            index === 0 ? 'bg-[#fbbf24]/20 text-[#fbbf24]' :
                            index === 1 ? 'bg-[#9ca3af]/20 text-[#9ca3af]' :
                            'bg-[#f97316]/20 text-[#f97316]'
                          }`}>
                            #{index + 1}
                          </div>
                          <div className="text-left">
                            <p className="text-[#f7f8f8] font-medium text-sm">
                              {days[slot.day]} à {String(slot.hour).padStart(2, '0')}h00
                            </p>
                            <p className="text-[#5e6063] text-xs">{Math.round(slot.score)}% d'efficacité</p>
                          </div>
                        </div>
                        <span className="text-[#8b8d90] text-xs">Créer →</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Cohesion Score */}
              <motion.div
                variants={itemVariants}
                className="mt-5 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#f472b6]/10 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-[#f472b6]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[#f7f8f8]">Score de Cohésion</h3>
                      <p className="text-xs text-[#5e6063]">Santé de l'équipe</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      cohesionScore >= 70 ? 'text-[#34d399]' :
                      cohesionScore >= 50 ? 'text-[#fbbf24]' :
                      'text-[#f87171]'
                    }`}>
                      {cohesionScore}%
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#5e6063]">
                      <Users className="w-3 h-3" />
                      <span>Équipe active</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-1.5 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        cohesionScore >= 70 ? 'bg-[#34d399]' :
                        cohesionScore >= 50 ? 'bg-[#fbbf24]' :
                        'bg-[#f87171]'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${cohesionScore}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Help Banner */}
              <motion.div
                variants={itemVariants}
                className="mt-5 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#fbbf24]/10 flex items-center justify-center">
                    <MousePointer className="w-5 h-5 text-[#fbbf24]" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#f7f8f8]">
                      Astuce : Cliquez sur une case verte
                    </p>
                    <p className="text-xs text-[#5e6063] mt-0.5">
                      Pour créer une session au meilleur créneau
                    </p>
                  </div>
                  <Sparkles className="w-5 h-5 text-[#fbbf24]" strokeWidth={1.5} />
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default AvailabilityHeatmapScreen;
