/**
 * EXEMPLE D'ÉCRAN OPTIMISÉ AVEC TOUTES LES BEST PRACTICES
 * 
 * Cet exemple montre comment utiliser tous les outils de performance :
 * - Performance monitoring
 * - Cache avec stale-while-revalidate
 * - Batch de requêtes
 * - Composants mémoïsés
 * - Optimistic updates
 */

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Calendar, Plus } from 'lucide-react';
import { usePerformanceMonitor } from '@/app/hooks/usePerformanceMonitor';
import { useOptimizedFetch, useBatchFetch, useOptimisticUpdate } from '@/app/hooks/useOptimizedFetch';
import { CacheTTL } from '@/app/utils/cache';
import { MemoizedSquadCard } from '@/app/components/optimized/MemoizedSquadCard';
import { VirtualizedGrid } from '@/app/components/optimized/VirtualizedList';
import { Button } from '@/app/components/ui/button';

// Types
interface Squad {
  id: number;
  name: string;
  game: string;
  gameImage: string;
  members: number;
  reliability: number;
  nextSession: string;
  isActive: boolean;
  onlineMembers: number;
}

interface Stats {
  totalSquads: number;
  totalSessions: number;
  reliability: number;
}

interface Session {
  id: number;
  title: string;
  date: string;
  time: string;
  confirmed: number;
  total: number;
}

// Simulated API calls (remplacer par vrais appels Supabase)
const api = {
  fetchSquads: async (): Promise<Squad[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
      {
        id: 1,
        name: 'Fragsters',
        game: 'Valorant',
        gameImage: 'https://images.unsplash.com/photo-1617812895996-9a016b8d2ef1?w=400',
        members: 5,
        reliability: 87,
        nextSession: "Aujourd'hui 21:00",
        isActive: true,
        onlineMembers: 3,
      },
      // ... plus de squads
    ];
  },

  fetchStats: async (): Promise<Stats> => {
    await new Promise(resolve => setTimeout(resolve, 150));
    return {
      totalSquads: 5,
      totalSessions: 128,
      reliability: 94,
    };
  },

  fetchNextSession: async (): Promise<Session | null> => {
    await new Promise(resolve => setTimeout(resolve, 180));
    return {
      id: 1,
      title: 'Ranked Grind',
      date: "Aujourd'hui",
      time: '21:00',
      confirmed: 4,
      total: 5,
    };
  },

  updateRSVP: async (sessionId: number, status: 'confirmed' | 'declined'): Promise<Session> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: sessionId,
      title: 'Ranked Grind',
      date: "Aujourd'hui",
      time: '21:00',
      confirmed: status === 'confirmed' ? 5 : 3,
      total: 5,
    };
  },
};

