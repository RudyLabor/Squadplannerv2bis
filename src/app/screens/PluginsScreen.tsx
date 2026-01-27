import { ArrowLeft, Puzzle, Check, Download, Settings, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

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
  color: string;
  version?: string;
}

export function PluginsScreen({ onNavigate, showToast }: PluginsScreenProps) {
  const [plugins, setPlugins] = useState<Plugin[]>([
    {
      id: 'discord',
      name: 'Discord',
      description: 'Synchronisation complète avec Discord (events, messages, vocal)',
      icon: '💬',
      installed: true,
      color: 'from-[#5865F2] to-[#4752C4]',
      version: 'v2.4.1',
    },
    {
      id: 'twitch',
      name: 'Twitch',
      description: 'Planifiez vos streams et sessions live automatiquement',
      icon: '🟣',
      installed: false,
      color: 'from-[#9146FF] to-[#772CE8]',
    },
    {
      id: 'steam',
      name: 'Steam',
      description: 'Import automatique de votre bibliothèque et statut en jeu',
      icon: '🎮',
      installed: true,
      color: 'from-[#1B2838] to-[#171A21]',
      version: 'v1.8.3',
    },
    {
      id: 'youtube',
      name: 'YouTube Gaming',
      description: 'Intégration avec YouTube pour les créateurs de contenu',
      icon: '📺',
      installed: false,
      color: 'from-[#FF0000] to-[#CC0000]',
    },
    {
      id: 'epicgames',
      name: 'Epic Games',
      description: 'Connectez votre compte Epic Games Store',
      icon: '⚡',
      installed: false,
      color: 'from-[#313131] to-[#000000]',
    },
    {
      id: 'xbox',
      name: 'Xbox Live',
      description: 'Synchronisez vos achievements et votre gamertag',
      icon: '🎯',
      installed: false,
      color: 'from-[#107C10] to-[#0E6A0E]',
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
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Plugins</h1>
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
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] mb-4 shadow-lg">
            <Puzzle className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Plugins & Extensions
          </h2>
          <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">
            Connectez vos plateformes gaming préférées
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[var(--primary-50)] to-[var(--secondary-50)] rounded-2xl p-5 border-[0.5px] border-[var(--border-medium)]"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--primary-700)] mb-1">
              {installedCount}/{plugins.length}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">
              Plugins installés
            </div>
          </div>
        </motion.div>

        {/* Installed Plugins */}
        {installedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3 px-1">
              Installés ({installedCount})
            </h3>
            <div className="space-y-3">
              {plugins
                .filter(p => p.installed)
                .map((plugin, index) => (
                  <motion.div
                    key={plugin.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="bg-white rounded-2xl p-5 border-[0.5px] border-[var(--border-medium)] shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${plugin.color} flex items-center justify-center text-2xl shadow-md`}
                      >
                        {plugin.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-[var(--text-primary)]">
                            {plugin.name}
                          </h4>
                          <span className="px-2 py-0.5 bg-[var(--success-50)] text-[var(--success-700)] text-xs font-medium rounded-lg flex items-center gap-1">
                            <Check className="w-3 h-3" strokeWidth={2.5} />
                            Actif
                          </span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] mb-3">
                          {plugin.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => showToast?.('Ouverture des paramètres...', 'info')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--background)] rounded-lg text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--background-elevated)] transition-colors"
                          >
                            <Settings className="w-3.5 h-3.5" strokeWidth={2} />
                            Configurer
                          </button>
                          <button
                            onClick={() => togglePlugin(plugin.id)}
                            className="px-3 py-1.5 text-xs font-medium text-[var(--error-600)] hover:bg-[var(--error-50)] rounded-lg transition-colors"
                          >
                            Désinstaller
                          </button>
                          {plugin.version && (
                            <span className="ml-auto text-xs text-[var(--text-tertiary)]">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3 px-1">
            Disponibles ({plugins.length - installedCount})
          </h3>
          <div className="space-y-3">
            {plugins
              .filter(p => !p.installed)
              .map((plugin, index) => (
                <motion.div
                  key={plugin.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="bg-white rounded-2xl p-5 border-[0.5px] border-[var(--border-medium)] shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${plugin.color} flex items-center justify-center text-2xl shadow-md`}
                    >
                      {plugin.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--text-primary)] mb-1">
                        {plugin.name}
                      </h4>
                      <p className="text-sm text-[var(--text-secondary)] mb-3">
                        {plugin.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePlugin(plugin.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[var(--primary-600)] text-white rounded-xl text-sm font-medium hover:bg-[var(--primary-700)] transition-colors"
                        >
                          <Download className="w-4 h-4" strokeWidth={2} />
                          Installer
                        </button>
                        <button
                          onClick={() => showToast?.('Ouverture de la page...', 'info')}
                          className="p-2 hover:bg-[var(--background)] rounded-xl transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-[var(--text-tertiary)]" strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default PluginsScreen;
