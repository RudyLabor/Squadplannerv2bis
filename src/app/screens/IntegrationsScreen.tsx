import { ArrowLeft, Zap, Link2, Check, Loader2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { integrationsAPI, type Integrations } from '@/utils/integrationsAPI';
import { oauthHelper, type OAuthProvider } from '@/utils/oauth';

interface IntegrationsScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  useMockData?: boolean;
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

// Icones SVG pour les services
const DiscordIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

const GoogleCalendarIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.316 5.684H5.684v12.632h12.632V5.684z" fill="#fff"/>
    <path d="M19.632 24H4.368A4.368 4.368 0 0 1 0 19.632V4.368A4.368 4.368 0 0 1 4.368 0h15.264A4.368 4.368 0 0 1 24 4.368v15.264A4.368 4.368 0 0 1 19.632 24zM7.579 17.053h2.526v-6.316H7.58v6.316zm3.789 0h2.527V8.842h-2.527v8.21zm3.79 0h2.526V11.79h-2.527v5.263z" fill="currentColor"/>
  </svg>
);

const TwitchIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
  </svg>
);

const SteamIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0z"/>
  </svg>
);

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  connected: boolean;
  username?: string;
  platform: string;
}

interface IntegrationCardProps {
  integration: Integration;
  onConnect: () => void;
  onDisconnect: () => void;
  isLoading: boolean;
}

