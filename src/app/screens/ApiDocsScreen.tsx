import { ArrowLeft, Code2, BookOpen, Terminal, Key, Webhook, Copy, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ApiDocsScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function ApiDocsScreen({ onNavigate, showToast }: ApiDocsScreenProps) {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(label);
    showToast?.(`${label} copié !`, 'success');
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const endpoints = [
    {
      method: 'GET',
      path: '/api/v1/squads',
      description: 'Liste toutes les squads',
      auth: true,
    },
    {
      method: 'POST',
      path: '/api/v1/squads',
      description: 'Créer une nouvelle squad',
      auth: true,
    },
    {
      method: 'GET',
      path: '/api/v1/sessions',
      description: 'Liste toutes les sessions',
      auth: true,
    },
    {
      method: 'POST',
      path: '/api/v1/sessions',
      description: 'Proposer une session',
      auth: true,
    },
    {
      method: 'POST',
      path: '/api/v1/sessions/:id/vote',
      description: 'Voter pour une session',
      auth: true,
    },
    {
      method: 'GET',
      path: '/api/v1/users/:id',
      description: 'Profil utilisateur',
      auth: false,
    },
    {
      method: 'GET',
      path: '/api/v1/leaderboard',
      description: 'Classement global',
      auth: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => onNavigate?.('integrations')}
            className="p-2 hover:bg-[var(--background-elevated)] rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" strokeWidth={2} />
          </button>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">API Publique</h1>
          <div className="w-9" />
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
            <Code2 className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Squad Planner API
          </h2>
          <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">
            Intégrez Squad Planner dans vos outils avec notre API RESTful
          </p>
        </motion.div>

        {/* API Key */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 border-[0.5px] border-[var(--border-medium)] shadow-sm"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-xl bg-[var(--primary-50)]">
              <Key className="w-5 h-5 text-[var(--primary-600)]" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">
                Clé API
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Authentifiez vos requêtes avec votre clé API
              </p>
            </div>
          </div>

          <div className="bg-[var(--background)] rounded-xl p-4 font-mono text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--text-tertiary)]">Authorization: Bearer</span>
              <button
                onClick={() => copyToClipboard('sk_live_abc123...', 'Clé API')}
                className="text-[var(--primary-600)] hover:text-[var(--primary-700)] transition-colors"
              >
                {copiedEndpoint === 'Clé API' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="text-[var(--text-primary)]">sk_live_abc123def456ghi789...</div>
          </div>

          <button
            onClick={() => onNavigate?.('integrations')}
            className="w-full mt-4 py-2.5 bg-[var(--primary-600)] text-white rounded-xl font-medium text-sm hover:bg-[var(--primary-700)] transition-colors"
          >
            Générer une nouvelle clé
          </button>
        </motion.div>

        {/* Base URL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5 border-[0.5px] border-[var(--border-medium)] shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <Terminal className="w-5 h-5 text-[var(--secondary-500)]" strokeWidth={2} />
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              URL de base
            </h3>
          </div>
          <div className="bg-[var(--background)] rounded-xl p-4 font-mono text-sm text-[var(--text-primary)]">
            https://api.squadplanner.app
          </div>
        </motion.div>

        {/* Endpoints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-[var(--text-secondary)]" strokeWidth={2} />
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Endpoints disponibles
            </h3>
          </div>

          <div className="space-y-3">
            {endpoints.map((endpoint, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-medium)] shadow-sm"
              >
                <div className="flex items-start gap-3 mb-2">
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-mono font-semibold ${
                      endpoint.method === 'GET'
                        ? 'bg-[var(--secondary-50)] text-[var(--secondary-700)]'
                        : 'bg-[var(--primary-50)] text-[var(--primary-700)]'
                    }`}
                  >
                    {endpoint.method}
                  </span>
                  <div className="flex-1">
                    <code className="text-sm font-mono text-[var(--text-primary)]">
                      {endpoint.path}
                    </code>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      {endpoint.description}
                    </p>
                    {endpoint.auth && (
                      <div className="flex items-center gap-1 mt-2">
                        <Key className="w-3 h-3 text-[var(--warning-500)]" strokeWidth={2} />
                        <span className="text-xs text-[var(--warning-600)]">
                          Authentification requise
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Webhooks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-[var(--primary-50)] to-[var(--secondary-50)] rounded-2xl p-5 border-[0.5px] border-[var(--border-medium)]"
        >
          <div className="flex items-center gap-3 mb-3">
            <Webhook className="w-5 h-5 text-[var(--primary-600)]" strokeWidth={2} />
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Webhooks
            </h3>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Recevez des notifications en temps réel pour les événements importants
          </p>
          <button
            onClick={() => onNavigate?.('webhooks')}
            className="px-4 py-2 bg-white rounded-xl text-sm font-medium text-[var(--primary-600)] hover:bg-[var(--primary-50)] transition-colors shadow-sm"
          >
            Configurer les webhooks
          </button>
        </motion.div>

        {/* Documentation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center py-6"
        >
          <p className="text-sm text-[var(--text-secondary)] mb-3">
            Documentation complète
          </p>
          <a
            href="https://docs.squadplanner.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl text-sm font-medium text-[var(--text-primary)] border-[0.5px] border-[var(--border-medium)] hover:bg-[var(--background-elevated)] transition-colors shadow-sm"
          >
            <BookOpen className="w-4 h-4" strokeWidth={2} />
            Voir la documentation
          </a>
        </motion.div>
      </div>
    </div>
  );
}

export default ApiDocsScreen;
