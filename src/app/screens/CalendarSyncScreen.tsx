// @ts-nocheck
import { ArrowLeft, Calendar, Check, Download, ExternalLink, Crown, Loader2, Sparkles, Link } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/app/contexts/UserContext';
import { tokenManager } from '@/utils/tokenManager';
import { oauthHelper } from '@/utils/oauth';
import { sessionsAPI } from '@/app/services/api';
import { exportSessionsToICS } from '@/utils/ics-generator';
import { useSessions } from '@/app/contexts/SessionsContext';
import { useSquads } from '@/app/contexts/SquadsContext';

interface CalendarSyncScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
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

const calendars = [
  {
    id: 'google',
    name: 'Google Calendar',
    icon: '📅',
    gradient: 'from-blue-500 to-cyan-500',
    desc: 'Sync automatique avec votre agenda Google',
  },
  {
    id: 'apple',
    name: 'Apple Calendar',
    icon: '🍎',
    gradient: 'from-gray-700 to-gray-900',
    desc: 'Intégration native iOS et macOS',
  },
  {
    id: 'outlook',
    name: 'Outlook',
    icon: '📧',
    gradient: 'from-blue-600 to-indigo-600',
    desc: 'Compatible Microsoft 365',
  },
];

export function CalendarSyncScreen({ onNavigate, showToast }: CalendarSyncScreenProps) {
  const { userProfile } = useUser();
  const { sessions } = useSessions();
  const { currentSquad } = useSquads();
  const isPremium = userProfile?.isPremium ?? false;
  const [connectedCalendars, setConnectedCalendars] = useState<string[]>([]);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    checkGoogleConnection();
  }, []);

  const checkGoogleConnection = async () => {
    try {
      const connected = await tokenManager.isConnected('google');
      setIsGoogleConnected(connected);
      if (connected) {
        setConnectedCalendars(['google']);
      }
    } catch (error) {
      console.error('Error checking Google connection:', error);
    }
  };

  const syncSessionToGoogleCalendar = async (sessionId: string) => {
    try {
      const token = await tokenManager.getToken('google');
      const { session } = await sessionsAPI.getById(sessionId);

      const event = {
        summary: session.title,
        description: session.description || 'Session Squad Planner',
        start: {
          dateTime: `${session.scheduled_date}T${session.scheduled_time}`,
          timeZone: 'Europe/Paris',
        },
        end: {
          dateTime: calculateEndTime(session.scheduled_date, session.scheduled_time, session.duration || '2 hours'),
          timeZone: 'Europe/Paris',
        },
      };

      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) throw new Error('Calendar sync failed');

      showToast('Session ajoutée au calendrier ✓', 'success');
    } catch (error: any) {
      console.error('Calendar sync error:', error);
      showToast('Erreur de synchronisation', 'error');
    }
  };

  const calculateEndTime = (date: string, time: string, duration: string): string => {
    const startDateTime = new Date(`${date}T${time}`);
    const durationHours = parseInt(duration) || 2;
    startDateTime.setHours(startDateTime.getHours() + durationHours);
    return startDateTime.toISOString().slice(0, 16);
  };

  const handleConnect = async (calendarId: string) => {
    if (!isPremium) {
      showToast('Fonctionnalité Premium', 'info');
      setTimeout(() => onNavigate('premium'), 1000);
      return;
    }

    if (calendarId === 'google') {
      if (isGoogleConnected) {
        showToast('Google Calendar déjà connecté', 'info');
        return;
      }

      showToast('Redirection vers Google...', 'info');
      oauthHelper.startFlow('google');
      return;
    }

    showToast(`${calendars.find(c => c.id === calendarId)?.name} connecté !`, 'success');
    setConnectedCalendars([...connectedCalendars, calendarId]);
  };

  const handleDisconnect = (calendarId: string) => {
    showToast('Calendrier déconnecté', 'success');
    setConnectedCalendars(connectedCalendars.filter(id => id !== calendarId));
  };

  const handleExportICS = async () => {
    if (!sessions || sessions.length === 0) {
      showToast('Aucune session à exporter', 'info');
      return;
    }

    setIsExporting(true);
    try {
      const validSessions = sessions.filter(s => s.status !== 'cancelled');

      if (validSessions.length === 0) {
        showToast('Aucune session active à exporter', 'info');
        return;
      }

      exportSessionsToICS(validSessions, currentSquad?.name);
      showToast(`${validSessions.length} session(s) exportée(s) !`, 'success');
    } catch (error) {
      console.error('Export ICS error:', error);
      showToast('Erreur lors de l\'export', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Non-premium view
  if (!isPremium) {
    return (
      <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl" />
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
                onClick={() => onNavigate('integrations')}
                className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
              </motion.button>
              <div className="flex-1">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Sync Calendrier
                </h1>
                <p className="text-sm text-gray-500 font-medium">
                  Connectez vos agendas
                </p>
              </div>
              <motion.div
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <Calendar className="w-6 h-6 text-white" strokeWidth={2} />
              </motion.div>
            </motion.div>

            {/* Premium Upsell */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white text-center mb-6 shadow-2xl shadow-indigo-500/30 relative overflow-hidden"
            >
              {/* Removed shine animation for performance */}

              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm mx-auto mb-6 flex items-center justify-center">
                  <Crown className="w-10 h-10" strokeWidth={2} />
                </div>
                <h2 className="text-3xl font-black mb-3">Fonctionnalité Premium</h2>
                <p className="text-white/80 mb-8 max-w-sm mx-auto leading-relaxed font-medium">
                  Synchronisez vos sessions automatiquement avec Google Calendar, Apple Calendar ou Outlook.
                </p>
                <motion.button
                  onClick={() => onNavigate('premium')}
                  className="w-full h-14 bg-white text-indigo-600 hover:bg-white/95 rounded-2xl shadow-xl font-bold text-base flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Crown className="w-6 h-6" strokeWidth={2} />
                  Passer Premium
                </motion.button>
              </div>
            </motion.div>

            {/* Preview Features */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg"
            >
              <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                Avec Premium, vous pourrez :
              </h3>
              <div className="space-y-3">
                {[
                  'Sync bi-directionnelle avec vos agendas',
                  'Rappels automatiques sur tous vos appareils',
                  'Export .ics pour partager avec votre squad',
                  'Mise à jour en temps réel des changements',
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Premium view
  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl" />
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
              onClick={() => onNavigate('integrations')}
              className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                Sync Calendrier
              </h1>
              <p className="text-sm text-amber-600 font-semibold flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" strokeWidth={2} />
                Premium
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Calendar className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Info Banner */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-5 mb-6 border border-blue-200/50"
          >
            <div className="flex items-start gap-4">
              <motion.div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Link className="w-6 h-6 text-white" strokeWidth={2} />
              </motion.div>
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-1">
                  Synchronisation automatique
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                  Vos sessions confirmées apparaîtront automatiquement dans vos calendriers connectés.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Calendar Providers */}
          <motion.div variants={itemVariants} className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              Connecter un calendrier
            </h3>
            <div className="space-y-3">
              {calendars.map((calendar, index) => {
                const isConnected = connectedCalendars.includes(calendar.id);
                return (
                  <motion.div
                    key={calendar.id}
                    variants={itemVariants}
                    custom={index}
                    className={`bg-white/80 backdrop-blur-sm rounded-2xl p-5 border shadow-lg transition-all ${
                      isConnected
                        ? 'border-emerald-200/50 bg-emerald-50/30'
                        : 'border-white/50'
                    }`}
                    whileHover={{ scale: 1.01, y: -2 }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${calendar.gradient} flex items-center justify-center text-3xl shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {calendar.icon}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-bold text-gray-800 mb-1 flex items-center gap-2">
                          {calendar.name}
                          {isConnected && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-bold"
                            >
                              CONNECTÉ
                            </motion.span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-500 font-medium">
                          {calendar.desc}
                        </p>
                      </div>
                    </div>

                    {isConnected ? (
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => handleDisconnect(calendar.id)}
                          className="flex-1 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Déconnecter
                        </motion.button>
                        <motion.button
                          onClick={() => showToast('Calendrier à jour !', 'success')}
                          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Check className="w-4 h-4" strokeWidth={2} />
                          Synchronisé
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button
                        onClick={() => handleConnect(calendar.id)}
                        className={`w-full py-3 rounded-xl bg-gradient-to-r ${calendar.gradient} text-white font-semibold text-sm shadow-lg flex items-center justify-center gap-2`}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ExternalLink className="w-4 h-4" strokeWidth={2} />
                        Connecter
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Export ICS */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg"
          >
            <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-500" strokeWidth={2} />
              Export manuel
            </h3>
            <p className="text-sm text-gray-500 font-medium mb-4">
              Téléchargez un fichier .ics contenant toutes vos sessions confirmées pour l'importer manuellement.
            </p>
            <motion.button
              onClick={handleExportICS}
              disabled={isExporting}
              className="w-full py-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold shadow-sm hover:bg-gray-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />
                  Export en cours...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" strokeWidth={2} />
                  Télécharger .ics ({sessions?.filter(s => s.status !== 'cancelled').length || 0} sessions)
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default CalendarSyncScreen;
