/**
 * BADGES SCREEN - LINEAR DESIGN SYSTEM
 * Collection de badges gaming avec rarete
 * Premium minimal design inspired by Linear.app
 */

import { ArrowLeft, Crown, Star, Award, Check, Sparkles, Trophy, Shield, Lock, Gem } from 'lucide-react';
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

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  rarity: BadgeRarity;
  unlocked: boolean;
  equipped: boolean;
  unlockedAt: string | null;
}

// ============================================
// ANIMATIONS - Linear-like smooth motion
// ============================================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.02 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }
  }
};

// ============================================
// RARITY CONFIG - Colors per rarity level
// ============================================
const rarityConfig: Record<BadgeRarity, {
  gradient: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  label: string;
}> = {
  legendary: {
    gradient: 'from-amber-500 to-orange-600',
    icon: Crown,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    glowColor: 'rgba(245,158,11,0.15)',
    label: 'Legendaire'
  },
  epic: {
    gradient: 'from-purple-500 to-violet-600',
    icon: Gem,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    glowColor: 'rgba(168,85,247,0.15)',
    label: 'Epique'
  },
  rare: {
    gradient: 'from-blue-500 to-cyan-600',
    icon: Star,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    glowColor: 'rgba(59,130,246,0.15)',
    label: 'Rare'
  },
  common: {
    gradient: 'from-[#5e6063] to-[#3a3d42]',
    icon: Award,
    color: 'text-[#8b8d90]',
    bgColor: 'bg-[rgba(255,255,255,0.05)]',
    borderColor: 'border-[rgba(255,255,255,0.1)]',
    glowColor: 'rgba(255,255,255,0.05)',
    label: 'Commun'
  }
};

// ============================================
// BADGE CARD - Premium design per rarity
// ============================================
interface PremiumBadgeCardProps {
  badge: BadgeItem;
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
      disabled={!badge.unlocked}
      className={`relative overflow-hidden rounded-xl p-4 text-left transition-all duration-200 ${
        badge.unlocked
          ? isEquipped
            ? `bg-[rgba(255,255,255,0.04)] border-2 ${config.borderColor}`
            : 'bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)]'
          : 'bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.04)] opacity-50 cursor-not-allowed'
      }`}
      whileHover={badge.unlocked ? { y: -2 } : {}}
      whileTap={badge.unlocked ? { scale: 0.98 } : {}}
      transition={{ duration: 0.15 }}
    >
      {/* Subtle glow effect for unlocked badges */}
      {badge.unlocked && (
        <div
          className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-2xl pointer-events-none"
          style={{ backgroundColor: config.glowColor }}
        />
      )}

      {/* Equipped Indicator */}
      {isEquipped && badge.unlocked && (
        <motion.div
          className={`absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </motion.div>
      )}

      {/* Badge Icon */}
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
          badge.unlocked
            ? `bg-gradient-to-br ${config.gradient}`
            : 'bg-[rgba(255,255,255,0.04)]'
        }`}
      >
        <Icon className={`w-6 h-6 ${badge.unlocked ? 'text-white' : 'text-[#3a3d42]'}`} strokeWidth={1.5} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className={`text-[13px] font-semibold tracking-tight mb-1 ${badge.unlocked ? 'text-[#f7f8f8]' : 'text-[#3a3d42]'}`}>
          {badge.name}
        </div>
        <div className={`text-[12px] leading-relaxed mb-3 line-clamp-2 ${badge.unlocked ? 'text-[#8b8d90]' : 'text-[#3a3d42]'}`}>
          {badge.description}
        </div>

        {/* Rarity Tag */}
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider ${
          badge.unlocked
            ? `${config.bgColor} ${config.color}`
            : 'bg-[rgba(255,255,255,0.03)] text-[#3a3d42]'
        }`}>
          {config.label}
        </div>
      </div>

      {/* Lock Overlay */}
      {!badge.unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#08090a]/60 rounded-xl">
          <Lock className="w-5 h-5 text-[#3a3d42]" strokeWidth={1.5} />
        </div>
      )}
    </motion.button>
  );
}

// ============================================
// EQUIPPED BADGE SLOT
// ============================================
function EquippedBadgeSlot({ badge, index }: { badge?: BadgeItem; index: number }) {
  const config = badge ? rarityConfig[badge.rarity] : null;
  const Icon = config?.icon || Award;

  return (
    <motion.div
      className="flex-1"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1 + index * 0.05, duration: 0.2 }}
    >
      {badge ? (
        <div className={`bg-[rgba(255,255,255,0.06)] rounded-xl p-3 text-center border ${config?.borderColor || 'border-[rgba(255,255,255,0.1)]'}`}>
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config?.gradient} flex items-center justify-center mx-auto mb-2`}>
            <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
          <div className="text-[11px] text-[#f7f8f8] font-medium truncate">
            {badge.name}
          </div>
        </div>
      ) : (
        <div className="bg-[rgba(255,255,255,0.02)] rounded-xl p-3 text-center border border-dashed border-[rgba(255,255,255,0.08)]">
          <div className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.03)] flex items-center justify-center mx-auto mb-2">
            <div className="w-5 h-5 rounded bg-[rgba(255,255,255,0.05)]" />
          </div>
          <div className="text-[11px] text-[#3a3d42] font-medium">
            Slot {index + 1}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ============================================
