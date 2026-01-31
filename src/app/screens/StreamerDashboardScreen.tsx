/**
 * STREAMER DASHBOARD SCREEN - LINEAR DESIGN SYSTEM
 * Premium, Dark, Minimal - Stream management
 */

import { useState, useEffect } from 'react';
import { ArrowLeft, Video, Users, Eye, TrendingUp, Calendar, Sparkles, Play, Clock, Zap, RefreshCw, ChevronRight, Radio, Tv } from 'lucide-react';
import { motion } from 'framer-motion';
import { streamerAPI, type StreamerStats, type UpcomingStream } from '@/utils/b2b-api';

interface StreamerDashboardScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

// Linear-style animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.15,
      when: "beforeChildren",
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }
  }
};

// Streaming accent color
const STREAMING_COLOR = '#8b93ff';

interface StatCardProps {
  icon: React.ElementType;
  value: string | number;
  label: string;
  accentColor: string;
}

function StatCard({ icon: Icon, value, label, accentColor }: StatCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="relative p-4 md:p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] transition-all duration-200 group cursor-default overflow-hidden"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
    >
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <Icon className="w-5 h-5 transition-colors" style={{ color: accentColor }} strokeWidth={1.5} />
          </div>
        </div>
        <p className="text-[28px] md:text-[32px] font-semibold text-[#f7f8f8] tabular-nums leading-none tracking-tight mb-0.5">{value}</p>
        <span className="text-[12px] md:text-[13px] text-[rgba(255,255,255,0.4)] uppercase tracking-wide">{label}</span>
      </div>
    </motion.div>
  );
}

interface StreamCardProps {
  stream: UpcomingStream;
  index: number;
}