interface OptimizedScreenExampleProps {
  onNavigate?: (screen: string) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function OptimizedScreenExample({ onNavigate, showToast }: OptimizedScreenExampleProps) {
  // 🔍 1. PERFORMANCE MONITORING
  usePerformanceMonitor('OptimizedScreenExample');

  // ⚡ 2. BATCH FETCH - Charger plusieurs ressources en parallèle
  const { data: batchData, loading: batchLoading } = useBatchFetch(
    {
      squads: api.fetchSquads,
      stats: api.fetchStats,
      nextSession: api.fetchNextSession,
    },
    {
      screenName: 'OptimizedScreenExample',
      autoFetch: true,
    }
  );

  // 🎯 3. OPTIMISTIC UPDATE - Pour RSVP instantané
  const { data: rsvpData, update: updateRSVP, isUpdating } = useOptimisticUpdate(
    { status: 'pending' as 'pending' | 'confirmed' | 'declined' },
    async (newData) => {
      const session = await api.updateRSVP(1, newData.status as any);
      return { status: newData.status };
    },
    {
      screenName: 'OptimizedScreenExample',
      onSuccess: () => showToast?.('RSVP confirmé !', 'success'),
      onError: (error) => showToast?.('Erreur lors de la mise à jour', 'error'),
    }
  );

  // 📝 4. MEMOIZED CALLBACKS - Éviter re-création de fonctions
  const handleSquadClick = useCallback((squadId: number) => {
    onNavigate?.('squad-detail');
  }, [onNavigate]);

  const handleRSVPConfirm = useCallback(() => {
    updateRSVP({ status: 'confirmed' });
  }, [updateRSVP]);

  const handleRSVPDecline = useCallback(() => {
    updateRSVP({ status: 'declined' });
  }, [updateRSVP]);

  // 🧮 5. MEMOIZED COMPUTED VALUES - Éviter recalculs inutiles
  const squads = useMemo(() => batchData.squads || [], [batchData.squads]);
  const stats = useMemo(() => batchData.stats, [batchData.stats]);
  const nextSession = useMemo(() => batchData.nextSession, [batchData.nextSession]);

  // États UI locaux
  const [filter, setFilter] = useState<'all' | 'active'>('all');

  // Filtered squads (memoized)
  const filteredSquads = useMemo(() => {
    if (filter === 'active') {
      return squads.filter(s => s.isActive);
    }
    return squads;
  }, [squads, filter]);

  // Loading state
  if (batchLoading) {
    return (
      <div className="min-h-screen pb-24 pt-safe px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--primary-500)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[var(--fg-tertiary)]">Chargement optimisé...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-safe">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            className="text-3xl font-semibold text-[var(--fg-primary)] mb-2 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Écran Optimisé (Exemple)
          </motion.h1>
          <p className="text-sm text-[var(--fg-tertiary)]">
            Toutes les optimisations actives ⚡
          </p>
        </div>

        {/* Stats - Chargées en batch */}
        {stats && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            <motion.div
              className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Users className="w-5 h-5 text-[var(--fg-tertiary)] mb-2" />
              <div className="text-2xl font-bold text-[var(--fg-primary)]">
                {stats.totalSquads}
              </div>
              <div className="text-xs text-[var(--fg-tertiary)]">Squads</div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
            >
              <Calendar className="w-5 h-5 text-[var(--fg-tertiary)] mb-2" />
              <div className="text-2xl font-bold text-[var(--fg-primary)]">
                {stats.totalSessions}
              </div>
              <div className="text-xs text-[var(--fg-tertiary)]">Sessions</div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <TrendingUp className="w-5 h-5 text-[var(--primary-500)] mb-2" />
              <div className="text-2xl font-bold text-[var(--fg-primary)]">
                {stats.reliability}%
              </div>
              <div className="text-xs text-[var(--fg-tertiary)]">Fiabilité</div>
            </motion.div>
          </div>
        )}

        {/* Next Session avec Optimistic Update */}
        {nextSession && (
          <motion.div
            className="bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] rounded-2xl p-5 mb-8 border-[0.5px] border-[var(--primary-200)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h3 className="text-sm font-semibold text-[var(--primary-700)] mb-3">
              Prochaine Session
            </h3>
            <div className="text-lg font-bold text-[var(--fg-primary)] mb-1">
              {nextSession.title}
            </div>
            <div className="text-sm text-[var(--fg-secondary)] mb-4">
              {nextSession.date} • {nextSession.time}
            </div>

            {/* RSVP Buttons avec Optimistic Update */}
            {rsvpData.status === 'pending' ? (
              <div className="flex gap-3">
                <Button
                  onClick={handleRSVPConfirm}
                  disabled={isUpdating}
                  className="flex-1 h-10 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white rounded-xl font-semibold text-sm"
                >
                  ✅ Confirmer
                </Button>
                <Button
                  onClick={handleRSVPDecline}
                  disabled={isUpdating}
                  className="flex-1 h-10 bg-white border border-[var(--border-medium)] hover:border-[var(--border-strong)] rounded-xl font-semibold text-sm"
                >
                  ❌ Refuser
                </Button>
              </div>
            ) : (
              <div className={`text-sm font-semibold ${
                rsvpData.status === 'confirmed' 
                  ? 'text-[var(--success-600)]' 
                  : 'text-[var(--fg-tertiary)]'
              }`}>
                {rsvpData.status === 'confirmed' ? '✅ Vous êtes confirmé !' : '❌ Vous avez refusé'}
              </div>
            )}
          </motion.div>
        )}

        {/* Filter */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === 'all'
                ? 'bg-[var(--primary-500)] text-white'
                : 'bg-white border border-[var(--border-medium)] text-[var(--fg-secondary)]'
            }`}
          >
            Toutes ({squads.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === 'active'
                ? 'bg-[var(--primary-500)] text-white'
                : 'bg-white border border-[var(--border-medium)] text-[var(--fg-secondary)]'
            }`}
          >
            Actives ({squads.filter(s => s.isActive).length})
          </button>
        </div>

        {/* Squads Grid - Composants mémoïsés */}
        {filteredSquads.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredSquads.map((squad, index) => (
              <MemoizedSquadCard
                key={squad.id}
                squad={squad}
                onClick={handleSquadClick}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[var(--fg-tertiary)]">
            Aucune squad trouvée
          </div>
        )}

        {/* Performance Info */}
        <motion.div
          className="mt-8 p-4 bg-gradient-to-r from-[var(--success-50)] to-[var(--primary-50)] rounded-2xl border border-[var(--success-200)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h4 className="text-sm font-bold text-[var(--fg-primary)] mb-2">
            ⚡ Optimisations actives :
          </h4>
          <ul className="text-xs text-[var(--fg-secondary)] space-y-1">
            <li>✅ Performance monitoring</li>
            <li>✅ Batch fetch (3 requêtes → 1 appel parallèle)</li>
            <li>✅ Cache avec stale-while-revalidate</li>
            <li>✅ Composants mémoïsés (MemoizedSquadCard)</li>
            <li>✅ Callbacks mémoïsés (useCallback)</li>
            <li>✅ Optimistic updates (RSVP instantané)</li>
            <li>✅ Computed values mémoïsés (useMemo)</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

export default OptimizedScreenExample;
