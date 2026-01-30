// @ts-nocheck
import { ArrowLeft, Clock, CheckCircle, XCircle, Car, Sparkles, Gamepad2, Users } from 'lucide-react';
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
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 30 }
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
      showToast('Aucune session specifiee', 'error');
      setLoading(false);
      return;
    }

    try {
      const response = await sessionsAPI.getSessions();
      const foundSession = response.sessions?.find((s: any) => s.id === data.sessionId);

      if (!foundSession) {
        showToast('Session non trouvee', 'error');
        setLoading(false);
        return;
      }

      setSession(foundSession);

      const api = sessionsAPI as any;
      let loadedCheckIns: any[] = [];
      if (typeof api.getCheckIns === 'function') {
        const checkInsResponse = await api.getCheckIns(data.sessionId);
        loadedCheckIns = checkInsResponse.checkIns || [];
      }
      setCheckIns(loadedCheckIns);

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
      showToast('Indiquez votre retard estime', 'error');
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
        showToast('Presence confirmee ! +1 fiabilite', 'success');
      } else if (status === 'late') {
        showToast(`Retard signale : ${lateMinutes} min`, 'info');
        notification('warning');
        play('whoosh');
      } else {
        showToast('Absence signalee (score impacte)', 'error');
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

  // Loading skeleton - Linear dark style
  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090a]">
        <div className="px-4 py-6 max-w-2xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1a1b1e] rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-[#1a1b1e] rounded w-32" />
                <div className="h-3 bg-[#1a1b1e] rounded w-24" />
              </div>
            </div>
            <div className="h-32 bg-[#1a1b1e] rounded-xl" />
            <div className="h-48 bg-[#1a1b1e] rounded-xl" />
            <div className="space-y-3">
              <div className="h-16 bg-[#1a1b1e] rounded-xl" />
              <div className="h-16 bg-[#1a1b1e] rounded-xl" />
              <div className="h-16 bg-[#1a1b1e] rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Session not found - Linear dark style
  if (!session) {
    return (
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Session introuvable</h2>
          <p className="text-[#8b8b8b] mb-6">Cette session n'existe pas ou a ete supprimee.</p>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-2.5 bg-[#1a1b1e] hover:bg-[#252629] border border-[#2a2b2e] text-white text-sm font-medium rounded-lg transition-colors"
          >
            Retour a l'accueil
          </button>
        </motion.div>
      </div>
    );
  }

  // Calculate stats
  const presentCount = checkIns.filter(ci => ci.status === 'present').length;
  const lateCount = checkIns.filter(ci => ci.status === 'late').length;
  const totalExpected = session.confirmedSlot?.responses?.filter((r: any) => r.response === 'yes').length || 0;

  return (
    <div className="min-h-screen pb-24 pt-safe bg-[#08090a] relative">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <button
              onClick={() => onNavigate('squad-detail', { id: session.squadId || data?.squadId })}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#1a1b1e] hover:bg-[#252629] border border-[#2a2b2e] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#8b8b8b]" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-white">
                Check-in
              </h1>
              <p className="text-sm text-[#8b8b8b]">
                {session.squadName}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#5e5ce6]/10 border border-[#5e5ce6]/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#5e5ce6]" />
            </div>
          </motion.div>

          {/* Time Alert Card */}
          <motion.div
            variants={itemVariants}
            className="bg-[#1a1b1e] border border-[#2a2b2e] rounded-xl p-5 mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#5e5ce6]/10 border border-[#5e5ce6]/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#5e5ce6]" />
              </div>
              <div>
                <p className="text-xs text-[#8b8b8b] font-medium uppercase tracking-wider mb-1">
                  C'est l'heure !
                </p>
                <p className="text-2xl font-semibold text-white">
                  {session.time}
                </p>
              </div>
            </div>
            <p className="text-sm text-[#8b8b8b] mt-4">
              Confirmez votre presence pour que l'equipe sache que vous etes pret.
            </p>
          </motion.div>

          {/* Session Info Card */}
          <motion.div variants={itemVariants}>
            <div className="bg-[#1a1b1e] border border-[#2a2b2e] rounded-xl overflow-hidden mb-6">
              {/* Game Image Header */}
              <div className="relative h-28">
                <ImageWithFallback
                  src={session.gameImage}
                  alt={session.game}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b1e] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <p className="text-xs text-[#8b8b8b] mb-0.5">
                    {session.game}
                  </p>
                  <h2 className="text-base font-semibold text-white">
                    {session.title}
                  </h2>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="p-4">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-[#08090a] rounded-lg p-3 border border-[#2a2b2e]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <p className="text-xs text-[#8b8b8b]">Presents</p>
                    </div>
                    <p className="text-lg font-semibold text-emerald-400">{presentCount}</p>
                  </div>
                  <div className="bg-[#08090a] rounded-lg p-3 border border-[#2a2b2e]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <p className="text-xs text-[#8b8b8b]">En route</p>
                    </div>
                    <p className="text-lg font-semibold text-orange-400">{lateCount}</p>
                  </div>
                  <div className="bg-[#08090a] rounded-lg p-3 border border-[#2a2b2e]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-2 h-2 rounded-full bg-[#8b8b8b]" />
                      <p className="text-xs text-[#8b8b8b]">Attente</p>
                    </div>
                    <p className="text-lg font-semibold text-[#8b8b8b]">{Math.max(0, totalExpected - presentCount - lateCount)}</p>
                  </div>
                </div>

                {/* Players List */}
                <div className="space-y-1">
                  {session.confirmedSlot?.responses?.map((response: any) => {
                    const player = response.player;
                    const checkIn = checkIns.find((ci: any) => ci.userId === player.id);
                    return (
                      <div
                        key={player.id}
                        className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-[#08090a] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#2a2b2e]">
                            {player.avatar ? (
                              <img
                                src={player.avatar}
                                alt={player.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#8b8b8b] font-medium text-sm">
                                {player.name?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <span className="text-sm font-medium text-white">
                            {player.name}
                          </span>
                        </div>
                        <div>
                          {checkIn?.status === 'present' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Present
                            </span>
                          )}
                          {checkIn?.status === 'late' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-400 text-xs font-medium">
                              <Car className="w-3.5 h-3.5" />
                              +{checkIn.note}min
                            </span>
                          )}
                          {checkIn?.status === 'absent' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 text-xs font-medium">
                              <XCircle className="w-3.5 h-3.5" />
                              Absent
                            </span>
                          )}
                          {!checkIn && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#2a2b2e] text-[#8b8b8b] text-xs font-medium">
                              En attente
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Check-in Actions */}
          {!userStatus && (
            <motion.div variants={itemVariants} className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-[#5e5ce6]" />
                <h2 className="text-sm font-medium text-white">
                  Confirmez votre presence
                </h2>
              </div>

              {/* Ready - Green button */}
              <motion.button
                onClick={() => handleCheckIn('present')}
                className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 rounded-xl p-4 transition-all group"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-emerald-400 mb-0.5">
                      Je suis pret
                    </p>
                    <p className="text-xs text-emerald-400/60">
                      Pret a jouer maintenant
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
              </motion.button>

              {/* Late / En route - Orange button */}
              <motion.div
                className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-11 h-11 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Car className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-orange-400 mb-0.5">
                      Je suis en route
                    </p>
                    <p className="text-xs text-orange-400/60">
                      Indiquez votre retard estime
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
                    className="flex-1 h-10 bg-[#08090a] border border-orange-500/30 focus:border-orange-500/50 rounded-lg px-3 text-sm text-white placeholder-[#8b8b8b] focus:outline-none focus:ring-1 focus:ring-orange-500/30 transition-all"
                  />
                  <button
                    onClick={() => handleCheckIn('late')}
                    disabled={!lateMinutes}
                    className="px-5 h-10 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/30 disabled:text-orange-400/50 text-white text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    Confirmer
                  </button>
                </div>
              </motion.div>

              {/* Absent - Red button */}
              <motion.button
                onClick={() => handleCheckIn('absent')}
                className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-xl p-4 transition-all group"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-red-400 mb-0.5">
                      Je ne viens pas
                    </p>
                    <p className="text-xs text-red-400/60">
                      Votre score de fiabilite sera impacte
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <XCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
              </motion.button>
            </motion.div>
          )}

          {/* Status Confirmed */}
          {userStatus && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-xl p-5 mb-6 border ${
                  userStatus === 'present'
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : userStatus === 'late'
                    ? 'bg-orange-500/10 border-orange-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="text-center">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                    userStatus === 'present'
                      ? 'bg-emerald-500/20'
                      : userStatus === 'late'
                      ? 'bg-orange-500/20'
                      : 'bg-red-500/20'
                  }`}>
                    {userStatus === 'present' && <CheckCircle className="w-7 h-7 text-emerald-400" />}
                    {userStatus === 'late' && <Car className="w-7 h-7 text-orange-400" />}
                    {userStatus === 'absent' && <XCircle className="w-7 h-7 text-red-400" />}
                  </div>
                  <h3 className={`text-lg font-semibold mb-1 ${
                    userStatus === 'present'
                      ? 'text-emerald-400'
                      : userStatus === 'late'
                      ? 'text-orange-400'
                      : 'text-red-400'
                  }`}>
                    {userStatus === 'present' && 'Presence confirmee !'}
                    {userStatus === 'late' && 'Retard signale'}
                    {userStatus === 'absent' && 'Absence enregistree'}
                  </h3>
                  <p className="text-sm text-[#8b8b8b]">
                    {userStatus === 'present' && 'Amusez-vous bien !'}
                    {userStatus === 'late' && 'L\'equipe est prevenue de votre retard'}
                    {userStatus === 'absent' && 'Dommage... A la prochaine !'}
                  </p>
                </div>
              </motion.div>

              {/* Deep Links */}
              {userStatus === 'present' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Gamepad2 className="w-4 h-4 text-[#5e5ce6]" />
                    <h3 className="text-sm font-medium text-white">
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
      </div>
    </div>
  );
}

export default CheckInScreen;
