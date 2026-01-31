/**
 * ACHIEVEMENTS SCREEN - Linear Dark Design System
 * Clean, minimal dark UI with subtle animations
 */

import { ArrowLeft, Trophy, Lock, Check, Target, Flame, Zap, Award, Star, Crown, Shield, Share2, Sparkles } from 'lucide-react';
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
  category: AchievementCategory;
  progress: number;
  total: number;
  unlocked: boolean;
  unlockedAt?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
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

// Linear dark design - rarity colors
const rarityConfig = {
  common: {
    color: '#8b8d90',
    bg: 'rgba(139, 141, 144, 0.1)',
    border: 'rgba(139, 141, 144, 0.2)',
    label: 'Common'
  },
  rare: {
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.1)',
    border: 'rgba(59, 130, 246, 0.2)',
    label: 'Rare'
  },
  epic: {
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.1)',
    border: 'rgba(168, 85, 247, 0.2)',
    label: 'Epic'
  },
  legendary: {
    color: '#f5a623',
    bg: 'rgba(245, 166, 35, 0.1)',
    border: 'rgba(245, 166, 35, 0.2)',
    label: 'Legendary'
  },
};

export function AchievementsScreen({ onNavigate, showToast }: AchievementsScreenProps) {
  const [activeCategory, setActiveCategory] = useState<AchievementCategory>('all');

  const achievements: Achievement[] = [
    {
      id: '1',
      name: 'Première Session',
      description: 'Participe à ta première session',
      icon: Trophy,
      rarity: 'common',
      category: 'sessions',
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
      category: 'sessions',
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
      category: 'squads',
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
      category: 'social',
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
      category: 'sessions',
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
      category: 'sessions',
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
      category: 'social',
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
      category: 'squads',
      progress: 38,
      total: 50,
      unlocked: false,
    },
  ];

  const categories = [
    { key: 'all' as const, label: 'Tous', count: achievements.length },
    { key: 'sessions' as const, label: 'Sessions', count: achievements.filter(a => a.category === 'sessions').length },
    { key: 'social' as const, label: 'Social', count: achievements.filter(a => a.category === 'social').length },
    { key: 'squads' as const, label: 'Squads', count: achievements.filter(a => a.category === 'squads').length },
  ];

  const filteredAchievements = activeCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === activeCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progressPercent = Math.round((unlockedCount / achievements.length) * 100);

  const handleShare = (achievement: Achievement) => {
    showToast(`${achievement.name} partagé !`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#08090a] pb-24 md:pb-8 pt-safe">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <motion.button
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[#8b8d90]" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-[#f7f8f8]">
                Trophées
              </h1>
              <p className="text-sm text-[#5e6063] mt-0.5">
                {unlockedCount}/{achievements.length} débloqués ({progressPercent}%)
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[rgba(245,166,35,0.1)] border border-[rgba(245,166,35,0.2)] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#f5a623]" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Progress Card */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-2xl p-5 mb-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]"
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(245,166,35,0.05)] to-transparent pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[#8b8d90] text-sm mb-1">
                    Progression globale
                  </div>
                  <div className="text-3xl font-bold text-[#f7f8f8]">
                    {progressPercent}%
                  </div>
                </div>
                <div className="w-14 h-14 rounded-xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-[#f5a623]" strokeWidth={1.5} />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#f5a623] to-[#f5a623]/70 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                />
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#4ade80]" />
                  <span className="text-sm text-[#8b8d90]">{unlockedCount} débloqués</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#5e6063]" />
                  <span className="text-sm text-[#8b8d90]">{achievements.length - unlockedCount} en cours</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Category Tabs */}
          <motion.div variants={itemVariants} className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {categories.map((cat) => (
              <motion.button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.key
                    ? 'bg-[rgba(255,255,255,0.1)] text-[#f7f8f8] border border-[rgba(255,255,255,0.1)]'
                    : 'bg-[rgba(255,255,255,0.02)] text-[#8b8d90] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)]'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {cat.label} ({cat.count})
              </motion.button>
            ))}
          </motion.div>

          {/* Achievements List */}
          <motion.div
            variants={containerVariants}
            className="space-y-3"
          >
            {filteredAchievements.map((achievement, index) => {
              const Icon = achievement.icon;
              const config = rarityConfig[achievement.rarity];
              const achProgressPercent = (achievement.total && achievement.total > 0)
                ? Math.round((achievement.progress / achievement.total) * 100)
                : 0;

              return (
                <motion.div
                  key={achievement.id}
                  variants={itemVariants}
                  custom={index}
                  className={`relative overflow-hidden rounded-xl p-4 transition-all bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] ${
                    achievement.unlocked ? 'hover:bg-[rgba(255,255,255,0.04)]' : 'opacity-80'
                  }`}
                  whileHover={{ scale: 1.01 }}
                >
                  {/* Left accent for unlocked */}
                  {achievement.unlocked && (
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                      style={{ backgroundColor: config.color }}
                    />
                  )}

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: achievement.unlocked ? config.bg : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${achievement.unlocked ? config.border : 'rgba(255,255,255,0.06)'}`
                        }}
                      >
                        <Icon
                          className="w-6 h-6"
                          style={{ color: achievement.unlocked ? config.color : '#5e6063' }}
                          strokeWidth={1.5}
                        />
                      </div>
                      {achievement.unlocked && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 + index * 0.05, type: "spring" }}
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#4ade80] flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-[#08090a]" strokeWidth={3} />
                        </motion.div>
                      )}
                      {!achievement.unlocked && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center">
                          <Lock className="w-2.5 h-2.5 text-[#5e6063]" strokeWidth={2} />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <div className={`text-sm font-medium ${
                            achievement.unlocked ? 'text-[#f7f8f8]' : 'text-[#8b8d90]'
                          }`}>
                            {achievement.name}
                          </div>
                          <div className="text-xs text-[#5e6063] mt-0.5">
                            {achievement.description}
                          </div>
                        </div>
                        {/* Rarity Badge */}
                        <span
                          className="px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider flex-shrink-0"
                          style={{
                            backgroundColor: config.bg,
                            color: config.color,
                            border: `1px solid ${config.border}`
                          }}
                        >
                          {config.label}
                        </span>
                      </div>

                      {/* Progress or Unlocked Date */}
                      {achievement.unlocked ? (
                        <div className="flex items-center justify-between mt-3">
                          <div className="text-xs text-[#4ade80] font-medium flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            Débloqué {achievement.unlockedAt}
                          </div>
                          <motion.button
                            onClick={() => handleShare(achievement)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#8b8d90] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#f7f8f8] transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            Partager
                          </motion.button>
                        </div>
                      ) : (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-[#8b8d90] font-medium">
                              {achievement.progress}/{achievement.total}
                            </span>
                            <span className="text-xs text-[#5e6063]">
                              {achProgressPercent}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: config.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${achProgressPercent}%` }}
                              transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Empty state */}
          {filteredAchievements.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-12"
            >
              <div className="w-16 h-16 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-[#5e6063]" strokeWidth={1.5} />
              </div>
              <p className="text-[#8b8d90] text-sm">Aucun trophée dans cette catégorie</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default AchievementsScreen;
