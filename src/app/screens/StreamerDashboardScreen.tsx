import { ArrowLeft, Video, Users, Eye, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface StreamerDashboardScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function StreamerDashboardScreen({ onNavigate, showToast }: StreamerDashboardScreenProps) {
  const stats = { followers: 12450, avgViewers: 385, nextStream: 'Demain 21h', scheduledSessions: 4 };
  const upcomingStreams = [
    { date: '25 Jan', time: '21h', game: 'Valorant', squad: 'Squad Alpha', viewers: 350 },
    { date: '27 Jan', time: '20h', game: 'CS2', squad: 'Squad Beta', viewers: 420 },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20">
      <div className="sticky top-0 z-10 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={() => onNavigate?.('home')} className="p-2 hover:bg-[var(--background-elevated)] rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" strokeWidth={2} />
          </button>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Streamer Dashboard</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#9146FF] to-[#772CE8] mb-4 shadow-lg">
            <Video className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Dashboard Créateur</h2>
          <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">
            Planifiez vos streams avec vos squads
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-[#9146FF]/10 to-[#772CE8]/10 rounded-xl p-4 border-[0.5px] border-[#9146FF]/20 text-center">
            <Users className="w-6 h-6 text-[#9146FF] mx-auto mb-2" strokeWidth={2} />
            <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.followers.toLocaleString()}</div>
            <div className="text-xs text-[var(--text-tertiary)]">Followers</div>
          </div>
          <div className="bg-gradient-to-br from-[#9146FF]/10 to-[#772CE8]/10 rounded-xl p-4 border-[0.5px] border-[#9146FF]/20 text-center">
            <Eye className="w-6 h-6 text-[#9146FF] mx-auto mb-2" strokeWidth={2} />
            <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.avgViewers}</div>
            <div className="text-xs text-[var(--text-tertiary)]">Viewers moy.</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-[#9146FF] to-[#772CE8] rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5" strokeWidth={2} />
            <h3 className="font-semibold">Prochain stream</h3>
          </div>
          <div className="text-2xl font-bold mb-1">{stats.nextStream}</div>
          <div className="text-sm text-white/80">{stats.scheduledSessions} sessions planifiées ce mois</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3 px-1">
            Streams programmés
          </h3>
          <div className="space-y-3">
            {upcomingStreams.map((stream, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-medium)] shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)]">{stream.game}</h4>
                    <p className="text-xs text-[var(--text-secondary)]">{stream.date} • {stream.time}</p>
                  </div>
                  <span className="px-2 py-1 bg-[#9146FF]/10 text-[#9146FF] text-xs font-semibold rounded-lg">
                    ~{stream.viewers} viewers
                  </span>
                </div>
                <div className="text-xs text-[var(--text-tertiary)]">Avec {stream.squad}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-center">
          <button onClick={() => onNavigate?.('propose-session')} className="px-6 py-3 bg-[#9146FF] text-white rounded-xl font-medium hover:bg-[#772CE8] transition-colors">
            Planifier un stream
          </button>
        </motion.div>
      </div>
    </div>
  );
}
