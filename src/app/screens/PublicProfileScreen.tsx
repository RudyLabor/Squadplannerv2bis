import { ArrowLeft, Trophy, TrendingUp, Users, Calendar, UserPlus, MessageCircle, Shield, Star, Award, Gamepad2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Card, IconButton } from '@/design-system';

interface PublicProfileScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
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
    bio: 'Joueur passionne de FPS et MOBA. Toujours partant pour une session !',
    topGames: ['Valorant', 'League of Legends', 'CS2'],
    achievements: [
      { name: 'Fiabilite Parfaite', rarity: 'legendary', icon: Trophy },
      { name: 'Leader de Squad', rarity: 'rare', icon: Shield },
      { name: 'Marathon Gamer', rarity: 'epic', icon: Award },
    ],
    recentActivity: [
      { type: 'session', content: 'Ranked Valorant', date: 'Il y a 2h' },
      { type: 'achievement', content: 'Debloque "Semaine parfaite"', date: 'Il y a 1j' },
      { type: 'squad', content: 'A rejoint "Elite Warriors"', date: 'Il y a 3j' },
    ],
  };

  const isFriend = false;

  const handleAddFriend = () => {
    showToast('Invitation d\'ami envoyee !', 'success');
  };

  const handleInviteToSquad = () => {
    showToast('Invitation a rejoindre une squad envoyee !', 'success');
  };

  const handleSendMessage = () => {
    showToast('Messagerie bientot disponible', 'info');
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-[var(--color-warning-500)] to-orange-500';
      case 'epic': return 'from-purple-500 to-violet-500';
      case 'rare': return 'from-blue-500 to-[var(--color-primary-500)]';
      default: return 'from-[var(--fg-tertiary)] to-slate-500';
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-[var(--color-primary-50)] via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[var(--color-primary-400)]/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-success-400)]/15 to-teal-400/15 rounded-full blur-3xl" />
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
              aria-label="Retour"
              icon={<ArrowLeft className="w-5 h-5" strokeWidth={2} />}
              variant="secondary"
              onClick={() => onNavigate('home')}
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--color-primary-600)] to-purple-600 bg-clip-text text-transparent tracking-tight">
                Profil Public
              </h1>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 flex items-center justify-center shadow-lg shadow-[var(--color-primary-500)]/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Gamepad2 className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Profile Header Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 rounded-2xl p-6 mb-6 shadow-xl shadow-[var(--color-primary-500)]/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-4">
                <motion.div
                  className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-3xl flex-shrink-0"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  {mockUser.name[0]}
                </motion.div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                    {mockUser.name}
                  </h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs font-bold">
                      Niveau {mockUser.level}
                    </span>
                    <span className="px-2.5 py-1 bg-[var(--color-success-400)]/30 backdrop-blur-sm rounded-lg text-white text-xs font-bold">
                      {mockUser.reliabilityScore}% fiabilite
                    </span>
                  </div>
                  <p className="text-sm text-white/80 font-medium mt-2">
                    Membre depuis {mockUser.joinedDate}
                  </p>
                </div>
              </div>

              {mockUser.bio && (
                <p className="text-sm text-white/90 font-medium mb-4">
                  {mockUser.bio}
                </p>
              )}

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
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex gap-3 mb-6">
            {!isFriend && (
              <Button
                onClick={handleAddFriend}
                icon={<UserPlus className="w-4 h-4" strokeWidth={2} />}
                fullWidth
                className="flex-1"
              >
                Ajouter en ami
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={handleInviteToSquad}
              icon={<Users className="w-4 h-4" strokeWidth={2} />}
              fullWidth
              className="flex-1"
            >
              Inviter
            </Button>
            <IconButton
              aria-label="Message"
              icon={<MessageCircle className="w-5 h-5" strokeWidth={2} />}
              variant="secondary"
              onClick={handleSendMessage}
            />
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
            <Card variant="elevated" padding="md" className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm text-center">
              <div className="text-2xl font-bold text-[var(--fg-primary)] mb-1">
                {mockUser.totalSessions}
              </div>
              <div className="text-xs text-[var(--fg-secondary)] font-semibold">
                Sessions
              </div>
            </Card>

            <Card variant="elevated" padding="md" className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm text-center">
              <div className="text-2xl font-bold text-[var(--color-success-600)] mb-1">
                {mockUser.attendance}%
              </div>
              <div className="text-xs text-[var(--fg-secondary)] font-semibold">
                Presence
              </div>
            </Card>

            <Card variant="elevated" padding="md" className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm text-center">
              <div className="text-2xl font-bold text-[var(--fg-primary)] mb-1">
                {mockUser.squads}
              </div>
              <div className="text-xs text-[var(--fg-secondary)] font-semibold">
                Squads
              </div>
            </Card>
          </motion.div>

          {/* Achievements Section */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-[var(--color-warning-500)]" />
              <h3 className="text-sm font-bold text-[var(--fg-secondary)] tracking-tight">
                Trophees en vedette
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {mockUser.achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <Card
                    key={achievement.name}
                    variant="elevated"
                    padding="md"
                    className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm text-center"
                  >
                    <motion.div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getRarityGradient(achievement.rarity)} flex items-center justify-center mx-auto mb-2 shadow-md`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                    </motion.div>
                    <div className="text-[10px] text-[var(--fg-secondary)] font-semibold line-clamp-2">
                      {achievement.name}
                    </div>
                  </Card>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[var(--color-primary-500)]" />
              <h3 className="text-sm font-bold text-[var(--fg-secondary)] tracking-tight">
                Activite recente
              </h3>
            </div>
            <div className="space-y-3">
              {mockUser.recentActivity.map((activity, index) => {
                const icons = {
                  session: Calendar,
                  achievement: Trophy,
                  squad: Users,
                };
                const gradients = {
                  session: 'from-blue-500 to-[var(--color-primary-500)]',
                  achievement: 'from-[var(--color-warning-500)] to-orange-500',
                  squad: 'from-[var(--color-success-500)] to-teal-500',
                };
                const Icon = icons[activity.type as keyof typeof icons];
                const gradient = gradients[activity.type as keyof typeof gradients];

                return (
                  <Card
                    key={index}
                    variant="elevated"
                    padding="md"
                    className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm flex items-center gap-3"
                  >
                    <motion.div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-md`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[var(--fg-primary)] font-medium">
                        {activity.content}
                      </div>
                      <div className="text-xs text-[var(--fg-secondary)] font-medium mt-0.5">
                        {activity.date}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </motion.div>

          {/* Pro Tip */}
          <motion.div
            variants={itemVariants}
            className="mt-6 bg-gradient-to-br from-[var(--color-warning-100)]/80 to-orange-100/80 backdrop-blur-sm rounded-2xl p-4 border border-[var(--color-warning-200)]/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-warning-500)] to-orange-500 flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-[var(--color-warning-800)]">
                  Profil verifie
                </p>
                <p className="text-[10px] text-[var(--color-warning-600)] mt-0.5">
                  Ce joueur a un excellent historique de fiabilite
                </p>
              </div>
              <Star className="w-5 h-5 text-[var(--color-warning-500)] fill-[var(--color-warning-500)]" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
export default PublicProfileScreen;
