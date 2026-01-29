/**
 * FRIENDS SCREEN - Premium UI v2.0
 * Framer Motion + Glassmorphism + Gradients
 */

import { ArrowLeft, UserPlus, Users, Clock, Check, X, Search, MoreVertical, Sparkles } from 'lucide-react';
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
    showToast('Invitation acceptée !', 'success');
  };

  const handleRejectInvite = (inviteId: string) => {
    showToast('Invitation refusée', 'info');
  };

  const handleSendInvite = (friendId: string) => {
    showToast('Invitation envoyée !', 'success');
  };

  const handleRemoveFriend = (friendId: string) => {
    showToast('Ami retiré', 'info');
  };

  const tabs: { key: FriendTab; label: string; count: number }[] = [
    { key: 'friends', label: 'Amis', count: friends.length },
    { key: 'pending', label: 'Invitations', count: pendingInvites.length },
    { key: 'suggestions', label: 'Suggestions', count: suggestions.length },
  ];

  const onlineCount = friends.filter(f => f.isOnline).length;

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
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
              className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Mes Amis
              </h1>
              <p className="text-sm text-gray-500 mt-0.5 font-medium">
                {friends.length} amis · <span className="text-emerald-500">{onlineCount} en ligne</span>
              </p>
            </div>
            <motion.button
              onClick={() => showToast('Recherche d\'amis', 'info')}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <UserPlus className="w-5 h-5" strokeWidth={2} />
            </motion.button>
          </motion.div>

          {/* Search Bar */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2} />
              <input
                type="text"
                placeholder="Rechercher un ami..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
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
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-white/80 backdrop-blur-sm text-gray-600 border border-white/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === tab.key
                      ? 'bg-white/20'
                      : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    {tab.count}
                  </span>
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
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-md hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.01, x: 4 }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {friend.name[0]}
                        </div>
                        {friend.isOnline && (
                          <motion.div
                            className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-800 mb-1">
                          {friend.name}
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          {friend.isOnline ? (
                            <span className="text-emerald-500 font-semibold">En ligne</span>
                          ) : (
                            <span className="text-gray-500 font-medium">{friend.lastSeen}</span>
                          )}
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500 font-medium">
                            {friend.commonSquads} squad{friend.commonSquads > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      {/* Score & Actions */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <div className={`text-sm font-bold ${
                            friend.reliabilityScore >= 90 ? 'text-emerald-500' :
                            friend.reliabilityScore >= 75 ? 'text-indigo-500' :
                            'text-gray-500'
                          }`}>
                            {friend.reliabilityScore}%
                          </div>
                          <div className="text-[10px] text-gray-400 font-medium">
                            fiabilité
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFriend(friend.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                          <MoreVertical className="w-4 h-4" strokeWidth={2} />
                        </button>
                      </div>
                    </div>
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
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-md"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                        {invite.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-800 mb-1">
                          {invite.name}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                          {invite.mutualFriends} ami{invite.mutualFriends > 1 ? 's' : ''} en commun · {invite.sentAt}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => handleAcceptInvite(invite.id)}
                        className="flex-1 h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Check className="w-4 h-4" strokeWidth={2.5} />
                        Accepter
                      </motion.button>
                      <motion.button
                        onClick={() => handleRejectInvite(invite.id)}
                        className="flex-1 h-11 rounded-xl bg-white border border-gray-200 text-gray-600 font-semibold text-sm flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02, borderColor: '#ef4444', color: '#ef4444' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <X className="w-4 h-4" strokeWidth={2.5} />
                        Refuser
                      </motion.button>
                    </div>
                  </motion.div>
                ))}

                {pendingInvites.length === 0 && (
                  <motion.div variants={itemVariants} className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-md flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium">Aucune invitation en attente</p>
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
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-md"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                        {suggestion.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-800 mb-1">
                          {suggestion.name}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                          {suggestion.commonSquads} squad{suggestion.commonSquads > 1 ? 's' : ''} en commun
                        </div>
                      </div>
                      <div className={`text-sm font-bold ${
                        suggestion.reliabilityScore >= 90 ? 'text-emerald-500' :
                        suggestion.reliabilityScore >= 75 ? 'text-indigo-500' :
                        'text-gray-500'
                      }`}>
                        {suggestion.reliabilityScore}%
                      </div>
                    </div>
                    <motion.button
                      onClick={() => handleSendInvite(suggestion.id)}
                      className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <UserPlus className="w-4 h-4" strokeWidth={2} />
                      Ajouter en ami
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default FriendsScreen;
