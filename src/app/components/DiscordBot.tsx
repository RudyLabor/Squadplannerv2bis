// 🤖 SQUAD PLANNER - Bot Discord Natif

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Check, Copy, ExternalLink, Zap, Users, Bell, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { EMOJIS } from '@/constants/emojis';

interface DiscordBotProps {
  squadId?: string;
  onConnect?: () => void;
}

export function DiscordBot({ squadId, onConnect }: DiscordBotProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const botInviteUrl = 'https://discord.com/api/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=YOUR_PERMISSIONS&scope=bot%20applications.commands';

  const handleCopyWebhook = async () => {
    if (webhookUrl) {
      await navigator.clipboard.writeText(webhookUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleConnectDiscord = () => {
    // Simulation de connexion
    setIsConnected(true);
    setWebhookUrl('https://discord.com/api/webhooks/123456789/abcdefgh');
    if (onConnect) {
      onConnect();
    }
  };

  const features = [
    {
      icon: Calendar,
      emoji: EMOJIS.time.calendar,
      title: 'Annonces automatiques',
      description: 'Poste les sessions dans ton serveur Discord',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Bell,
      emoji: EMOJIS.time.alarm,
      title: 'Rappels de session',
      description: 'Notifie les joueurs 24h et 1h avant',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      icon: Users,
      emoji: EMOJIS.gaming.people,
      title: 'Gestion des réponses',
      description: 'Les joueurs répondent via réactions Discord',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Zap,
      emoji: EMOJIS.gaming.zap,
      title: 'Sync temps réel',
      description: 'Mises à jour instantanées entre Discord et Squad Planner',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card variant="glass-3" className="p-6">
        <div className="flex items-start gap-4">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5865F2] to-[#7289DA] flex items-center justify-center flex-shrink-0"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <MessageCircle className="w-8 h-8 text-white" />
          </motion.div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="heading-small">Bot Discord Natif</h3>
              {isConnected && (
                <Badge variant="success" size="sm">
                  <Check className="w-3 h-3 mr-1" />
                  Connecté
                </Badge>
              )}
            </div>
            <p className="text-sm text-[var(--fg-secondary)] font-body mb-4">
              Intègre Squad Planner directement dans ton serveur Discord pour gérer tes sessions sans quitter l'app.
            </p>

            {!isConnected ? (
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={handleConnectDiscord}
                  className="shadow-glow-primary"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Connecter Discord
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => window.open(botInviteUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Inviter le bot
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--primary-500)]/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[var(--fg-secondary)] uppercase tracking-wide">
                      Webhook URL
                    </span>
                    <button
                      onClick={handleCopyWebhook}
                      className="flex items-center gap-1 text-xs text-[var(--primary-400)] hover:text-[var(--primary-300)] transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3" />
                          Copié
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copier
                        </>
                      )}
                    </button>
                  </div>
                  <code className="text-xs text-[var(--fg-tertiary)] font-mono break-all">
                    {webhookUrl}
                  </code>
                </div>

                <Button variant="ghost" size="sm" fullWidth>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ouvrir les paramètres Discord
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              variant="glass-2"
              className="h-full hover:glass-3 transition-all duration-200 p-4"
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-2xl">{feature.emoji}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm mb-1">{feature.title}</h4>
                  <p className="text-xs text-[var(--fg-secondary)] font-body">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Commands Preview */}
      {isConnected && (
        <Card variant="glass-3" className="p-6">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <span className="text-lg">{EMOJIS.gaming.rocket}</span>
            Commandes disponibles
          </h4>
          
          <div className="space-y-3">
            {[
              { command: '/session create', description: 'Créer une nouvelle session gaming' },
              { command: '/session list', description: 'Voir toutes les sessions à venir' },
              { command: '/squad info', description: 'Afficher les infos du squad' },
              { command: '/rsvp yes/no/maybe', description: 'Répondre à une invitation' },
              { command: '/stats player', description: 'Consulter les stats d\'un joueur' },
            ].map((cmd, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer group"
                whileHover={{ x: 4 }}
              >
                <code className="text-sm font-mono text-[var(--primary-400)] flex-shrink-0">
                  {cmd.command}
                </code>
                <span className="text-xs text-[var(--fg-tertiary)] font-body group-hover:text-[var(--fg-secondary)] transition-colors">
                  {cmd.description}
                </span>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Discord Embed Preview */}
      {isConnected && (
        <Card variant="glass-3" className="p-6">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <span className="text-lg">{EMOJIS.gaming.controller}</span>
            Aperçu dans Discord
          </h4>

          {/* Mock Discord Message */}
          <div className="rounded-xl bg-[#36393f] p-4 border-l-4 border-[#5865F2]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-white">Squad Planner Bot</span>
              <Badge variant="info" size="sm" className="ml-auto">
                BOT
              </Badge>
            </div>

            <div className="space-y-2">
              <h5 className="text-white font-bold text-base">
                🎮 Nouvelle session : Ranked Valorant
              </h5>
              <div className="text-sm text-gray-300 space-y-1 font-body">
                <p><strong>Squad:</strong> STR Fragsters</p>
                <p><strong>Date:</strong> Aujourd'hui à 21:00</p>
                <p><strong>Joueurs:</strong> 4/5 confirmés</p>
              </div>
              
              <div className="flex gap-2 mt-3">
                <div className="px-3 py-1 rounded bg-green-600 text-white text-xs font-semibold">
                  ✅ Présent
                </div>
                <div className="px-3 py-1 rounded bg-red-600 text-white text-xs font-semibold">
                  ❌ Absent
                </div>
                <div className="px-3 py-1 rounded bg-yellow-600 text-white text-xs font-semibold">
                  ⏰ Peut-être
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}