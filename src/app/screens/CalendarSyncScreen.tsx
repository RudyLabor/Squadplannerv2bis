// @ts-nocheck
import { ArrowLeft, Calendar, Check, Download, ExternalLink, Crown, Loader2, Sparkles, Link2, Zap } from 'lucide-react';
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
    transition: { staggerChildren: 0.04, delayChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 28 }
  }
};

// Icones SVG pour les calendriers
const GoogleCalendarIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.316 5.684H5.684v12.632h12.632V5.684z" fill="#fff"/>
    <path d="M19.632 24H4.368A4.368 4.368 0 0 1 0 19.632V4.368A4.368 4.368 0 0 1 4.368 0h15.264A4.368 4.368 0 0 1 24 4.368v15.264A4.368 4.368 0 0 1 19.632 24zM7.579 17.053h2.526v-6.316H7.58v6.316zm3.789 0h2.527V8.842h-2.527v8.21zm3.79 0h2.526V11.79h-2.527v5.263z" fill="currentColor"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const OutlookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.55q0-.44.3-.75.3-.3.75-.3h12.9q.44 0 .75.3.3.3.3.75V12zm-6 9v-6q0-.5-.3-.85-.29-.35-.7-.35H9v2h5.5q.41 0 .7.3.3.29.3.7v4H18zm6 0V13h-6v2h4v4h2z"/>
  </svg>
);

