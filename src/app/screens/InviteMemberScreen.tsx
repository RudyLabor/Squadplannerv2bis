/**
 * InviteMemberScreen - Linear Dark Design
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

interface InviteMemberScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  data?: { squadId?: string; squadName?: string; inviteCode?: string };
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
    <div className="min-h-screen bg-[#08090a] pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <motion.button
              onClick={() => onNavigate('squad-detail', { squadId })}
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.06)] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-[#f7f8f8] tracking-tight">
                Inviter des membres
              </h1>
              <p className="text-sm text-[#5e6063]">
                Partage le code ou recherche des joueurs
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#5e6dd2] flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            variants={itemVariants}
            className="bg-[rgba(255,255,255,0.02)] rounded-xl p-1 border border-[rgba(255,255,255,0.06)] mb-6"
          >
            <div className="flex gap-1">
              <motion.button
                onClick={() => setActiveTab('link')}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'link'
                    ? 'bg-[#5e6dd2] text-white'
                    : 'text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.04)]'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <Link className="w-4 h-4" strokeWidth={2} />
                Lien & Code
              </motion.button>
              <motion.button
                onClick={() => setActiveTab('search')}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'search'
                    ? 'bg-[#5e6dd2] text-white'
                    : 'text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.04)]'
                }`}
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
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Invite Code Card */}
              <motion.div
                variants={itemVariants}
                className="bg-[rgba(255,255,255,0.02)] rounded-xl p-5 border border-[rgba(255,255,255,0.06)]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(94,109,210,0.15)] flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-[#5e6dd2]" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#f7f8f8]">Code d'invitation</h3>
                    <p className="text-xs text-[#5e6063]">
                      Partage ce code avec tes amis
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 bg-[rgba(94,109,210,0.1)] rounded-xl px-5 py-4 text-center border border-[rgba(94,109,210,0.2)]">
                    <code className="text-2xl font-bold font-mono text-[#5e6dd2] tracking-[0.25em]">
                      {inviteCode}
                    </code>
                  </div>
                  <motion.button
                    onClick={handleCopyCode}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      codeCopied
                        ? 'bg-[rgba(52,199,89,0.15)] border border-[rgba(52,199,89,0.3)]'
                        : 'bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.06)]'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {codeCopied ? (
                      <Check className="w-5 h-5 text-[#34c759]" strokeWidth={2} />
                    ) : (
                      <Copy className="w-5 h-5 text-[#8b8d90]" strokeWidth={2} />
                    )}
                  </motion.button>
                </div>

                <p className="text-xs text-[#5e6063] text-center">
                  Les joueurs peuvent entrer ce code dans "Rejoindre une squad"
                </p>
              </motion.div>

              {/* Invite Link Card */}
              <motion.div
                variants={itemVariants}
                className="bg-[rgba(255,255,255,0.02)] rounded-xl p-5 border border-[rgba(255,255,255,0.06)]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(52,199,89,0.15)] flex items-center justify-center">
                    <Link className="w-5 h-5 text-[#34c759]" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#f7f8f8]">Lien direct</h3>
                    <p className="text-xs text-[#5e6063]">
                      Un clic pour rejoindre
                    </p>
                  </div>
                </div>

                <div className="bg-[rgba(255,255,255,0.04)] rounded-lg px-4 py-3 mb-4 border border-[rgba(255,255,255,0.08)]">
                  <code className="text-sm text-[#8b8d90] font-mono break-all">
                    {inviteLink}
                  </code>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={handleCopyLink}
                    className={`flex-1 h-11 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                      linkCopied
                        ? 'bg-[#34c759] text-white'
                        : 'bg-[#5e6dd2] hover:bg-[#6a79db] text-white'
                    }`}
                    whileHover={{ scale: 1.01 }}
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
                    className="h-11 w-11 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.06)] flex items-center justify-center transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share2 className="w-5 h-5 text-[#8b8d90]" strokeWidth={2} />
                  </motion.button>
                </div>
              </motion.div>

              {/* Quick Share Options */}
              <motion.div
                variants={itemVariants}
                className="bg-[rgba(255,255,255,0.02)] rounded-xl p-5 border border-[rgba(255,255,255,0.06)]"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-[#5e6dd2]" />
                  <h3 className="font-medium text-[#f7f8f8]">Partage rapide</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={handleShareViaDiscord}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[rgba(88,101,242,0.1)] border border-[rgba(88,101,242,0.2)] hover:bg-[rgba(88,101,242,0.15)] transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MessageCircle className="w-5 h-5 text-[#5865f2]" strokeWidth={2} />
                    <span className="font-medium text-[#f7f8f8]">Discord</span>
                  </motion.button>
                  <motion.button
                    onClick={handleShare}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.06)] transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Share2 className="w-5 h-5 text-[#8b8d90]" strokeWidth={2} />
                    <span className="font-medium text-[#f7f8f8]">Autres</span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'search' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Search Card */}
              <motion.div
                variants={itemVariants}
                className="bg-[rgba(255,255,255,0.02)] rounded-xl p-5 border border-[rgba(255,255,255,0.06)]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(52,199,89,0.15)] flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-[#34c759]" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#f7f8f8]">Rechercher un joueur</h3>
                    <p className="text-xs text-[#5e6063]">
                      Trouve et invite directement
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pseudo ou email..."
                    className="flex-1 h-11 px-4 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#f7f8f8] placeholder-[#5e6063] text-sm focus:outline-none focus:border-[#5e6dd2] focus:ring-1 focus:ring-[#5e6dd2] transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchPlayer()}
                  />
                  <motion.button
                    onClick={handleSearchPlayer}
                    disabled={!searchQuery.trim()}
                    className="h-11 w-11 rounded-xl bg-[#5e6dd2] hover:bg-[#6a79db] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    whileHover={{ scale: searchQuery.trim() ? 1.05 : 1 }}
                    whileTap={{ scale: searchQuery.trim() ? 0.95 : 1 }}
                  >
                    <Search className="w-5 h-5" strokeWidth={2} />
                  </motion.button>
                </div>
              </motion.div>

              {/* Suggestions */}
              <motion.div
                variants={itemVariants}
                className="bg-[rgba(255,255,255,0.02)] rounded-xl p-5 border border-[rgba(255,255,255,0.06)]"
              >
                <h3 className="font-medium text-[#f7f8f8] mb-4">Suggestions</h3>
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] mx-auto mb-4 flex items-center justify-center">
                    <UserPlus className="w-7 h-7 text-[#5e6063]" strokeWidth={1.5} />
                  </div>
                  <p className="text-sm text-[#8b8d90]">
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
