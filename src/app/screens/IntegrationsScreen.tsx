import { ArrowLeft, Link2, MessageSquare, Calendar, Trophy, Target, XCircle, CheckCircle2, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { integrationsAPI, type Integrations } from '@/utils/integrationsAPI';
import { projectId } from '@/utils/supabase/info';

interface IntegrationsScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  useMockData?: boolean;
}

export function IntegrationsScreen({ onNavigate, showToast, useMockData = false }: IntegrationsScreenProps) {
  const { getAccessToken } = useAuth();
  const [integrations, setIntegrations] = useState<Integrations | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);

  // Load integrations from backend
  useEffect(() => {
    // If useMockData is true, use mock data instead
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
      showToast('Erreur lors du chargement des intégrations', 'error');
      // Set defaults on error
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

  // Handle integration connection
  const handleIntegrationConnect = async (platform: string, displayName: string) => {
    const accessToken = await getAccessToken();
    if (!accessToken || !integrations) return;

    setConnecting(platform);

    try {
      // Real OAuth flow for Discord and Google
      if (platform === 'discord' || platform === 'google') {
        showToast(`Redirection vers ${displayName}...`, 'info');
        
        // Get OAuth authorization URL from backend
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-e884809f/oauth/${platform}/authorize`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to get OAuth URL');
        }

        const data = await response.json();
        
        if (data.authUrl) {
          // Redirect to OAuth provider
          window.location.href = data.authUrl;
          return;
        }
      } else {
        // Fake OAuth flow for other platforms (Twitch, Steam, Riot, Battle.net)
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

  // Handle integration disconnection
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

  if (loading) {
    return (
      <div className="min-h-screen pb-24 pt-safe flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[var(--primary-500)] animate-spin mx-auto mb-4" strokeWidth={2} />
          <p className="text-sm text-[var(--fg-tertiary)] font-medium">Chargement des intégrations...</p>
        </div>
      </div>
    );
  }

  if (!integrations) {
    return (
      <div className="min-h-screen pb-24 pt-safe flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-[var(--fg-tertiary)] font-medium">Erreur de chargement</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-safe">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => onNavigate('profile')}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Intégrations
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium mt-1">
              Connecte tes plateformes favorites
            </p>
          </div>
        </div>

        {/* Gaming Platforms Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 tracking-tight">
            🎮 Plateformes Gaming
          </h2>
          
          <div className="space-y-3">
            {/* Discord Integration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#5865F2] flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[var(--fg-primary)] mb-0.5">
                    Discord
                  </div>
                  <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                    {integrations.discord.connected 
                      ? `✓ Connecté • ${integrations.discord.username}` 
                      : 'Synchronise tes serveurs et notifications'}
                  </div>
                </div>
                {integrations.discord.connected ? (
                  <button
                    onClick={() => handleIntegrationDisconnect('discord', 'Discord')}
                    disabled={connecting === 'discord'}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--error-50)] text-[var(--error-500)] text-xs font-semibold hover:bg-[var(--error-100)] transition-colors disabled:opacity-50"
                  >
                    {connecting === 'discord' ? (
                      <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                    ) : (
                      <XCircle className="w-4 h-4" strokeWidth={2} />
                    )}
                    Déconnecter
                  </button>
                ) : (
                  <button
                    onClick={() => handleIntegrationConnect('discord', 'Discord')}
                    disabled={connecting === 'discord'}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#5865F2] text-white text-xs font-semibold hover:bg-[#4752C4] transition-colors disabled:opacity-50"
                  >
                    {connecting === 'discord' ? (
                      <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                    ) : (
                      <Link2 className="w-4 h-4" strokeWidth={2} />
                    )}
                    Connecter
                  </button>
                )}
              </div>
            </motion.div>

            {/* Twitch Integration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#9146FF] flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[var(--fg-primary)] mb-0.5">
                    Twitch
                  </div>
                  <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                    {integrations.twitch.connected 
                      ? `✓ Connecté • ${integrations.twitch.username}` 
                      : 'Partage tes sessions en live'}
                  </div>
                </div>
                {integrations.twitch.connected ? (
                  <button
                    onClick={() => handleIntegrationDisconnect('twitch', 'Twitch')}
                    disabled={connecting === 'twitch'}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--error-50)] text-[var(--error-500)] text-xs font-semibold hover:bg-[var(--error-100)] transition-colors disabled:opacity-50"
                  >
                    {connecting === 'twitch' ? (
                      <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                    ) : (
                      <XCircle className="w-4 h-4" strokeWidth={2} />
                    )}
                    Déconnecter
                  </button>
                ) : (
                  <button
                    onClick={() => handleIntegrationConnect('twitch', 'Twitch')}
                    disabled={connecting === 'twitch'}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#9146FF] text-white text-xs font-semibold hover:bg-[#7D3ACF] transition-colors disabled:opacity-50"
                  >
                    {connecting === 'twitch' ? (
                      <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                    ) : (
                      <Link2 className="w-4 h-4" strokeWidth={2} />
                    )}
                    Connecter
                  </button>
                )}
              </div>
            </motion.div>

            {/* Steam Integration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#171A21] flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[var(--fg-primary)] mb-0.5">
                    Steam
                  </div>
                  <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                    {integrations.steam.connected 
                      ? `✓ Connecté • ${integrations.steam.username}` 
                      : 'Importe ta bibliothèque de jeux'}
                  </div>
                </div>
                {integrations.steam.connected ? (
                  <button
                    onClick={() => handleIntegrationDisconnect('steam', 'Steam')}
                    disabled={connecting === 'steam'}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--error-50)] text-[var(--error-500)] text-xs font-semibold hover:bg-[var(--error-100)] transition-colors disabled:opacity-50"
                  >
                    {connecting === 'steam' ? (
                      <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                    ) : (
                      <XCircle className="w-4 h-4" strokeWidth={2} />
                    )}
                    Déconnecter
                  </button>
                ) : (
                  <button
                    onClick={() => handleIntegrationConnect('steam', 'Steam')}
                    disabled={connecting === 'steam'}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#171A21] text-white text-xs font-semibold hover:bg-[#0E1013] transition-colors disabled:opacity-50"
                  >
                    {connecting === 'steam' ? (
                      <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                    ) : (
                      <Link2 className="w-4 h-4" strokeWidth={2} />
                    )}
                    Connecter
                  </button>
                )}
              </div>
            </motion.div>

            {/* Riot Games Integration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#D13639] flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[var(--fg-primary)] mb-0.5">
                    Riot Games
                  </div>
                  <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                    {integrations.riot.connected 
                      ? `✓ Connecté • ${integrations.riot.username}` 
                      : 'Valorant, LoL, TFT stats'}
                  </div>
                </div>
                {integrations.riot.connected ? (
                  <button
                    onClick={() => handleIntegrationDisconnect('riot', 'Riot Games')}
                    disabled={connecting === 'riot'}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--error-50)] text-[var(--error-500)] text-xs font-semibold hover:bg-[var(--error-100)] transition-colors disabled:opacity-50"
                  >
                    {connecting === 'riot' ? (
                      <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                    ) : (
                      <XCircle className="w-4 h-4" strokeWidth={2} />
                    )}
                    Déconnecter
                  </button>
                ) : (
                  <button
                    onClick={() => handleIntegrationConnect('riot', 'Riot Games')}
                    disabled={connecting === 'riot'}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#D13639] text-white text-xs font-semibold hover:bg-[#B82D30] transition-colors disabled:opacity-50"
                  >
                    {connecting === 'riot' ? (
                      <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                    ) : (
                      <Link2 className="w-4 h-4" strokeWidth={2} />
                    )}
                    Connecter
                  </button>
                )}
              </div>
            </motion.div>

            {/* Battle.net Integration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#148EFF] flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[var(--fg-primary)] mb-0.5">
                    Battle.net
                  </div>
                  <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                    {integrations.battlenet.connected 
                      ? `✓ Connecté • ${integrations.battlenet.username}` 
                      : 'Overwatch, Call of Duty, WoW'}
                  </div>
                </div>
                {integrations.battlenet.connected ? (
                  <button
                    onClick={() => handleIntegrationDisconnect('battlenet', 'Battle.net')}
                    disabled={connecting === 'battlenet'}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--error-50)] text-[var(--error-500)] text-xs font-semibold hover:bg-[var(--error-100)] transition-colors disabled:opacity-50"
                  >
                    {connecting === 'battlenet' ? (
                      <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                    ) : (
                      <XCircle className="w-4 h-4" strokeWidth={2} />
                    )}
                    Déconnecter
                  </button>
                ) : (
                  <button
                    onClick={() => handleIntegrationConnect('battlenet', 'Battle.net')}
                    disabled={connecting === 'battlenet'}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#148EFF] text-white text-xs font-semibold hover:bg-[#1178D6] transition-colors disabled:opacity-50"
                  >
                    {connecting === 'battlenet' ? (
                      <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                    ) : (
                      <Link2 className="w-4 h-4" strokeWidth={2} />
                    )}
                    Connecter
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Productivity Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 tracking-tight">
            📅 Productivité
          </h2>
          
          <div className="space-y-3">
            {/* Google Calendar Integration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#4285F4] flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[var(--fg-primary)] mb-0.5">
                    Google Calendar
                  </div>
                  <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                    {integrations.googleCalendar.connected 
                      ? `✓ Connecté • ${integrations.googleCalendar.email || integrations.googleCalendar.username}` 
                      : 'Synchronise tes sessions automatiquement'}
                  </div>
                </div>
                {integrations.googleCalendar.connected ? (
                  <button
                    onClick={() => handleIntegrationDisconnect('googleCalendar', 'Google Calendar')}
                    disabled={connecting === 'googleCalendar'}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--error-50)] text-[var(--error-500)] text-xs font-semibold hover:bg-[var(--error-100)] transition-colors disabled:opacity-50"
                  >
                    {connecting === 'googleCalendar' ? (
                      <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                    ) : (
                      <XCircle className="w-4 h-4" strokeWidth={2} />
                    )}
                    Déconnecter
                  </button>
                ) : (
                  <button
                    onClick={() => handleIntegrationConnect('googleCalendar', 'Google Calendar')}
                    disabled={connecting === 'googleCalendar'}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#4285F4] text-white text-xs font-semibold hover:bg-[#357AE8] transition-colors disabled:opacity-50"
                  >
                    {connecting === 'googleCalendar' ? (
                      <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                    ) : (
                      <Link2 className="w-4 h-4" strokeWidth={2} />
                    )}
                    Connecter
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Advanced Section */}
        <div>
          <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 tracking-tight">
            ⚡ Avancé
          </h2>
          
          <div className="space-y-3">
            {/* API & Webhooks */}
            <motion.button
              onClick={() => onNavigate('api-docs')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 text-left border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200"
              whileHover={{ y: -2 }}
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--primary-50)] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[var(--primary-500)]" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-[var(--fg-primary)] mb-0.5">
                  API & Webhooks
                </div>
                <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                  Documentation développeur & accès API
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--fg-tertiary)]" strokeWidth={2} />
            </motion.button>

            {/* Plugins */}
            <motion.button
              onClick={() => onNavigate('plugins')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 text-left border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200"
              whileHover={{ y: -2 }}
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--secondary-50)] flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--secondary-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-[var(--fg-primary)] mb-0.5">
                  Plugins & Extensions
                </div>
                <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                  Étends les fonctionnalités de l'app
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--fg-tertiary)]" strokeWidth={2} />
            </motion.button>
          </div>
        </div>

      </div>
    </div>
  );
}