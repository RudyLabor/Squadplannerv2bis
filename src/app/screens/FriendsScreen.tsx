import { ArrowLeft, UserPlus, Users, Clock, Check, X, Search, MoreVertical } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

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

  return (
    <div className="min-h-screen pb-24 pt-safe">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => onNavigate('profile')}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Mes Amis
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium mt-1">
              {friends.length} amis · {friends.filter(f => f.isOnline).length} en ligne
            </p>
          </div>
          <button
            onClick={() => showToast('Recherche d\'amis', 'info')}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white flex items-center justify-center shadow-lg shadow-[var(--primary-500)]/20 hover:shadow-xl hover:shadow-[var(--primary-500)]/30 hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] transition-all duration-200"
          >
            <UserPlus className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--fg-tertiary)]" strokeWidth={2} />
            <input
              type="text"
              placeholder="Rechercher un ami..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white border-[0.5px] border-[var(--border-subtle)] text-sm font-medium text-[var(--fg-primary)] placeholder:text-[var(--fg-tertiary)] focus:outline-none focus:border-[var(--primary-500)] focus:ring-2 focus:ring-[var(--primary-100)] shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-[var(--primary-500)] text-white shadow-sm'
                  : 'bg-white text-[var(--fg-secondary)] border-[0.5px] border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === tab.key
                    ? 'bg-white/20'
                    : 'bg-[var(--primary-50)] text-[var(--primary-500)]'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Friends List */}
        {activeTab === 'friends' && (
          <div className="space-y-3">
            {friends.map((friend, index) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar with Online Status */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] flex items-center justify-center text-white font-bold text-lg">
                      {friend.name[0]}
                    </div>
                    {friend.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[var(--success-500)] rounded-full border-2 border-white" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                      {friend.name}
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      {friend.isOnline ? (
                        <span className="text-[var(--success-500)] font-semibold">En ligne</span>
                      ) : (
                        <span className="text-[var(--fg-tertiary)] font-medium">{friend.lastSeen}</span>
                      )}
                      <span className="text-[var(--fg-tertiary)] font-medium">
                        {friend.commonSquads} squad{friend.commonSquads > 1 ? 's' : ''} commune{friend.commonSquads > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Reliability Score */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <div className={`text-sm font-bold ${
                        friend.reliabilityScore >= 90 ? 'text-[var(--success-500)]' :
                        friend.reliabilityScore >= 75 ? 'text-[var(--primary-500)]' :
                        'text-[var(--fg-secondary)]'
                      }`}>
                        {friend.reliabilityScore}
                      </div>
                      <div className="text-[10px] text-[var(--fg-tertiary)] font-medium">
                        fiabilité
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFriend(friend.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--error-50)] text-[var(--fg-tertiary)] hover:text-[var(--error-500)] transition-all"
                    >
                      <MoreVertical className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pending Invitations */}
        {activeTab === 'pending' && (
          <div className="space-y-3">
            {pendingInvites.map((invite, index) => (
              <motion.div
                key={invite.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {invite.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                      {invite.name}
                    </div>
                    <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                      {invite.mutualFriends} ami{invite.mutualFriends > 1 ? 's' : ''} en commun · {invite.sentAt}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptInvite(invite.id)}
                    className="flex-1 h-10 rounded-xl bg-[var(--success-500)] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[var(--success-600)] transition-all shadow-sm"
                  >
                    <Check className="w-4 h-4" strokeWidth={2} />
                    Accepter
                  </button>
                  <button
                    onClick={() => handleRejectInvite(invite.id)}
                    className="flex-1 h-10 rounded-xl bg-white border-[0.5px] border-[var(--border-medium)] text-[var(--fg-secondary)] font-semibold text-sm flex items-center justify-center gap-2 hover:border-[var(--error-500)] hover:text-[var(--error-500)] transition-all"
                  >
                    <X className="w-4 h-4" strokeWidth={2} />
                    Refuser
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Suggestions */}
        {activeTab === 'suggestions' && (
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {suggestion.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                      {suggestion.name}
                    </div>
                    <div className="text-xs text-[var(--fg-tertiary)] font-medium">
                      {suggestion.commonSquads} squad{suggestion.commonSquads > 1 ? 's' : ''} commune{suggestion.commonSquads > 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${
                    suggestion.reliabilityScore >= 90 ? 'text-[var(--success-500)]' :
                    suggestion.reliabilityScore >= 75 ? 'text-[var(--primary-500)]' :
                    'text-[var(--fg-secondary)]'
                  }`}>
                    {suggestion.reliabilityScore}
                  </div>
                </div>
                <button
                  onClick={() => handleSendInvite(suggestion.id)}
                  className="w-full h-10 rounded-xl bg-[var(--primary-500)] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[var(--primary-600)] transition-all shadow-sm"
                >
                  <UserPlus className="w-4 h-4" strokeWidth={2} />
                  Ajouter en ami
                </button>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
export default FriendsScreen;
