import { ArrowLeft, Code2, BookOpen, Terminal, Key, Webhook, Copy, CheckCircle2, Sparkles, Star, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { IconButton, Card, Badge } from '@/design-system';

interface ApiDocsScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
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

export function ApiDocsScreen({ onNavigate, showToast }: ApiDocsScreenProps) {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(label);
    showToast?.(`${label} copié !`, 'success');
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const endpoints = [
    { method: 'GET', path: '/api/v1/squads', description: 'Liste toutes les squads', auth: true },
    { method: 'POST', path: '/api/v1/squads', description: 'Créer une nouvelle squad', auth: true },
    { method: 'GET', path: '/api/v1/sessions', description: 'Liste toutes les sessions', auth: true },
    { method: 'POST', path: '/api/v1/sessions', description: 'Proposer une session', auth: true },
    { method: 'POST', path: '/api/v1/sessions/:id/vote', description: 'Voter pour une session', auth: true },
    { method: 'GET', path: '/api/v1/users/:id', description: 'Profil utilisateur', auth: false },
    { method: 'GET', path: '/api/v1/leaderboard', description: 'Classement global', auth: false },
  ];

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-slate-400/20 to-gray-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl" />
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
              onClick={() => onNavigate?.('integrations')}
              variant="ghost"
              aria-label="Retour aux integrations"
              className="w-12 h-12 rounded-2xl bg-[var(--bg-elevated)]/80 backdrop-blur-sm border border-[var(--border-subtle)] shadow-lg hover:shadow-xl transition-all"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-700 to-gray-600 bg-clip-text text-transparent">
                API Publique
              </h1>
              <p className="text-sm text-[var(--fg-secondary)] font-medium">
                Documentation développeurs
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-600 to-gray-700 flex items-center justify-center shadow-lg shadow-slate-500/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Code2 className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center py-6 mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-600 to-gray-700 mb-4 shadow-xl shadow-slate-500/30">
              <Code2 className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg-primary)] mb-2">Squad Planner API</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Intégrez Squad Planner dans vos outils avec notre API RESTful
            </p>
          </motion.div>

          {/* API Key Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg mb-6"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                <Key className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold tracking-tight text-[var(--fg-primary)] mb-1">
                  Clé API
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                  Authentifiez vos requêtes avec votre clé API
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 font-mono text-xs mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Authorization: Bearer</span>
                <motion.button
                  onClick={() => copyToClipboard('sk_live_abc123...', 'Clé API')}
                  className="text-indigo-600 hover:text-indigo-700 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {copiedEndpoint === 'Clé API' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </motion.button>
              </div>
              <div className="text-gray-800">sk_live_abc123def456ghi789...</div>
            </div>

            <motion.button
              onClick={() => onNavigate?.('integrations')}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/30"
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.99 }}
            >
              Générer une nouvelle clé
            </motion.button>
          </motion.div>

          {/* Base URL */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg mb-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                <Terminal className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-base font-bold tracking-tight text-[var(--fg-primary)]">
                URL de base
              </h3>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm text-gray-800">
              https://api.squadplanner.app
            </div>
          </motion.div>

          {/* Endpoints */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              <h3 className="text-sm font-bold tracking-tight text-[var(--fg-secondary)]">
                Endpoints disponibles
              </h3>
            </div>

            <div className="space-y-3">
              {endpoints.map((endpoint, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg"
                  whileHover={{ scale: 1.01, y: -2 }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                        endpoint.method === 'GET'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {endpoint.method}
                    </span>
                    <div className="flex-1">
                      <code className="text-sm font-mono text-gray-800 font-medium">
                        {endpoint.path}
                      </code>
                      <p className="text-xs text-gray-500 font-medium mt-1">
                        {endpoint.description}
                      </p>
                      {endpoint.auth && (
                        <div className="flex items-center gap-1 mt-2">
                          <Key className="w-3 h-3 text-amber-500" strokeWidth={2} />
                          <span className="text-xs text-amber-600 font-medium">
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

          {/* Webhooks CTA */}
          <motion.div
            variants={itemVariants}
            className="mt-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 shadow-xl shadow-indigo-500/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Webhook className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold tracking-tight text-white mb-1">
                  Webhooks
                </h3>
                <p className="text-sm text-white/80 font-medium mb-3">
                  Recevez des notifications en temps réel pour les événements importants
                </p>
                <motion.button
                  onClick={() => onNavigate?.('webhooks')}
                  className="px-4 py-2 bg-white text-indigo-600 rounded-xl text-sm font-bold hover:bg-white/90 transition-colors shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Configurer les webhooks
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Documentation Link */}
          <motion.div
            variants={itemVariants}
            className="mt-6 text-center py-6"
          >
            <p className="text-sm text-gray-500 font-medium mb-3">
              Documentation complète
            </p>
            <motion.a
              href="https://docs.squadplanner.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur-sm rounded-xl text-sm font-bold text-gray-700 border border-white/50 shadow-lg"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <BookOpen className="w-4 h-4" strokeWidth={2} />
              Voir la documentation
              <ExternalLink className="w-4 h-4" strokeWidth={2} />
            </motion.a>
          </motion.div>

          {/* Pro Tip */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-amber-100/80 to-orange-100/80 backdrop-blur-sm rounded-2xl p-4 border border-amber-200/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-amber-800">
                  API v1 stable
                </p>
                <p className="text-[10px] text-amber-600 mt-0.5">
                  Rate limit: 1000 requêtes/minute
                </p>
              </div>
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default ApiDocsScreen;
