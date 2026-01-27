import { ArrowLeft, Bot, Zap, Check, Copy, Terminal, MessageSquare, Users, Calendar } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

interface DiscordBotScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function DiscordBotScreen({ onNavigate, showToast }: DiscordBotScreenProps) {
  const [botToken, setBotToken] = useState('');
  const [serverId, setServerId] = useState('');
  const [channelId, setChannelId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const slashCommands = [
    {
      command: '/session',
      description: 'Créer une nouvelle session de jeu',
      usage: '/session <jeu> <date> <heure>',
      example: '/session Valorant demain 21h',
      icon: Calendar,
      color: 'var(--primary-500)',
    },
    {
      command: '/rsvp',
      description: 'Répondre à une invitation de session',
      usage: '/rsvp <session_id> <oui|non|peut-être>',
      example: '/rsvp 123 oui',
      icon: Check,
      color: 'var(--success-500)',
    },
    {
      command: '/retard',
      description: 'Signaler un retard pour la session en cours',
      usage: '/retard <minutes>',
      example: '/retard 15',
      icon: Zap,
      color: 'var(--warning-500)',
    },
    {
      command: '/squad',
      description: 'Voir les infos de votre squad',
      usage: '/squad [nom]',
      example: '/squad Fragsters',
      icon: Users,
      color: 'var(--secondary-500)',
    },
  ];

  const handleConnect = () => {
    if (!botToken || !serverId || !channelId) {
      showToast('Veuillez remplir tous les champs', 'error');
      return;
    }

    setIsConnected(true);
    showToast('Bot Discord connecté avec succès !', 'success');
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setBotToken('');
    setServerId('');
    setChannelId('');
    showToast('Bot Discord déconnecté', 'info');
  };

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    showToast('Commande copiée !', 'success');
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  return (
    <div className="min-h-screen pb-24 pt-safe">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => onNavigate('integrations')}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Discord Bot
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)]">
              Gérez vos sessions depuis Discord
            </p>
          </div>
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-[var(--success-500)]' : 'bg-[var(--fg-tertiary)]'}`} />
        </div>

        {/* Connection Status */}
        {isConnected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[var(--success-50)] to-[var(--success-100)] rounded-2xl p-6 mb-8 border-[0.5px] border-[var(--success-200)]"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-[var(--success-500)] flex items-center justify-center flex-shrink-0">
                <Bot className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[var(--fg-primary)] mb-1">
                  Bot actif
                </h3>
                <p className="text-sm text-[var(--fg-secondary)]">
                  Connecté au serveur Discord
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={handleDisconnect}
                className="h-10 px-4 bg-white/80 hover:bg-white border-[0.5px] border-[var(--border-medium)] rounded-xl text-sm font-semibold"
              >
                Déconnecter
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--fg-tertiary)]">Server ID:</span>
                <span className="font-mono text-[var(--fg-secondary)]">{serverId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--fg-tertiary)]">Channel ID:</span>
                <span className="font-mono text-[var(--fg-secondary)]">{channelId}</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 mb-8 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
          >
            <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-5">
              Configuration
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-[var(--fg-secondary)] mb-2 block font-semibold">
                  Bot Token
                </label>
                <Input
                  type="password"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  placeholder="MTIzNDU2Nzg5MDEyMzQ1Njc4OQ..."
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-[var(--fg-secondary)] mb-2 block font-semibold">
                  Server ID
                </label>
                <Input
                  value={serverId}
                  onChange={(e) => setServerId(e.target.value)}
                  placeholder="123456789012345678"
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-[var(--fg-secondary)] mb-2 block font-semibold">
                  Channel ID
                </label>
                <Input
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  placeholder="987654321098765432"
                  className="font-mono text-sm"
                />
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleConnect}
              className="w-full h-12 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-semibold shadow-md"
            >
              <Bot className="w-5 h-5" strokeWidth={2} />
              Connecter le Bot
            </Button>

            <div className="mt-4 p-4 bg-[var(--bg-muted)] rounded-xl">
              <p className="text-xs text-[var(--fg-tertiary)] leading-relaxed">
                💡 <strong>Besoin d'aide ?</strong> Consultez notre{' '}
                <a href="#" className="text-[var(--primary-500)] font-semibold underline">
                  guide de configuration Discord
                </a>{' '}
                pour créer votre bot.
              </p>
            </div>
          </motion.div>
        )}

        {/* Slash Commands */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5" strokeWidth={2} />
            Slash Commands disponibles
          </h2>

          <div className="space-y-3">
            {slashCommands.map((cmd, index) => (
              <motion.div
                key={cmd.command}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-5 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${cmd.color}15` }}
                  >
                    <cmd.icon className="w-5 h-5" style={{ color: cmd.color }} strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-base font-bold text-[var(--fg-primary)]">
                        {cmd.command}
                      </h3>
                      <button
                        onClick={() => copyCommand(cmd.command)}
                        className="w-7 h-7 rounded-lg bg-[var(--bg-muted)] hover:bg-[var(--bg-subtle)] flex items-center justify-center transition-all"
                      >
                        {copiedCommand === cmd.command ? (
                          <Check className="w-4 h-4 text-[var(--success-500)]" strokeWidth={2} />
                        ) : (
                          <Copy className="w-4 h-4 text-[var(--fg-tertiary)]" strokeWidth={2} />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-[var(--fg-secondary)] mb-3">
                      {cmd.description}
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2 text-xs">
                        <span className="text-[var(--fg-tertiary)] font-semibold min-w-[60px]">
                          Usage:
                        </span>
                        <code className="font-mono bg-[var(--bg-muted)] px-2 py-0.5 rounded text-[var(--fg-secondary)]">
                          {cmd.usage}
                        </code>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <span className="text-[var(--fg-tertiary)] font-semibold min-w-[60px]">
                          Exemple:
                        </span>
                        <code className="font-mono bg-[var(--primary-50)] px-2 py-0.5 rounded text-[var(--primary-600)] border-[0.5px] border-[var(--primary-200)]">
                          {cmd.example}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 tracking-tight">
            Fonctionnalités
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Embeds auto', icon: MessageSquare, enabled: isConnected },
              { label: 'Rappels J-1', icon: Calendar, enabled: isConnected },
              { label: 'Rappels H-1', icon: Zap, enabled: isConnected },
              { label: 'Vocal push', icon: Users, enabled: false },
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-2xl p-4 border-[0.5px] transition-all ${
                  feature.enabled
                    ? 'bg-[var(--success-50)] border-[var(--success-200)]'
                    : 'bg-[var(--bg-muted)] border-[var(--border-subtle)]'
                }`}
              >
                <feature.icon
                  className={`w-6 h-6 mb-2 ${
                    feature.enabled ? 'text-[var(--success-500)]' : 'text-[var(--fg-tertiary)]'
                  }`}
                  strokeWidth={2}
                />
                <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                  {feature.label}
                </div>
                <div className={`text-xs font-medium ${
                  feature.enabled ? 'text-[var(--success-600)]' : 'text-[var(--fg-tertiary)]'
                }`}>
                  {feature.enabled ? 'Actif' : 'Inactif'}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Warning */}
        {!isConnected && (
          <div className="bg-[var(--warning-50)] rounded-2xl p-5 border-[0.5px] border-[var(--warning-200)]">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--warning-500)] flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                  Bot non connecté
                </h4>
                <p className="text-sm text-[var(--fg-secondary)] leading-relaxed">
                  Connectez votre bot Discord pour profiter des slash commands et des rappels automatiques dans vos channels.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default DiscordBotScreen;