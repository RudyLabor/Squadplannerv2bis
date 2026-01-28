/**
 * InviteMemberScreen
 *
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
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

interface InviteMemberScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  data?: { squadId?: string; squadName?: string; inviteCode?: string };
}

export function InviteMemberScreen({ onNavigate, showToast, data }: InviteMemberScreenProps) {
  const { squadId: routeSquadId } = useParams<{ squadId: string }>();
  const { currentSquad, getSquadById } = useSquads();
  const [linkCopied, setLinkCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'link' | 'search'>('link');

  const squadId = routeSquadId || data?.squadId;

  // Fetch squad data if needed
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
    <div className="min-h-screen pb-24 pt-safe bg-[var(--bg-base)]">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => onNavigate('squad-detail', { squadId })}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Inviter des membres
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)]">
              Partage le code ou recherche des joueurs
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-[var(--bg-muted)] rounded-xl">
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'link'
                ? 'bg-white shadow-sm text-[var(--fg-primary)]'
                : 'text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)]'
            }`}
          >
            <Link className="w-4 h-4 inline-block mr-2" />
            Lien & Code
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'search'
                ? 'bg-white shadow-sm text-[var(--fg-primary)]'
                : 'text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)]'
            }`}
          >
            <Search className="w-4 h-4 inline-block mr-2" />
            Rechercher
          </button>
        </div>

        {activeTab === 'link' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Invite Code Card */}
            <div className="bg-white rounded-3xl p-6 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--fg-primary)]">Code d'invitation</h3>
                  <p className="text-xs text-[var(--fg-tertiary)]">
                    Partage ce code avec tes amis
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 bg-[var(--bg-muted)] rounded-2xl px-6 py-4 text-center">
                  <code className="text-2xl font-bold font-mono text-[var(--primary-600)] tracking-[0.3em]">
                    {inviteCode}
                  </code>
                </div>
                <button
                  onClick={handleCopyCode}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    codeCopied
                      ? 'bg-green-500 text-white'
                      : 'bg-[var(--bg-muted)] text-[var(--fg-secondary)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  {codeCopied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                </button>
              </div>

              <p className="text-xs text-[var(--fg-tertiary)] text-center">
                Les joueurs peuvent entrer ce code dans "Rejoindre une squad"
              </p>
            </div>

            {/* Invite Link Card */}
            <div className="bg-white rounded-3xl p-6 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--secondary-500)] to-[var(--secondary-600)] flex items-center justify-center">
                  <Link className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--fg-primary)]">Lien direct</h3>
                  <p className="text-xs text-[var(--fg-tertiary)]">
                    Un clic pour rejoindre
                  </p>
                </div>
              </div>

              <div className="bg-[var(--bg-muted)] rounded-2xl px-4 py-3 mb-4 overflow-hidden">
                <code className="text-sm text-[var(--fg-secondary)] font-mono break-all">
                  {inviteLink}
                </code>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={handleCopyLink}
                  className="flex-1 h-12 rounded-xl"
                >
                  {linkCopied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copier le lien
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleShare}
                  className="h-12 px-4 rounded-xl"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Quick Share Options */}
            <div className="bg-white rounded-3xl p-6 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
              <h3 className="font-semibold text-[var(--fg-primary)] mb-4">Partage rapide</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleShareViaDiscord}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-[#5865F2]/10 hover:bg-[#5865F2]/20 transition-colors"
                >
                  <MessageCircle className="w-6 h-6 text-[#5865F2]" />
                  <span className="font-medium text-[#5865F2]">Discord</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--bg-muted)] hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <Share2 className="w-6 h-6 text-[var(--fg-secondary)]" />
                  <span className="font-medium text-[var(--fg-secondary)]">Autres</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'search' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Search Card */}
            <div className="bg-white rounded-3xl p-6 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--fg-primary)]">Rechercher un joueur</h3>
                  <p className="text-xs text-[var(--fg-tertiary)]">
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
                <Button
                  variant="primary"
                  onClick={handleSearchPlayer}
                  disabled={!searchQuery.trim()}
                  className="h-12 px-6 rounded-xl"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Recent Players / Friends Section (placeholder) */}
            <div className="bg-white rounded-3xl p-6 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
              <h3 className="font-semibold text-[var(--fg-primary)] mb-4">Suggestions</h3>
              <div className="text-center py-8">
                <UserPlus className="w-12 h-12 text-[var(--fg-muted)] mx-auto mb-3" />
                <p className="text-sm text-[var(--fg-tertiary)]">
                  Recherche un joueur par son pseudo pour l'inviter
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default InviteMemberScreen;