// SKELETON LOADER
// ============================================
function BadgesSkeleton() {
  return (
    <div className="min-h-screen bg-[#08090a] pb-24 pt-safe">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Header skeleton */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.04)] animate-pulse" />
          <div className="flex-1">
            <div className="h-6 w-40 bg-[rgba(255,255,255,0.04)] rounded animate-pulse mb-2" />
            <div className="h-4 w-32 bg-[rgba(255,255,255,0.03)] rounded animate-pulse" />
          </div>
        </div>

        {/* Equipped section skeleton */}
        <div className="h-32 bg-[rgba(255,255,255,0.02)] rounded-xl mb-6 animate-pulse" />

        {/* Progress skeleton */}
        <div className="h-20 bg-[rgba(255,255,255,0.02)] rounded-xl mb-6 animate-pulse" />

        {/* Grid skeleton */}
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-40 bg-[rgba(255,255,255,0.02)] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export function BadgesScreen({ onNavigate, showToast, useMockData = false }: BadgesScreenProps) {
  const { userProfile: user } = useUser();
  const [equippedBadges, setEquippedBadges] = useState<string[]>(['1', '2', '3']);
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (useMockData) {
      setBadges(mockBadges as unknown as BadgeItem[]);
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
      const response = await statsAPI.getUserStats();
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
      showToast('Badge non debloque', 'error');
      return;
    }

    setEquippedBadges(prev => {
      if (prev.includes(badgeId)) {
        return prev.filter(id => id !== badgeId);
      } else {
        if (prev.length >= 3) {
          showToast('Maximum 3 badges equipes', 'error');
          return prev;
        }
        return [...prev, badgeId];
      }
    });
    showToast('Badge mis a jour', 'success');
  };

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const progressPercent = (badges.length > 0)
    ? Math.round((unlockedCount / badges.length) * 100)
    : 0;

  if (loading) {
    return <BadgesSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#08090a] pb-24 pt-safe">
      <motion.div
        className="px-4 py-6 max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
          <motion.button
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.06)] transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-[18px] h-[18px] text-[#8b8d90]" strokeWidth={1.5} />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-[20px] font-semibold text-[#f7f8f8] tracking-tight">
              Collection de Badges
            </h1>
            <p className="text-[13px] text-[#5e6063] mt-0.5">
              {unlockedCount}/{badges.length} debloques
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Equipped Badges Preview */}
        <motion.div
          variants={itemVariants}
          className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 mb-5"
        >
          <div className="flex items-center gap-2 text-[#8b8d90] text-[12px] font-medium mb-4">
            <Shield className="w-4 h-4" strokeWidth={1.5} />
            <span>Badges affiches sur ton profil</span>
            <span className="ml-auto text-[#5e6063]">{equippedBadges.length}/3</span>
          </div>
          <div className="flex gap-3">
            {[0, 1, 2].map((index) => {
              const equippedBadge = badges.find(b => b.id === equippedBadges[index]);
              return (
                <EquippedBadgeSlot
                  key={index}
                  badge={equippedBadge}
                  index={index}
                />
              );
            })}
          </div>
        </motion.div>

        {/* Progress Card */}
        <motion.div
          variants={itemVariants}
          className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 mb-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
              <span className="text-[13px] font-medium text-[#f7f8f8]">Progression</span>
            </div>
            <div className="text-[16px] font-semibold text-amber-400 tabular-nums">
              {progressPercent}%
            </div>
          </div>
          <div className="h-2 bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            />
          </div>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          variants={itemVariants}
          className="bg-[rgba(94,109,210,0.08)] border border-[rgba(94,109,210,0.15)] rounded-xl p-3.5 mb-5"
        >
          <div className="flex items-center gap-3 text-[12px] text-[#8b8d90]">
            <div className="w-8 h-8 rounded-lg bg-[rgba(94,109,210,0.15)] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-[#5e6dd2]" strokeWidth={1.5} />
            </div>
            <span>
              Clique sur un badge pour l'equiper. Tu peux afficher jusqu'a <span className="text-[#f7f8f8] font-medium">3 badges</span> sur ton profil.
            </span>
          </div>
        </motion.div>

        {/* Badges Grid */}
        <AnimatePresence mode="wait">
          {badges.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-5">
                <Trophy className="w-10 h-10 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-[16px] font-semibold text-[#f7f8f8] mb-2">Aucun badge</h3>
              <p className="text-[13px] text-[#5e6063] max-w-[240px] mx-auto leading-relaxed">
                Participe a des sessions pour debloquer tes premiers badges
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="badges"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-3"
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
  );
}

export default BadgesScreen;
