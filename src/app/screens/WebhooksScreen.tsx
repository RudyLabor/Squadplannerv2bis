import { ArrowLeft, Webhook, Plus, Trash2, Edit3, Check, X, Zap, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

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
    <div className="min-h-screen bg-[var(--background)] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => onNavigate?.('api-docs')}
            className="p-2 hover:bg-[var(--background-elevated)] rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" strokeWidth={2} />
          </button>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Webhooks</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 hover:bg-[var(--background-elevated)] rounded-xl transition-colors"
          >
            <Plus className="w-5 h-5 text-[var(--primary-600)]" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] mb-4 shadow-lg">
            <Webhook className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Webhooks
          </h2>
          <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">
            Recevez des notifications en temps réel pour les événements
          </p>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[var(--warning-50)] to-[var(--warning-100)] rounded-2xl p-4 border-[0.5px] border-[var(--warning-200)]"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[var(--warning-600)] flex-shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <h4 className="text-sm font-semibold text-[var(--warning-900)] mb-1">
                Webhooks HTTP POST
              </h4>
              <p className="text-xs text-[var(--warning-700)]">
                Les webhooks envoient des requêtes POST à vos endpoints. Assurez-vous qu'ils sont accessibles publiquement.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Webhooks List */}
        {webhooks.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            {webhooks.map((webhook, index) => (
              <motion.div
                key={webhook.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="bg-white rounded-2xl p-5 border-[0.5px] border-[var(--border-medium)] shadow-sm"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${webhook.active ? 'bg-gradient-to-br from-[var(--success-500)] to-[var(--success-600)]' : 'bg-[var(--background)]'} flex items-center justify-center shadow-sm`}>
                    <Zap className={`w-6 h-6 ${webhook.active ? 'text-white' : 'text-[var(--text-tertiary)]'}`} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-[var(--text-primary)]">
                        {webhook.name}
                      </h4>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-lg ${webhook.active ? 'bg-[var(--success-50)] text-[var(--success-700)]' : 'bg-[var(--background)] text-[var(--text-tertiary)]'}`}>
                        {webhook.active ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <code className="text-xs text-[var(--text-secondary)] font-mono block mb-2 truncate">
                      {webhook.url}
                    </code>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {webhook.events.map(event => (
                        <span
                          key={event}
                          className="px-2 py-1 bg-[var(--primary-50)] text-[var(--primary-700)] text-xs rounded-lg"
                        >
                          {availableEvents.find(e => e.id === event)?.label || event}
                        </span>
                      ))}
                    </div>
                    {webhook.lastTriggered && (
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Dernier déclenchement : {webhook.lastTriggered}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-subtle)]">
                  <button
                    onClick={() => toggleWebhook(webhook.id)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${webhook.active ? 'bg-[var(--background)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]' : 'bg-[var(--success-500)] text-white hover:bg-[var(--success-600)]'}`}
                  >
                    {webhook.active ? 'Désactiver' : 'Activer'}
                  </button>
                  <button
                    onClick={() => showToast?.('Fonctionnalité bientôt disponible', 'info')}
                    className="p-2 hover:bg-[var(--background)] rounded-xl transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-[var(--text-tertiary)]" strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => deleteWebhook(webhook.id)}
                    className="p-2 hover:bg-[var(--error-50)] rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-[var(--error-500)]" strokeWidth={2} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 rounded-full bg-[var(--background)] flex items-center justify-center mx-auto mb-4">
              <Webhook className="w-10 h-10 text-[var(--text-tertiary)]" strokeWidth={2} />
            </div>
            <p className="text-[var(--text-secondary)] text-sm mb-4">
              Aucun webhook configuré
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 bg-[var(--primary-600)] text-white rounded-xl text-sm font-medium hover:bg-[var(--primary-700)] transition-colors"
            >
              Créer un webhook
            </button>
          </motion.div>
        )}
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
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-x-4 top-20 z-50 bg-white rounded-3xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                Nouveau webhook
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={newWebhook.name}
                    onChange={e => setNewWebhook({ ...newWebhook, name: e.target.value })}
                    placeholder="Discord Notifications"
                    className="w-full px-4 py-3 bg-[var(--background)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    value={newWebhook.url}
                    onChange={e => setNewWebhook({ ...newWebhook, url: e.target.value })}
                    placeholder="https://example.com/webhook"
                    className="w-full px-4 py-3 bg-[var(--background)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Événements ({newWebhook.events.length})
                  </label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {availableEvents.map(event => (
                      <button
                        key={event.id}
                        onClick={() => toggleEvent(event.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${newWebhook.events.includes(event.id) ? 'bg-[var(--primary-50)] border-2 border-[var(--primary-500)]' : 'bg-[var(--background)] border-2 border-transparent'}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{event.icon}</span>
                          <span className="text-sm font-medium text-[var(--text-primary)]">
                            {event.label}
                          </span>
                        </div>
                        {newWebhook.events.includes(event.id) && (
                          <Check className="w-5 h-5 text-[var(--primary-600)]" strokeWidth={2.5} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-[var(--background)] text-[var(--text-primary)] rounded-xl font-medium hover:bg-[var(--background-elevated)] transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={addWebhook}
                  className="flex-1 py-3 bg-[var(--primary-600)] text-white rounded-xl font-medium hover:bg-[var(--primary-700)] transition-colors"
                >
                  Créer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WebhooksScreen;
