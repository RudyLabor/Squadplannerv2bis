/**
 * InviteMemberScreen - Premium UI
 * Screen for inviting members to a squad via code, link, or direct search.
 */

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSquads } from '@/app/contexts/SquadsContext';
import {
  ArrowLeft,
  Link,
  Copy,
  Check,
  Share2,
  QrCode,
  Search,
  UserPlus,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { Button, Input, IconButton } from '@/design-system';

interface InviteMemberScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  data?: { squadId?: string; squadName?: string; inviteCode?: string };
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

export function InviteMemberScreen({ onNavigate, showToast, data }: InviteMemberScreenProps) {
  const { squadId: routeSquadId } = useParams<{ squadId: string }>();
  const { currentSquad, getSquadById } = useSquads();
  const [linkCopied, setLinkCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'link' | 'search'>('link');

  const squadId = routeSquadId || data?.squadId;

  useEffect(() => {
    if (squadId && !currentSquad) {
      getSquadById(squadId);
    }
  }, [squadId, currentSquad, getSquadById]);

  const inviteCode = currentSquad?.invite_code || data?.inviteCode || squadId?.slice(0, 8).toUpperCase() || 'ABC123';
  const inviteLink = `${window.location.origin}/join/${inviteCode}`;
  const squadName = currentSquad?.name || data?.squadName || 'Squad';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setLinkCopied(true);
      showToast('Lien copié !', 'success');
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      showToast('Impossible de copier le lien', 'error');
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCodeCopied(true);
      showToast('Code copié !', 'success');
      setTimeout(() => setCodeCopied(false), 2000);
    } catch (err) {
      showToast('Impossible de copier le code', 'error');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Rejoins ${squadName} sur Squad Planner !`,
      text: `${squadName} t'invite à rejoindre son squad. Utilise le code ${inviteCode} ou clique sur le lien !`,
      url: inviteLink,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        showToast('Invitation partagée !', 'success');
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleShareViaDiscord = () => {
    const text = encodeURIComponent(`Rejoins ${squadName} sur Squad Planner ! ${inviteLink}`);
    window.open(`https://discord.com/channels/@me?message=${text}`, '_blank');
    showToast('Discord ouvert', 'info');
  };

  const handleSearchPlayer = () => {
    if (searchQuery.trim()) {
      onNavigate('search-players', { query: searchQuery, squadId: data?.squadId });
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-[var(--color-primary-50)] via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[var(--color-primary-400)]/20 to-purple-400/20 rounded-full blur-3xl" />
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
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
            <IconButton
              variant="secondary"
              size="md"
              icon={<ArrowLeft className="w-5 h-5" strokeWidth={2} />}
              onClick={() => onNavigate('squad-detail', { squadId })}
              aria-label="Retour"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[var(--color-primary-600)] to-purple-600 bg-clip-text text-transparent">
                Inviter des membres
              </h1>
              <p className="text-sm text-[var(--fg-secondary)] font-medium">
                Partage le code ou recherche des joueurs
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 flex items-center justify-center shadow-lg shadow-[var(--color-primary-500)]/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <UserPlus className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            variants={itemVariants}
            className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl p-1.5 border border-[var(--border-subtle)] shadow-lg mb-6"
          >
            <div className="flex gap-1">
              <motion.button
                onClick={() => setActiveTab('link')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'link'
                    ? 'bg-gradient-to-r from-[var(--color-primary-500)] to-purple-500 text-white shadow-lg shadow-[var(--color-primary-500)]/30'
                    : 'text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]'
                }`}
                whileHover={{ scale: activeTab === 'link' ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link className="w-4 h-4" strokeWidth={2} />
                Lien & Code
              </motion.button>
              <motion.button
                onClick={() => setActiveTab('search')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'search'
                    ? 'bg-gradient-to-r from-[var(--color-primary-500)] to-purple-500 text-white shadow-lg shadow-[var(--color-primary-500)]/30'
                    : 'text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]'
                }`}
                whileHover={{ scale: activeTab === 'search' ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Search className="w-4 h-4" strokeWidth={2} />
                Rechercher
              </motion.button>
            </div>
          </motion.div>

          {activeTab === 'link' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Invite Code Card */}
              <motion.div
                variants={itemVariants}
                className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl p-6 border border-[var(--border-subtle)] shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 flex items-center justify-center shadow-lg shadow-[var(--color-primary-500)]/30"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <QrCode className="w-6 h-6 text-white" strokeWidth={2} />
                  </motion.div>
                  <div>
                    <h3 className="font-bold tracking-tight text-[var(--fg-primary)]">Code d'invitation</h3>
                    <p className="text-xs text-[var(--fg-tertiary)] font-medium">
                      Partage ce code avec tes amis
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 bg-gradient-to-br from-[var(--color-primary-50)] to-purple-50 rounded-2xl px-6 py-4 text-center border border-[var(--color-primary-200)]">
                    <code className="text-2xl font-bold font-mono bg-gradient-to-r from-[var(--color-primary-600)] to-purple-600 bg-clip-text text-transparent tracking-[0.3em]">
                      {inviteCode}
                    </code>
                  </div>
                  <motion.button
                    onClick={handleCopyCode}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-md ${
                      codeCopied
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-500/30'
                        : 'bg-white/80 hover:bg-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {codeCopied ? (
                      <Check className="w-6 h-6 text-white" strokeWidth={2} />
                    ) : (
                      <Copy className="w-6 h-6 text-gray-600" strokeWidth={2} />
                    )}
                  </motion.button>
                </div>

                <p className="text-xs text-[var(--fg-tertiary)] text-center font-medium">
                  Les joueurs peuvent entrer ce code dans "Rejoindre une squad"
                </p>
              </motion.div>

              {/* Invite Link Card */}
              <motion.div
                variants={itemVariants}
                className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl p-6 border border-[var(--border-subtle)] shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-success-500)] to-teal-500 flex items-center justify-center shadow-lg shadow-[var(--color-success-500)]/30"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Link className="w-6 h-6 text-white" strokeWidth={2} />
                  </motion.div>
                  <div>
                    <h3 className="font-bold tracking-tight text-[var(--fg-primary)]">Lien direct</h3>
                    <p className="text-xs text-[var(--fg-tertiary)] font-medium">
                      Un clic pour rejoindre
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[var(--bg-subtle)] to-slate-50 rounded-xl px-4 py-3 mb-4 overflow-hidden border border-[var(--border-subtle)]">
                  <code className="text-sm text-[var(--fg-secondary)] font-mono break-all">
                    {inviteLink}
                  </code>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={handleCopyLink}
                    className={`flex-1 h-12 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                      linkCopied
                        ? 'bg-gradient-to-r from-[var(--color-success-500)] to-teal-500 text-white shadow-lg shadow-[var(--color-success-500)]/30'
                        : 'bg-gradient-to-r from-[var(--color-primary-500)] to-purple-500 text-white shadow-lg shadow-[var(--color-primary-500)]/30'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {linkCopied ? (
                      <>
                        <Check className="w-4 h-4" strokeWidth={2} />
                        Copié !
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" strokeWidth={2} />
                        Copier le lien
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    onClick={handleShare}
                    className="h-12 px-4 rounded-xl bg-[var(--bg-elevated)]/80 border border-[var(--border-subtle)] shadow-md hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share2 className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
                  </motion.button>
                </div>
              </motion.div>

              {/* Quick Share Options */}
              <motion.div
                variants={itemVariants}
                className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl p-6 border border-[var(--border-subtle)] shadow-lg"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[var(--color-primary-500)]" />
                  <h3 className="font-bold tracking-tight text-[var(--fg-primary)]">Partage rapide</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={handleShareViaDiscord}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-primary-100)] hover:bg-[var(--color-primary-200)] transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MessageCircle className="w-6 h-6 text-[var(--color-primary-600)]" strokeWidth={2} />
                    <span className="font-semibold text-[var(--color-primary-700)]">Discord</span>
                  </motion.button>
                  <motion.button
                    onClick={handleShare}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-muted)] transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Share2 className="w-6 h-6 text-[var(--fg-secondary)]" strokeWidth={2} />
                    <span className="font-semibold text-[var(--fg-primary)]">Autres</span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'search' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Search Card */}
              <motion.div
                variants={itemVariants}
                className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl p-6 border border-[var(--border-subtle)] shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-[var(--color-success-500)] flex items-center justify-center shadow-lg shadow-teal-500/30"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <UserPlus className="w-6 h-6 text-white" strokeWidth={2} />
                  </motion.div>
                  <div>
                    <h3 className="font-bold tracking-tight text-[var(--fg-primary)]">Rechercher un joueur</h3>
                    <p className="text-xs text-[var(--fg-tertiary)] font-medium">
                      Trouve et invite directement
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pseudo ou email..."
                    className="flex-1 h-12 rounded-xl"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchPlayer()}
                  />
                  <motion.button
                    onClick={handleSearchPlayer}
                    disabled={!searchQuery.trim()}
                    className="h-12 px-6 rounded-xl bg-gradient-to-r from-[var(--color-primary-500)] to-purple-500 text-white font-semibold shadow-lg shadow-[var(--color-primary-500)]/30 disabled:opacity-40"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Search className="w-5 h-5" strokeWidth={2} />
                  </motion.button>
                </div>
              </motion.div>

              {/* Suggestions */}
              <motion.div
                variants={itemVariants}
                className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl p-6 border border-[var(--border-subtle)] shadow-lg"
              >
                <h3 className="font-bold tracking-tight text-[var(--fg-primary)] mb-4">Suggestions</h3>
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--bg-subtle)] to-[var(--bg-muted)] mx-auto mb-4 flex items-center justify-center">
                    <UserPlus className="w-8 h-8 text-[var(--fg-tertiary)]" strokeWidth={1.5} />
                  </div>
                  <p className="text-sm text-[var(--fg-secondary)] font-medium">
                    Recherche un joueur par son pseudo pour l'inviter
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default InviteMemberScreen;
