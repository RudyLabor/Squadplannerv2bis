import { ArrowLeft, Trophy, Zap, Check, ExternalLink, Shield } from 'lucide-react';
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

export function EsportIntegrationsScreen({ onNavigate, showToast }: EsportIntegrationsScreenProps) {
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: 'faceit',
      name: 'FACEIT',
      description: 'Plateforme de compétition CS2, Dota 2, League of Legends',
      icon: '⚔️',
      connected: false,
      color: 'from-[#FF5500] to-[#E04D00]',
      features: ['Import des matchs', 'Stats ELO', 'Historique compétitif'],
    },
    {
      id: 'esl',
      name: 'ESL Gaming',
      description: 'Tournois officiels et ligues esport',
      icon: '🏆',
      connected: false,
      color: 'from-[#003366] to-[#002244]',
      features: ['Calendrier tournois', 'Résultats', 'Classements'],
    },
    {
      id: 'challengermode',
      name: 'Challengermode',
      description: 'Matchmaking compétitif multi-jeux',
      icon: '🎯',
      connected: false,
      color: 'from-[#9C27B0] to-[#7B1FA2]',
      features: ['Matchs classés', 'Progression', 'Récompenses'],
    },
    {
      id: 'gamerlink',
      name: 'GamerLink',
      description: 'Réseau social gaming et LFG',
      icon: '🔗',
      connected: false,
      color: 'from-[#00D9FF] to-[#00B8D4]',
      features: ['Profil public', 'Recherche coéquipiers', 'Communauté'],
    },
    {
      id: 'battlefy',
      name: 'Battlefy',
      description: 'Organisation et gestion de tournois',
      icon: '⚡',
      connected: false,
      color: 'from-[#FF6B35] to-[#F7931E]',
      features: ['Création tournois', 'Brackets', 'Gestion équipes'],
    },
    {
      id: 'toornament',
      name: 'Toornament',
      description: 'Plateforme de gestion de compétitions esport',
      icon: '🏅',
      connected: false,
      color: 'from-[#1976D2] to-[#1565C0]',
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
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Esport Platforms</h1>
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
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--warning-500)] to-[var(--error-500)] mb-4 shadow-lg">
            <Trophy className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Plateformes Esport
          </h2>
          <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">
            Synchronisez vos compétitions et tournois
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[var(--warning-50)] to-[var(--error-50)] rounded-2xl p-5 border-[0.5px] border-[var(--border-medium)]"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--warning-700)] mb-1">
              {connectedCount}/{platforms.length}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">
              Plateformes connectées
            </div>
          </div>
        </motion.div>

        {/* Premium Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] rounded-2xl p-5 text-white shadow-lg"
        >
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Fonctionnalité Premium</h3>
              <p className="text-sm text-white/80 mb-3">
                Les intégrations esport sont réservées aux abonnés Premium et aux équipes B2B.
              </p>
              <button
                onClick={() => onNavigate?.('premium')}
                className="px-4 py-2 bg-white text-[var(--primary-600)] rounded-xl text-sm font-medium hover:bg-white/90 transition-colors"
              >
                Voir les offres Premium
              </button>
            </div>
          </div>
        </motion.div>

        {/* Platforms List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="bg-white rounded-2xl p-5 border-[0.5px] border-[var(--border-medium)] shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-2xl shadow-md`}
                >
                  {platform.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-[var(--text-primary)]">
                      {platform.name}
                    </h4>
                    {platform.connected && (
                      <span className="px-2 py-0.5 bg-[var(--success-50)] text-[var(--success-700)] text-xs font-medium rounded-lg flex items-center gap-1">
                        <Check className="w-3 h-3" strokeWidth={2.5} />
                        Connecté
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mb-3">
                    {platform.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {platform.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-[var(--background)] text-[var(--text-tertiary)] text-xs rounded-lg"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePlatform(platform.id)}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                        platform.connected
                          ? 'bg-[var(--background)] text-[var(--text-primary)] hover:bg-[var(--background-elevated)]'
                          : 'bg-[var(--primary-600)] text-white hover:bg-[var(--primary-700)]'
                      }`}
                    >
                      {platform.connected ? 'Déconnecter' : 'Connecter'}
                    </button>
                    <button
                      onClick={() => showToast?.('Ouverture de la documentation...', 'info')}
                      className="p-2 hover:bg-[var(--background)] rounded-xl transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-[var(--text-tertiary)]" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-br from-[var(--secondary-50)] to-[var(--primary-50)] rounded-2xl p-5 border-[0.5px] border-[var(--border-medium)] text-center"
        >
          <Zap className="w-8 h-8 text-[var(--secondary-500)] mx-auto mb-3" strokeWidth={2} />
          <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">
            Bientôt disponible
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mb-3">
            Riot Games API, Activision, EA Sports, et plus encore
          </p>
          <button
            onClick={() => showToast?.('Merci de votre intérêt !', 'success')}
            className="px-4 py-2 bg-white text-[var(--text-primary)] rounded-xl text-sm font-medium hover:bg-[var(--background-elevated)] transition-colors shadow-sm"
          >
            M'informer des nouvelles intégrations
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default EsportIntegrationsScreen;
