// @ts-nocheck
import { ArrowLeft, Zap, Check, Copy, Terminal, MessageSquare, Users, Calendar, Webhook, Send, Bot, Sparkles, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSquads } from '../contexts/SquadsContext';
import { supabase } from '@/lib/supabase';
import { testWebhook } from '@/utils/discord-webhook';

interface DiscordBotScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface WebhookConfig {
  id?: string;
  squad_id: string;
  url: string;
  events: string[];
  is_active: boolean;
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

export function DiscordBotScreen({ onNavigate, showToast }: DiscordBotScreenProps) {
  const { currentSquad } = useSquads();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    'session_created',
    'session_updated',
    'member_joined',
    'rsvp_submitted',
  ]);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  useEffect(() => {
    if (currentSquad?.id) {
      loadWebhooks();
    }
  }, [currentSquad]);

  const loadWebhooks = async () => {
    if (!currentSquad) return;

    try {
      const { data, error } = await supabase
        .from('webhooks')
        .select('*')
        .eq('squad_id', currentSquad.id)
        .eq('is_active', true);

      if (error) throw error;

      setWebhooks((data || []) as WebhookConfig[]);

      if (data && data.length > 0) {
        setWebhookUrl(data[0].url);
        setSelectedEvents(data[0].events || []);
      }
    } catch (error) {
      console.error('[Discord Bot] Load webhooks error:', error);
    }
  };

  const handleSaveWebhook = async () => {
    if (!currentSquad) {
      showToast('Sélectionnez un squad', 'error');
      return;
    }

    if (!webhookUrl) {
      showToast('Entrez une URL de webhook Discord', 'error');
      return;
    }

    if (!webhookUrl.includes('discord.com/api/webhooks/')) {
      showToast('URL de webhook Discord invalide', 'error');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('webhooks')
        .upsert({
          squad_id: currentSquad.id,
          url: webhookUrl,
          events: selectedEvents,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      setWebhooks([data as WebhookConfig]);
      showToast('Webhook Discord configuré !', 'success');
    } catch (error: any) {
      console.error('[Discord Bot] Save webhook error:', error);
      showToast(error.message || 'Erreur lors de la configuration', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWebhook = async () => {
    if (!currentSquad || webhooks.length === 0) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('webhooks')
        .update({ is_active: false })
        .eq('squad_id', currentSquad.id);

      if (error) throw error;

      setWebhooks([]);
      setWebhookUrl('');
      showToast('Webhook Discord supprimé', 'info');
    } catch (error: any) {
      console.error('[Discord Bot] Delete webhook error:', error);
      showToast(error.message || 'Erreur lors de la suppression', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleEvent = (event: string) => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  };

  const isConnected = webhooks.length > 0;

  const slashCommands = [
    {
      command: '/session',
      description: 'Créer une nouvelle session de jeu',
      usage: '/session <jeu> <date> <heure>',
      example: '/session Valorant demain 21h',
      icon: Calendar,
    },
    {
      command: '/rsvp',
      description: 'Répondre à une invitation de session',
      usage: '/rsvp <session_id> <oui|non|peut-être>',
      example: '/rsvp 123 oui',
      icon: Check,
    },
    {
      command: '/retard',
      description: 'Signaler un retard pour la session en cours',
      usage: '/retard <minutes>',
      example: '/retard 15',
      icon: Zap,
    },
    {
      command: '/squad',
      description: 'Voir les infos de votre squad',
      usage: '/squad [nom]',
      example: '/squad Fragsters',
      icon: Users,
    },
  ];

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    showToast('Commande copiée !', 'success');
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl) {
      showToast('Entrez une URL de webhook', 'error');
      return;
    }

    setTesting(true);
    try {
      const success = await testWebhook(webhookUrl);
      if (success) {
        showToast('Message de test envoyé ! Vérifiez Discord.', 'success');
      } else {
        showToast('Échec de l\'envoi - vérifiez l\'URL', 'error');
      }
    } catch (error) {
      console.error('[Discord Bot] Test webhook error:', error);
      showToast('Erreur lors du test', 'error');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 pt-safe bg-[#08090a]">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <motion.button
              onClick={() => onNavigate('integrations')}
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[#8b8d90]" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-[#f7f8f8]">
                Discord Bot
              </h1>
              <p className="text-sm text-[#5e6063] mt-0.5">
                Gérez vos sessions depuis Discord
              </p>
            </div>
            <motion.div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isConnected
                  ? 'bg-emerald-500/20'
                  : 'bg-[#5865F2]/20'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <Bot className={`w-5 h-5 ${isConnected ? 'text-emerald-400' : 'text-[#5865F2]'}`} strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Connection Status */}
          <AnimatePresence mode="wait">
            {!currentSquad ? (
              <motion.div
                key="no-squad"
                variants={itemVariants}
                className="bg-[rgba(255,255,255,0.02)] border border-amber-500/20 rounded-xl p-4 mb-6"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-amber-400" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-amber-400 mb-1">
                      Sélectionnez un squad
                    </h3>
                    <p className="text-xs text-[#5e6063]">
                      Vous devez sélectionner un squad pour configurer le webhook Discord.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : isConnected ? (
              <motion.div
                key="connected"
                variants={itemVariants}
                className="bg-[rgba(255,255,255,0.02)] border border-emerald-500/30 rounded-xl p-5 mb-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Webhook className="w-6 h-6 text-emerald-400" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-[#f7f8f8] mb-0.5">
                      Webhook actif
                    </h3>
                    <p className="text-sm text-[#5e6063]">
                      Notifications envoyées à Discord
                    </p>
                  </div>
                  <motion.button
                    onClick={handleDeleteWebhook}
                    disabled={loading}
                    className="h-9 px-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:border-red-500/50 rounded-lg text-sm font-medium text-[#8b8d90] hover:text-red-400 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Supprimer
                  </motion.button>
                </div>
                <div>
                  <span className="text-[#5e6063] text-xs font-medium">Événements actifs:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedEvents.map((event) => (
                      <span key={event} className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-md">
                        {event.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="config"
                variants={itemVariants}
                className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 mb-6"
              >
                <h3 className="text-base font-medium text-[#f7f8f8] mb-5">
                  Configuration Webhook Discord
                </h3>

                <div className="space-y-4 mb-5">
                  <div>
                    <label className="text-sm text-[#8b8d90] mb-2 block font-medium">
                      URL du Webhook Discord
                    </label>
                    <input
                      type="text"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://discord.com/api/webhooks/..."
                      className="w-full h-11 px-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-sm font-mono text-[#f7f8f8] placeholder:text-[#5e6063] focus:outline-none focus:border-[#5865F2] transition-colors"
                    />
                    <p className="text-xs text-[#5e6063] mt-1.5">
                      Créez un webhook dans les paramètres de votre serveur Discord
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-[#8b8d90] mb-2 block font-medium">
                      Événements à notifier
                    </label>
                    <div className="space-y-1">
                      {[
                        { id: 'session_created', label: 'Session créée' },
                        { id: 'session_updated', label: 'Session modifiée' },
                        { id: 'member_joined', label: 'Membre rejoint' },
                        { id: 'rsvp_submitted', label: 'RSVP reçu' },
                      ].map((event) => (
                        <label key={event.id} className="flex items-center gap-3 cursor-pointer p-2.5 rounded-lg hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                          <motion.div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              selectedEvents.includes(event.id)
                                ? 'bg-[#5865F2] border-[#5865F2]'
                                : 'border-[rgba(255,255,255,0.15)] bg-transparent'
                            }`}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleEvent(event.id)}
                          >
                            {selectedEvents.includes(event.id) && (
                              <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            )}
                          </motion.div>
                          <span className="text-sm text-[#f7f8f8] font-medium">{event.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={handleSaveWebhook}
                    disabled={loading || !webhookUrl}
                    className="flex-1 h-11 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Webhook className="w-4 h-4" strokeWidth={2} />
                    {loading ? 'Configuration...' : 'Configurer'}
                  </motion.button>
                  <motion.button
                    onClick={handleTestWebhook}
                    disabled={testing || !webhookUrl}
                    className="h-11 px-5 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-[#8b8d90] rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2 hover:border-[#5865F2] hover:text-[#5865F2] transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send className="w-4 h-4" strokeWidth={2} />
                    {testing ? 'Test...' : 'Tester'}
                  </motion.button>
                </div>

                <div className="mt-4 p-3.5 bg-[#5865F2]/10 border border-[#5865F2]/20 rounded-lg">
                  <p className="text-xs text-[#8b8d90] leading-relaxed">
                    <span className="font-medium text-[#5865F2]">Comment créer un webhook ?</span> Allez dans Paramètres du serveur → Intégrations → Webhooks → Nouveau Webhook
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Slash Commands */}
          <motion.div variants={itemVariants} className="mb-6">
            <h2 className="text-base font-medium text-[#f7f8f8] mb-4 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#5865F2]" strokeWidth={2} />
              Slash Commands disponibles
            </h2>

            <div className="space-y-3">
              {slashCommands.map((cmd, index) => (
                <motion.div
                  key={cmd.command}
                  variants={itemVariants}
                  custom={index}
                  className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 hover:border-[rgba(255,255,255,0.1)] transition-colors"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#5865F2]/20 flex items-center justify-center flex-shrink-0">
                      <cmd.icon className="w-5 h-5 text-[#5865F2]" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="text-sm font-semibold text-[#f7f8f8]">
                          {cmd.command}
                        </h3>
                        <motion.button
                          onClick={() => copyCommand(cmd.command)}
                          className="w-7 h-7 rounded-md bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center hover:border-[rgba(255,255,255,0.1)] transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {copiedCommand === cmd.command ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2} />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-[#5e6063]" strokeWidth={2} />
                          )}
                        </motion.button>
                      </div>
                      <p className="text-sm text-[#8b8d90] mb-3">
                        {cmd.description}
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-start gap-2 text-xs">
                          <span className="text-[#5e6063] font-medium min-w-[55px]">
                            Usage:
                          </span>
                          <code className="font-mono bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] px-2 py-0.5 rounded text-[#8b8d90]">
                            {cmd.usage}
                          </code>
                        </div>
                        <div className="flex items-start gap-2 text-xs">
                          <span className="text-[#5e6063] font-medium min-w-[55px]">
                            Exemple:
                          </span>
                          <code className="font-mono bg-[#5865F2]/10 border border-[#5865F2]/20 px-2 py-0.5 rounded text-[#5865F2]">
                            {cmd.example}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div variants={itemVariants} className="mb-6">
            <h2 className="text-base font-medium text-[#f7f8f8] mb-4">
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
                  variants={itemVariants}
                  custom={index}
                  className={`rounded-xl p-4 border transition-colors ${
                    feature.enabled
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.06)]'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <feature.icon
                    className={`w-5 h-5 mb-2.5 ${
                      feature.enabled ? 'text-emerald-400' : 'text-[#5e6063]'
                    }`}
                    strokeWidth={2}
                  />
                  <div className={`text-sm font-medium mb-0.5 ${
                    feature.enabled ? 'text-[#f7f8f8]' : 'text-[#8b8d90]'
                  }`}>
                    {feature.label}
                  </div>
                  <div className={`text-xs font-medium ${
                    feature.enabled ? 'text-emerald-400' : 'text-[#5e6063]'
                  }`}>
                    {feature.enabled ? 'Actif' : 'Inactif'}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Warning */}
          {!isConnected && currentSquad && (
            <motion.div variants={itemVariants}>
              <div className="bg-[rgba(255,255,255,0.02)] border border-amber-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-400" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-400">
                      Bot non connecté
                    </p>
                    <p className="text-xs text-[#5e6063] mt-0.5">
                      Connectez pour profiter des slash commands et rappels
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default DiscordBotScreen;
