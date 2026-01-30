/**
 * ACHIEVEMENTS SCREEN - Premium UI v2.0
 * Framer Motion + Glassmorphism + Gradients
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const rarityConfig = {
  common: { gradient: 'from-gray-400 to-gray-500', bg: 'bg-gray-100', text: 'text-gray-600' },
  rare: { gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-100', text: 'text-blue-600' },
  epic: { gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-100', text: 'text-purple-600' },
  legendary: { gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-100', text: 'text-amber-600' },
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
    <div className="min-h-screen pb-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
            <motion.button
              onClick={() => onNavigate('profile')}
              className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Trophées
              </h1>
              <p className="text-sm text-gray-500 mt-0.5 font-medium">
                {unlockedCount}/{achievements.length} débloqués ({progressPercent}%)
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Trophy className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Progress Card */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-3xl p-6 mb-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10 flex items-center justify-between mb-4">
              <div>
                <div className="text-white/90 text-sm font-medium mb-1">
                  Progression globale
                </div>
                <div className="text-4xl font-bold text-white">
                  {progressPercent}%
                </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Category Tabs */}
          <motion.div variants={itemVariants} className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {categories.map((cat) => (
              <motion.button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.key
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-white/80 backdrop-blur-sm text-gray-600 border border-white/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {cat.label} ({cat.count})
              </motion.button>
            ))}
          </motion.div>

          {/* Achievements Grid */}
          <motion.div
            variants={containerVariants}
            className="space-y-4"
          >
            {achievements.map((achievement, index) => {
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
                  className={`relative overflow-hidden rounded-2xl p-5 transition-all ${
                    achievement.unlocked
                      ? 'bg-white/90 backdrop-blur-sm border border-white/50 shadow-lg'
                      : 'bg-white/60 backdrop-blur-sm border border-white/30 shadow-md'
                  }`}
                  whileHover={{ scale: 1.01, y: -2 }}
                >
                  {/* Unlocked indicator line */}
                  {achievement.unlocked && (
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${config.gradient}`} />
                  )}

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="relative flex-shrink-0">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                        achievement.unlocked
                          ? `bg-gradient-to-br ${config.gradient} shadow-md`
                          : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-7 h-7 ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`} strokeWidth={2} />
                      </div>
                      {achievement.unlocked && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 + index * 0.05, type: "spring" }}
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-md"
                        >
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </motion.div>
                      )}
                      {!achievement.unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Lock className="w-4 h-4 text-gray-400" strokeWidth={2} />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className={`text-sm font-semibold mb-1 ${
                            achievement.unlocked ? 'text-gray-800' : 'text-gray-400'
                          }`}>
                            {achievement.name}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">
                            {achievement.description}
                          </div>
                        </div>
                        {/* Rarity Badge */}
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text}`}>
                          {achievement.rarity}
                        </span>
                      </div>

                      {/* Progress or Unlocked Date */}
                      {achievement.unlocked ? (
                        <div className="flex items-center justify-between mt-3">
                          <div className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            Débloqué {achievement.unlockedAt}
                          </div>
                          <motion.button
                            onClick={() => handleShare(achievement)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${config.bg} ${config.text}`}
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
                            <span className="text-xs text-gray-600 font-semibold">
                              {achievement.progress}/{achievement.total}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">
                              {achProgressPercent}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full bg-gradient-to-r ${config.gradient}`}
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
        </motion.div>
      </div>
    </div>
  );
}

export default AchievementsScreen;
