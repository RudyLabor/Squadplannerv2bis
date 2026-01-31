/**
 * PUBLIC PROFILE SCREEN - LINEAR DESIGN SYSTEM
 * Profile public d'un autre joueur - Design premium minimal
 * Central question: "Puis-je faire confiance à ce joueur?"
 */

import {
  ArrowLeft,
  Trophy,
  TrendingUp,
  Users,
  Calendar,
  UserPlus,
  MessageCircle,
  Shield,
  Star,
  Award,
  Gamepad2,
  CheckCircle2,
  Clock,
  Flame,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PublicProfileScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

// Animations - Linear style
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.02 }
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

// ============================================
// SECONDARY STAT - Smaller with icon
// ============================================
function SecondaryStat({
  value,
  label,
  icon: Icon,
  iconColor = "text-[#5e6dd2]"
}: {
  value: string | number;
  label: string;
  icon?: any;
  iconColor?: string;
}) {
  return (
    <div className="text-center">
      {Icon && <Icon className={`w-4 h-4 ${iconColor} opacity-50 mx-auto mb-1`} strokeWidth={1.5} />}
      <p className="text-[18px] font-semibold text-[#f7f8f8] tabular-nums leading-none mb-0.5">
        {value}
      </p>
      <span className="text-[11px] text-[#5e6063]">{label}</span>
    </div>
  );
}

