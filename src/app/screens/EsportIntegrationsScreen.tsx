import { ArrowLeft, Trophy, Zap, Check, ExternalLink, Shield, Sparkles, Star, Link2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { IconButton, Card, Badge } from '@/design-system';

interface EsportIntegrationsScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface Platform {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  gradient: string;
  shadow: string;
  features: string[];
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

export function EsportIntegrationsScreen({ onNavigate, showToast }: EsportIntegrationsScreenProps) {
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: 'faceit',
      name: 'FACEIT',
      description: 'Plateforme de compétition CS2, Dota 2, League of Legends',
      icon: '⚔️',
      connected: false,
      gradient: 'from-orange-500 to-red-500',
      shadow: 'shadow-orange-500/30',
      features: ['Import des matchs', 'Stats ELO', 'Historique compétitif'],
    },
    {
      id: 'esl',
      name: 'ESL Gaming',
      description: 'Tournois officiels et ligues esport',
      icon: '🏆',
      connected: false,
      gradient: 'from-blue-600 to-indigo-700',
      shadow: 'shadow-blue-600/30',
      features: ['Calendrier tournois', 'Résultats', 'Classements'],
    },
    {
      id: 'challengermode',
      name: 'Challengermode',
      description: 'Matchmaking compétitif multi-jeux',
      icon: '🎯',
      connected: false,
      gradient: 'from-purple-500 to-violet-600',
      shadow: 'shadow-purple-500/30',
      features: ['Matchs classés', 'Progression', 'Récompenses'],
    },
    {
      id: 'gamerlink',
      name: 'GamerLink',
      description: 'Réseau social gaming et LFG',
      icon: '🔗',
      connected: false,
      gradient: 'from-cyan-500 to-teal-500',
      shadow: 'shadow-cyan-500/30',
      features: ['Profil public', 'Recherche coéquipiers', 'Communauté'],
    },
    {
      id: 'battlefy',
      name: 'Battlefy',
      description: 'Organisation et gestion de tournois',
      icon: '⚡',
      connected: false,
      gradient: 'from-amber-500 to-orange-500',
      shadow: 'shadow-amber-500/30',
      features: ['Création tournois', 'Brackets', 'Gestion équipes'],
    },
    {
      id: 'toornament',
      name: 'Toornament',
      description: 'Plateforme de gestion de compétitions esport',
      icon: '🏅',
      connected: false,
      gradient: 'from-blue-500 to-cyan-500',
      shadow: 'shadow-blue-500/30',
      features: ['Tournois automatisés', 'Streaming', 'Analytics'],
    },
  ]);

  const togglePlatform = (platformId: string) => {
    setPlatforms(prev =>
      prev.map(p => (p.id === platformId ? { ...p, connected: !p.connected } : p))
    );
    const platform = platforms.find(p => p.id === platformId);
    if (platform) {
      showToast?.(
        platform.connected ? `${platform.name} déconnecté` : `${platform.name} connecté avec succès !`,
        platform.connected ? 'info' : 'success'
      );
    }
  };

  const connectedCount = platforms.filter(p => p.connected).length;

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-br from-red-400/15 to-rose-400/15 rounded-full blur-3xl" />
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
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Esport Platforms
              </h1>
              <p className="text-sm text-[var(--fg-secondary)] font-medium">
                Intégrations compétitives
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Trophy className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center py-6 mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 mb-4 shadow-xl shadow-amber-500/30">
              <Trophy className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg-primary)] mb-2">Plateformes Esport</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Synchronisez vos compétitions et tournois
            </p>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 mb-6 shadow-xl shadow-amber-500/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="text-white/80 text-sm font-semibold mb-1">
                  Plateformes connectées
                </div>
                <div className="text-4xl font-bold text-white">
                  {connectedCount}/{platforms.length}
                </div>
              </div>
              <motion.div
                className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Link2 className="w-8 h-8 text-white" strokeWidth={2} />
              </motion.div>
            </div>
          </motion.div>

          {/* Premium Badge */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 mb-6 shadow-xl shadow-indigo-500/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold tracking-tight text-white mb-1">Fonctionnalité Premium</h3>
                <p className="text-sm text-white/80 font-medium mb-3">
                  Les intégrations esport sont réservées aux abonnés Premium et aux équipes B2B.
                </p>
                <motion.button
                  onClick={() => onNavigate?.('premium')}
                  className="px-4 py-2 bg-white text-indigo-600 rounded-xl text-sm font-bold hover:bg-white/90 transition-colors shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Voir les offres Premium
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Platforms List */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-bold tracking-tight text-[var(--fg-secondary)]">
                Plateformes disponibles
              </h3>
            </div>
            <div className="space-y-3">
              {platforms.map((platform) => (
                <motion.div
                  key={platform.id}
                  variants={itemVariants}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.01, y: -2 }}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center text-2xl shadow-lg ${platform.shadow}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {platform.icon}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold tracking-tight text-[var(--fg-primary)]">
                          {platform.name}
                        </h4>
                        {platform.connected && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1">
                            <Check className="w-3 h-3" strokeWidth={2.5} />
                            Connecté
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 font-medium mb-3">
                        {platform.description}
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {platform.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => togglePlatform(platform.id)}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            platform.connected
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              : `bg-gradient-to-r ${platform.gradient} text-white shadow-md ${platform.shadow}`
                          }`}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          {platform.connected ? 'Déconnecter' : 'Connecter'}
                        </motion.button>
                        <motion.button
                          onClick={() => showToast?.('Ouverture de la documentation...', 'info')}
                          className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
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

          {/* Coming Soon Banner */}
          <motion.div
            variants={itemVariants}
            className="mt-8 bg-gradient-to-br from-slate-100/80 to-gray-100/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-500 to-gray-600 mx-auto mb-3 flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <h3 className="text-base font-bold tracking-tight text-[var(--fg-primary)] mb-2">
              Bientôt disponible
            </h3>
            <p className="text-sm text-gray-500 font-medium mb-4">
              Riot Games API, Activision, EA Sports, et plus encore
            </p>
            <motion.button
              onClick={() => showToast?.('Merci de votre intérêt !', 'success')}
              className="px-5 py-2.5 bg-white text-gray-700 rounded-xl text-sm font-bold hover:shadow-lg transition-all shadow-md border border-white/50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              M'informer des nouvelles intégrations
            </motion.button>
          </motion.div>

          {/* Pro Tip */}
          <motion.div
            variants={itemVariants}
            className="mt-6 bg-gradient-to-br from-amber-100/80 to-orange-100/80 backdrop-blur-sm rounded-2xl p-4 border border-amber-200/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                <Star className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-amber-800">
                  Astuce Pro
                </p>
                <p className="text-[10px] text-amber-600 mt-0.5">
                  Connectez FACEIT pour importer automatiquement vos stats
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default EsportIntegrationsScreen;
