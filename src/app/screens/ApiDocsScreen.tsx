import { ArrowLeft, Code2, BookOpen, Terminal, Key, Webhook, Copy, CheckCircle2, Sparkles, Star, ExternalLink, Lock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { IconButton } from '@/design-system';

interface ApiDocsScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 28 }
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
    <div className="min-h-screen pb-24 md:pb-8 pt-safe bg-[#08090a] relative overflow-hidden">
      {/* Subtle gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-indigo-500/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
            <IconButton
              icon={<ArrowLeft className="w-5 h-5" strokeWidth={1.5} />}
              onClick={() => onNavigate?.('integrations')}
              variant="ghost"
              aria-label="Retour aux intégrations"
              className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all"
            />
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-white tracking-tight">
                API Publique
              </h1>
              <p className="text-sm text-gray-500">
                Documentation développeurs
              </p>
            </div>
            <motion.div
              className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <Code2 className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
            </motion.div>
          </motion.div>

          {/* Hero Section */}
          <motion.div
            variants={itemVariants}
            className="text-center py-8 mb-6"
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20 mb-4"
              whileHover={{ scale: 1.05, rotate: 3 }}
            >
              <Code2 className="w-8 h-8 text-blue-400" strokeWidth={1.5} />
            </motion.div>
            <h2 className="text-2xl font-semibold text-white tracking-tight mb-2">
              Squad Planner API
            </h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
              Intégrez Squad Planner dans vos outils avec notre API RESTful
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">v1 Stable</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
                <span className="text-xs text-gray-400">1000 req/min</span>
              </span>
            </div>
          </motion.div>

          {/* API Key Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white/[0.02] backdrop-blur-sm rounded-2xl p-5 border border-white/[0.06] mb-4"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Key className="w-5 h-5 text-amber-400" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-white mb-0.5">
                  Clé API
                </h3>
                <p className="text-sm text-gray-500">
                  Authentifiez vos requêtes avec votre clé API
                </p>
              </div>
            </div>

            {/* Code block */}
            <div className="bg-[#0d0e10] rounded-xl p-4 font-mono text-xs border border-white/[0.04] mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500">Authorization: Bearer</span>
                <motion.button
                  onClick={() => copyToClipboard('sk_live_abc123...', 'Clé API')}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/[0.06]"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {copiedEndpoint === 'Clé API' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </motion.button>
              </div>
              <div className="text-blue-400">sk_live_abc123def456ghi789...</div>
            </div>

            <motion.button
              onClick={() => onNavigate?.('integrations')}
              className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-medium text-sm transition-colors"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Générer une nouvelle clé
            </motion.button>
          </motion.div>

          {/* Base URL */}
          <motion.div
            variants={itemVariants}
            className="bg-white/[0.02] backdrop-blur-sm rounded-2xl p-5 border border-white/[0.06] mb-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-white">
                URL de base
              </h3>
            </div>
            <div className="bg-[#0d0e10] rounded-xl p-4 font-mono text-sm text-emerald-400 border border-white/[0.04]">
              https://api.squadplanner.app
            </div>
          </motion.div>

          {/* Endpoints Section */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-blue-400" strokeWidth={1.5} />
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                Endpoints disponibles
              </h3>
            </div>

            <div className="space-y-2">
              {endpoints.map((endpoint, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all group"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-mono font-semibold ${
                        endpoint.method === 'GET'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}
                    >
                      {endpoint.method}
                    </span>
                    <div className="flex-1 min-w-0">
                      <code className="text-sm font-mono text-white block truncate">
                        {endpoint.path}
                      </code>
                      <p className="text-xs text-gray-500 mt-1">
                        {endpoint.description}
                      </p>
                      {endpoint.auth && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <Lock className="w-3 h-3 text-amber-400" strokeWidth={2} />
                          <span className="text-xs text-amber-400/80">
                            Auth requise
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
            className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl p-5 border border-indigo-500/20 relative overflow-hidden mb-6"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                <Webhook className="w-6 h-6 text-indigo-400" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-white mb-1">
                  Webhooks
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Recevez des notifications en temps réel pour les événements importants
                </p>
                <motion.button
                  onClick={() => onNavigate?.('webhooks')}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg text-sm font-medium transition-colors"
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
            className="text-center py-6"
          >
            <p className="text-sm text-gray-500 mb-3">
              Documentation complète
            </p>
            <motion.a
              href="https://docs.squadplanner.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.1] transition-all"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <BookOpen className="w-4 h-4" strokeWidth={1.5} />
              Voir la documentation
              <ExternalLink className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
            </motion.a>
          </motion.div>

          {/* Pro Tip */}
          <motion.div
            variants={itemVariants}
            className="bg-amber-500/5 rounded-xl p-4 border border-amber-500/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-300">
                  API v1 stable
                </p>
                <p className="text-xs text-amber-400/60 mt-0.5">
                  Rate limit: 1000 requêtes/minute
                </p>
              </div>
              <Star className="w-5 h-5 text-amber-400 fill-amber-400/30" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default ApiDocsScreen;
