import { ArrowLeft, Trophy, Lock, Check, Target, Flame, Zap, Award, Star, Crown, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface AchievementsScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

type AchievementCategory = 'all' | 'sessions' | 'social' | 'squads';
type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  rarity: AchievementRarity;
  progress: number;
  total: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export function AchievementsScreen({ onNavigate, showToast }: AchievementsScreenProps) {
  const [activeCategory, setActiveCategory] = useState<AchievementCategory>('all');

  const rarityColors = {
    common: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
    rare: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    epic: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
    legendary: { bg: 'bg-[var(--primary-50)]', text: 'text-[var(--primary-600)]', border: 'border-[var(--primary-200)]' },
  };

  const achievements: Achievement[] = [
    {
      id: '1',
      name: 'Première Session',
      description: 'Participe à ta première session',
      icon: Trophy,
      rarity: 'common',
      progress: 1,
      total: 1,
      unlocked: true,
      unlockedAt: 'Il y a 2 semaines',
    },
    {
      id: '2',
      name: 'Fiabilité Parfaite',
      description: 'Complète 10 sessions sans absence',
      icon: Crown,
      rarity: 'legendary',
      progress: 10,
      total: 10,
      unlocked: true,
      unlockedAt: 'Il y a 3 jours',
    },
    {
      id: '3',
      name: 'Leader de Squad',
      description: 'Crée ta première squad',
      icon: Shield,
      rarity: 'rare',
      progress: 1,
      total: 1,
      unlocked: true,
      unlockedAt: 'Il y a 1 semaine',
    },
    {
      id: '4',
      name: 'Social Butterfly',
      description: 'Ajoute 5 amis',
      icon: Star,
      rarity: 'rare',
      progress: 3,
      total: 5,
      unlocked: false,
    },
    {
      id: '5',
      name: 'Marathon Gamer',
      description: 'Participe à 50 sessions',
      icon: Flame,
      rarity: 'epic',
      progress: 28,
      total: 50,
      unlocked: false,
    },
    {
      id: '6',
      name: 'Organisateur Pro',
      description: 'Organise 25 sessions',
      icon: Target,
      rarity: 'epic',
      progress: 12,
      total: 25,
      unlocked: false,
    },
    {
      id: '7',
      name: 'Jamais en Retard',
      description: '20 check-ins à l\'heure',
      icon: Zap,
      rarity: 'rare',
      progress: 15,
      total: 20,
      unlocked: false,
    },
    {
      id: '8',
      name: 'Légende Vivante',
      description: 'Atteins le niveau 50',
      icon: Award,
      rarity: 'legendary',
      progress: 38,
      total: 50,
      unlocked: false,
    },
  ];

  const categories = [
    { key: 'all' as const, label: 'Tous', count: achievements.length },
    { key: 'sessions' as const, label: 'Sessions', count: 4 },
    { key: 'social' as const, label: 'Social', count: 2 },
    { key: 'squads' as const, label: 'Squads', count: 2 },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progressPercent = Math.round((unlockedCount / achievements.length) * 100);

  const handleShare = (achievement: Achievement) => {
    showToast(`${achievement.name} partagé !`, 'success');
  };

  return (
    <div className="min-h-screen pb-24 pt-safe">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => onNavigate('profile')}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Trophées
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium mt-1">
              {unlockedCount}/{achievements.length} débloqués ({progressPercent}%)
            </p>
          </div>
        </div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] rounded-2xl p-6 mb-8 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-white/90 text-sm font-medium mb-1">
                Progression globale
              </div>
              <div className="text-3xl font-bold text-white">
                {progressPercent}%
              </div>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeCategory === cat.key
                  ? 'bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white shadow-lg shadow-[var(--primary-500)]/20'
                  : 'bg-white text-[var(--fg-secondary)] border-[0.5px] border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 gap-4">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            const colors = rarityColors[achievement.rarity];
            // Vérification de sécurité pour éviter NaN
            const progressPercent = (achievement.total && achievement.total > 0) 
              ? Math.round((achievement.progress / achievement.total) * 100)
              : 0;
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl p-5 border-[0.5px] shadow-sm hover:shadow-md transition-all duration-200 ${
                  achievement.unlocked ? colors.border : 'border-[var(--border-subtle)]'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 relative ${
                    achievement.unlocked ? colors.bg : 'bg-gray-100'
                  }`}>
                    {achievement.unlocked ? (
                      <>
                        <Icon className={`w-7 h-7 ${colors.text}`} strokeWidth={2} />
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--success-500)] flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                      </>
                    ) : (
                      <>
                        <Icon className="w-7 h-7 text-gray-400" strokeWidth={2} />
                        <Lock className="absolute w-4 h-4 text-gray-400" strokeWidth={2} />
                      </>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className={`text-sm font-semibold mb-1 ${
                          achievement.unlocked ? 'text-[var(--fg-primary)]' : 'text-[var(--fg-tertiary)]'
                        }`}>
                          {achievement.name}
                        </div>
                        <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                          {achievement.description}
                        </div>
                      </div>
                      {/* Rarity Badge */}
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${colors.bg} ${colors.text}`}>
                        {achievement.rarity}
                      </span>
                    </div>

                    {/* Progress or Unlocked Date */}
                    {achievement.unlocked ? (
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-xs text-[var(--success-500)] font-semibold">
                          ✓ Débloqué {achievement.unlockedAt}
                        </div>
                        <button
                          onClick={() => handleShare(achievement)}
                          className="px-3 py-1.5 rounded-lg bg-[var(--primary-50)] text-[var(--primary-500)] text-xs font-semibold hover:bg-[var(--primary-100)] transition-all"
                        >
                          Partager
                        </button>
                      </div>
                    ) : (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-[var(--fg-secondary)] font-semibold">
                            {achievement.progress}/{achievement.total}
                          </span>
                          <span className="text-xs text-[var(--fg-tertiary)] font-medium">
                            {progressPercent}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[var(--primary-500)] to-[var(--secondary-500)] rounded-full"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
export default AchievementsScreen;
