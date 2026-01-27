import { Search, Plus, Users, TrendingUp, UserCheck, Wifi } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/Button';
import { EmptyState } from '@/app/components/ui/EmptyState';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useTranslation } from '@/i18n/useTranslation';
import { games } from '@/data/games';
import { mockSquads } from '@/data/mockData';
import { usePerformanceMonitor } from '@/app/hooks/usePerformanceMonitor';
import { squadsAPI } from '@/utils/api';
import { useAuth } from '@/app/contexts/AuthContext';

interface SquadsScreenProps {
  onNavigate: (screen: string, params?: any) => void;
  useMockData?: boolean; // Pour la galerie de démo
}

export function SquadsScreen({ onNavigate, useMockData = false }: SquadsScreenProps) {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [squads, setSquads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔍 Performance Monitoring
  usePerformanceMonitor('SquadsScreen');

  // Load squads from backend only when authenticated, or use mock data
  useEffect(() => {
    if (useMockData) {
      // Mode démo pour la galerie
      setSquads(mockSquads);
      setIsLoading(false);
    } else if (!authLoading && isAuthenticated) {
      console.log('✅ Auth ready, loading squads...');
      loadSquads();
    } else if (!authLoading && !isAuthenticated) {
      console.log('⚠️ Not authenticated, skipping squad load');
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated, useMockData]);

  const loadSquads = async () => {
    setIsLoading(true);
    try {
      const { squads: userSquads } = await squadsAPI.getSquads();
      console.log('✅ Squads loaded:', userSquads?.length || 0);
      setSquads(userSquads || []);
    } catch (error: any) {
      console.error('❌ Load squads error:', error?.message || error);
      // Keep empty array on error
      setSquads([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSquads = squads.filter(squad =>
    squad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    squad.game.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 90) return 'text-[var(--success-600)] bg-gradient-to-br from-[var(--success-50)] to-[var(--success-100)] border-[var(--success-200)]';
    if (reliability >= 75) return 'text-[var(--primary-600)] bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] border-[var(--primary-200)]';
    return 'text-[var(--warning-600)] bg-gradient-to-br from-[var(--warning-50)] to-[var(--warning-100)] border-[var(--warning-200)]';
  };

  return (
    <div className="min-h-screen pb-24 pt-safe">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[var(--fg-primary)] mb-2 tracking-tight">
            {t('squads.title')}
          </h1>
          <p className="text-base text-[var(--fg-tertiary)] font-medium">
            {squads.length} squads actives
          </p>
        </div>

        {/* Search + Create */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--fg-tertiary)]" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Rechercher des squads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white border-[0.5px] border-[var(--border-medium)] rounded-2xl text-sm text-[var(--fg-primary)] placeholder:text-[var(--fg-tertiary)] focus:border-[var(--primary-500)] focus:ring-2 focus:ring-[var(--primary-500)]/20 transition-all shadow-sm"
            />
          </div>
          <Button
            variant="default"
            onClick={() => onNavigate('create-squad')}
            className="h-12 px-5 bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] text-white rounded-2xl shadow-lg shadow-[var(--primary-500)]/20"
          >
            <Plus className="w-5 h-5" strokeWidth={2} />
          </Button>
        </div>

        {/* Squads Grid - Vertical Cards */}
        {isLoading ? (
          <EmptyState
            icon={Users}
            title="Chargement..."
            description="Récupération de vos squads"
          />
        ) : filteredSquads.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Crée ta première squad"
            description="Rassemble tes mates et organisez vos sessions"
            actionLabel="Créer ma squad"
            onAction={() => onNavigate('create-squad')}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredSquads.map((squad, index) => (
              <motion.div
                key={squad.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <motion.div
                  className="bg-white rounded-2xl border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-xl cursor-pointer overflow-hidden group"
                  onClick={() => onNavigate('squad-detail', { squadId: squad.id })}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Header with game badge */}
                  <div className="relative h-24 bg-gradient-to-br from-[var(--bg-base)] to-white border-b border-[var(--border-subtle)]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-lg">
                        <ImageWithFallback
                          src={squad.gameImage}
                          alt={squad.game}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    {/* Online indicator */}
                    {squad.onlineMembers > 0 && (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--success-500)] text-white text-xs font-bold shadow-sm">
                        <Wifi className="w-3 h-3" strokeWidth={2.5} />
                        {squad.onlineMembers}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Squad name */}
                    <h3 className="text-base font-bold text-[var(--fg-primary)] mb-1 truncate group-hover:text-[var(--primary-600)] transition-colors">
                      {squad.name}
                    </h3>
                    <p className="text-xs text-[var(--fg-tertiary)] font-medium mb-4 truncate">
                      {squad.game}
                    </p>

                    {/* Stats grid */}
                    <div className="space-y-2 mb-4">
                      {/* Members */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--fg-tertiary)] font-medium flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" strokeWidth={2} />
                          Membres
                        </span>
                        <span className="text-xs font-bold text-[var(--fg-primary)]">
                          {squad.members}
                        </span>
                      </div>

                      {/* Reliability */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--fg-tertiary)] font-medium flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} />
                          Fiabilité
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getReliabilityColor(squad.reliability)}`}>
                          {squad.reliability}%
                        </span>
                      </div>
                    </div>

                    {/* Next session */}
                    <div className={`pt-3 border-t border-[var(--border-subtle)] ${
                      squad.isActive 
                        ? 'bg-gradient-to-r from-[var(--primary-50)] to-[var(--primary-100)] -mx-4 -mb-4 px-4 pb-4 mt-3' 
                        : ''
                    }`}>
                      <div className="flex items-center gap-1.5 text-xs">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          squad.isActive ? 'bg-[var(--primary-500)] animate-pulse' : 'bg-[var(--fg-tertiary)]/30'
                        }`} />
                        <span className={`font-semibold ${
                          squad.isActive ? 'text-[var(--primary-700)]' : 'text-[var(--fg-tertiary)]'
                        }`}>
                          {squad.nextSession}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default SquadsScreen;
