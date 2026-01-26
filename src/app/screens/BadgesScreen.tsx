import { ArrowLeft, Crown, Star, Award, Lock, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/Button';
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

export function BadgesScreen({ onNavigate, showToast, useMockData = false }: BadgesScreenProps) {
  const { user } = useUser();
  const [equippedBadges, setEquippedBadges] = useState<string[]>(['1', '2', '3']);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (useMockData) {
      // Mode démo pour la galerie
      setBadges(mockBadges);
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
      
      // Map backend badges to UI format
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
      setLoading(false);
    } catch (error: any) {
      console.error('Error loading badges:', error);
      setBadges([]);
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
              Collection de Badges
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium mt-1">
              {unlockedCount}/{badges.length} débloqués · {equippedBadges.length}/3 équipés
            </p>
          </div>
        </div>

        {/* Equipped Badges Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] rounded-2xl p-6 mb-8 shadow-lg"
        >
          <div className="text-white/90 text-sm font-semibold mb-4">
            Badges affichés sur ton profil
          </div>
          <div className="flex gap-3">
            {[0, 1, 2].map((index) => {
              const equippedBadge = badges.find(b => b.id === equippedBadges[index]);
              
              return (
                <div key={index} className="flex-1">
                  {equippedBadge ? (
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-2">
                        <Award className="w-6 h-6 text-white" strokeWidth={2} />
                      </div>
                      <div className="text-xs text-white font-semibold">
                        {equippedBadge.name}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border-2 border-dashed border-white/20">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <div className="w-8 h-8 rounded-lg bg-white/10" />
                      </div>
                      <div className="text-xs text-white/60 font-medium">
                        Emplacement {index + 1}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 mb-6 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-[var(--fg-primary)]">
              Progression globale
            </div>
            <div className="text-2xl font-bold text-[var(--primary-500)]">
              {progressPercent}%
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--primary-500)] to-[var(--secondary-500)] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[var(--primary-50)] rounded-2xl p-4 mb-6 border-[0.5px] border-[var(--primary-100)]"
        >
          <div className="text-sm text-[var(--fg-secondary)] font-medium">
            💡 Équipe jusqu'à 3 badges sur ton profil pour montrer tes accomplissements
          </div>
        </motion.div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge, index) => {
            const Icon = badge.rarity === 'legendary' ? Crown :
                          badge.rarity === 'epic' ? Star :
                          badge.rarity === 'rare' ? Award :
                          Star;
            const isEquipped = equippedBadges.includes(badge.id);
            
            return (
              <motion.button
                key={badge.id}
                onClick={() => handleToggleEquip(badge.id)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl p-5 border-[0.5px] shadow-sm hover:shadow-md transition-all duration-200 text-left relative ${
                  badge.unlocked
                    ? isEquipped
                      ? 'border-[var(--primary-500)] ring-2 ring-[var(--primary-100)]'
                      : 'border-[var(--border-subtle)]'
                    : 'border-[var(--border-subtle)] opacity-60'
                }`}
              >
                {/* Equipped Indicator */}
                {isEquipped && badge.unlocked && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--success-500)] flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                )}

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 ${
                  badge.unlocked ? badge.bg : 'bg-gray-100'
                }`}>
                  <Icon className={`w-7 h-7 ${badge.unlocked ? badge.color : 'text-gray-400'}`} strokeWidth={2} />
                </div>

                {/* Content */}
                <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                  {badge.name}
                </div>
                <div className="text-xs text-[var(--fg-tertiary)] font-medium mb-3">
                  {badge.description}
                </div>

                {/* Status */}
                {badge.unlocked ? (
                  <div className="text-xs text-[var(--success-500)] font-semibold">
                    {isEquipped ? '✓ Équipé' : 'Débloqué'}
                  </div>
                ) : (
                  <div className="text-xs text-[var(--fg-tertiary)] font-semibold">
                    🔒 Verrouillé
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

      </div>
    </div>
  );
}