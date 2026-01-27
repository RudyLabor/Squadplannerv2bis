// 🔗 SQUAD PLANNER - Système de Webhooks

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Webhook, Plus, Trash2, Edit2, Check, X, Copy, ExternalLink, Zap, Activity } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { EMOJIS } from '@/constants/emojis';

export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: WebhookEvent[];
  isActive: boolean;
  lastTriggered?: Date;
  totalCalls: number;
}

export type WebhookEvent =
  | 'session.created'
  | 'session.updated'
  | 'session.cancelled'
  | 'session.starting'
  | 'player.rsvp'
  | 'player.joined'
  | 'player.left'
  | 'squad.created'
  | 'squad.updated';

interface WebhooksManagerProps {
  squadId?: string;
  onWebhookChange?: (webhooks: WebhookConfig[]) => void;
}

const availableEvents: { value: WebhookEvent; label: string; emoji: string; color: string }[] = [
  { value: 'session.created', label: 'Session créée', emoji: EMOJIS.time.calendar, color: 'from-blue-500 to-blue-600' },
  { value: 'session.updated', label: 'Session modifiée', emoji: EMOJIS.gaming.controller, color: 'from-yellow-500 to-yellow-600' },
  { value: 'session.cancelled', label: 'Session annulée', emoji: '🚫', color: 'from-red-500 to-red-600' },
  { value: 'session.starting', label: 'Session démarre', emoji: EMOJIS.gaming.zap, color: 'from-green-500 to-green-600' },
  { value: 'player.rsvp', label: 'Réponse joueur', emoji: '✋', color: 'from-purple-500 to-purple-600' },
  { value: 'player.joined', label: 'Joueur rejoint', emoji: '👋', color: 'from-green-500 to-green-600' },
  { value: 'player.left', label: 'Joueur quitte', emoji: '👋', color: 'from-orange-500 to-orange-600' },
  { value: 'squad.created', label: 'Squad créé', emoji: EMOJIS.achievements.trophy, color: 'from-blue-500 to-blue-600' },
  { value: 'squad.updated', label: 'Squad modifié', emoji: '⚙️', color: 'from-gray-500 to-gray-600' },
];

