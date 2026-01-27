import { Settings, ChevronRight, Shield, Sparkles, TrendingUp, Trophy, Clock, Target, Crown, Users, Award, Medal, Calendar, Edit, Bell, Link2 } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useTranslation } from '@/i18n/useTranslation';
import { useUser } from '@/app/contexts/UserContext';
import { usePerformanceMonitor } from '@/app/hooks/usePerformanceMonitor';
import { statsAPI } from '@/utils/api';
import { useState, useEffect } from 'react';
import { AnimatedCard, AnimatedList, AnimatedListItem, ParallaxSection } from '@/app/components/animations';
import { staggerContainer, easings } from '@/utils/motion-variants';
import { Palette } from 'lucide-react';

interface ProfileScreenProps {
  onNavigate?: (screen: string) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
  onLogout?: () => void;
  userEmail?: string;
  userName?: string;
  isPremium?: boolean;
}

export function ProfileScreen({ onNavigate, showToast, onLogout, userEmail, userName, isPremium }: ProfileScreenProps) {
  const { t } = useTranslation();
  const { userProfile, user } = useUser();
  const [userStats, setUserStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // 🔍 Performance Monitoring
  usePerformanceMonitor('ProfileScreen');

  // Load user stats (ROADMAP #2)
  useEffect(() => {
    const loadStats = async () => {
      if (!user?.id) {
        setLoadingStats(false);
        return;
      }

      try {
        const response = await statsAPI.getUserStats(user.id);
        setUserStats(response.stats);
        setLoadingStats(false);
      } catch (error: any) {
        console.error('Error loading user stats:', error);
        // Fallback to default stats if error
        setUserStats({
          reliabilityScore: 100,
          totalSessions: 0,
          attendedSessions: 0,
          attendanceRate: 100,
          noShowCount: 0,
          noShowRate: 0,
          badges: [],
        });
        setLoadingStats(false);
      }
    };

    loadStats();
  }, [user?.id]);

  const profile = {
    name: userProfile.displayName,
    username: userProfile.username,
    avatar: userProfile.avatarUrl,
    bio: userProfile.bio,
    location: userProfile.location,
    favoriteGame: userProfile.favoriteGame,
    playStyle: userProfile.playStyle,
    availableHours: userProfile.availableHours,
    level: 47,
    rank: 'Shotcaller',
    reliability: userStats?.reliabilityScore || 100, // Real reliability score from backend
    sessions: userStats?.totalSessions || 0, // Real sessions count
    mvp: 23,
    hoursPlayed: 384,
  };

  const stats = [
    { label: 'Fiabilité', value: `${profile.reliability}%`, color: 'var(--primary-500)' },
    { label: 'Sessions', value: profile.sessions, color: 'var(--primary-500)' },
    { label: 'MVP', value: profile.mvp, color: 'var(--primary-500)' },
    { label: 'Heures jouées', value: profile.hoursPlayed, color: 'var(--primary-500)' },
  ];

  const settings = [
    { icon: Link2, label: 'Intégrations', path: 'integrations', description: 'Discord, Calendar, API' },
    { icon: Bell, label: 'Notifications', path: 'notification-settings', description: 'Alertes & rappels' },
    { icon: Shield, label: 'Confidentialité', path: 'privacy', description: 'Sécurité & données' },
    { icon: Settings, label: 'Préférences', path: 'preferences', description: 'Personnalisation' },
    { icon: Palette, label: 'Design System', path: 'design-doc', description: 'Documentation complète' },
  ];

  return (
    <div className="min-h-screen pb-24 pt-safe">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Profile Header */}
        <div className="mb-10">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--fg-primary)] tracking-tight">
              Mon Profil
            </h2>
            <button
              onClick={() => onNavigate?.('edit-profile')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-[0.5px] border-[var(--border-medium)] hover:border-[var(--border-strong)] text-sm font-semibold text-[var(--fg-primary)] shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Edit className="w-4 h-4" strokeWidth={2} />
              Modifier
            </button>
          </div>
          <div className="flex items-start gap-5 mb-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl overflow-hidden ring-2 ring-[var(--border-medium)]">
                <ImageWithFallback
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] flex items-center justify-center text-sm font-semibold text-white shadow-lg shadow-[var(--primary-500)]/20">
                {profile.level}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h1 className="text-3xl font-semibold text-[var(--fg-primary)] tracking-tight">
                  {profile.name}
                </h1>
                {isPremium && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-[var(--warning-500)] to-[var(--warning-600)] rounded-lg">
                    <Crown className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                    <span className="text-xs font-bold text-white whitespace-nowrap">PRO</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[var(--fg-tertiary)] font-medium">
                  {profile.rank}
                </span>
                <span className="text-[var(--fg-tertiary)]">•</span>
                <span className="text-[var(--fg-tertiary)] font-medium">
                  Niveau {profile.level}
                </span>
              </div>
              {userEmail && (
                <div className="text-xs text-[var(--fg-tertiary)] mt-1">
                  {userEmail}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-5 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200"
              whileHover={{ y: -2 }}
            >
              <div className="text-3xl font-semibold text-[var(--fg-primary)] mb-1 tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Premium & Advanced Stats CTAs */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          {/* Premium CTA */}
          <motion.button
            onClick={() => onNavigate?.('premium')}
            className="bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] rounded-2xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-left"
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <Crown className="w-6 h-6 mb-2" strokeWidth={2} />
            <div className="text-sm font-bold mb-1">Premium</div>
            <div className="text-xs opacity-90">IA + Stats + Export</div>
          </motion.button>

          {/* Advanced Stats CTA */}
          <motion.button
            onClick={() => onNavigate?.('advanced-stats')}
            className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-medium)] shadow-sm hover:shadow-md transition-all duration-200 text-left"
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <TrendingUp className="w-6 h-6 text-[var(--primary-500)] mb-2" strokeWidth={2} />
            <div className="text-sm font-bold text-[var(--fg-primary)] mb-1">Stats Pro</div>
            <div className="text-xs text-[var(--fg-tertiary)]">Analyses détaillées</div>
          </motion.button>
        </div>

        {/* ROADMAP #2 - Social & Compétition */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 tracking-tight">
            Social & Compétition
          </h2>
          
          {/* Badges débloqués récemment (ROADMAP #2) */}
          {userStats?.badges && userStats.badges.length > 0 && (
            <div className="bg-gradient-to-br from-[var(--warning-50)] to-[var(--primary-50)] rounded-2xl p-5 mb-4 border-[0.5px] border-[var(--warning-200)]">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-bold text-[var(--fg-primary)]">
                  🏆 Badges débloqués
                </div>
                <button
                  onClick={() => onNavigate?.('badges')}
                  className="text-xs font-semibold text-[var(--primary-500)] hover:text-[var(--primary-600)]"
                >
                  Voir tout →
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {userStats.badges.slice(0, 3).map((badge: any) => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border-[0.5px] border-[var(--warning-200)] shadow-sm"
                  >
                    <span className="text-lg">{badge.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-[var(--fg-primary)]">{badge.name}</div>
                      <div className="text-xs text-[var(--fg-tertiary)] capitalize">{badge.rarity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Mes Amis */}
            <motion.button
              onClick={() => onNavigate?.('friends')}
              className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-medium)] shadow-sm hover:shadow-md transition-all duration-200 text-left"
              whileHover={{ y: -2, scale: 1.02 }}
            >
              <Users className="w-6 h-6 text-[var(--secondary-500)] mb-2" strokeWidth={2} />
              <div className="text-sm font-bold text-[var(--fg-primary)] mb-1">Mes Amis</div>
              <div className="text-xs text-[var(--fg-tertiary)]">47 contacts</div>
            </motion.button>

            {/* Trophées */}
            <motion.button
              onClick={() => onNavigate?.('achievements')}
              className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-medium)] shadow-sm hover:shadow-md transition-all duration-200 text-left"
              whileHover={{ y: -2, scale: 1.02 }}
            >
              <Award className="w-6 h-6 text-[var(--primary-500)] mb-2" strokeWidth={2} />
              <div className="text-sm font-bold text-[var(--fg-primary)] mb-1">Trophées</div>
              <div className="text-xs text-[var(--fg-tertiary)]">18/45 débloqués</div>
            </motion.button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Badges */}
            <motion.button
              onClick={() => onNavigate?.('badges')}
              className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-medium)] shadow-sm hover:shadow-md transition-all duration-200 text-left"
              whileHover={{ y: -2, scale: 1.02 }}
            >
              <Medal className="w-6 h-6 text-[var(--warning-500)] mb-2" strokeWidth={2} />
              <div className="text-sm font-bold text-[var(--fg-primary)] mb-1">Badges</div>
              <div className="text-xs text-[var(--fg-tertiary)]">{userStats?.badges?.length || 0} débloqués</div>
            </motion.button>

            {/* Mon Rang */}
            <motion.button
              onClick={() => onNavigate?.('ranking')}
              className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-medium)] shadow-sm hover:shadow-md transition-all duration-200 text-left"
              whileHover={{ y: -2, scale: 1.02 }}
            >
              <Trophy className="w-6 h-6 text-[var(--error-500)] mb-2" strokeWidth={2} />
              <div className="text-sm font-bold text-[var(--fg-primary)] mb-1">Mon Rang</div>
              <div className="text-xs text-[var(--fg-tertiary)]">Gold II</div>
            </motion.button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 tracking-tight">
            Activité récente
          </h2>
          <div className="space-y-3">
            <motion.div
              className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--primary-50)] flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-[var(--primary-500)]" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-[var(--fg-primary)] mb-1 font-semibold">
                    Récompense MVP
                  </div>
                  <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                    Valorant Ranked • Il y a 2 heures
                  </div>
                </div>
                <TrendingUp className="w-5 h-5 text-[var(--primary-500)]" strokeWidth={2} />
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--success-50)] flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[var(--success-500)]" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-[var(--fg-primary)] mb-1 font-semibold">
                    Session terminée
                  </div>
                  <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                    CS2 Compétitif • Hier
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Settings */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 tracking-tight">
            Paramètres
          </h2>
          <div className="space-y-3">
            {settings.map((setting) => {
              const Icon = setting.icon;
              return (
                <button
                  key={setting.path}
                  onClick={() => onNavigate?.(setting.path)}
                  className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 text-left border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-subtle)] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[var(--fg-secondary)]" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-[var(--fg-primary)] font-semibold mb-0.5">
                      {setting.label}
                    </div>
                    <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                      {setting.description}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--fg-tertiary)]" strokeWidth={2} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 tracking-tight">
            Déconnexion
          </h2>
          <div className="space-y-3">
            <button
              onClick={onLogout}
              className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 text-left border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-subtle)] flex items-center justify-center">
                <LogOut className="w-6 h-6 text-[var(--fg-secondary)]" strokeWidth={1.5} />
              </div>
              <span className="flex-1 text-sm text-[var(--fg-primary)] font-semibold">
                Déconnexion
              </span>
              <ChevronRight className="w-5 h-5 text-[var(--fg-tertiary)]" strokeWidth={2} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
export default ProfileScreen;
