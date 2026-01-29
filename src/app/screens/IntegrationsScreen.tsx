import { ArrowLeft, Link2, MessageSquare, Calendar, Trophy, Target, XCircle, CheckCircle2, Sparkles, ChevronRight, Loader2, Zap, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

interface IntegrationCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  connected: boolean;
  username?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  isLoading: boolean;
  index: number;
}

function IntegrationCard({ name, description, icon, bgColor, connected, username, onConnect, onDisconnect, isLoading, index }: IntegrationCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      custom={index}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center gap-4">
        <motion.div
          className={`w-14 h-14 rounded-xl ${bgColor} flex items-center justify-center flex-shrink-0 shadow-lg`}
          whileHover={{ rotate: 5, scale: 1.05 }}
        >
          {icon}
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-gray-800 mb-0.5">
            {name}
          </div>
          <div className="text-xs text-gray-500 font-medium">
            {connected
              ? <span className="text-emerald-600">✓ Connecté{username ? ` • ${username}` : ''}</span>
              : description}
          </div>
        </div>
        {connected ? (
          <motion.button
            onClick={onDisconnect}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
            ) : (
              <XCircle className="w-4 h-4" strokeWidth={2} />
            )}
            Déconnecter
          </motion.button>
        ) : (
          <motion.button
            onClick={onConnect}
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl ${bgColor} text-white text-xs font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-md`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
            ) : (
              <Link2 className="w-4 h-4" strokeWidth={2} />
            )}
            Connecter
          </motion.button>
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
        googleCalendar: { connected: true, email: 'player@example.com' },
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
        showToast(`Connexion à ${displayName} en cours...`, 'info');
        await new Promise(resolve => setTimeout(resolve, 1500));

        const updatedIntegrations = await integrationsAPI.connectIntegration(
          accessToken,
          platform,
          { username: `user_${platform}` }
        );

        setIntegrations(updatedIntegrations);
        showToast(`${displayName} connecté avec succès !`, 'success');
      }
    } catch (error: any) {
      console.error('Connection error:', error);
      showToast(`Erreur lors de la connexion à ${displayName}`, 'error');
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
      showToast(`${displayName} déconnecté`, 'info');
    } catch (error: any) {
      console.error('Disconnection error:', error);
      showToast(`Erreur lors de la déconnexion de ${displayName}`, 'error');
    } finally {
      setConnecting(null);
    }
  };

  const connectedCount = integrations
    ? Object.values(integrations).filter((i: any) => i.connected).length
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-lg"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Link2 className="w-8 h-8 text-white" />
          </motion.div>
          <p className="text-gray-500 font-medium">Chargement des intégrations...</p>
        </motion.div>
      </div>
    );
  }

  if (!integrations) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 font-medium">Erreur de chargement</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
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
              onClick={() => onNavigate('profile')}
              className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Intégrations
              </h1>
              <p className="text-sm text-indigo-500 font-medium mt-0.5">
                {connectedCount} plateforme{connectedCount > 1 ? 's' : ''} connectée{connectedCount > 1 ? 's' : ''}
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Link2 className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Stats Banner */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-5 mb-6 shadow-xl relative overflow-hidden"
          >
            <motion.div
              className="absolute top-2 right-2 w-24 h-24 bg-white/10 rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-white/90 text-sm font-semibold">Synchronise tes comptes</div>
                <div className="text-white/70 text-xs mt-0.5">
                  Connecte tes plateformes pour une expérience unifiée
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{connectedCount}</div>
                <div className="text-xs text-white/70">connectées</div>
              </div>
            </div>
          </motion.div>

          {/* Gaming Platforms Section */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-sm">🎮</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Plateformes Gaming</h2>
            </div>

            <div className="space-y-3">
              <IntegrationCard
                name="Discord"
                description="Synchronise tes serveurs et notifications"
                icon={<MessageSquare className="w-7 h-7 text-white" strokeWidth={2} />}
                bgColor="bg-[#5865F2]"
                connected={integrations.discord.connected}
                username={integrations.discord.username}
                onConnect={() => handleIntegrationConnect('discord', 'Discord')}
                onDisconnect={() => handleIntegrationDisconnect('discord', 'Discord')}
                isLoading={connecting === 'discord'}
                index={0}
              />

              <IntegrationCard
                name="Twitch"
                description="Partage tes sessions en live"
                icon={
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                  </svg>
                }
                bgColor="bg-[#9146FF]"
                connected={integrations.twitch.connected}
                username={integrations.twitch.username}
                onConnect={() => handleIntegrationConnect('twitch', 'Twitch')}
                onDisconnect={() => handleIntegrationDisconnect('twitch', 'Twitch')}
                isLoading={connecting === 'twitch'}
                index={1}
              />

              <IntegrationCard
                name="Steam"
                description="Importe ta bibliothèque de jeux"
                icon={
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0z"/>
                  </svg>
                }
                bgColor="bg-[#171A21]"
                connected={integrations.steam.connected}
                username={integrations.steam.username}
                onConnect={() => handleIntegrationConnect('steam', 'Steam')}
                onDisconnect={() => handleIntegrationDisconnect('steam', 'Steam')}
                isLoading={connecting === 'steam'}
                index={2}
              />

              <IntegrationCard
                name="Riot Games"
                description="Valorant, LoL, TFT stats"
                icon={<Trophy className="w-7 h-7 text-white" strokeWidth={2} />}
                bgColor="bg-[#D13639]"
                connected={integrations.riot.connected}
                username={integrations.riot.username}
                onConnect={() => handleIntegrationConnect('riot', 'Riot Games')}
                onDisconnect={() => handleIntegrationDisconnect('riot', 'Riot Games')}
                isLoading={connecting === 'riot'}
                index={3}
              />

              <IntegrationCard
                name="Battle.net"
                description="Overwatch, Call of Duty, WoW"
                icon={<Target className="w-7 h-7 text-white" strokeWidth={2} />}
                bgColor="bg-[#148EFF]"
                connected={integrations.battlenet.connected}
                username={integrations.battlenet.username}
                onConnect={() => handleIntegrationConnect('battlenet', 'Battle.net')}
                onDisconnect={() => handleIntegrationDisconnect('battlenet', 'Battle.net')}
                isLoading={connecting === 'battlenet'}
                index={4}
              />
            </div>
          </motion.div>

          {/* Productivity Section */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <span className="text-sm">📅</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Productivité</h2>
            </div>

            <IntegrationCard
              name="Google Calendar"
              description="Synchronise tes sessions automatiquement"
              icon={<Calendar className="w-7 h-7 text-white" strokeWidth={2} />}
              bgColor="bg-[#4285F4]"
              connected={integrations.googleCalendar.connected}
              username={integrations.googleCalendar.email || integrations.googleCalendar.username}
              onConnect={() => handleIntegrationConnect('google', 'Google Calendar')}
              onDisconnect={() => handleIntegrationDisconnect('googleCalendar', 'Google Calendar')}
              isLoading={connecting === 'google' || connecting === 'googleCalendar'}
              index={5}
            />
          </motion.div>

          {/* Advanced Section */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <span className="text-sm">⚡</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Avancé</h2>
            </div>

            <div className="space-y-3">
              <motion.button
                onClick={() => onNavigate('api-docs')}
                className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4 text-left border border-white/50 shadow-lg"
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-800 mb-0.5">API & Webhooks</div>
                  <div className="text-xs text-gray-500 font-medium">Documentation développeur & accès API</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" strokeWidth={2} />
              </motion.button>

              <motion.button
                onClick={() => onNavigate('plugins')}
                className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4 text-left border border-white/50 shadow-lg"
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                  <Shield className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-800 mb-0.5">Plugins & Extensions</div>
                  <div className="text-xs text-gray-500 font-medium">Étends les fonctionnalités de l'app</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" strokeWidth={2} />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default IntegrationsScreen;