const calendars = [
  {
    id: 'google',
    name: 'Google Calendar',
    icon: <GoogleCalendarIcon />,
    color: '#4285F4',
    desc: 'Sync automatique avec votre agenda Google',
  },
  {
    id: 'apple',
    name: 'Apple Calendar',
    icon: <AppleIcon />,
    color: '#A3AAAE',
    desc: 'Integration native iOS et macOS',
  },
  {
    id: 'outlook',
    name: 'Outlook',
    icon: <OutlookIcon />,
    color: '#0078D4',
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
  const [connecting, setConnecting] = useState<string | null>(null);

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

      showToast('Session ajoutee au calendrier', 'success');
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
      showToast('Fonctionnalite Premium', 'info');
      setTimeout(() => onNavigate('premium'), 1000);
      return;
    }

    setConnecting(calendarId);

    if (calendarId === 'google') {
      if (isGoogleConnected) {
        showToast('Google Calendar deja connecte', 'info');
        setConnecting(null);
        return;
      }

      showToast('Redirection vers Google...', 'info');
      oauthHelper.startFlow('google');
      return;
    }

    // Simulate connection for other calendars
    await new Promise(resolve => setTimeout(resolve, 1500));
    showToast(`${calendars.find(c => c.id === calendarId)?.name} connecte !`, 'success');
    setConnectedCalendars([...connectedCalendars, calendarId]);
    setConnecting(null);
  };

  const handleDisconnect = async (calendarId: string) => {
    setConnecting(calendarId);
    await new Promise(resolve => setTimeout(resolve, 500));
    showToast('Calendrier deconnecte', 'info');
    setConnectedCalendars(connectedCalendars.filter(id => id !== calendarId));
    setConnecting(null);
  };

  const handleExportICS = async () => {
    if (!sessions || sessions.length === 0) {
      showToast('Aucune session a exporter', 'info');
      return;
    }

    setIsExporting(true);
    try {
      const validSessions = sessions.filter(s => s.status !== 'cancelled');

      if (validSessions.length === 0) {
        showToast('Aucune session active a exporter', 'info');
        return;
      }

      exportSessionsToICS(validSessions, currentSquad?.name);
      showToast(`${validSessions.length} session(s) exportee(s) !`, 'success');
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
      <div className="min-h-screen bg-[#08090a] pb-24 pt-safe">
        <div className="px-4 py-6 max-w-2xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
              <button
                onClick={() => onNavigate('integrations')}
                className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.12)] transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-[#8b8d90]" />
              </button>
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-[#f7f8f8]">Sync Calendrier</h1>
                <p className="text-[13px] text-[#8b8d90] mt-0.5">
                  Connectez vos agendas
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
            </motion.div>

            {/* Premium Upsell Card */}
            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-[rgba(255,255,255,0.08)] p-6 mb-6"
            >
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-5">
                  <Crown className="w-8 h-8 text-amber-400" />
                </div>
                <h2 className="text-xl font-semibold text-[#f7f8f8] mb-2">Fonctionnalite Premium</h2>
                <p className="text-[14px] text-[#8b8d90] mb-6 max-w-sm mx-auto leading-relaxed">
                  Synchronisez vos sessions automatiquement avec Google Calendar, Apple Calendar ou Outlook.
                </p>
                <button
                  onClick={() => onNavigate('premium')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium text-[14px] hover:opacity-90 transition-all duration-200"
                >
                  <Crown className="w-5 h-5" />
                  Passer Premium
                </button>
              </div>

              {/* Decorative gradient orbs */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
            </motion.div>

            {/* Preview Features */}
            <motion.div
              variants={itemVariants}
              className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-[14px] font-medium text-[#f7f8f8]">
                  Avec Premium, vous pourrez :
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  'Sync bi-directionnelle avec vos agendas',
                  'Rappels automatiques sur tous vos appareils',
                  'Export .ics pour partager avec votre squad',
                  'Mise a jour en temps reel des changements',
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-emerald-400" strokeWidth={2.5} />
                    </div>
                    <span className="text-[13px] text-[#8b8d90]">{feature}</span>
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
  const connectedCount = connectedCalendars.length;

  return (
    <div className="min-h-screen bg-[#08090a] pb-24 pt-safe">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <button
              onClick={() => onNavigate('integrations')}
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.12)] transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-[#8b8d90]" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-[#f7f8f8]">Sync Calendrier</h1>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span className="text-[11px] font-medium text-amber-400">Premium</span>
                </div>
              </div>
              <p className="text-[13px] text-[#8b8d90] mt-0.5">
                {connectedCount} calendrier{connectedCount > 1 ? 's' : ''} connecte{connectedCount > 1 ? 's' : ''}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
          </motion.div>

          {/* Info Banner */}
          <motion.div
            variants={itemVariants}
            className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 mb-6"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Link2 className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-[14px] font-medium text-[#f7f8f8] mb-1">Synchronisation automatique</p>
                <p className="text-[13px] text-[#8b8d90] leading-relaxed">
                  Vos sessions confirmees apparaitront automatiquement dans vos calendriers connectes.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Calendar Providers */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#5c5e61]" />
              <h2 className="text-[13px] font-medium text-[#8b8d90] uppercase tracking-wider">
                Calendriers
              </h2>
              <span className="text-[12px] text-[#5c5e61] ml-1">({calendars.length})</span>
            </div>
            <div className="space-y-3">
              {calendars.map((calendar) => {
                const isConnected = connectedCalendars.includes(calendar.id);
                const isLoading = connecting === calendar.id;

                return (
                  <motion.div
                    key={calendar.id}
                    variants={itemVariants}
                    className="group bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
                        style={{ backgroundColor: `${calendar.color}20`, color: calendar.color }}
                      >
                        {calendar.icon}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[15px] font-medium text-[#f7f8f8]">{calendar.name}</span>
                          {isConnected && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                              <Check className="w-3 h-3 text-emerald-400" strokeWidth={2.5} />
                              <span className="text-[11px] font-medium text-emerald-400">Connecte</span>
                            </div>
                          )}
                        </div>
                        <p className="text-[13px] text-[#8b8d90] mt-0.5 truncate">
                          {calendar.desc}
                        </p>
                      </div>

                      {/* Action Button */}
                      {isConnected ? (
                        <button
                          onClick={() => handleDisconnect(calendar.id)}
                          disabled={isLoading}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Deconnecter'
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleConnect(calendar.id)}
                          disabled={isLoading}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium text-[#f7f8f8] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                          style={{ backgroundColor: calendar.color }}
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <ExternalLink className="w-4 h-4" />
                              Connecter
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Export ICS Section */}
          <motion.div
            variants={itemVariants}
            className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-5"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <Download className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-[14px] font-medium text-[#f7f8f8] mb-1">Export manuel</h3>
                <p className="text-[13px] text-[#8b8d90] leading-relaxed">
                  Telechargez un fichier .ics contenant toutes vos sessions confirmees pour l'importer manuellement.
                </p>
              </div>
            </div>
            <button
              onClick={handleExportICS}
              disabled={isExporting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-[14px] font-medium text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.12)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Export en cours...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Telecharger .ics ({sessions?.filter(s => s.status !== 'cancelled').length || 0} sessions)
                </>
              )}
            </button>
          </motion.div>

          {/* Tips Card */}
          <motion.div
            variants={itemVariants}
            className="mt-6 p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#f7f8f8] mb-1">Astuce</p>
                <p className="text-[12px] text-[#8b8d90] leading-relaxed">
                  Connectez Google Calendar pour recevoir des rappels automatiques avant chaque session gaming.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default CalendarSyncScreen;
