import { ArrowLeft, Calendar, Check, Download, ExternalLink, Crown } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/Button';

interface CalendarSyncScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function CalendarSyncScreen({ onNavigate, showToast }: CalendarSyncScreenProps) {
  const isPremium = false; // TODO: Get from context
  const [connectedCalendars, setConnectedCalendars] = useState<string[]>([]);

  const calendars = [
    {
      id: 'google',
      name: 'Google Calendar',
      icon: '📅',
      color: '#4285F4',
      desc: 'Sync automatique avec votre agenda Google',
    },
    {
      id: 'apple',
      name: 'Apple Calendar',
      icon: '🍎',
      color: '#000000',
      desc: 'Intégration native iOS et macOS',
    },
    {
      id: 'outlook',
      name: 'Outlook',
      icon: '📧',
      color: '#0078D4',
      desc: 'Compatible Microsoft 365',
    },
  ];

  const handleConnect = (calendarId: string) => {
    if (!isPremium) {
      showToast('Fonctionnalité Premium', 'info');
      setTimeout(() => onNavigate('premium'), 1000);
      return;
    }

    showToast(`${calendars.find(c => c.id === calendarId)?.name} connecté !`, 'success');
    setConnectedCalendars([...connectedCalendars, calendarId]);
  };

  const handleDisconnect = (calendarId: string) => {
    showToast('Calendrier déconnecté', 'success');
    setConnectedCalendars(connectedCalendars.filter(id => id !== calendarId));
  };

  const handleExportICS = () => {
    if (!isPremium) {
      showToast('Fonctionnalité Premium', 'info');
      setTimeout(() => onNavigate('premium'), 1000);
      return;
    }

    showToast('Fichier .ics téléchargé !', 'success');
  };

  if (!isPremium) {
    return (
      <div className="min-h-screen pb-24 pt-safe bg-[var(--bg-base)]">
        <div className="px-4 py-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => onNavigate('integrations')}
              className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
            </button>
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Sync Calendrier
            </h1>
          </div>

          {/* Premium Upsell */}
          <div className="bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] rounded-3xl p-8 text-white text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center">
              <Crown className="w-10 h-10" strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Fonctionnalité Premium</h2>
            <p className="text-base opacity-90 mb-6 leading-relaxed">
              Synchronisez vos sessions automatiquement avec Google Calendar, Apple Calendar ou Outlook.
            </p>
            <Button
              variant="primary"
              onClick={() => onNavigate('premium')}
              className="w-full h-14 bg-white text-[var(--primary-500)] hover:bg-white/90 rounded-2xl shadow-xl font-bold"
            >
              <Crown className="w-6 h-6" strokeWidth={2} />
              Passer Premium
            </Button>
          </div>

          {/* Preview */}
          <div className="bg-[var(--bg-subtle)] rounded-2xl p-5 border-[0.5px] border-[var(--border-medium)]">
            <h3 className="text-sm font-semibold text-[var(--fg-primary)] mb-3">
              Avec Premium, vous pourrez :
            </h3>
            <div className="space-y-2 text-sm text-[var(--fg-secondary)]">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[var(--success-500)] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                <span>Sync bi-directionnelle avec vos agendas</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[var(--success-500)] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                <span>Rappels automatiques sur tous vos appareils</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[var(--success-500)] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                <span>Export .ics pour partager avec votre squad</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[var(--success-500)] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                <span>Mise à jour en temps réel des changements</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-safe bg-[var(--bg-base)]">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => onNavigate('integrations')}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[var(--primary-500)]" strokeWidth={2} />
              Sync Calendrier
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-[var(--primary-500)]" strokeWidth={2} />
              Premium
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-[var(--primary-50)] rounded-2xl p-5 mb-6 border-[0.5px] border-[var(--primary-200)]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary-500)] flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                Synchronisation automatique
              </h3>
              <p className="text-xs text-[var(--fg-tertiary)]">
                Vos sessions confirmées apparaîtront automatiquement dans vos calendriers connectés.
              </p>
            </div>
          </div>
        </div>

        {/* Calendar Providers */}
        <div className="space-y-3 mb-6">
          <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-4">
            Connecter un calendrier
          </h3>
          {calendars.map((calendar, index) => {
            const isConnected = connectedCalendars.includes(calendar.id);
            return (
              <motion.div
                key={calendar.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl p-5 border-[0.5px] shadow-sm transition-all ${
                  isConnected
                    ? 'border-[var(--success-300)] bg-[var(--success-50)]/30'
                    : 'border-[var(--border-subtle)]'
                }`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ backgroundColor: `${calendar.color}15` }}
                  >
                    {calendar.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-[var(--fg-primary)] mb-1 flex items-center gap-2">
                      {calendar.name}
                      {isConnected && (
                        <span className="px-2 py-0.5 rounded-full bg-[var(--success-500)] text-white text-xs font-bold">
                          CONNECTÉ
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-[var(--fg-tertiary)]">
                      {calendar.desc}
                    </p>
                  </div>
                </div>

                {isConnected ? (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => handleDisconnect(calendar.id)}
                      className="flex-1 h-11 bg-white border-[0.5px] border-[var(--border-medium)] hover:border-[var(--border-strong)] rounded-xl shadow-sm font-semibold text-sm"
                    >
                      Déconnecter
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => showToast('Calendrier à jour !', 'success')}
                      className="flex-1 h-11 bg-[var(--success-500)] hover:bg-[var(--success-600)] text-white rounded-xl shadow-md font-semibold text-sm"
                    >
                      <Check className="w-4 h-4" strokeWidth={2} />
                      Synchronisé
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => handleConnect(calendar.id)}
                    className="w-full h-11 bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] text-white rounded-xl shadow-lg shadow-[var(--primary-500)]/20 font-semibold text-sm transition-all duration-200"
                  >
                    <ExternalLink className="w-4 h-4" strokeWidth={2} />
                    Connecter
                  </Button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Export ICS */}
        <div className="bg-white rounded-2xl p-5 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
          <h3 className="text-base font-semibold text-[var(--fg-primary)] mb-3 flex items-center gap-2">
            <Download className="w-5 h-5 text-[var(--primary-500)]" strokeWidth={2} />
            Export manuel
          </h3>
          <p className="text-sm text-[var(--fg-tertiary)] mb-4">
            Téléchargez un fichier .ics contenant toutes vos sessions confirmées pour l'importer manuellement.
          </p>
          <Button
            variant="ghost"
            onClick={handleExportICS}
            className="w-full h-12 bg-white border-[0.5px] border-[var(--border-medium)] hover:border-[var(--border-strong)] rounded-xl shadow-sm font-semibold"
          >
            <Download className="w-5 h-5" strokeWidth={2} />
            Télécharger .ics
          </Button>
        </div>

      </div>
    </div>
  );
}

export default CalendarSyncScreen;