/**
 * FRIENDS SCREEN - LINEAR DESIGN SYSTEM
 * Premium, Dark, Minimal - Friends management
 */

import { ArrowLeft, UserPlus, Users, Clock, Check, X, Search, MoreHorizontal, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

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

// Linear-style animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.02 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }
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
    showToast('Invitation acceptée', 'success');
  };

  const handleRejectInvite = (inviteId: string) => {
    showToast('Invitation refusée', 'info');
  };

  const handleSendInvite = (friendId: string) => {
    showToast('Invitation envoyée', 'success');
  };

  const tabs: { key: FriendTab; label: string; count: number }[] = [
    { key: 'friends', label: 'Amis', count: friends.length },
    { key: 'pending', label: 'Invitations', count: pendingInvites.length },
    { key: 'suggestions', label: 'Suggestions', count: suggestions.length },
  ];

  const onlineCount = friends.filter(f => f.isOnline).length;

  const getReliabilityColor = (score: number) => {
    if (score >= 90) return 'text-[#4ade80] bg-[rgba(74,222,128,0.1)]';
    if (score >= 75) return 'text-[#8b93ff] bg-[rgba(94,109,210,0.1)]';
    return 'text-[#8b8d90] bg-[rgba(139,141,144,0.1)]';
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 bg-[#08090a]">
      <div className="px-4 md:px-6 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header - Linear style */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
            <motion.button
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.06)] transition-all"
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-[22px] md:text-[24px] font-semibold text-[#f7f8f8]">
                Mes Amis
              </h1>
              <p className="text-[13px] text-[#8b8d90]">
                {friends.length} amis · <span className="text-[#4ade80]">{onlineCount} en ligne</span>
              </p>
            </div>
            <motion.button
              onClick={() => onNavigate('search-players')}
              className="w-11 h-11 rounded-xl bg-[#5e6dd2] text-white flex items-center justify-center shadow-lg shadow-[#5e6dd2]/20 hover:bg-[#6a79db] transition-colors"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <UserPlus className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
          </motion.div>

          {/* Search Bar - Linear style */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#5e6063]" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Rechercher un ami..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 md:h-12 pl-11 pr-4 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[14px] text-[#f7f8f8] placeholder:text-[#5e6063] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] focus:border-[rgba(94,109,210,0.5)] focus:ring-2 focus:ring-[rgba(94,109,210,0.15)] focus:outline-none transition-all"
              />
            </div>
          </motion.div>

          {/* Tabs - Linear style with pill indicator */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex gap-1 p-1 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 px-3 py-2 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all flex items-center justify-center gap-2 ${
                    activeTab === tab.key
                      ? 'bg-[rgba(94,109,210,0.2)] text-[#8b93ff]'
                      : 'text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.04)]'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full ${
                      activeTab === tab.key
                        ? 'bg-[#8b93ff] text-[#08090a]'
                        : 'bg-[rgba(255,255,255,0.08)] text-[#5e6063]'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Online friends indicator */}
          {activeTab === 'friends' && onlineCount > 0 && (
            <motion.div variants={itemVariants} className="mb-4">
              <div className="flex items-center gap-2 text-[12px] text-[#8b8d90]">
                <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
                <span><span className="text-[#4ade80] font-medium">{onlineCount}</span> ami{onlineCount > 1 ? 's' : ''} en ligne</span>
              </div>
            </motion.div>
          )}

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
                className="space-y-2"
              >
                {friends.map((friend, index) => (
                  <motion.div
                    key={friend.id}
                    variants={itemVariants}
                    custom={index}
                    className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] transition-all group"
                    whileHover={{ y: -1 }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-11 h-11 rounded-xl bg-[rgba(94,109,210,0.15)] flex items-center justify-center text-[#8b93ff] font-semibold text-[14px]">
                          {friend.name[0]}
                        </div>
                        {friend.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#4ade80] rounded-full border-2 border-[#08090a]" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-medium text-[#f7f8f8] group-hover:text-white transition-colors">
                          {friend.name}
                        </div>
                        <div className="flex items-center gap-2 text-[12px] text-[#8b8d90]">
                          {friend.isOnline ? (
                            <span className="text-[#4ade80]">En ligne</span>
                          ) : (
                            <span>{friend.lastSeen}</span>
                          )}
                          <span className="text-[#5e6063]">·</span>
                          <span>{friend.commonSquads} squad{friend.commonSquads > 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      {/* Score */}
                      <span className={`px-2 py-1 rounded-lg text-[11px] font-semibold ${getReliabilityColor(friend.reliabilityScore)}`}>
                        {friend.reliabilityScore}%
                      </span>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5e6063] hover:bg-[rgba(94,109,210,0.15)] hover:text-[#8b93ff] transition-all"
                          title="Envoyer un message"
                        >
                          <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5e6063] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#8b8d90] transition-all"
                          title="Plus d'options"
                        >
                          <MoreHorizontal className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Empty state for friends */}
                {friends.length === 0 && (
                  <motion.div
                    variants={itemVariants}
                    className="p-6 md:p-8 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]"
                  >
                    <div className="text-center max-w-[280px] mx-auto">
                      <div className="w-12 h-12 rounded-xl bg-[rgba(94,109,210,0.15)] flex items-center justify-center mx-auto mb-4">
                        <Users className="w-6 h-6 text-[#8b93ff]" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-[15px] font-semibold text-[#f7f8f8] mb-2">
                        Aucun ami pour le moment
                      </h3>
                      <p className="text-[13px] text-[#8b8d90] mb-4">
                        Recherche des joueurs pour commencer a construire ta squad
                      </p>
                      <motion.button
                        onClick={() => onNavigate('search-players')}
                        className="px-4 py-2 rounded-lg bg-[#5e6dd2] text-white text-[13px] font-medium hover:bg-[#6a79db] transition-colors"
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <UserPlus className="w-4 h-4 inline mr-2" strokeWidth={1.5} />
                        Rechercher des joueurs
                      </motion.button>
                    </div>
                  </motion.div>
                )}
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
                className="space-y-2"
              >
                {pendingInvites.length > 0 ? pendingInvites.map((invite, index) => (
                  <motion.div
                    key={invite.id}
                    variants={itemVariants}
                    custom={index}
                    className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-[rgba(94,109,210,0.15)] flex items-center justify-center text-[#8b93ff] font-semibold text-[14px] flex-shrink-0">
                        {invite.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-medium text-[#f7f8f8]">
                          {invite.name}
                        </div>
                        <div className="text-[12px] text-[#8b8d90]">
                          {invite.mutualFriends} ami{invite.mutualFriends > 1 ? 's' : ''} en commun · {invite.sentAt}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => handleAcceptInvite(invite.id)}
                        className="flex-1 h-10 rounded-xl bg-[#4ade80] text-[#08090a] font-semibold text-[13px] flex items-center justify-center gap-2 hover:bg-[#5eeb96] transition-colors"
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Check className="w-4 h-4" strokeWidth={2} />
                        Accepter
                      </motion.button>
                      <motion.button
                        onClick={() => handleRejectInvite(invite.id)}
                        className="flex-1 h-10 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#8b8d90] font-medium text-[13px] flex items-center justify-center gap-2 hover:bg-[rgba(248,113,113,0.1)] hover:border-[rgba(248,113,113,0.2)] hover:text-[#f87171] transition-all"
                        whileTap={{ scale: 0.98 }}
                      >
                        <X className="w-4 h-4" strokeWidth={2} />
                        Refuser
                      </motion.button>
                    </div>
                  </motion.div>
                )) : (
                  <motion.div
                    variants={itemVariants}
                    className="p-6 md:p-8 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]"
                  >
                    <div className="text-center max-w-[280px] mx-auto">
                      <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.04)] flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-6 h-6 text-[#5e6063]" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-[15px] font-semibold text-[#f7f8f8] mb-2">
                        Aucune invitation
                      </h3>
                      <p className="text-[13px] text-[#8b8d90]">
                        Tu n'as pas d'invitations en attente
                      </p>
                    </div>
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
                className="space-y-2"
              >
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    variants={itemVariants}
                    custom={index}
                    className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-[rgba(94,109,210,0.15)] flex items-center justify-center text-[#8b93ff] font-semibold text-[14px] flex-shrink-0">
                        {suggestion.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-medium text-[#f7f8f8]">
                          {suggestion.name}
                        </div>
                        <div className="text-[12px] text-[#8b8d90]">
                          {suggestion.commonSquads} squad{suggestion.commonSquads > 1 ? 's' : ''} en commun
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-[11px] font-semibold ${getReliabilityColor(suggestion.reliabilityScore)}`}>
                        {suggestion.reliabilityScore}%
                      </span>
                    </div>
                    <motion.button
                      onClick={() => handleSendInvite(suggestion.id)}
                      className="w-full h-10 rounded-xl bg-[#5e6dd2] text-white font-semibold text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-[#5e6dd2]/20 hover:bg-[#6a79db] transition-colors"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <UserPlus className="w-4 h-4" strokeWidth={1.5} />
                      Ajouter en ami
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search players CTA */}
          {activeTab === 'friends' && (
            <motion.div variants={itemVariants} className="mt-6">
              <motion.button
                onClick={() => onNavigate('search-players')}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[rgba(94,109,210,0.08)] border border-[rgba(94,109,210,0.2)] text-[#8b93ff] text-[14px] font-medium hover:bg-[rgba(94,109,210,0.12)] transition-all"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Users className="w-4 h-4" strokeWidth={1.5} />
                Rechercher des joueurs
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default FriendsScreen;
