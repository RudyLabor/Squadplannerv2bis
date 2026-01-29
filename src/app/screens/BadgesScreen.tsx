import { ArrowLeft, Crown, Star, Award, Check, Sparkles, Trophy, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { mockBadges } from '@/data/mockData';
import { statsAPI } from '@/utils/api';
import { useUser } from '@/app/contexts/UserContext';

interface BadgesScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  useMockData?: boolean;
}

type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

interface Badge {
  id: string;
  name: string;
  description: string;
  rarity: BadgeRarity;
  unlocked: boolean;
  equipped: boolean;
  unlockedAt: string | null;
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

const rarityConfig: Record<BadgeRarity, { gradient: string; icon: React.ElementType; color: string; bgColor: string; borderColor: string }> = {
  legendary: {
    gradient: 'from-amber-500 to-orange-500',
    icon: Crown,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-300'
  },
  epic: {
    gradient: 'from-purple-500 to-pink-500',
    icon: Sparkles,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-300'
  },
  rare: {
    gradient: 'from-blue-500 to-cyan-500',
    icon: Star,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-300'
  },
  common: {
    gradient: 'from-gray-400 to-gray-500',
    icon: Award,
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200'
  }
};

interface PremiumBadgeCardProps {
  badge: Badge;
  isEquipped: boolean;
  onToggleEquip: () => void;
  index: number;
}

function PremiumBadgeCard({ badge, isEquipped, onToggleEquip, index }: PremiumBadgeCardProps) {
  const config = rarityConfig[badge.rarity];
  const Icon = config.icon;

  return (
    <motion.button
      variants={itemVariants}
      custom={index}
      onClick={onToggleEquip}
      className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 ${
        badge.unlocked
          ? isEquipped
            ? 'bg-white/95 border-2 border-indigo-500 shadow-lg shadow-indigo-500/20'
            : 'bg-white/80 border border-white/50 hover:bg-white/90'
          : 'bg-white/40 border border-white/30 opacity-60'
      } backdrop-blur-sm`}
      whileHover={badge.unlocked ? { scale: 1.02, y: -2 } : {}}
      whileTap={badge.unlocked ? { scale: 0.98 } : {}}
    >
      {/* Rarity Glow Effect */}
      {badge.unlocked && (
        <motion.div
          className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${config.gradient} rounded-full blur-2xl opacity-20`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      {/* Equipped Indicator */}
      {isEquipped && badge.unlocked && (
        <motion.div
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-md"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </motion.div>
      )}

      {/* Icon */}
      <motion.div
        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 ${
          badge.unlocked
            ? `bg-gradient-to-br ${config.gradient} shadow-lg`
            : 'bg-gray-200'
        }`}
        whileHover={badge.unlocked ? { rotate: 5, scale: 1.1 } : {}}
      >
        <Icon className={`w-7 h-7 ${badge.unlocked ? 'text-white' : 'text-gray-400'}`} strokeWidth={2} />
      </motion.div>

      {/* Content */}
      <div className="relative z-10">
        <div className={`text-sm font-bold mb-1 ${badge.unlocked ? 'text-gray-800' : 'text-gray-400'}`}>
          {badge.name}
        </div>
        <div className={`text-xs mb-3 leading-relaxed ${badge.unlocked ? 'text-gray-500' : 'text-gray-400'}`}>
          {badge.description}
        </div>

        {/* Rarity Tag */}
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
          badge.unlocked ? `${config.bgColor} ${config.color}` : 'bg-gray-100 text-gray-400'
        }`}>
          {badge.rarity}
        </div>
      </div>

      {/* Lock Overlay */}
      {!badge.unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-2xl">
          <div className="text-2xl">🔒</div>
        </div>
      )}
    </motion.button>
  );
}