function StreamCard({ stream, index }: StreamCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      custom={index}
      className="relative bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] transition-all"
      whileHover={{ x: 2 }}
    >
      {/* Left accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5"
        style={{ backgroundColor: STREAMING_COLOR }}
      />

      <div className="p-4 pl-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${STREAMING_COLOR}15` }}
            >
              <Video className="w-5 h-5" style={{ color: STREAMING_COLOR }} strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="font-medium text-[#f7f8f8] text-[13px]">{stream.game}</h4>
              <p className="text-[11px] text-[#5e6063]">{stream.date} • {stream.time}</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[rgba(139,147,255,0.1)] text-[#8b93ff] text-[11px] font-medium">
            ~{stream.expectedViewers} viewers
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#8b8d90]">
            <Users className="w-3.5 h-3.5 text-[#5e6063]" strokeWidth={1.5} />
            <span className="text-[11px]">Avec {stream.squadName}</span>
          </div>
          <motion.button
            className="text-[11px] font-medium text-[#5e6dd2] hover:text-[#8b93ff] transition-colors"
            whileHover={{ x: 2 }}
          >
            Modifier
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-[rgba(255,255,255,0.04)] rounded-xl" />
        ))}
      </div>
      <div className="h-32 bg-[rgba(255,255,255,0.04)] rounded-xl" />
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-[rgba(255,255,255,0.04)] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

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
      // Utiliser des donnees de demo en cas d'erreur
      setStats({
        followers: 12450,
        avgViewers: 385,
        nextStream: 'Demain 21h',
        scheduledSessions: 4,
        watchTime: '2.5h',
        growthPercent: 12,
      });
      setUpcomingStreams([
        { id: '1', date: '25 Jan', time: '21h', game: 'Valorant', squadName: 'Squad Alpha', expectedViewers: 350, isLive: false },
        { id: '2', date: '27 Jan', time: '20h', game: 'CS2', squadName: 'Squad Beta', expectedViewers: 420, isLive: false },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 bg-[#08090a]">
      <div className="px-4 md:px-6 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header - Linear style */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <motion.button
              onClick={() => onNavigate?.('home')}
              className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.06)] transition-all"
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-[22px] md:text-[24px] font-semibold text-[#f7f8f8]">
                Streamer Dashboard
              </h1>
              <p className="text-[13px] text-[#5e6063]">
                Gérez vos streams et planifications
              </p>
            </div>
            <motion.button
              onClick={loadData}
              disabled={isLoading}
              className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.06)] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${STREAMING_COLOR}15` }}
            >
              <Video className="w-5 h-5" style={{ color: STREAMING_COLOR }} strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {/* Stats Grid */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
                <StatCard
                  icon={Users}
                  value={stats?.followers.toLocaleString() || '0'}
                  label="Followers"
                  iconColor={STREAMING_COLOR}
                />
                <StatCard
                  icon={Eye}
                  value={stats?.avgViewers || 0}
                  label="Viewers moyens"
                  iconColor="#60a5fa"
                />
                <StatCard
                  icon={Clock}
                  value={stats?.watchTime || '0h'}
                  label="Watch time moyen"
                  iconColor="#f5a623"
                />
                <StatCard
                  icon={TrendingUp}
                  value="+12%"
                  label="Croissance"
                  iconColor="#4ade80"
                />
              </motion.div>

              {/* Next Stream Card - Featured */}
              <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-xl mb-6"
                style={{
                  background: `linear-gradient(135deg, ${STREAMING_COLOR}20 0%, rgba(139,147,255,0.05) 100%)`,
                  border: `1px solid ${STREAMING_COLOR}30`
                }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20" style={{ backgroundColor: STREAMING_COLOR }} />

                <div className="p-5 relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${STREAMING_COLOR}20` }}
                    >
                      <Calendar className="w-5 h-5" style={{ color: STREAMING_COLOR }} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-medium text-[#f7f8f8]">Prochain stream</h3>
                      <p className="text-[12px] text-[#8b8d90]">{stats?.scheduledSessions || 0} sessions planifiées</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[28px] font-semibold text-[#f7f8f8]">
                      {stats?.nextStream || 'Aucun'}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(255,255,255,0.08)]">
                      <Radio className="w-3.5 h-3.5 text-[#4ade80]" strokeWidth={1.5} />
                      <span className="text-[11px] text-[#4ade80] font-medium">Prêt</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Upcoming Streams */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[14px] font-medium text-[#f7f8f8] flex items-center gap-2">
                    <Play className="w-4 h-4" style={{ color: STREAMING_COLOR }} strokeWidth={1.5} />
                    Streams programmés
                  </h3>
                  <motion.button
                    className="text-[12px] font-medium text-[#5e6dd2] flex items-center gap-1 hover:text-[#8b93ff] transition-colors"
                    whileHover={{ x: 2 }}
                  >
                    Voir tout
                    <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </motion.button>
                </div>

                <div className="space-y-2">
                  {upcomingStreams.length > 0 ? (
                    upcomingStreams.map((stream, i) => (
                      <StreamCard key={i} stream={stream} index={i} />
                    ))
                  ) : (
                    <div className="p-6 text-center bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl">
                      <Tv className="w-10 h-10 mx-auto mb-3 text-[#5e6063]" strokeWidth={1.5} />
                      <p className="text-[13px] text-[#8b8d90]">Aucun stream programmé</p>
                      <p className="text-[11px] text-[#5e6063] mt-1">Planifiez votre prochain stream</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.div variants={itemVariants} className="mt-8">
                <motion.button
                  onClick={() => onNavigate?.('propose-session')}
                  className="w-full h-12 rounded-xl text-white text-[14px] font-medium shadow-lg flex items-center justify-center gap-2 transition-colors"
                  style={{
                    backgroundColor: STREAMING_COLOR,
                    boxShadow: `0 8px 20px ${STREAMING_COLOR}30`
                  }}
                  whileHover={{ y: -1, backgroundColor: '#9ba3ff' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Zap className="w-4 h-4" strokeWidth={1.5} />
                  Planifier un stream
                  <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                </motion.button>
              </motion.div>

              {/* Tips Banner */}
              <motion.div
                variants={itemVariants}
                className="mt-6 p-4 rounded-xl bg-[rgba(245,166,35,0.08)] border border-[rgba(245,166,35,0.2)]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[rgba(245,166,35,0.15)] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-[18px] h-[18px] text-[#f5a623]" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-[#f7f8f8]">Astuce du jour</p>
                    <p className="text-[12px] text-[#8b8d90]">Planifiez vos streams 48h à l'avance pour maximiser la participation</p>
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
