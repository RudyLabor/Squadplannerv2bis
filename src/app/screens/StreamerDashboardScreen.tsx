import { useState, useEffect } from 'react';
import { ArrowLeft, Video, Users, Eye, TrendingUp, Calendar, Sparkles, Play, Clock, Zap, Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { streamerAPI, type StreamerStats, type UpcomingStream } from '@/utils/b2b-api';
import { IconButton, Card, Badge, SkeletonPage } from '@/design-system';

interface StreamerDashboardScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
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

export function StreamerDashboardScreen({ onNavigate, showToast }: StreamerDashboardScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StreamerStats | null>(null);
  const [upcomingStreams, setUpcomingStreams] = useState<UpcomingStream[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsData, streamsData] = await Promise.all([
        streamerAPI.getStats(),
        streamerAPI.getUpcomingStreams(),
      ]);
      setStats(statsData);
      setUpcomingStreams(streamsData);
    } catch (error) {
      console.error('Error loading streamer data:', error);
      showToast?.('Erreur de chargement', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-violet-400/20 to-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-br from-fuchsia-400/15 to-purple-400/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
            <IconButton
              icon={<ArrowLeft className="w-5 h-5" strokeWidth={2} />}
              onClick={() => onNavigate?.('home')}
              variant="ghost"
              aria-label="Retour a l'accueil"
              className="w-12 h-12 rounded-2xl bg-[var(--bg-elevated)]/80 backdrop-blur-sm border border-[var(--border-subtle)] shadow-lg hover:shadow-xl transition-all"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                Streamer Dashboard
              </h1>
              <p className="text-sm text-[var(--fg-secondary)] font-medium">
                Gérez vos streams
              </p>
            </div>
            <motion.button
              onClick={loadData}
              disabled={isLoading}
              className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-4 h-4 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Video className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <div className="py-8">
              <SkeletonPage />
            </div>
          ) : (
            <>
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center py-6 mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-violet-600 mb-4 shadow-xl shadow-purple-500/30">
              <Video className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg-primary)] mb-2">Dashboard Créateur</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Planifiez vos streams avec vos squads
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg text-center"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 mx-auto mb-2 flex items-center justify-center shadow-md">
                <Users className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats?.followers.toLocaleString() || 0}</div>
              <div className="text-xs text-gray-500 font-medium">Followers</div>
            </motion.div>
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg text-center"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 mx-auto mb-2 flex items-center justify-center shadow-md">
                <Eye className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats?.avgViewers || 0}</div>
              <div className="text-xs text-gray-500 font-medium">Viewers moy.</div>
            </motion.div>
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg text-center"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-500 mx-auto mb-2 flex items-center justify-center shadow-md">
                <Clock className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats?.watchTime || '0h'}</div>
              <div className="text-xs text-gray-500 font-medium">Watch time moy.</div>
            </motion.div>
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg text-center"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 mx-auto mb-2 flex items-center justify-center shadow-md">
                <TrendingUp className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="text-2xl font-bold text-gray-800">+12%</div>
              <div className="text-xs text-gray-500 font-medium">Croissance</div>
            </motion.div>
          </motion.div>

          {/* Next Stream Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-5 mb-6 shadow-xl shadow-purple-500/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <h3 className="font-bold tracking-tight text-white">Prochain stream</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats?.nextStream || 'Aucun'}</div>
              <div className="text-sm text-white/80 font-medium">{stats?.scheduledSessions || 0} sessions planifiées ce mois</div>
            </div>
          </motion.div>

          {/* Upcoming Streams */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-5 h-5 text-purple-500" />
              <h3 className="text-sm font-bold tracking-tight text-[var(--fg-secondary)]">
                Streams programmés
              </h3>
            </div>
            <div className="space-y-3">
              {upcomingStreams.map((stream, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.01, y: -2 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center shadow-md"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Video className="w-6 h-6 text-white" strokeWidth={2} />
                      </motion.div>
                      <div>
                        <h4 className="font-bold tracking-tight text-[var(--fg-primary)]">{stream.game}</h4>
                        <p className="text-xs text-gray-500 font-medium">{stream.date} • {stream.time}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-lg">
                      ~{stream.expectedViewers} viewers
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">Avec {stream.squadName}</span>
                    <motion.button
                      className="text-xs font-semibold text-purple-600 hover:text-purple-700"
                      whileHover={{ scale: 1.05 }}
                    >
                      Modifier
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div variants={itemVariants} className="mt-8">
            <motion.button
              onClick={() => onNavigate?.('propose-session')}
              className="w-full h-14 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 font-bold transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.99 }}
            >
              <Zap className="w-5 h-5" strokeWidth={2} />
              Planifier un stream
            </motion.button>
          </motion.div>

          {/* Tips Banner */}
          <motion.div
            variants={itemVariants}
            className="mt-6 bg-gradient-to-br from-amber-100/80 to-orange-100/80 backdrop-blur-sm rounded-2xl p-4 border border-amber-200/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-amber-800">
                  Astuce : Planifiez vos streams 48h à l'avance
                </p>
                <p className="text-[10px] text-amber-600 mt-0.5">
                  Pour maximiser la participation de votre squad
                </p>
              </div>
            </div>
          </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default StreamerDashboardScreen;
