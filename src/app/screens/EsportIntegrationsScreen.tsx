import { ArrowLeft, Trophy, Zap, Check, ExternalLink, Shield, Sparkles, Star, Link2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

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
  color: string;
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
      description: 'Plateforme de competition CS2, Dota 2, League of Legends',
      icon: '⚔️',
      connected: false,
      color: '#f97316',
      features: ['Import des matchs', 'Stats ELO', 'Historique competitif'],
    },
    {
      id: 'esl',
      name: 'ESL Gaming',
      description: 'Tournois officiels et ligues esport',
      icon: '🏆',
      connected: false,
      color: '#3b82f6',
      features: ['Calendrier tournois', 'Resultats', 'Classements'],
    },
    {
      id: 'challengermode',
      name: 'Challengermode',
      description: 'Matchmaking competitif multi-jeux',
      icon: '🎯',
      connected: false,
      color: '#a855f7',
      features: ['Matchs classes', 'Progression', 'Recompenses'],
    },
    {
      id: 'gamerlink',
      name: 'GamerLink',
      description: 'Reseau social gaming et LFG',
      icon: '🔗',
      connected: false,
      color: '#06b6d4',
      features: ['Profil public', 'Recherche coequipiers', 'Communaute'],
    },
    {
      id: 'battlefy',
      name: 'Battlefy',
      description: 'Organisation et gestion de tournois',
      icon: '⚡',
      connected: false,
      color: '#f59e0b',
      features: ['Creation tournois', 'Brackets', 'Gestion equipes'],
    },
    {
      id: 'toornament',
      name: 'Toornament',
      description: 'Plateforme de gestion de competitions esport',
      icon: '🏅',
      connected: false,
      color: '#0ea5e9',
      features: ['Tournois automatises', 'Streaming', 'Analytics'],
    },
  ]);

  const togglePlatform = (platformId: string) => {
    setPlatforms(prev =>
      prev.map(p => (p.id === platformId ? { ...p, connected: !p.connected } : p))
    );
    const platform = platforms.find(p => p.id === platformId);
    if (platform) {
      showToast?.(
        platform.connected ? `${platform.name} deconnecte` : `${platform.name} connecte avec succes !`,
        platform.connected ? 'info' : 'success'
      );
    }
  };

  const connectedCount = platforms.filter(p => p.connected).length;

  return (
    <div className="min-h-screen pb-24 md:pb-8 bg-[#08090a]">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <motion.button
              onClick={() => onNavigate?.('integrations')}
              className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[#8a8f98] hover:text-white hover:bg-white/[0.06] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-white tracking-tight">
                Esport Platforms
              </h1>
              <p className="text-sm text-[#8a8f98]">
                Integrations competitives
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(249, 115, 22, 0.15)' }}
            >
              <Trophy className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8a8f98] mb-1">
                  Plateformes connectees
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">{connectedCount}</span>
                  <span className="text-lg text-[#5a5f69]">/ {platforms.length}</span>
                </div>
              </div>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)' }}
              >
                <Link2 className="w-7 h-7 text-orange-500" strokeWidth={1.5} />
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(connectedCount / platforms.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Premium Banner */}
          <motion.div
            variants={itemVariants}
            className="relative bg-gradient-to-br from-violet-500/10 to-purple-500/5 border border-violet-500/20 rounded-2xl p-5 mb-6 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl" />

            <div className="relative flex items-start gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
              >
                <Shield className="w-5 h-5 text-violet-400" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">Fonctionnalite Premium</h3>
                <p className="text-sm text-[#8a8f98] mb-4 leading-relaxed">
                  Les integrations esport sont reservees aux abonnes Premium et aux equipes B2B.
                </p>
                <motion.button
                  onClick={() => onNavigate?.('premium')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-sm font-medium transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Voir les offres Premium
                  <ChevronRight className="w-4 h-4" strokeWidth={2} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Platforms Section */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-orange-500" strokeWidth={1.5} />
              <h3 className="text-sm font-medium text-[#8a8f98] uppercase tracking-wider">
                Plateformes disponibles
              </h3>
            </div>

            <div className="space-y-3">
              {platforms.map((platform) => (
                <motion.div
                  key={platform.id}
                  variants={itemVariants}
                  className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] rounded-xl p-4 transition-all"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${platform.color}20` }}
                    >
                      {platform.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">
                          {platform.name}
                        </h4>
                        {platform.connected && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-md">
                            <Check className="w-3 h-3" strokeWidth={2.5} />
                            Connecte
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#8a8f98] mb-3">
                        {platform.description}
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {platform.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-white/[0.05] text-[#8a8f98] text-xs font-medium rounded-md"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => togglePlatform(platform.id)}
                          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            platform.connected
                              ? 'bg-white/[0.03] text-[#8a8f98] hover:bg-white/[0.06] border border-white/[0.06]'
                              : 'text-white'
                          }`}
                          style={!platform.connected ? { backgroundColor: platform.color } : {}}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          {platform.connected ? 'Deconnecter' : 'Connecter'}
                        </motion.button>
                        <motion.button
                          onClick={() => showToast?.('Ouverture de la documentation...', 'info')}
                          className="p-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-lg transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ExternalLink className="w-4 h-4 text-[#8a8f98]" strokeWidth={1.5} />
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
            className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 text-center mb-6"
          >
            <div
              className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(100, 116, 139, 0.15)' }}
            >
              <Zap className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">
              Bientot disponible
            </h3>
            <p className="text-sm text-[#8a8f98] mb-4">
              Riot Games API, Activision, EA Sports, et plus encore
            </p>
            <motion.button
              onClick={() => showToast?.('Merci de votre interet !', 'success')}
              className="px-5 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-[#e5e7eb] rounded-lg text-sm font-medium transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              M'informer des nouvelles integrations
            </motion.button>
          </motion.div>

          {/* Pro Tip */}
          <motion.div
            variants={itemVariants}
            className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(249, 115, 22, 0.2)' }}
              >
                <Star className="w-5 h-5 text-orange-400" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-300">
                  Astuce Pro
                </p>
                <p className="text-xs text-orange-400/70 mt-0.5">
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
