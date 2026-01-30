/**
 * FRIENDS SCREEN - Premium UI v2.0
 * Framer Motion + Glassmorphism + Gradients
 */

import { ArrowLeft, UserPlus, Users, Clock, Check, X, Search, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Card, Badge } from '@/design-system';

interface FriendsScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

type FriendTab = 'friends' | 'pending' | 'suggestions';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
  commonSquads: number;
  reliabilityScore: number;
}

interface PendingInvite {
  id: string;
  name: string;
  avatar: string;
  mutualFriends: number;
  sentAt: string;
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

export function FriendsScreen({ onNavigate, showToast }: FriendsScreenProps) {
  const [activeTab, setActiveTab] = useState<FriendTab>('friends');
  const [searchQuery, setSearchQuery] = useState('');

  const friends: Friend[] = [
    { id: '1', name: 'MaxGaming', avatar: '', isOnline: true, commonSquads: 3, reliabilityScore: 92 },
    { id: '2', name: 'NightOwl', avatar: '', isOnline: true, commonSquads: 2, reliabilityScore: 88 },
    { id: '3', name: 'ProPlayer', avatar: '', isOnline: false, lastSeen: 'Il y a 2h', commonSquads: 1, reliabilityScore: 95 },
    { id: '4', name: 'ShadowKing', avatar: '', isOnline: false, lastSeen: 'Il y a 1j', commonSquads: 2, reliabilityScore: 76 },
  ];

  const pendingInvites: PendingInvite[] = [
    { id: '1', name: 'DragonSlayer', avatar: '', mutualFriends: 3, sentAt: 'Il y a 2h' },
    { id: '2', name: 'IceQueen', avatar: '', mutualFriends: 1, sentAt: 'Il y a 1j' },
  ];

  const suggestions: Friend[] = [
    { id: '1', name: 'ThunderBolt', avatar: '', isOnline: true, commonSquads: 2, reliabilityScore: 89 },
    { id: '2', name: 'PhoenixRise', avatar: '', isOnline: false, lastSeen: 'Il y a 3h', commonSquads: 1, reliabilityScore: 91 },
  ];

  const handleAcceptInvite = (inviteId: string) => {
    showToast('Invitation acceptee !', 'success');
  };

  const handleRejectInvite = (inviteId: string) => {
    showToast('Invitation refusee', 'info');
  };

  const handleSendInvite = (friendId: string) => {
    showToast('Invitation envoyee !', 'success');
  };

  const handleRemoveFriend = (friendId: string) => {
    showToast('Ami retire', 'info');
  };

  const tabs: { key: FriendTab; label: string; count: number }[] = [
    { key: 'friends', label: 'Amis', count: friends.length },
    { key: 'pending', label: 'Invitations', count: pendingInvites.length },
    { key: 'suggestions', label: 'Suggestions', count: suggestions.length },
  ];

  const onlineCount = friends.filter(f => f.isOnline).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.35 }}
      className="min-h-screen pb-24 bg-[var(--bg-base)] relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[var(--color-primary-400)]/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
            <motion.button
              onClick={() => onNavigate('profile')}
              className="w-12 h-12 rounded-2xl bg-[var(--bg-elevated)] backdrop-blur-sm border border-[var(--border-subtle)] flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[var(--fg-secondary)]" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[var(--color-primary-600)] to-purple-600 bg-clip-text text-transparent">
                Mes Amis
              </h1>
              <p className="text-sm text-[var(--fg-secondary)] mt-0.5 font-medium">
                {friends.length} amis · <span className="text-[var(--color-success-500)]">{onlineCount} en ligne</span>
              </p>
            </div>
            <motion.button
              onClick={() => showToast('Recherche d\'amis', 'info')}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 text-white flex items-center justify-center shadow-lg shadow-[var(--color-primary-500)]/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <UserPlus className="w-5 h-5" strokeWidth={2} />
            </motion.button>
          </motion.div>

          {/* Search Bar */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--fg-tertiary)]" strokeWidth={2} />
              <input
                type="text"
                placeholder="Rechercher un ami..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-[var(--bg-elevated)] backdrop-blur-sm border border-[var(--border-subtle)] shadow-lg text-sm text-[var(--fg-primary)] placeholder-[var(--fg-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/50 transition-all"
              />
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={itemVariants} className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {tabs.map((tab) => (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-[var(--color-primary-500)] to-purple-500 text-white shadow-lg shadow-[var(--color-primary-500)]/30'
                    : 'bg-[var(--bg-elevated)] backdrop-blur-sm text-[var(--fg-secondary)] border border-[var(--border-subtle)]'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.label}
                {tab.count > 0 && (
                  <Badge
                    variant={activeTab === tab.key ? "default" : "primary"}
                    size="sm"
                    className={activeTab === tab.key ? 'bg-white/20 text-white' : ''}
                  >
                    {tab.count}
                  </Badge>
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {/* Friends List */}
            {activeTab === 'friends' && (
              <motion.div
                key="friends"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {friends.map((friend, index) => (
                  <motion.div
                    key={friend.id}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="p-4 hover:shadow-lg transition-all" interactive>
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {friend.name[0]}
                          </div>
                          {friend.isOnline && (
                            <motion.div
                              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[var(--color-success-500)] rounded-full border-2 border-[var(--bg-elevated)]"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold tracking-tight text-[var(--fg-primary)] mb-1">
                            {friend.name}
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            {friend.isOnline ? (
                              <span className="text-[var(--color-success-500)] font-semibold">En ligne</span>
                            ) : (
                              <span className="text-[var(--fg-secondary)] font-medium">{friend.lastSeen}</span>
                            )}
                            <span className="text-[var(--fg-tertiary)]">•</span>
                            <span className="text-[var(--fg-secondary)] font-medium">
                              {friend.commonSquads} squad{friend.commonSquads > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>

                        {/* Score & Actions */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right">
                            <div className={`text-sm font-bold ${
                              friend.reliabilityScore >= 90 ? 'text-[var(--color-success-500)]' :
                              friend.reliabilityScore >= 75 ? 'text-[var(--color-primary-500)]' :
                              'text-[var(--fg-secondary)]'
                            }`}>
                              {friend.reliabilityScore}%
                            </div>
                            <div className="text-sm text-[var(--fg-tertiary)] font-medium">
                              fiabilite
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveFriend(friend.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--fg-tertiary)] hover:bg-[var(--color-error-50)] hover:text-[var(--color-error-500)] transition-all"
                          >
                            <MoreVertical className="w-4 h-4" strokeWidth={2} />
                          </button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pending Invitations */}
            {activeTab === 'pending' && (
              <motion.div
                key="pending"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {pendingInvites.map((invite, index) => (
                  <motion.div
                    key={invite.id}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="p-4">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                          {invite.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold tracking-tight text-[var(--fg-primary)] mb-1">
                            {invite.name}
                          </div>
                          <div className="text-sm text-[var(--fg-secondary)] font-medium">
                            {invite.mutualFriends} ami{invite.mutualFriends > 1 ? 's' : ''} en commun · {invite.sentAt}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => handleAcceptInvite(invite.id)}
                          className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[var(--color-success-500)] to-teal-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Check className="w-4 h-4" strokeWidth={2.5} />
                          Accepter
                        </motion.button>
                        <motion.button
                          onClick={() => handleRejectInvite(invite.id)}
                          className="flex-1 h-11 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--fg-secondary)] font-semibold text-sm flex items-center justify-center gap-2"
                          whileHover={{ scale: 1.02, borderColor: 'var(--color-error-500)', color: 'var(--color-error-500)' }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <X className="w-4 h-4" strokeWidth={2.5} />
                          Refuser
                        </motion.button>
                      </div>
                    </Card>
                  </motion.div>
                ))}

                {pendingInvites.length === 0 && (
                  <motion.div variants={itemVariants} className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--bg-elevated)] backdrop-blur-sm border border-[var(--border-subtle)] shadow-md flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-[var(--fg-tertiary)]" />
                    </div>
                    <p className="text-sm text-[var(--fg-secondary)] font-medium">Aucune invitation en attente</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Suggestions */}
            {activeTab === 'suggestions' && (
              <motion.div
                key="suggestions"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="p-4">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                          {suggestion.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold tracking-tight text-[var(--fg-primary)] mb-1">
                            {suggestion.name}
                          </div>
                          <div className="text-sm text-[var(--fg-secondary)] font-medium">
                            {suggestion.commonSquads} squad{suggestion.commonSquads > 1 ? 's' : ''} en commun
                          </div>
                        </div>
                        <div className={`text-sm font-bold ${
                          suggestion.reliabilityScore >= 90 ? 'text-[var(--color-success-500)]' :
                          suggestion.reliabilityScore >= 75 ? 'text-[var(--color-primary-500)]' :
                          'text-[var(--fg-secondary)]'
                        }`}>
                          {suggestion.reliabilityScore}%
                        </div>
                      </div>
                      <motion.button
                        onClick={() => handleSendInvite(suggestion.id)}
                        className="w-full h-11 rounded-xl bg-gradient-to-r from-[var(--color-primary-500)] to-purple-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-[var(--color-primary-500)]/20"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <UserPlus className="w-4 h-4" strokeWidth={2} />
                        Ajouter en ami
                      </motion.button>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default FriendsScreen;
