import { ArrowLeft, Calendar, TrendingUp, Sparkles, MousePointer, Zap, Users, Heart } from 'lucide-react';
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
    if (!data?.squadId && !useMockData) return;

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
    if (value === 0) return 'bg-gray-100';
    if (value < 25) return 'bg-red-200';
    if (value < 50) return 'bg-amber-300';
    if (value < 75) return 'bg-emerald-300';
    return 'bg-emerald-500';
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
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
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
                Heatmap Disponibilité
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                {sessionsCount} session{sessionsCount > 1 ? 's' : ''} analysée{sessionsCount > 1 ? 's' : ''}
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Calendar className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {loading ? (
            <motion.div variants={itemVariants} className="text-center py-20">
              {/* Loader animation - keep infinite */}
              <motion.div
                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto mb-4 flex items-center justify-center shadow-xl shadow-indigo-500/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <TrendingUp className="w-10 h-10 text-white" strokeWidth={2} />
              </motion.div>
              <p className="text-gray-500 font-medium">Analyse IA en cours...</p>
            </motion.div>
          ) : (
            <>
              {/* Info Banner */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 mb-6 shadow-xl shadow-indigo-500/30 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">
                      Visualisation des Créneaux Efficaces
                    </h3>
                    <p className="text-sm text-white/80 font-medium">
                      Les cases vertes = créneaux avec forte participation. Cliquez pour créer une session.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Legend */}
              <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 mb-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-gray-100 border border-gray-200"></div>
                  <span className="text-xs text-gray-500 font-medium">Aucune</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-red-200"></div>
                  <span className="text-xs text-gray-500 font-medium">Faible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-amber-300"></div>
                  <span className="text-xs text-gray-500 font-medium">Moyen</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-emerald-300"></div>
                  <span className="text-xs text-gray-500 font-medium">Bon</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-emerald-500"></div>
                  <span className="text-xs text-gray-500 font-medium">Excellent</span>
                </div>
              </motion.div>

              {/* Heatmap Grid */}
              <motion.div
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg overflow-x-auto"
              >
                <div className="min-w-[600px]">
                  {/* Days Header */}
                  <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-1 mb-2">
                    <div className="w-12"></div>
                    {days.map((day, index) => (
                      <div key={index} className="text-center text-xs font-bold text-gray-700 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Heatmap Rows */}
                  {hours.map((hour, hourIndex) => (
                    <div key={hourIndex} className="grid grid-cols-[auto_repeat(7,1fr)] gap-1 mb-1">
                      <div className="w-12 flex items-center justify-end pr-2 text-xs text-gray-400 font-medium">
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
                            className={`aspect-square rounded-lg ${getColor(value)} ${
                              value > 0 ? 'cursor-pointer hover:ring-2 hover:ring-indigo-500 hover:ring-offset-1' : 'cursor-default'
                            } transition-all duration-150 shadow-sm`}
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
                  className="mt-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-5 shadow-xl shadow-purple-500/30 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">Suggestions IA</h3>
                        <p className="text-xs text-white/70">Top 3 créneaux optimaux</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {topSlots.map((slot, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleCellClick(slot.day, slot.hour, slot.score)}
                          className="w-full bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between hover:bg-white/20 transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                              index === 0 ? 'bg-yellow-400 text-yellow-900' :
                              index === 1 ? 'bg-gray-300 text-gray-700' :
                              'bg-orange-400 text-orange-900'
                            }`}>
                              #{index + 1}
                            </div>
                            <div className="text-left">
                              <p className="text-white font-semibold text-sm">
                                {days[slot.day]} à {String(slot.hour).padStart(2, '0')}h00
                              </p>
                              <p className="text-white/60 text-xs">{Math.round(slot.score)}% d'efficacité</p>
                            </div>
                          </div>
                          <div className="text-white/80 text-xs">Créer →</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Cohesion Score */}
              <motion.div
                variants={itemVariants}
                className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
                      <Heart className="w-6 h-6 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-800">Score de Cohésion</h3>
                      <p className="text-xs text-gray-500">Santé de l'équipe</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-black ${
                      cohesionScore >= 70 ? 'text-emerald-500' :
                      cohesionScore >= 50 ? 'text-amber-500' :
                      'text-red-500'
                    }`}>
                      {cohesionScore}%
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      <span>Équipe active</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        cohesionScore >= 70 ? 'bg-gradient-to-r from-emerald-400 to-teal-500' :
                        cohesionScore >= 50 ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
                        'bg-gradient-to-r from-red-400 to-rose-500'
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
                className="mt-6 bg-gradient-to-br from-amber-100/80 to-orange-100/80 backdrop-blur-sm rounded-2xl p-4 border border-amber-200/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                    <MousePointer className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-amber-800">
                      Astuce : Cliquez sur une case verte
                    </p>
                    <p className="text-[10px] text-amber-600 mt-0.5">
                      Pour créer une session au meilleur créneau
                    </p>
                  </div>
                  <Sparkles className="w-5 h-5 text-amber-500" />
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