export function BadgesScreen({ onNavigate, showToast, useMockData = false }: BadgesScreenProps) {
  const { userProfile: user } = useUser();
  const [equippedBadges, setEquippedBadges] = useState<string[]>(['1', '2', '3']);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (useMockData) {
      setBadges(mockBadges as unknown as Badge[]);
      setEquippedBadges(mockBadges.filter(b => b.equipped).map(b => b.id));
      setLoading(false);
    } else {
      loadBadges();
    }
  }, [useMockData]);

  const loadBadges = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await statsAPI.getUserStats(user.id);
      const backendBadges = response.stats?.badges || [];

      const mappedBadges = backendBadges.map((badge: any) => ({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        rarity: badge.rarity as BadgeRarity,
        unlocked: true,
        equipped: false,
        unlockedAt: badge.unlockedAt,
      }));

      setBadges(mappedBadges);
    } catch (error: any) {
      console.error('Error loading badges:', error);
      setBadges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEquip = (badgeId: string) => {
    if (!badges.find(b => b.id === badgeId)?.unlocked) {
      showToast('Badge non débloqué', 'error');
      return;
    }

    setEquippedBadges(prev => {
      if (prev.includes(badgeId)) {
        return prev.filter(id => id !== badgeId);
      } else {
        if (prev.length >= 3) {
          showToast('Maximum 3 badges équipés', 'error');
          return prev;
        }
        return [...prev, badgeId];
      }
    });
    showToast('Badge équipé mis à jour', 'success');
  };

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const progressPercent = (badges.length > 0)
    ? Math.round((unlockedCount / badges.length) * 100)
    : 0;

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 left-1/2 w-64 h-64 bg-gradient-to-br from-blue-400/15 to-cyan-400/15 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
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
                Collection de Badges
              </h1>
              <p className="text-sm text-amber-600/80 font-medium mt-0.5">
                {unlockedCount}/{badges.length} débloqués · {equippedBadges.length}/3 équipés
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Trophy className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Equipped Badges Preview */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-6 mb-6 shadow-xl shadow-indigo-500/20 relative overflow-hidden"
          >
            {/* Animated particles */}
            <motion.div
              className="absolute top-4 right-4 w-2 h-2 bg-white/40 rounded-full"
              animate={{ y: [-10, 10, -10], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-6 left-1/4 w-1.5 h-1.5 bg-white/30 rounded-full"
              animate={{ y: [10, -10, 10], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            />

            <div className="flex items-center gap-2 text-white/90 text-sm font-semibold mb-4">
              <Shield className="w-4 h-4" />
              Badges affichés sur ton profil
            </div>
            <div className="flex gap-3">
              {[0, 1, 2].map((index) => {
                const equippedBadge = badges.find(b => b.id === equippedBadges[index]);
                const config = equippedBadge ? rarityConfig[equippedBadge.rarity] : null;
                const Icon = config?.icon || Award;

                return (
                  <motion.div
                    key={index}
                    className="flex-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                  >
                    {equippedBadge ? (
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                        <motion.div
                          className="w-12 h-12 rounded-xl bg-white/25 backdrop-blur-sm flex items-center justify-center mx-auto mb-2"
                          whileHover={{ rotate: 10, scale: 1.1 }}
                        >
                          <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                        </motion.div>
                        <div className="text-xs text-white font-semibold truncate">
                          {equippedBadge.name}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border-2 border-dashed border-white/20">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <div className="w-8 h-8 rounded-lg bg-white/10" />
                        </div>
                        <div className="text-xs text-white/60 font-medium">
                          Slot {index + 1}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Progress Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-white/50 shadow-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-semibold text-gray-800">Progression globale</span>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                {progressPercent}%
              </div>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Info Banner */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-amber-100/80 to-orange-100/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-amber-200/50"
          >
            <div className="flex items-center gap-3 text-sm text-amber-800 font-medium">
              <span className="text-xl">💡</span>
              Équipe jusqu'à 3 badges sur ton profil pour montrer tes accomplissements
            </div>
          </motion.div>

          {/* Loading State */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Trophy className="w-8 h-8 text-white" />
                </motion.div>
                <p className="text-gray-500 font-medium">Chargement des badges...</p>
              </motion.div>
            ) : badges.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <motion.div
                  className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-xl"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy className="w-12 h-12 text-white" strokeWidth={1.5} />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun badge</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                  Participe à des sessions pour débloquer tes premiers badges
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="badges"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-4"
              >
                {badges.map((badge, index) => (
                  <PremiumBadgeCard
                    key={badge.id}
                    badge={badge}
                    isEquipped={equippedBadges.includes(badge.id)}
                    onToggleEquip={() => handleToggleEquip(badge.id)}
                    index={index}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default BadgesScreen;