export function WebhooksManager({ squadId, onWebhookChange }: WebhooksManagerProps) {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: '1',
      name: 'Discord Notifications',
      url: 'https://discord.com/api/webhooks/...',
      events: ['session.created', 'session.starting', 'player.rsvp'],
      isActive: true,
      lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000),
      totalCalls: 127,
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [] as WebhookEvent[],
  });

  const handleCreateWebhook = () => {
    if (!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0) return;

    const webhook: WebhookConfig = {
      id: Date.now().toString(),
      name: newWebhook.name,
      url: newWebhook.url,
      events: newWebhook.events,
      isActive: true,
      totalCalls: 0,
    };

    const updated = [...webhooks, webhook];
    setWebhooks(updated);
    if (onWebhookChange) onWebhookChange(updated);

    setNewWebhook({ name: '', url: '', events: [] });
    setIsCreating(false);
  };

  const handleDeleteWebhook = (id: string) => {
    const updated = webhooks.filter(w => w.id !== id);
    setWebhooks(updated);
    if (onWebhookChange) onWebhookChange(updated);
  };

  const handleToggleWebhook = (id: string) => {
    const updated = webhooks.map(w =>
      w.id === id ? { ...w, isActive: !w.isActive } : w
    );
    setWebhooks(updated);
    if (onWebhookChange) onWebhookChange(updated);
  };

  const toggleEvent = (event: WebhookEvent) => {
    setNewWebhook(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event],
    }));
  };

  const getEventInfo = (eventType: WebhookEvent) => {
    return availableEvents.find(e => e.value === eventType);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="glass-3" className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] flex items-center justify-center flex-shrink-0"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Webhook className="w-8 h-8 text-white" />
            </motion.div>

            <div className="flex-1">
              <h3 className="heading-small mb-2">Webhooks</h3>
              <p className="text-sm text-[var(--fg-secondary)] font-body mb-4">
                Connecte Squad Planner à tes outils préférés (Discord, Slack, Zapier...) pour automatiser tes workflows.
              </p>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[var(--fg-secondary)] font-mono">
                    {webhooks.filter(w => w.isActive).length} actifs
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[var(--fg-tertiary)]" />
                  <span className="text-[var(--fg-secondary)] font-mono">
                    {webhooks.reduce((sum, w) => sum + w.totalCalls, 0)} appels
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreating(!isCreating)}
            className="shadow-glow-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau
          </Button>
        </div>
      </Card>

      {/* Create Webhook Form */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card variant="glass-3" className="p-6">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[var(--primary-400)]" />
                Créer un webhook
              </h4>

              <div className="space-y-4">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Nom du webhook
                  </label>
                  <input
                    type="text"
                    value={newWebhook.name}
                    onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                    placeholder="Ex: Discord Notifications"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--bg-secondary)] focus:border-[var(--primary-500)] focus:outline-none transition-colors font-body"
                  />
                </div>

                {/* URL Input */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    URL du webhook
                  </label>
                  <input
                    type="url"
                    value={newWebhook.url}
                    onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--bg-secondary)] focus:border-[var(--primary-500)] focus:outline-none transition-colors font-mono text-sm"
                  />
                </div>

                {/* Events Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Événements à écouter ({newWebhook.events.length} sélectionnés)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableEvents.map((event) => {
                      const isSelected = newWebhook.events.includes(event.value);
                      return (
                        <motion.button
                          key={event.value}
                          onClick={() => toggleEvent(event.value)}
                          className={`p-3 rounded-xl border transition-all text-left ${
                            isSelected
                              ? 'bg-[var(--primary-500)]/10 border-[var(--primary-500)]/30'
                              : 'bg-[var(--bg-tertiary)] border-transparent hover:border-[var(--bg-secondary)]'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-base">{event.emoji}</span>
                            <span className="text-xs font-semibold truncate">
                              {event.label}
                            </span>
                          </div>
                          {isSelected && (
                            <Check className="w-3 h-3 text-green-500" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="primary"
                    onClick={handleCreateWebhook}
                    disabled={!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0}
                    className="shadow-glow-primary"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Créer
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsCreating(false);
                      setNewWebhook({ name: '', url: '', events: [] });
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Webhooks List */}
      <div className="space-y-4">
        {webhooks.map((webhook, index) => (
          <motion.div
            key={webhook.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="glass-2" className="hover:glass-3 transition-all p-6">
              <div className="flex items-start gap-4">
                {/* Status Indicator */}
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  webhook.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                }`} />

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold mb-1">{webhook.name}</h4>
                      <code className="text-xs text-[var(--fg-tertiary)] font-mono break-all">
                        {webhook.url}
                      </code>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <motion.button
                        onClick={() => handleToggleWebhook(webhook.id)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          webhook.isActive ? 'bg-green-500' : 'bg-[var(--bg-tertiary)]'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-lg"
                          animate={{ x: webhook.isActive ? 26 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </motion.button>

                      <button
                        onClick={() => handleDeleteWebhook(webhook.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Events */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {webhook.events.map((event) => {
                      const info = getEventInfo(event);
                      return (
                        <Badge key={event} variant="secondary" size="sm">
                          <span className="mr-1">{info?.emoji}</span>
                          {info?.label}
                        </Badge>
                      );
                    })}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-[var(--fg-tertiary)]">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3 h-3" />
                      <span className="font-mono">{webhook.totalCalls} appels</span>
                    </div>
                    {webhook.lastTriggered && (
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3 h-3" />
                        <span className="font-body">
                          Dernier appel il y a {Math.floor((Date.now() - webhook.lastTriggered.getTime()) / 1000 / 60)}min
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Documentation */}
      <Card variant="glass-3" className="p-6">
        <h4 className="font-bold mb-3 flex items-center gap-2">
          <span className="text-lg">📚</span>
          Exemples de payload
        </h4>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
            <div className="flex items-center justify-between mb-2">
              <code className="text-xs font-semibold text-[var(--primary-400)]">
                session.created
              </code>
              <Button variant="ghost" size="sm">
                <Copy className="w-3 h-3 mr-1" />
                Copier
              </Button>
            </div>
            <pre className="text-xs text-[var(--fg-tertiary)] font-mono overflow-x-auto">
{`{
  "event": "session.created",
  "timestamp": "2026-01-24T20:00:00Z",
  "data": {
    "sessionId": "abc123",
    "squadName": "STR Fragsters",
    "game": "Valorant",
    "date": "2026-01-25",
    "time": "21:00",
    "players": ["player1", "player2"]
  }
}`}
            </pre>
          </div>

          <Button variant="ghost" size="sm" fullWidth>
            <ExternalLink className="w-4 h-4 mr-2" />
            Voir la documentation complète
          </Button>
        </div>
      </Card>
    </div>
  );
}