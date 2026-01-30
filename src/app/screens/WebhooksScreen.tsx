import { ArrowLeft, Webhook, Plus, Trash2, Edit3, Check, X, Zap, AlertCircle, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { IconButton, Card, Badge } from '@/design-system';

interface WebhooksScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  lastTriggered?: string;
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

export function WebhooksScreen({ onNavigate, showToast }: WebhooksScreenProps) {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: '1',
      name: 'Discord Notifications',
      url: 'https://discord.com/api/webhooks/...',
      events: ['session.created', 'session.confirmed', 'member.joined'],
      active: true,
      lastTriggered: 'Il y a 2h',
    },
    {
      id: '2',
      name: 'Analytics Pipeline',
      url: 'https://analytics.example.com/webhook',
      events: ['session.completed', 'member.checkin'],
      active: true,
      lastTriggered: 'Il y a 5h',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [] as string[],
  });

  const availableEvents = [
    { id: 'session.created', label: 'Session créée', icon: '📅' },
    { id: 'session.confirmed', label: 'Session confirmée', icon: '✅' },
    { id: 'session.cancelled', label: 'Session annulée', icon: '❌' },
    { id: 'session.completed', label: 'Session terminée', icon: '🎮' },
    { id: 'member.joined', label: 'Membre rejoint', icon: '👋' },
    { id: 'member.left', label: 'Membre parti', icon: '👋' },
    { id: 'member.checkin', label: 'Check-in effectué', icon: '✓' },
    { id: 'vote.created', label: 'Vote créé', icon: '🗳️' },
  ];

  const toggleWebhook = (id: string) => {
    setWebhooks(prev =>
      prev.map(w => (w.id === id ? { ...w, active: !w.active } : w))
    );
    const webhook = webhooks.find(w => w.id === id);
    showToast?.(
      webhook?.active ? 'Webhook désactivé' : 'Webhook activé',
      webhook?.active ? 'info' : 'success'
    );
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
    showToast?.('Webhook supprimé', 'success');
  };

  const addWebhook = () => {
    if (!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0) {
      showToast?.('Veuillez remplir tous les champs', 'error');
      return;
    }

    const webhook: WebhookConfig = {
      id: Date.now().toString(),
      name: newWebhook.name,
      url: newWebhook.url,
      events: newWebhook.events,
      active: true,
    };

    setWebhooks(prev => [...prev, webhook]);
    setNewWebhook({ name: '', url: '', events: [] });
    setShowAddModal(false);
    showToast?.('Webhook créé avec succès !', 'success');
  };

  const toggleEvent = (eventId: string) => {
    setNewWebhook(prev => ({
      ...prev,
      events: prev.events.includes(eventId)
        ? prev.events.filter(e => e !== eventId)
        : [...prev.events, eventId],
    }));
  };

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations - static for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
            <IconButton
              icon={<ArrowLeft className="w-5 h-5" strokeWidth={2} />}
              onClick={() => onNavigate?.('api-docs')}
              variant="ghost"
              aria-label="Retour a la documentation API"
              className="w-12 h-12 rounded-2xl bg-[var(--bg-elevated)]/80 backdrop-blur-sm border border-[var(--border-subtle)] shadow-lg hover:shadow-xl transition-all"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Webhooks
              </h1>
              <p className="text-sm text-[var(--fg-secondary)] font-medium">
                Notifications temps réel
              </p>
            </div>
            <IconButton
              icon={<Plus className="w-6 h-6 text-white" strokeWidth={2} />}
              onClick={() => setShowAddModal(true)}
              variant="primary"
              aria-label="Ajouter un webhook"
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30"
            />
          </motion.div>

          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center py-6 mb-6">
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-xl shadow-indigo-500/30"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Webhook className="w-10 h-10 text-white" strokeWidth={1.5} />
            </motion.div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg-primary)] mb-2">Webhooks</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Recevez des notifications en temps réel pour les événements
            </p>
          </motion.div>

          {/* Info Banner */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-amber-100/80 to-orange-100/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-amber-200/50"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-tight text-amber-800 mb-1">
                  Webhooks HTTP POST
                </h4>
                <p className="text-xs text-amber-700 font-medium">
                  Les webhooks envoient des requêtes POST à vos endpoints. Assurez-vous qu'ils sont accessibles publiquement.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Webhooks List */}
          {webhooks.length > 0 ? (
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h3 className="text-sm font-bold tracking-tight text-[var(--fg-secondary)]">
                  Webhooks configurés ({webhooks.length})
                </h3>
              </div>
              <div className="space-y-3">
                {webhooks.map((webhook) => (
                  <motion.div
                    key={webhook.id}
                    variants={itemVariants}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.01, y: -2 }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <motion.div
                        className={`flex-shrink-0 w-12 h-12 rounded-xl ${webhook.active ? 'bg-gradient-to-br from-emerald-500 to-teal-500' : 'bg-gray-200'} flex items-center justify-center shadow-md`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Zap className={`w-6 h-6 ${webhook.active ? 'text-white' : 'text-gray-400'}`} strokeWidth={2} />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold tracking-tight text-[var(--fg-primary)]">
                            {webhook.name}
                          </h4>
                          <span className={`px-2 py-0.5 text-xs font-bold rounded-lg ${webhook.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                            {webhook.active ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                        <code className="text-xs text-gray-500 font-mono block mb-2 truncate">
                          {webhook.url}
                        </code>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {webhook.events.map(event => (
                            <span
                              key={event}
                              className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-lg"
                            >
                              {availableEvents.find(e => e.id === event)?.label || event}
                            </span>
                          ))}
                        </div>
                        {webhook.lastTriggered && (
                          <p className="text-xs text-gray-400 font-medium">
                            Dernier déclenchement : {webhook.lastTriggered}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <motion.button
                        onClick={() => toggleWebhook(webhook.id)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${webhook.active ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'}`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        {webhook.active ? 'Désactiver' : 'Activer'}
                      </motion.button>
                      <motion.button
                        onClick={() => showToast?.('Fonctionnalité bientôt disponible', 'info')}
                        className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit3 className="w-4 h-4 text-gray-400" strokeWidth={2} />
                      </motion.button>
                      <motion.button
                        onClick={() => deleteWebhook(webhook.id)}
                        className="p-2.5 hover:bg-red-50 rounded-xl transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" strokeWidth={2} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="text-center py-12"
            >
              <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Webhook className="w-10 h-10 text-gray-400" strokeWidth={2} />
              </div>
              <p className="text-gray-500 text-sm mb-4 font-medium">
                Aucun webhook configuré
              </p>
              <motion.button
                onClick={() => setShowAddModal(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Créer un webhook
              </motion.button>
            </motion.div>
          )}

          {/* Pro Tip */}
          <motion.div
            variants={itemVariants}
            className="mt-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 shadow-xl shadow-indigo-500/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Star className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-white">
                  Astuce Pro
                </p>
                <p className="text-[10px] text-white/80 mt-0.5">
                  Utilisez ngrok pour tester vos webhooks en local
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Add Webhook Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="fixed inset-x-4 top-20 z-50 bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto border border-white/50"
            >
              <h3 className="text-xl font-bold tracking-tight text-[var(--fg-primary)] mb-4">
                Nouveau webhook
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={newWebhook.name}
                    onChange={e => setNewWebhook({ ...newWebhook, name: e.target.value })}
                    placeholder="Discord Notifications"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    value={newWebhook.url}
                    onChange={e => setNewWebhook({ ...newWebhook, url: e.target.value })}
                    placeholder="https://example.com/webhook"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Événements ({newWebhook.events.length})
                  </label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {availableEvents.map(event => (
                      <motion.button
                        key={event.id}
                        onClick={() => toggleEvent(event.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${newWebhook.events.includes(event.id) ? 'bg-indigo-50 border-2 border-indigo-500' : 'bg-gray-50 border-2 border-transparent'}`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{event.icon}</span>
                          <span className="text-sm font-medium text-gray-800">
                            {event.label}
                          </span>
                        </div>
                        {newWebhook.events.includes(event.id) && (
                          <Check className="w-5 h-5 text-indigo-600" strokeWidth={2.5} />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Annuler
                </motion.button>
                <motion.button
                  onClick={addWebhook}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Créer
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WebhooksScreen;