// ============================================
// ACTIVITY ITEM
// ============================================
function ActivityItem({
  icon: Icon,
  iconBgColor,
  iconColor,
  content,
  date
}: {
  icon: any;
  iconBgColor: string;
  iconColor: string;
  content: string;
  date: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[rgba(255,255,255,0.02)] transition-colors">
      <div className={`w-9 h-9 rounded-lg ${iconBgColor} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-4 h-4 ${iconColor}`} strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-[#f7f8f8] font-medium truncate">{content}</p>
        <p className="text-[11px] text-[#5e6063]">{date}</p>
      </div>
    </div>
  );
}

// ============================================
// ACHIEVEMENT BADGE
// ============================================
function AchievementBadge({
  icon: Icon,
  name,
  rarity
}: {
  icon: any;
  name: string;
  rarity: 'legendary' | 'epic' | 'rare' | 'common';
}) {
  const colors = {
    legendary: { bg: 'bg-[rgba(245,166,35,0.1)]', icon: 'text-[#f5a623]', border: 'border-[rgba(245,166,35,0.2)]' },
    epic: { bg: 'bg-[rgba(168,85,247,0.1)]', icon: 'text-[#a855f7]', border: 'border-[rgba(168,85,247,0.2)]' },
    rare: { bg: 'bg-[rgba(96,165,250,0.1)]', icon: 'text-[#60a5fa]', border: 'border-[rgba(96,165,250,0.2)]' },
    common: { bg: 'bg-[rgba(255,255,255,0.04)]', icon: 'text-[#8b8d90]', border: 'border-[rgba(255,255,255,0.06)]' }
  };
  const color = colors[rarity];

  return (
    <motion.div
      className={`p-3 rounded-xl ${color.bg} border ${color.border} text-center`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.1 }}
    >
      <div className={`w-10 h-10 rounded-lg ${color.bg} flex items-center justify-center mx-auto mb-2`}>
        <Icon className={`w-5 h-5 ${color.icon}`} strokeWidth={1.5} />
      </div>
      <p className="text-[11px] text-[#8b8d90] font-medium line-clamp-2">{name}</p>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export function PublicProfileScreen({ onNavigate, showToast }: PublicProfileScreenProps) {
  const mockUser = {
    name: 'ProGamer2K',
    level: 42,
    reliabilityScore: 95,
    totalSessions: 187,
    attendance: 92,
    squads: 5,
    friends: 23,
    joinedDate: 'Janvier 2025',
    bio: 'Joueur passionné de FPS et MOBA. Toujours partant pour une session !',
    topGames: ['Valorant', 'League of Legends', 'CS2'],
    achievements: [
      { name: 'Fiabilité Parfaite', rarity: 'legendary' as const, icon: Trophy },
      { name: 'Leader de Squad', rarity: 'rare' as const, icon: Shield },
      { name: 'Marathon Gamer', rarity: 'epic' as const, icon: Award },
    ],
    recentActivity: [
      { type: 'session', content: 'Ranked Valorant', date: 'Il y a 2h' },
      { type: 'achievement', content: 'Débloqué "Semaine parfaite"', date: 'Il y a 1j' },
      { type: 'squad', content: 'A rejoint "Elite Warriors"', date: 'Il y a 3j' },
    ],
  };

  const isFriend = false;

  const handleAddFriend = () => {
    showToast('Invitation d\'ami envoyée !', 'success');
  };

  const handleInviteToSquad = () => {
    showToast('Invitation à rejoindre une squad envoyée !', 'success');
  };

  const handleSendMessage = () => {
    showToast('Messagerie bientôt disponible', 'info');
  };

  const activityIcons = {
    session: { icon: Calendar, bg: 'bg-[rgba(96,165,250,0.1)]', color: 'text-[#60a5fa]' },
    achievement: { icon: Trophy, bg: 'bg-[rgba(245,166,35,0.1)]', color: 'text-[#f5a623]' },
    squad: { icon: Users, bg: 'bg-[rgba(139,147,255,0.1)]', color: 'text-[#8b93ff]' },
  };

  return (
    <div className="min-h-screen bg-[#08090a] pb-24 md:pb-8">
      <motion.div
        className="max-w-3xl mx-auto px-4 md:px-6 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
          <motion.button
            onClick={() => onNavigate('home')}
            className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.06)] transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-[20px] md:text-[24px] font-semibold text-[#f7f8f8]">Profil Public</h1>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[rgba(139,147,255,0.1)] flex items-center justify-center">
            <Gamepad2 className="w-5 h-5 text-[#8b93ff]" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* IDENTITY BLOCK */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="p-5 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
            <div className="flex items-start gap-4 mb-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-xl bg-[#1f2023] overflow-hidden border border-[#27282b] flex items-center justify-center">
                  <span className="text-2xl font-semibold text-[#8b8d90]">
                    {mockUser.name[0]}
                  </span>
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#4ade80] border-2 border-[#08090a]" />
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-[18px] md:text-[20px] font-semibold text-[#f7f8f8] mb-1">{mockUser.name}</h2>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="px-2 py-0.5 text-[11px] font-medium text-[#8b93ff] bg-[rgba(139,147,255,0.1)] rounded-md">
                    Niveau {mockUser.level}
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-medium text-[#4ade80] bg-[rgba(74,222,128,0.1)] rounded-md">
                    {mockUser.reliabilityScore}% fiabilité
                  </span>
                </div>
                <p className="text-[12px] text-[#5e6063] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Membre depuis {mockUser.joinedDate}
                </p>
              </div>
            </div>

            {/* Bio */}
            {mockUser.bio && (
              <p className="text-[13px] text-[#8b8d90] mb-4 leading-relaxed">
                {mockUser.bio}
              </p>
            )}

            {/* Top Games */}
            <div className="flex gap-2 flex-wrap">
              {mockUser.topGames.map((game) => (
                <span
                  key={game}
                  className="px-2.5 py-1 text-[11px] font-medium text-[#8b8d90] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] rounded-lg"
                >
                  {game}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* ACTION BUTTONS */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="flex gap-3 mb-6">
          {!isFriend && (
            <motion.button
              onClick={handleAddFriend}
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-[#5e6dd2] text-white text-[13px] font-medium hover:bg-[#6e7de2] transition-colors"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <UserPlus className="w-4 h-4" strokeWidth={1.5} />
              Ajouter en ami
            </motion.button>
          )}
          <motion.button
            onClick={handleInviteToSquad}
            className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] text-[#f7f8f8] text-[13px] font-medium hover:bg-[rgba(255,255,255,0.06)] transition-colors"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Users className="w-4 h-4" strokeWidth={1.5} />
            Inviter
          </motion.button>
          <motion.button
            onClick={handleSendMessage}
            className="w-11 h-11 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.06)] transition-all"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
          </motion.button>
        </motion.div>

        {/* ============================================ */}
        {/* FIABILITÉ HERO BLOCK */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="p-5 rounded-2xl bg-[rgba(74,222,128,0.03)] border border-[rgba(74,222,128,0.1)]">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-[#4ade80]" strokeWidth={1.5} />
              <span className="text-[13px] font-medium text-[#8b8d90] uppercase tracking-wide">Score de Fiabilité</span>
            </div>

            {/* Big reliability score */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-[48px] md:text-[56px] font-bold text-[#4ade80] tabular-nums leading-none">
                {mockUser.reliabilityScore}
              </span>
              <span className="text-[20px] font-medium text-[#4ade80]/60">%</span>
            </div>

            {/* Supporting metrics */}
            <div className="flex items-center gap-6 text-[13px]">
              <div className="flex items-center gap-1.5 text-[#8b8d90]">
                <Trophy className="w-4 h-4 text-[#f5a623]/70" strokeWidth={1.5} />
                <span className="tabular-nums">{mockUser.totalSessions}</span>
                <span className="text-[#5e6063]">sessions</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#8b8d90]">
                <Clock className="w-4 h-4 text-[#60a5fa]/70" strokeWidth={1.5} />
                <span className="tabular-nums">{mockUser.attendance}%</span>
                <span className="text-[#5e6063]">présence</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* SECONDARY STATS */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="p-4 md:p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
            <div className="grid grid-cols-4 gap-4">
              <SecondaryStat
                value={mockUser.totalSessions}
                label="Sessions"
                icon={Calendar}
                iconColor="text-[#60a5fa]"
              />
              <SecondaryStat
                value={`${mockUser.attendance}%`}
                label="Présence"
                icon={Clock}
                iconColor="text-[#4ade80]"
              />
              <SecondaryStat
                value={mockUser.squads}
                label="Squads"
                icon={Gamepad2}
                iconColor="text-[#5e6dd2]"
              />
              <SecondaryStat
                value={mockUser.friends}
                label="Amis"
                icon={Users}
                iconColor="text-[#8b93ff]"
              />
            </div>
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* ACHIEVEMENTS - Trophées en vedette */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#f5a623]" strokeWidth={1.5} />
              <span className="text-[12px] font-medium text-[#5e6063] uppercase tracking-wide">Trophées en vedette</span>
            </div>
            <motion.button
              onClick={() => onNavigate('badges')}
              className="text-[12px] text-[#5e6dd2] hover:text-[#8b93ff] transition-colors font-medium flex items-center gap-0.5"
              whileHover={{ x: 2 }}
            >
              Voir tout
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {mockUser.achievements.map((achievement) => (
              <AchievementBadge
                key={achievement.name}
                icon={achievement.icon}
                name={achievement.name}
                rarity={achievement.rarity}
              />
            ))}
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* RECENT ACTIVITY */}
        {/* ============================================ */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-[#5e6dd2]" strokeWidth={1.5} />
            <span className="text-[12px] font-medium text-[#5e6063] uppercase tracking-wide">Activité récente</span>
          </div>
          <div className="rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] overflow-hidden divide-y divide-[rgba(255,255,255,0.04)]">
            {mockUser.recentActivity.map((activity, index) => {
              const activityStyle = activityIcons[activity.type as keyof typeof activityIcons];
              return (
                <ActivityItem
                  key={index}
                  icon={activityStyle.icon}
                  iconBgColor={activityStyle.bg}
                  iconColor={activityStyle.color}
                  content={activity.content}
                  date={activity.date}
                />
              );
            })}
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* VERIFIED PROFILE BADGE */}
        {/* ============================================ */}
        <motion.div variants={itemVariants}>
          <div className="p-4 rounded-xl bg-[rgba(74,222,128,0.03)] border border-[rgba(74,222,128,0.1)] flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(74,222,128,0.1)] flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-[#4ade80]" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#f7f8f8]">Profil vérifié</p>
              <p className="text-[11px] text-[#5e6063]">Ce joueur a un excellent historique de fiabilité</p>
            </div>
            <Star className="w-5 h-5 text-[#f5a623] fill-[#f5a623]" strokeWidth={1.5} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default PublicProfileScreen;
