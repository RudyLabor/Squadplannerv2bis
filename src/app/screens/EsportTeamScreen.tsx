import { ArrowLeft, Trophy, Users, Target, BarChart3, Shield, Star, Gamepad2, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, IconButton, Badge } from '@/design-system';

interface EsportTeamScreenProps {
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

export function EsportTeamScreen({ onNavigate, showToast }: EsportTeamScreenProps) {
  const team = { name: 'Team Rocket', game: 'Valorant', rank: 'Radiant', members: 7, upcomingMatches: 3, winRate: 68 };
  const roster = [
    { name: 'MaxPro', role: 'IGL', rank: 'Radiant', availability: 98, isLeader: true },
    { name: 'SkillGod', role: 'Duelist', rank: 'Immortal 3', availability: 95, isLeader: false },
    { name: 'SupportKing', role: 'Support', rank: 'Immortal 2', availability: 92, isLeader: false },
    { name: 'FlashMaster', role: 'Entry', rank: 'Immortal 3', availability: 88, isLeader: false },
    { name: 'SmokeGuru', role: 'Controller', rank: 'Immortal 1', availability: 94, isLeader: false },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'IGL': return 'from-amber-500 to-orange-500';
      case 'Duelist': return 'from-red-500 to-rose-500';
      case 'Support': return 'from-emerald-500 to-teal-500';
      case 'Entry': return 'from-purple-500 to-violet-500';
      case 'Controller': return 'from-blue-500 to-indigo-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-yellow-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-br from-orange-400/15 to-red-400/15 rounded-full blur-3xl" />
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
              aria-label="Retour"
              className="w-12 h-12 rounded-2xl bg-[var(--bg-elevated)]/80 backdrop-blur-sm border border-[var(--bg-elevated)]/50 shadow-lg hover:shadow-xl"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Équipe Esport
              </h1>
              <p className="text-sm text-[var(--fg-secondary)] font-medium">
                Gestion professionnelle
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Trophy className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Team Hero */}
          <motion.div variants={itemVariants} className="text-center py-6 mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-orange-600 mb-4 shadow-xl shadow-red-500/30">
              <Trophy className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg-primary)] mb-1">{team.name}</h2>
            <p className="text-[var(--fg-secondary)] font-medium">{team.game} • {team.rank}</p>
          </motion.div>

          {/* B2B Mode Banner */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl p-5 mb-6 shadow-xl shadow-red-500/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-bold tracking-tight text-white">Mode B2B Activé</h3>
                  <p className="text-xs text-white/80">Gestion professionnelle</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-white">{team.members}</div>
                  <div className="text-xs text-white/80 font-medium">Joueurs</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-white">{team.upcomingMatches}</div>
                  <div className="text-xs text-white/80 font-medium">Matchs</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-white">{team.winRate}%</div>
                  <div className="text-xs text-white/80 font-medium">Win Rate</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Roster */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-red-500" />
              <h3 className="text-sm font-bold tracking-tight text-[var(--fg-secondary)]">
                Roster ({roster.length})
              </h3>
            </div>
            <div className="space-y-3">
              {roster.map((player, i) => (
                <Card
                  key={i}
                  variants={itemVariants}
                  className="p-4 hover:scale-[1.01] hover:-translate-y-0.5"
                  interactive
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getRoleColor(player.role)} flex items-center justify-center shadow-md relative`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Gamepad2 className="w-6 h-6 text-white" strokeWidth={2} />
                        {player.isLeader && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center shadow-md">
                            <Crown className="w-3 h-3 text-amber-800" strokeWidth={2.5} />
                          </div>
                        )}
                      </motion.div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold tracking-tight text-[var(--fg-primary)]">{player.name}</h4>
                          {player.isLeader && (
                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded">
                              IGL
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--fg-secondary)] font-medium">{player.role} • {player.rank}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${player.availability >= 95 ? 'text-emerald-600' : player.availability >= 90 ? 'text-amber-600' : 'text-red-600'}`}>
                        {player.availability}%
                      </div>
                      <div className="text-xs text-[var(--fg-tertiary)] font-medium">Dispo</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
            <motion.button
              onClick={() => onNavigate?.('sessions')}
              className="h-14 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-2xl shadow-lg shadow-red-500/30 hover:shadow-xl font-bold transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Target className="w-5 h-5" strokeWidth={2} />
              Scrims
            </motion.button>
            <motion.button
              onClick={() => onNavigate?.('tournaments')}
              className="h-14 bg-[var(--bg-elevated)]/80 backdrop-blur-sm border border-[var(--bg-elevated)]/50 text-[var(--fg-secondary)] rounded-2xl shadow-lg hover:shadow-xl font-bold transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Trophy className="w-5 h-5" strokeWidth={2} />
              Tournois
            </motion.button>
          </motion.div>

          {/* Stats Banner */}
          <motion.div
            variants={itemVariants}
            className="mt-6 bg-gradient-to-br from-amber-100/80 to-orange-100/80 backdrop-blur-sm rounded-2xl p-4 border border-amber-200/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                <BarChart3 className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-amber-800">
                  Analytics avancées disponibles
                </p>
                <p className="text-[10px] text-amber-600 mt-0.5">
                  Suivez les performances de votre équipe
                </p>
              </div>
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default EsportTeamScreen;