function IntegrationCard({ integration, onConnect, onDisconnect, isLoading }: IntegrationCardProps) {
  const { name, description, icon, color, connected, username } = integration;

  return (
    <motion.div
      variants={itemVariants}
      className="group bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] transition-all duration-200"
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
          style={{ backgroundColor: `${color}20`, color: color }}
        >
          {icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-medium text-[#f7f8f8]">{name}</span>
            {connected && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Check className="w-3 h-3 text-emerald-400" strokeWidth={2.5} />
                <span className="text-[11px] font-medium text-emerald-400">Connecte</span>
              </div>
            )}
          </div>
          <p className="text-[13px] text-[#8b8d90] mt-0.5 truncate">
            {connected && username ? username : description}
          </p>
        </div>

        {/* Action Button */}
        {connected ? (
          <button
            onClick={onDisconnect}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                Deconnecter
              </>
            )}
          </button>
        ) : (
          <button
            onClick={onConnect}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium text-[#f7f8f8] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{ backgroundColor: color }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Link2 className="w-4 h-4" />
                Connecter
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function IntegrationsScreen({ onNavigate, showToast, useMockData = false }: IntegrationsScreenProps) {
  const { getAccessToken } = useAuth();
  const [integrations, setIntegrations] = useState<Integrations | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);

  useEffect(() => {
    if (useMockData) {
      setIntegrations({
        discord: { connected: true, username: 'GamerPro#1234' },
        googleCalendar: { connected: false, email: '' },
        twitch: { connected: false, username: '' },
        steam: { connected: true, username: 'GamerPro' },
        riot: { connected: false, username: '' },
        battlenet: { connected: false, username: '' },
      });
      setLoading(false);
      return;
    }

    loadIntegrations();
  }, [useMockData]);

  const loadIntegrations = async () => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      const data = await integrationsAPI.getUserIntegrations(accessToken);
      setIntegrations(data);
    } catch (error: any) {
      console.error('Error loading integrations:', error);
      setIntegrations({
        discord: { connected: false, username: '' },
        googleCalendar: { connected: false, email: '' },
        twitch: { connected: false, username: '' },
        steam: { connected: false, username: '' },
        riot: { connected: false, username: '' },
        battlenet: { connected: false, username: '' },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleIntegrationConnect = async (platform: string, displayName: string) => {
    const accessToken = await getAccessToken();
    if (!accessToken || !integrations) return;

    setConnecting(platform);

    try {
      const oauthProviders: OAuthProvider[] = ['discord', 'google', 'twitch', 'steam', 'riot', 'battlenet'];

      if (oauthProviders.includes(platform as OAuthProvider)) {
        showToast(`Redirection vers ${displayName}...`, 'info');
        oauthHelper.startFlow(platform as OAuthProvider);
        return;
      } else {
        showToast(`Connexion a ${displayName} en cours...`, 'info');
        await new Promise(resolve => setTimeout(resolve, 1500));

        const updatedIntegrations = await integrationsAPI.connectIntegration(
          accessToken,
          platform,
          { username: `user_${platform}` }
        );

        setIntegrations(updatedIntegrations);
        showToast(`${displayName} connecte avec succes !`, 'success');
      }
    } catch (error: any) {
      console.error('Connection error:', error);
      showToast(`Erreur lors de la connexion a ${displayName}`, 'error');
    } finally {
      setConnecting(null);
    }
  };

  const handleIntegrationDisconnect = async (platform: string, displayName: string) => {
    const accessToken = await getAccessToken();
    if (!accessToken || !integrations) return;

    setConnecting(platform);

    try {
      const updatedIntegrations = await integrationsAPI.disconnectIntegration(
        accessToken,
        platform
      );

      setIntegrations(updatedIntegrations);
      showToast(`${displayName} deconnecte`, 'info');
    } catch (error: any) {
      console.error('Disconnection error:', error);
      showToast(`Erreur lors de la deconnexion de ${displayName}`, 'error');
    } finally {
      setConnecting(null);
    }
  };

  // Build integrations list
  const buildIntegrationsList = (): { connected: Integration[]; available: Integration[] } => {
    if (!integrations) return { connected: [], available: [] };

    const allIntegrations: Integration[] = [
      {
        id: 'discord',
        name: 'Discord',
        description: 'Synchronise tes serveurs et notifications',
        icon: <DiscordIcon />,
        color: '#5865F2',
        connected: integrations.discord.connected,
        username: integrations.discord.username,
        platform: 'discord'
      },
      {
        id: 'googleCalendar',
        name: 'Google Calendar',
        description: 'Synchronise tes sessions automatiquement',
        icon: <GoogleCalendarIcon />,
        color: '#4285F4',
        connected: integrations.googleCalendar.connected,
        username: integrations.googleCalendar.email || integrations.googleCalendar.username,
        platform: 'google'
      },
      {
        id: 'twitch',
        name: 'Twitch',
        description: 'Partage tes sessions en live',
        icon: <TwitchIcon />,
        color: '#9146FF',
        connected: integrations.twitch.connected,
        username: integrations.twitch.username,
        platform: 'twitch'
      },
      {
        id: 'steam',
        name: 'Steam',
        description: 'Importe ta bibliotheque de jeux',
        icon: <SteamIcon />,
        color: '#00adee',
        connected: integrations.steam.connected,
        username: integrations.steam.username,
        platform: 'steam'
      }
    ];

    return {
      connected: allIntegrations.filter(i => i.connected),
      available: allIntegrations.filter(i => !i.connected)
    };
  };

  const { connected, available } = buildIntegrationsList();
  const connectedCount = connected.length;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-14 h-14 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Link2 className="w-6 h-6 text-[#8b8d90]" />
          </motion.div>
          <p className="text-[#8b8d90] text-sm">Chargement des integrations...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (!integrations) {
    return (
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8b8d90] text-sm">Erreur de chargement</p>
        </div>
      </div>
    );
  }

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
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.12)] transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-[#8b8d90]" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-[#f7f8f8]">Integrations</h1>
              <p className="text-[13px] text-[#8b8d90] mt-0.5">
                {connectedCount} service{connectedCount > 1 ? 's' : ''} connecte{connectedCount > 1 ? 's' : ''}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
          </motion.div>

          {/* Connected Section */}
          {connected.length > 0 && (
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <h2 className="text-[13px] font-medium text-[#8b8d90] uppercase tracking-wider">
                  Connecte
                </h2>
                <span className="text-[12px] text-[#5c5e61] ml-1">({connected.length})</span>
              </div>
              <div className="space-y-3">
                {connected.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    onConnect={() => handleIntegrationConnect(integration.platform, integration.name)}
                    onDisconnect={() => handleIntegrationDisconnect(integration.id === 'googleCalendar' ? 'googleCalendar' : integration.platform, integration.name)}
                    isLoading={connecting === integration.platform || connecting === integration.id}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Available Section */}
          {available.length > 0 && (
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#5c5e61]" />
                <h2 className="text-[13px] font-medium text-[#8b8d90] uppercase tracking-wider">
                  Disponible
                </h2>
                <span className="text-[12px] text-[#5c5e61] ml-1">({available.length})</span>
              </div>
              <div className="space-y-3">
                {available.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    onConnect={() => handleIntegrationConnect(integration.platform, integration.name)}
                    onDisconnect={() => handleIntegrationDisconnect(integration.id === 'googleCalendar' ? 'googleCalendar' : integration.platform, integration.name)}
                    isLoading={connecting === integration.platform || connecting === integration.id}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Empty state */}
          {connected.length === 0 && available.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-2xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center mx-auto mb-4">
                <Link2 className="w-8 h-8 text-[#5c5e61]" />
              </div>
              <p className="text-[#8b8d90] text-sm">Aucune integration disponible</p>
            </motion.div>
          )}

          {/* Info Card */}
          <motion.div
            variants={itemVariants}
            className="mt-8 p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#f7f8f8] mb-1">Synchronisation automatique</p>
                <p className="text-[12px] text-[#8b8d90] leading-relaxed">
                  Connecte tes services pour synchroniser automatiquement tes sessions,
                  notifications et statistiques avec Squad Planner.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default IntegrationsScreen;
