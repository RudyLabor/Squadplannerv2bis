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
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      command: '/rsvp',
      description: 'Répondre à une invitation de session',
      usage: '/rsvp <session_id> <oui|non|peut-être>',
      example: '/rsvp 123 oui',
      icon: Check,
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      command: '/retard',
      description: 'Signaler un retard pour la session en cours',
      usage: '/retard <minutes>',
      example: '/retard 15',
      icon: Zap,
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      command: '/squad',
      description: 'Voir les infos de votre squad',
      usage: '/squad [nom]',
      example: '/squad Fragsters',
      icon: Users,
      gradient: 'from-purple-500 to-pink-500',
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
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[#5865F2]/20 to-indigo-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
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
              onClick={() => onNavigate('integrations')}
              className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#5865F2] to-indigo-600 bg-clip-text text-transparent">
                Discord Bot
              </h1>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                Gérez vos sessions depuis Discord
              </p>
            </div>
            <motion.div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                isConnected
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                  : 'bg-gradient-to-br from-[#5865F2] to-indigo-600'
              }`}
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Bot className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Connection Status */}
          <AnimatePresence mode="wait">
            {!currentSquad ? (
              <motion.div
                key="no-squad"
                variants={itemVariants}
                className="bg-amber-50 rounded-2xl p-5 mb-6 border border-amber-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-amber-900 mb-1">
                      Sélectionnez un squad
                    </h3>
                    <p className="text-xs text-amber-700">
                      Vous devez sélectionner un squad pour configurer le webhook Discord.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : isConnected ? (
              <motion.div
                key="connected"
                variants={itemVariants}
                className="relative overflow-hidden rounded-2xl mb-6"
              >
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-5">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  />
                  <div className="relative flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Webhook className="w-7 h-7 text-white" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">
                        Webhook actif
                      </h3>
                      <p className="text-sm text-white/80">
                        Notifications envoyées à Discord
                      </p>
                    </div>
                    <motion.button
                      onClick={handleDeleteWebhook}
                      disabled={loading}
                      className="h-10 px-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 rounded-xl text-sm font-semibold text-white"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Supprimer
                    </motion.button>
                  </div>
                  <div className="relative">
                    <span className="text-white/70 text-xs font-medium">Événements actifs:</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedEvents.map((event) => (
                        <span key={event} className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                          {event.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="config"
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/50 shadow-lg"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-5">
                  Configuration Webhook Discord
                </h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block font-semibold">
                      URL du Webhook Discord
                    </label>
                    <input
                      type="text"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://discord.com/api/webhooks/..."
                      className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 text-sm font-mono text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5865F2]/30 focus:border-[#5865F2] transition-all"
                    />
                    <p className="text-xs text-gray-400 mt-1.5">
                      Créez un webhook dans les paramètres de votre serveur Discord
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-2 block font-semibold">
                      Événements à notifier
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: 'session_created', label: 'Session créée' },
                        { id: 'session_updated', label: 'Session modifiée' },
                        { id: 'member_joined', label: 'Membre rejoint' },
                        { id: 'rsvp_submitted', label: 'RSVP reçu' },
                      ].map((event) => (
                        <label key={event.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <motion.div
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                              selectedEvents.includes(event.id)
                                ? 'bg-[#5865F2] border-[#5865F2]'
                                : 'border-gray-300'
                            }`}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleEvent(event.id)}
                          >
                            {selectedEvents.includes(event.id) && (
                              <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            )}
                          </motion.div>
                          <span className="text-sm text-gray-700 font-medium">{event.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={handleSaveWebhook}
                    disabled={loading || !webhookUrl}
                    className="flex-1 h-12 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-semibold shadow-lg shadow-[#5865F2]/30 disabled:opacity-50 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Webhook className="w-5 h-5" strokeWidth={2} />
                    {loading ? 'Configuration...' : 'Configurer'}
                  </motion.button>
                  <motion.button
                    onClick={handleTestWebhook}
                    disabled={testing || !webhookUrl}
                    className="h-12 px-6 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2 hover:border-[#5865F2] hover:text-[#5865F2] transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send className="w-5 h-5" strokeWidth={2} />
                    {testing ? 'Test...' : 'Tester'}
                  </motion.button>
                </div>

                <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <p className="text-xs text-indigo-700 leading-relaxed">
                    <span className="font-semibold">Comment créer un webhook ?</span> Allez dans Paramètres du serveur → Intégrations → Webhooks → Nouveau Webhook
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Slash Commands */}
          <motion.div variants={itemVariants} className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Terminal className="w-5 h-5" strokeWidth={2} />
              Slash Commands disponibles
            </h2>

            <div className="space-y-3">
              {slashCommands.map((cmd, index) => (
                <motion.div
                  key={cmd.command}
                  variants={itemVariants}
                  custom={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.01, y: -2 }}
                >
                  <div className="flex items-start gap-4 mb-3">
                    <motion.div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cmd.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <cmd.icon className="w-5 h-5 text-white" strokeWidth={2} />
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-base font-bold text-gray-800">
                          {cmd.command}
                        </h3>
                        <motion.button
                          onClick={() => copyCommand(cmd.command)}
                          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {copiedCommand === cmd.command ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" strokeWidth={2} />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" strokeWidth={2} />
                          )}
                        </motion.button>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        {cmd.description}
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-start gap-2 text-xs">
                          <span className="text-gray-400 font-semibold min-w-[60px]">
                            Usage:
                          </span>
                          <code className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                            {cmd.usage}
                          </code>
                        </div>
                        <div className="flex items-start gap-2 text-xs">
                          <span className="text-gray-400 font-semibold min-w-[60px]">
                            Exemple:
                          </span>
                          <code className={`font-mono bg-gradient-to-r ${cmd.gradient} bg-clip-text text-transparent px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100`}>
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
            <h2 className="text-lg font-bold text-gray-800 mb-4">
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
                  className={`rounded-2xl p-4 border transition-all ${
                    feature.enabled
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-white/60 border-white/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <feature.icon
                    className={`w-6 h-6 mb-2 ${
                      feature.enabled ? 'text-emerald-500' : 'text-gray-400'
                    }`}
                    strokeWidth={2}
                  />
                  <div className={`text-sm font-semibold mb-1 ${
                    feature.enabled ? 'text-gray-800' : 'text-gray-500'
                  }`}>
                    {feature.label}
                  </div>
                  <div className={`text-xs font-medium ${
                    feature.enabled ? 'text-emerald-600' : 'text-gray-400'
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
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-4 border border-amber-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-amber-800">
                      Bot non connecté
                    </p>
                    <p className="text-[10px] text-amber-600 mt-0.5">
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
