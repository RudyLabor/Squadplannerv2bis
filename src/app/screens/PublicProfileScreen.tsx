import { ArrowLeft, Trophy, TrendingUp, Users, Calendar, UserPlus, MessageCircle, Shield, Star, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface PublicProfileScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

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
    bio: 'Joueur passionné de FPS et MOBA. Toujours partant pour une session ! 🎮',
    topGames: ['Valorant', 'League of Legends', 'CS2'],
    achievements: [
      { name: 'Fiabilité Parfaite', rarity: 'legendary', icon: Trophy },
      { name: 'Leader de Squad', rarity: 'rare', icon: Shield },
      { name: 'Marathon Gamer', rarity: 'epic', icon: Award },
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

  return (
    <div className="min-h-screen pb-24 pt-safe">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Profil Public
            </h1>
          </div>
        </div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] rounded-2xl p-6 mb-6 shadow-lg"
        >
          <div className="flex items-start gap-4 mb-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
              {mockUser.name[0]}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-white mb-1">
                {mockUser.name}
              </h2>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs font-bold">
                  Niveau {mockUser.level}
                </span>
                <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs font-bold">
                  {mockUser.reliabilityScore} fiabilité
                </span>
              </div>
              <p className="text-sm text-white/90 font-medium">
                Membre depuis {mockUser.joinedDate}
              </p>
            </div>
          </div>

          {/* Bio */}
          {mockUser.bio && (
            <p className="text-sm text-white/90 font-medium mb-4">
              {mockUser.bio}
            </p>
          )}

          {/* Top Games */}
          <div className="flex gap-2 flex-wrap">
            {mockUser.topGames.map((game) => (
              <span
                key={game}
                className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-white text-xs font-semibold"
              >
                {game}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          {!isFriend && (
            <button
              onClick={handleAddFriend}
              className="flex-1 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] shadow-lg shadow-[var(--primary-500)]/20 transition-all duration-200"
            >
              <UserPlus className="w-4 h-4" strokeWidth={2} />
              Ajouter en ami
            </button>
          )}
          <button
            onClick={handleInviteToSquad}
            className="flex-1 h-12 rounded-xl bg-white border-[0.5px] border-[var(--border-medium)] text-[var(--fg-primary)] font-semibold text-sm flex items-center justify-center gap-2 hover:border-[var(--primary-500)] hover:text-[var(--primary-500)] transition-all shadow-sm"
          >
            <Users className="w-4 h-4" strokeWidth={2} />
            Inviter
          </button>
          <button
            onClick={handleSendMessage}
            className="h-12 w-12 rounded-xl bg-white border-[0.5px] border-[var(--border-medium)] text-[var(--fg-primary)] flex items-center justify-center hover:border-[var(--primary-500)] hover:text-[var(--primary-500)] transition-all shadow-sm"
          >
            <MessageCircle className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm text-center"
          >
            <div className="text-2xl font-bold text-[var(--fg-primary)] mb-1">
              {mockUser.totalSessions}
            </div>
            <div className="text-xs text-[var(--fg-tertiary)] font-semibold">
              Sessions
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm text-center"
          >
            <div className="text-2xl font-bold text-[var(--success-500)] mb-1">
              {mockUser.attendance}%
            </div>
            <div className="text-xs text-[var(--fg-tertiary)] font-semibold">
              Présence
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm text-center"
          >
            <div className="text-2xl font-bold text-[var(--fg-primary)] mb-1">
              {mockUser.squads}
            </div>
            <div className="text-xs text-[var(--fg-tertiary)] font-semibold">
              Squads
            </div>
          </motion.div>
        </div>

        {/* Achievements Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[var(--primary-500)]" strokeWidth={2} />
            Trophées en vedette
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {mockUser.achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={achievement.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--primary-50)] flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-6 h-6 text-[var(--primary-500)]" strokeWidth={2} />
                  </div>
                  <div className="text-[10px] text-[var(--fg-secondary)] font-semibold line-clamp-2">
                    {achievement.name}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--primary-500)]" strokeWidth={2} />
            Activité récente
          </h3>
          <div className="space-y-3">
            {mockUser.recentActivity.map((activity, index) => {
              const icons = {
                session: Calendar,
                achievement: Trophy,
                squad: Users,
              };
              const Icon = icons[activity.type as keyof typeof icons];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--primary-50)] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[var(--primary-500)]" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[var(--fg-primary)] font-medium">
                      {activity.content}
                    </div>
                    <div className="text-xs text-[var(--fg-tertiary)] font-medium mt-0.5">
                      {activity.date}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
export default PublicProfileScreen;
