import { ArrowLeft, Trophy, Users, Target, BarChart3, Shield, Star, Gamepad2, Crown, Zap, TrendingUp, Calendar, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface EsportTeamScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
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

// Couleur Esport = violet
const ESPORT_COLOR = '#5e6dd2';
const ESPORT_COLOR_LIGHT = '#6b7bdf';

export function EsportTeamScreen({ onNavigate }: EsportTeamScreenProps) {
  const team = {
    name: 'Team Rocket',
    game: 'Valorant',
    rank: 'Radiant',
    members: 7,
    upcomingMatches: 3,
    winRate: 68,
    streak: 5
  };

  const roster = [
    { name: 'MaxPro', role: 'IGL', rank: 'Radiant', availability: 98, isLeader: true },
    { name: 'SkillGod', role: 'Duelist', rank: 'Immortal 3', availability: 95, isLeader: false },
    { name: 'SupportKing', role: 'Support', rank: 'Immortal 2', availability: 92, isLeader: false },
    { name: 'FlashMaster', role: 'Entry', rank: 'Immortal 3', availability: 88, isLeader: false },
    { name: 'SmokeGuru', role: 'Controller', rank: 'Immortal 1', availability: 94, isLeader: false },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'IGL': return 'bg-amber-500/20 text-amber-400';
      case 'Duelist': return 'bg-red-500/20 text-red-400';
      case 'Support': return 'bg-emerald-500/20 text-emerald-400';
      case 'Entry': return 'bg-purple-500/20 text-purple-400';
      case 'Controller': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getRoleIconBg = (role: string) => {
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
    <div className="min-h-screen pb-24 md:pb-8 bg-[#08090a]">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <motion.button
              onClick={() => onNavigate?.('home')}
              className="w-10 h-10 rounded-xl bg-[#1a1a1c] border border-[#27282b] flex items-center justify-center text-[#8b8d90] hover:text-white hover:bg-[#232326] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-white tracking-tight">
                Equipe Esport
              </h1>
              <p className="text-sm text-[#5e6063]">
                Gestion professionnelle
              </p>
            </div>
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${ESPORT_COLOR}20` }}
              whileHover={{ scale: 1.05 }}
            >
              <Trophy className="w-5 h-5" style={{ color: ESPORT_COLOR }} strokeWidth={1.5} />
            </motion.div>
          </motion.div>

          {/* Team Hero Card */}
          <motion.div
            variants={itemVariants}
            className="bg-[#111113] border border-[#1e1f22] rounded-2xl p-5 mb-4"
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${ESPORT_COLOR}, ${ESPORT_COLOR_LIGHT})` }}
              >
                <Trophy className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-white">{team.name}</h2>
                <p className="text-sm text-[#8b8d90]">{team.game}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="px-2 py-0.5 rounded-md text-xs font-medium"
                    style={{ backgroundColor: `${ESPORT_COLOR}20`, color: ESPORT_COLOR }}
                  >
                    {team.rank}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <Zap className="w-3 h-3" />
                    {team.streak} victoires
                  </span>
                </div>
              </div>
            </div>

            {/* Team Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#0c0c0e] border border-[#1e1f22] rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-white">{team.members}</div>
                <div className="text-xs text-[#5e6063]">Joueurs</div>
              </div>
              <div className="bg-[#0c0c0e] border border-[#1e1f22] rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-white">{team.upcomingMatches}</div>
                <div className="text-xs text-[#5e6063]">Matchs</div>
              </div>
              <div className="bg-[#0c0c0e] border border-[#1e1f22] rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-emerald-400">{team.winRate}%</div>
                <div className="text-xs text-[#5e6063]">Win Rate</div>
              </div>
            </div>
          </motion.div>

          {/* B2B Mode Banner */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl p-4 mb-6 border"
            style={{
              background: `linear-gradient(135deg, ${ESPORT_COLOR}15, ${ESPORT_COLOR}08)`,
              borderColor: `${ESPORT_COLOR}30`
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${ESPORT_COLOR}25` }}
              >
                <Shield className="w-5 h-5" style={{ color: ESPORT_COLOR }} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm">Mode B2B Active</h3>
                <p className="text-xs text-[#8b8d90]">Fonctionnalites professionnelles disponibles</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#5e6063]" />
            </div>
          </motion.div>

          {/* Roster Section */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" style={{ color: ESPORT_COLOR }} strokeWidth={1.5} />
                <h3 className="text-sm font-medium text-[#8b8d90] uppercase tracking-wider">
                  Roster
                </h3>
              </div>
              <span className="text-xs text-[#5e6063]">{roster.length} joueurs</span>
            </div>

            <div className="space-y-2">
              {roster.map((player, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="bg-[#111113] border border-[#1e1f22] rounded-xl p-3.5 hover:bg-[#151517] hover:border-[#27282b] transition-all cursor-pointer"
                  whileHover={{ x: 2 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div
                          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${getRoleIconBg(player.role)} flex items-center justify-center`}
                        >
                          <Gamepad2 className="w-5 h-5 text-white" strokeWidth={1.5} />
                        </div>
                        {player.isLeader && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center border-2 border-[#111113]">
                            <Crown className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-white text-sm">{player.name}</h4>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getRoleColor(player.role)}`}>
                            {player.role}
                          </span>
                        </div>
                        <p className="text-xs text-[#5e6063] mt-0.5">{player.rank}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${
                        player.availability >= 95
                          ? 'text-emerald-400'
                          : player.availability >= 90
                            ? 'text-amber-400'
                            : 'text-red-400'
                      }`}>
                        {player.availability}%
                      </div>
                      <div className="text-[10px] text-[#5e6063]">Disponible</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
            <motion.button
              onClick={() => onNavigate?.('sessions')}
              className="h-12 rounded-xl font-medium text-sm text-white flex items-center justify-center gap-2 transition-all"
              style={{ backgroundColor: ESPORT_COLOR }}
              whileHover={{ scale: 1.02, backgroundColor: ESPORT_COLOR_LIGHT }}
              whileTap={{ scale: 0.98 }}
            >
              <Target className="w-4 h-4" strokeWidth={1.5} />
              Scrims
            </motion.button>
            <motion.button
              onClick={() => onNavigate?.('tournaments')}
              className="h-12 bg-[#111113] border border-[#27282b] text-[#f7f8f8] rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 hover:bg-[#1a1a1c] hover:border-[#333438]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Trophy className="w-4 h-4" strokeWidth={1.5} />
              Tournois
            </motion.button>
          </motion.div>

          {/* Upcoming Match Card */}
          <motion.div
            variants={itemVariants}
            className="bg-[#111113] border border-[#1e1f22] rounded-xl p-4 mb-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4" style={{ color: ESPORT_COLOR }} strokeWidth={1.5} />
              <h3 className="text-sm font-medium text-white">Prochain match</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">vs Team Liquid</p>
                <p className="text-xs text-[#5e6063] mt-0.5">Demain, 20h00</p>
              </div>
              <span
                className="px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{ backgroundColor: `${ESPORT_COLOR}20`, color: ESPORT_COLOR }}
              >
                Scrim
              </span>
            </div>
          </motion.div>

          {/* Analytics Banner */}
          <motion.div
            variants={itemVariants}
            className="bg-[#111113] border border-[#1e1f22] rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-white">Analytics avancees</h3>
                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <TrendingUp className="w-3 h-3" />
                    +12%
                  </span>
                </div>
                <p className="text-xs text-[#5e6063] mt-0.5">
                  Suivez les performances de votre equipe
                </p>
              </div>
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default EsportTeamScreen;
