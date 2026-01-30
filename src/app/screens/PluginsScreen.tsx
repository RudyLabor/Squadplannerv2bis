import { ArrowLeft, Puzzle, Check, Download, Settings, ExternalLink, Sparkles, Zap, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { IconButton, Card, Badge } from '@/design-system';

interface PluginsScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface Plugin {
  id: string;
  name: string;
  description: string;
  icon: string;
  installed: boolean;
  gradient: string;
  shadow: string;
  version?: string;
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

export function PluginsScreen({ onNavigate, showToast }: PluginsScreenProps) {
  const [plugins, setPlugins] = useState<Plugin[]>([
    {
      id: 'discord',
      name: 'Discord',
      description: 'Synchronisation complète avec Discord (events, messages, vocal)',
      icon: '💬',
      installed: true,
      gradient: 'from-indigo-500 to-violet-600',
      shadow: 'shadow-indigo-500/30',
      version: 'v2.4.1',
    },
    {
      id: 'twitch',
      name: 'Twitch',
      description: 'Planifiez vos streams et sessions live automatiquement',
      icon: '🟣',
      installed: false,
      gradient: 'from-purple-500 to-violet-600',
      shadow: 'shadow-purple-500/30',
    },
    {
      id: 'steam',
      name: 'Steam',
      description: 'Import automatique de votre bibliothèque et statut en jeu',
      icon: '🎮',
      installed: true,
      gradient: 'from-slate-700 to-slate-800',
      shadow: 'shadow-slate-700/30',
      version: 'v1.8.3',
    },
    {
      id: 'youtube',
      name: 'YouTube Gaming',
      description: 'Intégration avec YouTube pour les créateurs de contenu',
      icon: '📺',
      installed: false,
      gradient: 'from-red-500 to-red-600',
      shadow: 'shadow-red-500/30',
    },
    {
      id: 'epicgames',
      name: 'Epic Games',
      description: 'Connectez votre compte Epic Games Store',
      icon: '⚡',
      installed: false,
      gradient: 'from-gray-700 to-gray-900',
      shadow: 'shadow-gray-700/30',
    },
    {
      id: 'xbox',
      name: 'Xbox Live',
      description: 'Synchronisez vos achievements et votre gamertag',
      icon: '🎯',
      installed: false,
      gradient: 'from-emerald-500 to-green-600',
      shadow: 'shadow-emerald-500/30',
    },
  ]);

  const togglePlugin = (pluginId: string) => {
    setPlugins(prev =>
      prev.map(p =>
        p.id === pluginId
          ? { ...p, installed: !p.installed, version: !p.installed ? 'v1.0.0' : undefined }
          : p
      )
    );
    const plugin = plugins.find(p => p.id === pluginId);
    if (plugin) {
      showToast?.(
        plugin.installed ? `${plugin.name} désinstallé` : `${plugin.name} installé avec succès !`,
        plugin.installed ? 'info' : 'success'
      );
    }
  };

  const installedCount = plugins.filter(p => p.installed).length;
  const installedPlugins = plugins.filter(p => p.installed);
  const availablePlugins = plugins.filter(p => !p.installed);

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
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
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <IconButton
              icon={<ArrowLeft className="w-5 h-5" strokeWidth={2} />}
              onClick={() => onNavigate?.('integrations')}
              variant="ghost"
              aria-label="Retour aux integrations"
              className="w-12 h-12 rounded-2xl bg-[var(--bg-elevated)]/80 backdrop-blur-sm border border-[var(--border-subtle)] shadow-lg hover:shadow-xl transition-all"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Plugins
              </h1>
              <p className="text-sm text-[var(--fg-secondary)] font-medium mt-0.5">
                Extensions & Intégrations
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Puzzle className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center py-6 mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-xl shadow-indigo-500/30">
              <Puzzle className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg-primary)] mb-2">
              Plugins & Extensions
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Connectez vos plateformes gaming préférées
            </p>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 mb-6 shadow-xl shadow-indigo-500/30 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="text-white/80 text-sm font-semibold mb-1">
                  Plugins installés
                </div>
                <div className="text-4xl font-bold text-white">
                  {installedCount}/{plugins.length}
                </div>
              </div>
              <motion.div
                className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Sparkles className="w-8 h-8 text-white" strokeWidth={2} />
              </motion.div>
            </div>
          </motion.div>

          {/* Installed Plugins */}
          {installedPlugins.length > 0 && (
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                  <Check className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-[var(--fg-primary)]">
                  Installés ({installedCount})
                </h3>
              </div>
              <div className="space-y-3">
                {installedPlugins.map((plugin, index) => (
                  <motion.div
                    key={plugin.id}
                    variants={itemVariants}
                    custom={index}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.01, y: -2 }}
                  >
                    <div className="flex items-start gap-4">
                      <motion.div
                        className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${plugin.gradient} flex items-center justify-center text-2xl shadow-lg ${plugin.shadow}`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {plugin.icon}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold tracking-tight text-[var(--fg-primary)]">
                            {plugin.name}
                          </h4>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-xs font-bold rounded-lg flex items-center gap-1">
                            <Check className="w-3 h-3" strokeWidth={2.5} />
                            Actif
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium mb-3">
                          {plugin.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <motion.button
                            onClick={() => showToast?.('Ouverture des paramètres...', 'info')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Settings className="w-3.5 h-3.5" strokeWidth={2} />
                            Configurer
                          </motion.button>
                          <motion.button
                            onClick={() => togglePlugin(plugin.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Désinstaller
                          </motion.button>
                          {plugin.version && (
                            <span className="ml-auto text-xs text-gray-400 font-medium">
                              {plugin.version}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Available Plugins */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                <Download className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-[var(--fg-primary)]">
                Disponibles ({availablePlugins.length})
              </h3>
            </div>
            <div className="space-y-3">
              {availablePlugins.map((plugin, index) => (
                <motion.div
                  key={plugin.id}
                  variants={itemVariants}
                  custom={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.01, y: -2 }}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${plugin.gradient} flex items-center justify-center text-2xl shadow-lg ${plugin.shadow}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {plugin.icon}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold tracking-tight text-[var(--fg-primary)] mb-1">
                        {plugin.name}
                      </h4>
                      <p className="text-sm text-gray-500 font-medium mb-3">
                        {plugin.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => togglePlugin(plugin.id)}
                          className={`flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r ${plugin.gradient} text-white rounded-xl text-sm font-semibold shadow-md ${plugin.shadow}`}
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Download className="w-4 h-4" strokeWidth={2} />
                          Installer
                        </motion.button>
                        <motion.button
                          onClick={() => showToast?.('Ouverture de la page...', 'info')}
                          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ExternalLink className="w-4 h-4 text-gray-400" strokeWidth={2} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Premium Banner */}
          <motion.div
            variants={itemVariants}
            className="mt-8 bg-gradient-to-r from-amber-100/80 to-orange-100/80 backdrop-blur-sm rounded-2xl p-4 border border-amber-200/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                <Zap className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-amber-800">
                  Accès prioritaire aux nouveaux plugins
                </p>
                <p className="text-[10px] text-amber-600 mt-0.5">
                  Avec l'abonnement Premium
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

export default PluginsScreen;
