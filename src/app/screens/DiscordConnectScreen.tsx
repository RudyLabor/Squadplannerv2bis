import { ArrowLeft, Gamepad2, Globe, Shield, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/app/components/ui/Button';
import { useUser } from '@/app/contexts/UserContext';

interface DiscordConnectScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function DiscordConnectScreen({ onNavigate, showToast }: DiscordConnectScreenProps) {
  const { userProfile, updateUserProfile } = useUser();
  const [connecting, setConnecting] = useState(false);
  const isConnected = userProfile?.integrations?.discord?.connected;

  const handleConnect = async () => {
    setConnecting(true);
    // Simulate OAuth flow
    setTimeout(async () => {
      try {
        await updateUserProfile({
          integrations: {
            ...userProfile.integrations,
            discord: {
              connected: true,
              username: 'SquadBot#1234'
            }
          }
        });
        setConnecting(false);
        // Open Discord OAuth URL in a real app
        window.open('https://discord.com/oauth2/authorize?client_id=FAKE_CLIENT_ID&scope=bot', '_blank');
        showToast('Bot connecté avec succès !', 'success');
      } catch (error) {
        setConnecting(false);
        showToast('Erreur de connexion', 'error');
      }
    }, 800);
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
              Connectez votre serveur
            </p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-[#5865F2] rounded-3xl p-8 text-center text-white mb-8 shadow-xl shadow-[#5865F2]/20">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
             <Gamepad2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Le Bot Squad Planner</h2>
          <p className="text-white/80 mb-8 max-w-sm mx-auto leading-relaxed">
            Invitez notre bot sur votre serveur pour créer des sessions directement depuis vos channels et synchroniser les rôles.
          </p>
          <Button
            variant="default"
            onClick={handleConnect}
            className="w-full h-14 bg-white text-[#5865F2] hover:bg-white/90 font-bold text-base rounded-2xl"
          >
            {connecting ? 'Connexion...' : isConnected ? 'Bot Connecté ✅' : 'Inviter le Bot'}
          </Button>
        </div>

        {/* Features */}
        <div className="grid gap-4">
          <div className="bg-white p-5 rounded-2xl border-[0.5px] border-[var(--border-subtle)] flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--primary-50)] flex items-center justify-center flex-shrink-0">
              <Globe className="w-6 h-6 text-[var(--primary-500)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--fg-primary)]">Commandes Slash</h3>
              <p className="text-sm text-[var(--fg-tertiary)] line-clamp-2">
                Utilisez /plan pour créer une session et /join pour rejoindre sans quitter Discord.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border-[0.5px] border-[var(--border-subtle)] flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--secondary-50)] flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-[var(--secondary-500)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--fg-primary)]">Synchro des Rôles</h3>
              <p className="text-sm text-[var(--fg-tertiary)] line-clamp-2">
                Attribuez automatiquement le rôle "In Session" aux joueurs présents.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border-[0.5px] border-[var(--border-subtle)] flex gap-4">
             <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
              <ExternalLink className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--fg-primary)]">Webhooks</h3>
              <p className="text-sm text-[var(--fg-tertiary)] line-clamp-2">
                Postez automatiquement les nouvelles sessions dans un channel #annonces.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DiscordConnectScreen;
