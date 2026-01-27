import { Calendar, Plus, Users, Clock, CheckCircle, XCircle, AlertCircle, Filter, Zap, Check, X, Globe } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/Button';
import { EmptyState } from '@/app/components/ui/EmptyState';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { mockSessions } from '@/data/mockData';
import { useTranslation } from '@/i18n/useTranslation';
import { usePerformanceMonitor } from '@/app/hooks/usePerformanceMonitor';
import { sessionsAPI } from '@/utils/api';
import { useAuth } from '@/app/contexts/AuthContext';

interface SessionsScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
  useMockData?: boolean;
}

export function SessionsScreen({ onNavigate, showToast = () => {}, useMockData = false }: SessionsScreenProps) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming'>('all');
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔍 Performance Monitoring
  usePerformanceMonitor('SessionsScreen');

  // Load sessions from backend or use mock data
  useEffect(() => {
    if (useMockData) {
      // Mode démo pour la galerie
      setSessions(mockSessions);
      setIsLoading(false);
    } else {
      loadSessions();
    }
  }, [useMockData]);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const { sessions: allSessions } = await sessionsAPI.getSessions();
      
      // Map backend data to UI format
      const formattedSessions = allSessions.map((s: any) => {
        // Use confirmed slot if available, otherwise first slot
        // In a real multi-slot voting system, we'd need more complex logic here
        const displaySlot = s.selectedSlotId 
          ? s.slots?.find((slot: any) => slot.id === s.selectedSlotId) 
          : s.slots?.[0];
          
        const dateStr = displaySlot?.date || '';
        const isToday = new Date(dateStr).toDateString() === new Date().toDateString();
        
        // Calculate confirmed participants (yes responses)
        const yesCount = displaySlot?.responses?.filter((r: any) => r.response === 'yes').length || 0;
        
        return {
          ...s,
          date: dateStr,
          time: displaySlot?.time || '',
          isToday,
          readyCount: yesCount,
          totalPlayers: s.playersNeeded,
          selectedSlotId: displaySlot?.id,
          relativeTime: dateStr && displaySlot?.time 
            ? formatDistanceToNow(new Date(`${dateStr}T${displaySlot.time}:00`), { addSuffix: true, locale: fr })
            : ''
        };
      });

      setSessions(formattedSessions || []);
    } catch (error: any) {
      console.error('Load sessions error:', error);
      // Keep empty array on error
      if (error?.message?.includes('Session') || error?.message?.includes('reconnecter')) {
        showToast(error.message, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => {
    if (filter === 'today') return session.isToday;
    if (filter === 'upcoming') return !session.isToday;
    return true;
  });

  const handleRSVP = async (sessionId: string, slotId: string, response: 'yes' | 'no') => {
    // En mode démo, simuler la réponse sans appel API
    if (useMockData) {
      showToast(
        response === 'yes' 
          ? 'Participation confirmée !' 
          : 'Participation refusée',
        'success'
      );
      return;
    }
    
    // Mode production: envoyer via API
    try {
      await sessionsAPI.rsvp(sessionId, slotId, response);
      showToast(
        response === 'yes' 
          ? 'Participation confirmée !' 
          : 'Participation refusée',
        'success'
      );
      // Reload sessions to get updated data
      loadSessions();
    } catch (error: any) {
      console.error('RSVP error:', error);
      showToast(error?.message || 'Erreur lors de la réponse', 'error');
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-safe">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[var(--fg-primary)] mb-2 tracking-tight">
            {t('sessions.title')}
          </h1>
          <p className="text-base text-[var(--fg-tertiary)] font-medium">
            {sessions.length} sessions à venir
          </p>
        </div>

        {/* Filters - Glass style premium */}
        <div className="flex gap-2 mb-8">
          {(['all', 'today', 'upcoming'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                filter === filterOption
                  ? 'bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white shadow-lg shadow-[var(--primary-500)]/20'
                  : 'bg-white/60 backdrop-blur-sm text-[var(--fg-secondary)] border-[0.5px] border-[var(--border-medium)] hover:bg-white hover:border-[var(--border-strong)] shadow-sm'
              }`}
            >
              {filterOption === 'all' && 'Toutes'}
              {filterOption === 'today' && "Aujourd'hui"}
              {filterOption === 'upcoming' && 'À venir'}
            </button>
          ))}
        </div>

        {/* Sessions Timeline */}
        {isLoading ? (
          <EmptyState
            icon={Calendar}
            title="Chargement..."
            description="Récupération de vos sessions"
          />
        ) : filteredSessions.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="Aucune session prévue"
            description="Propose un créneau à ta squad"
            actionLabel="Proposer une session"
            onAction={() => onNavigate('propose-session')}
          />
        ) : (
          <div className="space-y-6">
            {filteredSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="relative"
              >
                {/* Timeline connector */}
                {index < filteredSessions.length - 1 && (
                  <div className="absolute left-6 top-16 bottom-0 w-[2px] bg-gradient-to-b from-[var(--border-medium)] to-transparent" />
                )}

                {/* Session Card - Horizontal Timeline Layout */}
                <div className="flex gap-4">
                  {/* Time indicator */}
                  <div className="flex-shrink-0 w-12 pt-1">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm ${
                      session.isToday 
                        ? 'bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white shadow-lg shadow-[var(--primary-500)]/20' 
                        : 'bg-white border-[1.5px] border-[var(--border-medium)] text-[var(--fg-tertiary)]'
                    }`}>
                      {session.time.split(':')[0]}h
                    </div>
                  </div>

                  {/* Content card */}
                  <motion.div
                    className="flex-1 bg-white rounded-2xl border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
                    whileHover={{ y: -2 }}
                  >
                    <div className="p-5">
                      {/* Header row */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-[var(--fg-primary)]">
                              {session.title}
                            </h3>
                            {session.isToday && (
                              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[var(--primary-500)]/10 to-[var(--primary-600)]/10 border border-[var(--primary-500)]/20 text-xs font-bold text-[var(--primary-600)] flex items-center gap-1">
                                <Zap className="w-3 h-3" strokeWidth={2.5} />
                                Bientôt
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-[var(--fg-tertiary)]">
                            <span className="font-medium">{session.squad}</span>
                            <span className="w-1 h-1 rounded-full bg-[var(--fg-tertiary)]/40" />
                            <span>{session.game}</span>
                          </div>
                        </div>

                        {/* Game badge */}
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-[var(--border-subtle)] flex-shrink-0">
                          <ImageWithFallback
                            src={session.gameImage}
                            alt={session.game}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Metadata row */}
                      <div className="flex items-center gap-6 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-[var(--fg-secondary)]">
                          <Calendar className="w-4 h-4 text-[var(--fg-tertiary)]" strokeWidth={1.5} />
                          <span className="font-medium">{session.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--fg-secondary)]">
                          <Clock className="w-4 h-4 text-[var(--fg-tertiary)]" strokeWidth={1.5} />
                          <span className="font-medium">{session.time}</span>
                          {session.relativeTime && (
                            <span className="text-[var(--fg-tertiary)] ml-1 text-xs">
                              ({session.relativeTime})
                            </span>
                          )}
                          <span className="text-[var(--primary-500)] text-xs font-semibold bg-[var(--primary-50)] px-1.5 py-0.5 rounded ml-2">
                            Paris
                          </span>
                        </div>
                      </div>

                      {/* Status bar */}
                      <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
                        {/* Top row: Participants + Actions */}
                        <div className="flex items-center justify-between">
                          {/* Participants */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                              <Users className="w-4 h-4 text-[var(--secondary-500)]" strokeWidth={2} />
                              <span className={`text-sm font-bold ${
                                session.readyCount === session.totalPlayers 
                                  ? 'text-[var(--success-600)]' 
                                  : 'text-[var(--fg-secondary)]'
                              }`}>
                                {session.readyCount || 0}/{session.totalPlayers || 0}
                              </span>
                            </div>
                            {session.readyCount === session.totalPlayers && (
                              <span className="text-xs font-semibold text-[var(--success-600)] flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                                Complet
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          {session.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleRSVP(session.id, session.selectedSlotId, 'yes')}
                                className="px-4 py-2 rounded-xl bg-gradient-to-br from-[var(--success-50)] to-[var(--success-100)] border border-[var(--success-200)] text-[var(--success-700)] text-sm font-bold hover:from-[var(--success-500)] hover:to-[var(--success-600)] hover:text-white transition-all duration-200"
                              >
                                <Check className="w-4 h-4" strokeWidth={2.5} />
                              </button>
                              <button
                                onClick={() => handleRSVP(session.id, session.selectedSlotId, 'no')}
                                className="px-4 py-2 rounded-xl bg-gradient-to-br from-[var(--error-50)] to-[var(--error-100)] border border-[var(--error-200)] text-[var(--error-700)] text-sm font-bold hover:from-[var(--error-500)] hover:to-[var(--error-600)] hover:text-white transition-all duration-200"
                              >
                                <X className="w-4 h-4" strokeWidth={2.5} />
                              </button>
                            </div>
                          )}
                          {session.status === 'confirmed' && (
                            <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[var(--success-50)] to-[var(--success-100)] border border-[var(--success-200)] text-xs font-bold text-[var(--success-700)] flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                              Confirmé
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Button
            variant="default"
            onClick={() => onNavigate('propose-session')}
            className="w-full h-14 text-base font-bold bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] text-white rounded-2xl shadow-lg shadow-[var(--primary-500)]/20 hover:shadow-xl hover:shadow-[var(--primary-500)]/30 transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-2" strokeWidth={2} />
            Proposer une session
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
export default SessionsScreen;
