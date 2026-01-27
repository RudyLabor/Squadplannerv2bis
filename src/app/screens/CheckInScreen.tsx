import { ArrowLeft, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/button';
import { mockSessions } from '@/data/mockData';
import { sessionsAPI } from '@/utils/api';
import { useUser } from '@/app/contexts/UserContext';
import { useHaptic } from '@/app/hooks/useHaptic';
import { useSoundEffects } from '@/app/hooks/useSoundEffects';
import { Celebration } from '@/app/components/ui/Celebration';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { DeepLinkButton } from '@/app/components/ui/DeepLinkButton';

interface CheckInScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  useMockData?: boolean;
  data?: {
    sessionId: string;
    squadId: string;
  };
}

export function CheckInScreen({ onNavigate, showToast, useMockData = false, data }: CheckInScreenProps) {
  const { userProfile: user } = useUser();
  const [userStatus, setUserStatus] = useState<'present' | 'late' | 'absent' | null>(null);
  const [session, setSession] = useState<any>(null);
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lateMinutes, setLateMinutes] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const { notification } = useHaptic();
  const { play } = useSoundEffects();

  useEffect(() => {
    if (useMockData) {
      // Mode démo pour la galerie
      const mockSession = mockSessions[0];
      setSession(mockSession);
      setCheckIns(mockSession.attendees || []);
      setLoading(false);
    } else if (data?.sessionId) {
      loadCheckIn();
    }
  }, [data?.sessionId, useMockData]);

  const loadCheckIn = async () => {
    if (!data?.sessionId) {
      showToast('Aucune session spécifiée', 'error');
      setLoading(false);
      return;
    }

    try {
      // Get all sessions and find the one we need
      const response = await sessionsAPI.getSessions();
      const foundSession = response.sessions?.find((s: any) => s.id === data.sessionId);
      
      if (!foundSession) {
        showToast('Session non trouvée', 'error');
        setLoading(false);
        return;
      }

      setSession(foundSession);

      // Load check-ins
      const checkInsResponse = await sessionsAPI.getCheckIns(data.sessionId);
      setCheckIns(checkInsResponse.checkIns || []);

      // Check if user already checked in
      const userCheckIn = checkInsResponse.checkIns?.find((ci: any) => ci.userId === user?.id);
      if (userCheckIn) {
        setUserStatus(userCheckIn.status);
      }

      setLoading(false);
    } catch (error: any) {
      console.error('Error loading session:', error);
      showToast(error.message || 'Erreur de chargement', 'error');
      setLoading(false);
    }
  };

  const handleCheckIn = async (status: 'present' | 'late' | 'absent') => {
    if (status === 'late' && !lateMinutes) {
      showToast('Indiquez votre retard estimé', 'error');
      return;
    }

    if (!session || !data?.sessionId) {
      showToast('Session non disponible', 'error');
      return;
    }

    try {
      const note = status === 'late' ? `${lateMinutes} min de retard` : '';
      
      await sessionsAPI.checkIn(data.sessionId, status, note);
      
      setUserStatus(status);
      
      if (status === 'present') {
        notification('success');
        play('success');
        setShowCelebration(true);
        showToast('✅ Présence confirmée ! +1 fiabilité', 'success');
      } else if (status === 'late') {
        showToast(`⏰ Retard signalé : ${lateMinutes} min`, 'info');
        notification('warning');
        play('whoosh');
      } else {
        showToast('❌ Absence signalée (score impacté)', 'error');
        notification('error');
        play('error');
      }

      setTimeout(() => {
        onNavigate('squad-detail', { id: session.squadId || data?.squadId });
      }, status === 'present' ? 2500 : 1500);
    } catch (error: any) {
      console.error('Check-in error:', error);
      showToast(error.message || 'Erreur lors du check-in', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-500)] mx-auto mb-4"></div>
          <p className="text-[var(--fg-secondary)]">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-[var(--error-50)] rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-[var(--error-500)]" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--fg-primary)] mb-2">Session introuvable</h2>
          <p className="text-[var(--fg-secondary)] mb-6">Cette session n'existe pas ou a été supprimée.</p>
          <Button onClick={() => onNavigate('home')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  // Calculate stats from check-ins
  const presentCount = checkIns.filter(ci => ci.status === 'present').length;
  const lateCount = checkIns.filter(ci => ci.status === 'late').length;
  const totalExpected = session.confirmedSlot?.responses?.filter((r: any) => r.response === 'yes').length || 0;

  return (
    <div className="min-h-screen pb-24 pt-safe">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => onNavigate('squad-detail', { id: session.squadId || data?.squadId })}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Check-in session
            </h1>
            <div className="text-sm text-[var(--fg-tertiary)] font-medium mt-0.5">
              {session.squadName}
            </div>
          </div>
        </div>

        {/* Time Alert */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[var(--primary-50)] to-[var(--warning-50)] rounded-2xl p-6 mb-8 border-[0.5px] border-[var(--primary-200)] shadow-lg"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--primary-500)] flex items-center justify-center">
              <Clock className="w-7 h-7 text-white" strokeWidth={2} />
            </div>
            <div>
              <div className="text-xs text-[var(--fg-tertiary)] font-medium mb-1">
                C'est l'heure !
              </div>
              <div className="text-2xl font-bold text-[var(--fg-primary)]">
                {session.time}
              </div>
            </div>
          </div>
          <p className="text-sm text-[var(--fg-secondary)] font-medium">
            Confirmez votre présence pour que l'équipe sache que vous êtes prêt.
          </p>
        </motion.div>

        {/* Session Info */}
        <div className="bg-white rounded-2xl overflow-hidden border-[0.5px] border-[var(--border-subtle)] shadow-md mb-8">
          <div className="relative h-32">
            <ImageWithFallback 
              src={session.gameImage}
              alt={session.game}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <div className="text-xs text-white/70 font-medium mb-1">
                {session.game}
              </div>
              <div className="text-xl font-bold text-white">
                {session.title}
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="flex gap-2 mb-4">
              <div className="flex-1 bg-[var(--success-50)] rounded-xl px-3 py-2 border-[0.5px] border-[var(--success-200)]">
                <div className="text-xs text-[var(--success-700)] font-medium mb-1">
                  Présents
                </div>
                <div className="text-lg font-bold text-[var(--success-600)]">
                  {presentCount}
                </div>
              </div>
              <div className="flex-1 bg-[var(--warning-50)] rounded-xl px-3 py-2 border-[0.5px] border-[var(--warning-200)]">
                <div className="text-xs text-[var(--warning-700)] font-medium mb-1">
                  En retard
                </div>
                <div className="text-lg font-bold text-[var(--warning-600)]">
                  {lateCount}
                </div>
              </div>
              <div className="flex-1 bg-[var(--bg-subtle)] rounded-xl px-3 py-2 border-[0.5px] border-[var(--border-medium)]">
                <div className="text-xs text-[var(--fg-tertiary)] font-medium mb-1">
                  En attente
                </div>
                <div className="text-lg font-bold text-[var(--fg-secondary)]">
                  {totalExpected - presentCount - lateCount}
                </div>
              </div>
            </div>

            {/* Players List */}
            <div className="space-y-2">
              {session.confirmedSlot?.responses?.map((response: any) => {
                const player = response.player;
                const checkIn = checkIns.find((ci: any) => ci.userId === player.id);
                return (
                  <div 
                    key={player.id}
                    className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={player.avatar}
                        alt={player.name}
                        className="w-9 h-9 rounded-full"
                      />
                      <div className="text-sm font-semibold text-[var(--fg-primary)]">
                        {player.name}
                      </div>
                    </div>
                    <div>
                      {checkIn?.status === 'present' && (
                        <div className="flex items-center gap-1.5 bg-[var(--success-50)] px-2.5 py-1 rounded-full">
                          <CheckCircle className="w-3.5 h-3.5 text-[var(--success-600)]" strokeWidth={2} />
                          <span className="text-xs font-semibold text-[var(--success-700)]">Présent</span>
                        </div>
                      )}
                      {checkIn?.status === 'late' && (
                        <div className="flex items-center gap-1.5 bg-[var(--warning-50)] px-2.5 py-1 rounded-full">
                          <Clock className="w-3.5 h-3.5 text-[var(--warning-600)]" strokeWidth={2} />
                          <span className="text-xs font-semibold text-[var(--warning-700)]">+{checkIn.note}min</span>
                        </div>
                      )}
                      {checkIn?.status === 'absent' && (
                        <div className="flex items-center gap-1.5 bg-[var(--bg-subtle)] px-2.5 py-1 rounded-full">
                          <XCircle className="w-3.5 h-3.5 text-[var(--danger-600)]" strokeWidth={2} />
                          <span className="text-xs font-semibold text-[var(--danger-700)]">Absent</span>
                        </div>
                      )}
                      {!checkIn && (
                        <div className="flex items-center gap-1.5 bg-[var(--bg-subtle)] px-2.5 py-1 rounded-full">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--fg-tertiary)] animate-pulse" />
                          <span className="text-xs font-semibold text-[var(--fg-tertiary)]">En attente</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Check-in Actions */}
        {!userStatus && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4">
              Confirmez votre présence
            </h2>

            {/* Present */}
            <motion.button
              onClick={() => handleCheckIn('present')}
              className="w-full bg-[var(--success-500)] hover:bg-[var(--success-600)] text-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" strokeWidth={2} />
                </div>
                <div className="text-left flex-1">
                  <div className="text-base font-bold mb-1">
                    Je suis là
                  </div>
                  <div className="text-sm text-white/80 font-medium">
                    Prêt à jouer maintenant
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Late */}
            <motion.div
              className="bg-white rounded-2xl p-5 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--warning-50)] flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[var(--warning-600)]" strokeWidth={2} />
                </div>
                <div className="text-left flex-1">
                  <div className="text-base font-bold text-[var(--fg-primary)] mb-1">
                    Je suis en retard
                  </div>
                  <div className="text-sm text-[var(--fg-tertiary)] font-medium">
                    Indiquez votre retard estimé
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={lateMinutes}
                  onChange={(e) => setLateMinutes(e.target.value)}
                  placeholder="Minutes"
                  min="5"
                  max="60"
                  className="flex-1 h-11 bg-[var(--bg-base)] border-[0.5px] border-[var(--border-medium)] rounded-xl px-4 text-sm text-[var(--fg-primary)] font-semibold focus:border-[var(--warning-500)] focus:ring-2 focus:ring-[var(--warning-500)]/20"
                />
                <Button
                  variant="ghost"
                  onClick={() => handleCheckIn('late')}
                  disabled={!lateMinutes}
                  className="h-11 px-5 bg-[var(--warning-500)] hover:bg-[var(--warning-600)] text-white rounded-xl font-semibold disabled:opacity-40"
                >
                  Confirmer
                </Button>
              </div>
            </motion.div>

            {/* Absent */}
            <motion.button
              onClick={() => handleCheckIn('absent')}
              className="w-full bg-white hover:bg-[var(--danger-50)] border-[0.5px] border-[var(--border-medium)] hover:border-[var(--danger-500)] text-[var(--fg-primary)] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--danger-50)] flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-[var(--danger-600)]" strokeWidth={2} />
                </div>
                <div className="text-left flex-1">
                  <div className="text-base font-bold mb-1">
                    Je ne viens pas
                  </div>
                  <div className="text-sm text-[var(--fg-tertiary)] font-medium">
                    ⚠️ Votre score de fiabilité sera impacté
                  </div>
                </div>
              </div>
            </motion.button>
          </div>
        )}

        {/* Status Confirmed + Deep Links */}
        {userStatus && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-2xl p-6 shadow-lg mb-6 ${
                userStatus === 'present'
                  ? 'bg-[var(--success-50)] border-[0.5px] border-[var(--success-200)]'
                  : userStatus === 'late'
                  ? 'bg-[var(--warning-50)] border-[0.5px] border-[var(--warning-200)]'
                  : 'bg-[var(--danger-50)] border-[0.5px] border-[var(--danger-200)]'
              }`}
            >
              <div className="text-center">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 ${
                  userStatus === 'present'
                    ? 'bg-[var(--success-500)]'
                    : userStatus === 'late'
                    ? 'bg-[var(--warning-500)]'
                    : 'bg-[var(--danger-500)]'
                }`}>
                  {userStatus === 'present' && <CheckCircle className="w-8 h-8 text-white" strokeWidth={2} />}
                  {userStatus === 'late' && <Clock className="w-8 h-8 text-white" strokeWidth={2} />}
                  {userStatus === 'absent' && <XCircle className="w-8 h-8 text-white" strokeWidth={2} />}
                </div>
                <h3 className="text-xl font-bold text-[var(--fg-primary)] mb-2">
                  {userStatus === 'present' && 'Présence confirmée !'}
                  {userStatus === 'late' && 'Retard signalé'}
                  {userStatus === 'absent' && 'Absence enregistrée'}
                </h3>
                <p className="text-sm text-[var(--fg-tertiary)] font-medium">
                  {userStatus === 'present' && 'Amusez-vous bien ! 🎮'}
                  {userStatus === 'late' && 'L\'équipe est prévenue de votre retard'}
                  {userStatus === 'absent' && 'Dommage... À la prochaine !'}
                </p>
              </div>
            </motion.div>

            {/* Deep Links - Launch Game/Discord */}
            {userStatus === 'present' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <h3 className="text-sm font-semibold text-[var(--fg-secondary)] mb-3">
                  Lancer le jeu
                </h3>
                <DeepLinkButton
                  type="game"
                  label="Lancer Valorant"
                  deepLink="valorant://"
                  fallbackUrl="https://playvalorant.com"
                  variant="primary"
                />
                <DeepLinkButton
                  type="discord"
                  label="Rejoindre le vocal"
                  deepLink="discord://channels/1234567890"
                  fallbackUrl="https://discord.gg/squad"
                  variant="secondary"
                />
              </motion.div>
            )}
          </>
        )}

        {/* Celebration Overlay */}
        {showCelebration && (
          <Celebration
            title="Présence confirmée !"
            subtitle="Ton équipe sait que tu es prêt. Let's go !"
            variant="success"
            onComplete={() => setShowCelebration(false)}
          />
        )}
      </div>
    </div>
  );
}

export default CheckInScreen;