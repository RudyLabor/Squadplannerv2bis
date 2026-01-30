// @ts-nocheck
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertTriangle, Sparkles, Gamepad2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mockSessions } from '@/data/mockData';
import { sessionsAPI } from '@/utils/api';
import { useUser } from '@/app/contexts/UserContext';
import { useHaptic } from '@/app/hooks/useHaptic';
import { useSoundEffects } from '@/app/hooks/useSoundEffects';
import { Celebration } from '@/app/components/ui/Celebration';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { DeepLinkButton } from '@/app/components/ui/DeepLinkButton';
import { Button, Card, Badge, SkeletonPage, IconButton } from '@/design-system';

interface CheckInScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  useMockData?: boolean;
  data?: {
    sessionId: string;
    squadId: string;
  };
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

      // Load check-ins (mock if API not available)
      const api = sessionsAPI as any;
      let loadedCheckIns: any[] = [];
      if (typeof api.getCheckIns === 'function') {
        const checkInsResponse = await api.getCheckIns(data.sessionId);
        loadedCheckIns = checkInsResponse.checkIns || [];
      }
      setCheckIns(loadedCheckIns);

      // Check if user already checked in
      const userCheckIn = loadedCheckIns.find((ci: any) => ci.userId === user?.id);
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
      const api = sessionsAPI as any;

      if (typeof api.checkIn === 'function') {
        await api.checkIn(data.sessionId, status, note);
      }

      setUserStatus(status);

      if (status === 'present') {
        notification('success');
        play('success');
        setShowCelebration(true);
        showToast('Présence confirmée ! +1 fiabilité', 'success');
      } else if (status === 'late') {
        showToast(`Retard signalé : ${lateMinutes} min`, 'info');
        notification('warning');
        play('whoosh');
      } else {
        showToast('Absence signalée (score impacté)', 'error');
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
      <div className="min-h-screen bg-[var(--bg-base)]">
        <SkeletonPage />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary-50)] via-purple-50 to-pink-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card variant="elevated" padding="xl" className="text-center max-w-md bg-[var(--bg-elevated)]/80 backdrop-blur-sm border-[var(--border-subtle)]/50 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-error-500)] to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[var(--color-error-500)]/30">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--fg-primary)] mb-2">Session introuvable</h2>
            <p className="text-[var(--fg-secondary)] font-medium mb-6">Cette session n'existe pas ou a été supprimée.</p>
            <Button onClick={() => onNavigate('home')} variant="primary" fullWidth>
              Retour à l'accueil
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Calculate stats from check-ins
  const presentCount = checkIns.filter(ci => ci.status === 'present').length;
  const lateCount = checkIns.filter(ci => ci.status === 'late').length;
  const totalExpected = session.confirmedSlot?.responses?.filter((r: any) => r.response === 'yes').length || 0;

  return (
    <div className="min-h-screen pb-24 pt-safe bg-[var(--bg-base)] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[var(--color-success-400)]/20 to-teal-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-[var(--color-primary-400)]/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-warning-400)]/15 to-orange-400/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.35 }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
            <IconButton
              aria-label="Retour"
              icon={<ArrowLeft className="w-5 h-5" strokeWidth={2} />}
              variant="secondary"
              size="lg"
              onClick={() => onNavigate('squad-detail', { id: session.squadId || data?.squadId })}
              className="rounded-2xl bg-[var(--bg-elevated)]/80 backdrop-blur-sm border-[var(--border-subtle)]/50 shadow-lg hover:shadow-xl"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[var(--color-primary-600)] to-purple-600 bg-clip-text text-transparent">
                Check-in session
              </h1>
              <p className="text-sm text-[var(--fg-secondary)] font-medium mt-0.5">
                {session.squadName}
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-success-500)] to-teal-500 flex items-center justify-center shadow-lg shadow-[var(--color-success-500)]/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Clock className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Time Alert */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 rounded-3xl p-6 mb-8 shadow-xl shadow-[var(--color-primary-500)]/30 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10 flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Clock className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs text-white/80 font-semibold mb-1">
                  C'est l'heure !
                </p>
                <p className="text-3xl font-bold text-white">
                  {session.time}
                </p>
              </div>
            </div>
            <p className="relative z-10 text-sm text-white/90 font-medium">
              Confirmez votre présence pour que l'équipe sache que vous êtes prêt.
            </p>
          </motion.div>

          {/* Session Info */}
          <motion.div variants={itemVariants}>
            <Card variant="elevated" padding="none" className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm border-[var(--border-subtle)]/50 shadow-lg mb-8 overflow-hidden">
              <div className="relative h-32">
                <ImageWithFallback
                  src={session.gameImage}
                  alt={session.game}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-xs text-white/70 font-semibold mb-1">
                    {session.game}
                  </p>
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    {session.title}
                  </h2>
                </div>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <motion.div
                    className="bg-gradient-to-br from-[var(--color-success-50)] to-teal-50 rounded-xl px-3 py-2 border border-[var(--color-success-200)]"
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-xs text-[var(--color-success-700)] font-semibold mb-1">
                      Présents
                    </p>
                    <p className="text-lg font-bold text-[var(--color-success-600)]">
                      {presentCount}
                    </p>
                  </motion.div>
                  <motion.div
                    className="bg-gradient-to-br from-[var(--color-warning-50)] to-orange-50 rounded-xl px-3 py-2 border border-[var(--color-warning-200)]"
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-xs text-[var(--color-warning-700)] font-semibold mb-1">
                      En retard
                    </p>
                    <p className="text-lg font-bold text-[var(--color-warning-600)]">
                      {lateCount}
                    </p>
                  </motion.div>
                  <motion.div
                    className="bg-gradient-to-br from-[var(--bg-subtle)] to-slate-50 rounded-xl px-3 py-2 border border-[var(--border-subtle)]"
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-xs text-[var(--fg-secondary)] font-semibold mb-1">
                      En attente
                    </p>
                    <p className="text-lg font-bold text-[var(--fg-primary)]">
                      {totalExpected - presentCount - lateCount}
                    </p>
                  </motion.div>
                </div>

                {/* Players List */}
                <div className="space-y-2">
                  {session.confirmedSlot?.responses?.map((response: any) => {
                    const player = response.player;
                    const checkIn = checkIns.find((ci: any) => ci.userId === player.id);
                    return (
                      <motion.div
                        key={player.id}
                        className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] last:border-0"
                        whileHover={{ x: 2 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-[var(--color-primary-500)] to-purple-500">
                            {player.avatar ? (
                              <img
                                src={player.avatar}
                                alt={player.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                                {player.name?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <span className="text-sm font-semibold text-[var(--fg-primary)]">
                            {player.name}
                          </span>
                        </div>
                        <div>
                          {checkIn?.status === 'present' && (
                            <Badge variant="success" icon={<CheckCircle className="w-3.5 h-3.5" strokeWidth={2} />}>
                              Présent
                            </Badge>
                          )}
                          {checkIn?.status === 'late' && (
                            <Badge variant="warning" icon={<Clock className="w-3.5 h-3.5" strokeWidth={2} />}>
                              +{checkIn.note}min
                            </Badge>
                          )}
                          {checkIn?.status === 'absent' && (
                            <Badge variant="error" icon={<XCircle className="w-3.5 h-3.5" strokeWidth={2} />}>
                              Absent
                            </Badge>
                          )}
                          {!checkIn && (
                            <Badge variant="gray" dot>
                              En attente
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Check-in Actions */}
          {!userStatus && (
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[var(--color-primary-500)]" />
                <h2 className="text-lg font-bold tracking-tight text-[var(--fg-primary)]">
                  Confirmez votre presence
                </h2>
              </div>

              {/* Present */}
              <motion.button
                onClick={() => handleCheckIn('present')}
                className="w-full bg-gradient-to-r from-[var(--color-success-500)] to-teal-500 hover:from-[var(--color-success-600)] hover:to-teal-600 text-white rounded-2xl p-5 shadow-lg shadow-[var(--color-success-500)]/30 hover:shadow-xl transition-all"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-base font-bold mb-1">
                      Je suis là
                    </p>
                    <p className="text-sm text-white/80 font-medium">
                      Prêt à jouer maintenant
                    </p>
                  </div>
                </div>
              </motion.button>

              {/* Late */}
              <motion.div whileHover={{ y: -2 }}>
                <Card variant="elevated" padding="lg" className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm border-[var(--border-subtle)]/50 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-warning-100)] to-orange-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-[var(--color-warning-600)]" strokeWidth={2} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-base font-bold text-[var(--fg-primary)] mb-1">
                        Je suis en retard
                      </p>
                      <p className="text-sm text-[var(--fg-secondary)] font-medium">
                        Indiquez votre retard estimé
                      </p>
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
                      className="flex-1 h-11 bg-[var(--bg-elevated)]/80 border border-[var(--border-subtle)] rounded-xl px-4 text-sm text-[var(--fg-primary)] font-semibold focus:border-[var(--color-warning-500)] focus:ring-2 focus:ring-[var(--color-warning-500)]/20 transition-all"
                    />
                    <Button
                      variant="primary"
                      onClick={() => handleCheckIn('late')}
                      disabled={!lateMinutes}
                      className="h-11 px-5 bg-gradient-to-r from-[var(--color-warning-500)] to-orange-500 hover:from-[var(--color-warning-600)] hover:to-orange-600 rounded-xl font-semibold"
                    >
                      Confirmer
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* Absent */}
              <motion.button
                onClick={() => handleCheckIn('absent')}
                className="w-full bg-[var(--bg-elevated)]/80 backdrop-blur-sm hover:bg-[var(--color-error-50)] border border-[var(--border-subtle)]/50 hover:border-[var(--color-error-300)] text-[var(--fg-primary)] rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-error-100)] to-orange-100 flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-[var(--color-error-600)]" strokeWidth={2} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-base font-bold mb-1">
                      Je ne viens pas
                    </p>
                    <p className="text-sm text-[var(--fg-secondary)] font-medium">
                      Votre score de fiabilité sera impacté
                    </p>
                  </div>
                </div>
              </motion.button>
            </motion.div>
          )}

          {/* Status Confirmed + Deep Links */}
          {userStatus && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-2xl p-6 shadow-xl mb-6 ${
                  userStatus === 'present'
                    ? 'bg-gradient-to-br from-[var(--color-success-500)] to-teal-500 shadow-[var(--color-success-500)]/30'
                    : userStatus === 'late'
                    ? 'bg-gradient-to-br from-[var(--color-warning-500)] to-orange-500 shadow-[var(--color-warning-500)]/30'
                    : 'bg-gradient-to-br from-[var(--color-error-500)] to-orange-500 shadow-[var(--color-error-500)]/30'
                }`}
              >
                <div className="text-center">
                  <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                    {userStatus === 'present' && <CheckCircle className="w-8 h-8 text-white" strokeWidth={2} />}
                    {userStatus === 'late' && <Clock className="w-8 h-8 text-white" strokeWidth={2} />}
                    {userStatus === 'absent' && <XCircle className="w-8 h-8 text-white" strokeWidth={2} />}
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-white mb-2">
                    {userStatus === 'present' && 'Présence confirmée !'}
                    {userStatus === 'late' && 'Retard signalé'}
                    {userStatus === 'absent' && 'Absence enregistrée'}
                  </h3>
                  <p className="text-sm text-white/90 font-medium">
                    {userStatus === 'present' && 'Amusez-vous bien !'}
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
                  <div className="flex items-center gap-2 mb-3">
                    <Gamepad2 className="w-5 h-5 text-[var(--color-primary-500)]" />
                    <h3 className="text-sm font-bold text-[var(--fg-primary)]">
                      Lancer le jeu
                    </h3>
                  </div>
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
              title="Presence confirmee !"
              subtitle="Ton equipe sait que tu es pret. Let's go !"
              variant="success"
              onComplete={() => setShowCelebration(false)}
            />
          )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default CheckInScreen;
