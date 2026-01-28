import { ArrowLeft, Gamepad2, Globe, Shield, ExternalLink, CheckCircle2, Loader2, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { useUser } from '@/app/contexts/UserContext';
import { supabase } from '@/utils/supabase/client';

interface DiscordConnectScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function DiscordConnectScreen({ onNavigate, showToast }: DiscordConnectScreenProps) {
  const { userProfile, updateUserProfile } = useUser();
  const [connecting, setConnecting] = useState(false);
  const [discordUser, setDiscordUser] = useState<{ username?: string; avatar_url?: string; id?: string } | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Vérifier le statut de connexion Discord au chargement
  useEffect(() => {
    checkDiscordConnection();
  }, [userProfile]);

  const checkDiscordConnection = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Vérifier si l'utilisateur a une identité Discord liée
        const discordIdentity = user.identities?.find(id => id.provider === 'discord');
        if (discordIdentity) {
          setIsConnected(true);
          setDiscordUser({
            username: discordIdentity.identity_data?.full_name || discordIdentity.identity_data?.name || discordIdentity.identity_data?.global_name,
            avatar_url: discordIdentity.identity_data?.avatar_url,
            id: discordIdentity.identity_data?.provider_id,
          });
        } else if (userProfile?.integrations?.discord?.connected) {
          // Fallback: vérifier dans les integrations du profil
          setIsConnected(true);
          const discordIntegration = userProfile.integrations.discord as { connected: boolean; username?: string };
          setDiscordUser({
            username: discordIntegration.username,
          });
        } else {
          setIsConnected(false);
          setDiscordUser(null);
        }
      }
    } catch (error) {
      console.error('Error checking Discord connection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    try {
      // Utiliser l'OAuth Supabase natif pour Discord
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: `${window.location.origin}/discord-connect`,
          scopes: 'identify guilds',
          // Permettre de lier le compte Discord à un compte existant
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        throw error;
      }

      // La redirection est gérée automatiquement par Supabase
      showToast('Redirection vers Discord...', 'info');
    } catch (error: any) {
      console.error('Discord connection error:', error);
      showToast(error.message || 'Erreur de connexion Discord', 'error');
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setConnecting(true);
    try {
      // Note: Supabase ne permet pas de "unlinkIdentity" facilement
      // On met à jour le profil pour marquer Discord comme déconnecté côté app
      await updateUserProfile({
        integrations: {
          ...userProfile.integrations,
          discord: {
            connected: false,
            username: undefined,
          },
        },
      });

      setIsConnected(false);
      setDiscordUser(null);
      showToast('Discord déconnecté de l\'app', 'info');
    } catch (error: any) {
      console.error('Discord disconnect error:', error);
      showToast('Erreur lors de la déconnexion', 'error');
    } finally {
      setConnecting(false);
    }
  };

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
          <div>
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Discord
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium mt-1">
              Connectez votre compte Discord
            </p>
          </div>
        </div>

        {/* Connection Status Card */}
        {!loading && isConnected && discordUser && (
          <div className="bg-green-50 rounded-2xl p-4 mb-6 border border-green-200">
            <div className="flex items-center gap-4">
              <div className="relative">
                {discordUser.avatar_url ? (
                  <img
                    src={discordUser.avatar_url}
                    alt="Discord Avatar"
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-[#5865F2] flex items-center justify-center">
                    <User className="w-7 h-7 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-green-800">Connecté</p>
                <p className="text-sm text-green-600">{discordUser.username}</p>
              </div>
              <button
                onClick={handleDisconnect}
                disabled={connecting}
                className="px-4 py-2 rounded-xl bg-white text-red-600 text-sm font-medium hover:bg-red-50 transition-colors border border-red-200"
              >
                {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-[#5865F2] rounded-3xl p-8 text-center text-white mb-8 shadow-xl shadow-[#5865F2]/20">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3">
            {isConnected ? 'Discord Connecté' : 'Connecter Discord'}
          </h2>
          <p className="text-white/80 mb-8 max-w-sm mx-auto leading-relaxed">
            {isConnected
              ? 'Votre compte Discord est lié. Vous pouvez maintenant utiliser les fonctionnalités avancées.'
              : 'Connectez votre compte Discord pour synchroniser vos sessions et recevoir des notifications.'}
          </p>
          {!isConnected && (
            <Button
              variant="default"
              onClick={handleConnect}
              disabled={connecting || loading}
              className="w-full h-14 bg-white text-[#5865F2] hover:bg-white/90 font-bold text-base rounded-2xl disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : connecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Connexion...
                </>
              ) : (
                'Se connecter avec Discord'
              )}
            </Button>
          )}
        </div>

        {/* Features */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fonctionnalités</h3>
        <div className="grid gap-4">
          <div className={`bg-white p-5 rounded-2xl border-[0.5px] ${isConnected ? 'border-green-200 bg-green-50/50' : 'border-[var(--border-subtle)]'} flex gap-4`}>
            <div className="w-12 h-12 rounded-xl bg-[var(--primary-50)] flex items-center justify-center flex-shrink-0">
              <Globe className="w-6 h-6 text-[var(--primary-500)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--fg-primary)] flex items-center gap-2">
                Commandes Slash
                {isConnected && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </h3>
              <p className="text-sm text-[var(--fg-tertiary)] line-clamp-2">
                Utilisez /plan pour créer une session et /join pour rejoindre sans quitter Discord.
              </p>
            </div>
          </div>

          <div className={`bg-white p-5 rounded-2xl border-[0.5px] ${isConnected ? 'border-green-200 bg-green-50/50' : 'border-[var(--border-subtle)]'} flex gap-4`}>
            <div className="w-12 h-12 rounded-xl bg-[var(--secondary-50)] flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-[var(--secondary-500)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--fg-primary)] flex items-center gap-2">
                Synchro des Rôles
                {isConnected && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </h3>
              <p className="text-sm text-[var(--fg-tertiary)] line-clamp-2">
                Attribuez automatiquement le rôle "In Session" aux joueurs présents.
              </p>
            </div>
          </div>

          <div className={`bg-white p-5 rounded-2xl border-[0.5px] ${isConnected ? 'border-green-200 bg-green-50/50' : 'border-[var(--border-subtle)]'} flex gap-4`}>
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
              <ExternalLink className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--fg-primary)] flex items-center gap-2">
                Notifications
                {isConnected && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </h3>
              <p className="text-sm text-[var(--fg-tertiary)] line-clamp-2">
                Recevez des notifications Discord pour les sessions et les rappels.
              </p>
            </div>
          </div>
        </div>

        {/* Bot Invite Section */}
        {isConnected && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bot Discord (Optionnel)</h3>
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <Gamepad2 className="w-8 h-8 text-[#5865F2]" />
                <div>
                  <p className="font-medium text-gray-900">Squad Planner Bot</p>
                  <p className="text-sm text-gray-500">Invitez le bot sur votre serveur</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('discord-bot')}
                className="w-full py-3 rounded-xl bg-[#5865F2] text-white font-medium hover:bg-[#4752C4] transition-colors"
              >
                Configurer le Bot
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DiscordConnectScreen;
