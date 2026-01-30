/**
 * SQUAD CHAT SCREEN - LINEAR DESIGN SYSTEM
 * Premium, Dark, Minimal - Real-time messaging
 */

import { ArrowLeft, Send, Smile, MessageCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useHaptic } from '@/app/hooks/useHaptic';
import { squadsAPI } from '@/utils/api';
import { mockMessages } from '@/data/mockData';

interface SquadChatScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  useMockData?: boolean;
  data?: {
    squadId?: string;
    squadName?: string;
  };
}

interface Message {
  id: string;
  squadId?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  type?: 'text' | 'system' | 'session_created';
  timestamp: string;
  reactions?: Array<{
    userId: string;
    userName: string;
    emoji: string;
  }>;
  isCurrentUser?: boolean;
}

export function SquadChatScreen({
  onNavigate,
  showToast,
  useMockData,
  data,
}: SquadChatScreenProps) {
  const squadId = data?.squadId || 'squad-1';
  const squadName = data?.squadName || 'Les Conquerants';

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { selection } = useHaptic();

  useEffect(() => {
    if (useMockData === true) {
      setMessages(mockMessages);
      setTimeout(scrollToBottom, 100);
      return;
    }

    if (useMockData === false && squadId) {
      loadMessages();
    }
  }, [squadId, useMockData]);

  const loadMessages = async () => {
    if (useMockData) return;

    try {
      const api = squadsAPI as any;
      if (typeof api.getMessages === 'function') {
        const { messages: loadedMessages } = await api.getMessages(squadId);
        setMessages(loadedMessages || []);
        setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      console.error('Load messages error:', error);
    }
  };

  const currentUserId = 'user-1';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    selection();

    if (useMockData) {
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        userId: currentUserId,
        userName: 'Vous',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
        content: newMessage.trim(),
        type: 'text',
        timestamp: new Date().toISOString(),
        reactions: [],
        isCurrentUser: true
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
      showToast('Message envoye', 'success');
      return;
    }

    setIsLoading(true);

    try {
      const api = squadsAPI as any;
      if (typeof api.sendMessage === 'function') {
        const { message: sentMessage } = await api.sendMessage(squadId, newMessage.trim());
        setMessages([...messages, sentMessage]);
        setNewMessage('');
        showToast('Message envoye', 'success');
      } else {
        showToast('Fonctionnalite en developpement', 'info');
      }
    } catch (error: any) {
      console.error('Send message error:', error);
      showToast(error.message || 'Erreur lors de l\'envoi', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    selection();
    setMessages(messages.map(msg => {
      if (msg.id !== messageId) return msg;

      const existingReaction = msg.reactions?.find(
        r => r.userId === currentUserId && r.emoji === emoji
      );

      if (existingReaction) {
        return {
          ...msg,
          reactions: msg.reactions?.filter(
            r => !(r.userId === currentUserId && r.emoji === emoji)
          ),
        };
      } else {
        return {
          ...msg,
          reactions: [
            ...msg.reactions || [],
            { userId: currentUserId, userName: 'RudyFourcade', emoji },
          ],
        };
      }
    }));
    setShowEmojiPicker(null);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);

    if (hours < 1) {
      const mins = Math.floor(diff / 60000);
      return `${mins}min`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  const quickEmojis = ['👍', '❤️', '🔥', '😂', '🎮', '✅'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0e0f11]">
      {/* Header */}
      <div className="px-4 py-4 bg-[#141518] border-b border-[#1e2024] flex-shrink-0">
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => onNavigate('squad-detail', { id: squadId })}
            className="w-10 h-10 rounded-xl bg-[#1e2024] flex items-center justify-center text-[#8b8d93] hover:text-[#ececed] transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-[16px] font-semibold text-[#ececed]">
              {squadName}
            </h1>
            <p className="text-[12px] text-[#6f7177]">
              Chat de squad
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#5e6ad2] flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => {
            const isOwnMessage = message.userId === currentUserId;
            const isSystemMessage = message.type !== 'text';
            const showAvatar = !isOwnMessage && !isSystemMessage &&
              (index === 0 || messages[index - 1].userId !== message.userId);

            if (isSystemMessage) {
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <div className="bg-[#1e2024] rounded-lg px-3 py-1.5 max-w-[85%]">
                    <p className="text-[12px] text-[#6f7177] text-center">
                      {message.content}
                    </p>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                {showAvatar && !isOwnMessage && (
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-[#1e2024]">
                    <ImageWithFallback
                      src={message.userAvatar}
                      alt={message.userName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {!showAvatar && !isOwnMessage && <div className="w-8" />}

                <div className={`flex flex-col gap-1 max-w-[75%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                  {/* Message bubble */}
                  <div className="relative group">
                    <motion.div
                      className={`rounded-xl px-4 py-2.5 ${
                        isOwnMessage
                          ? 'bg-[#5e6ad2] text-white'
                          : 'bg-[#1e2024] text-[#ececed]'
                      }`}
                      whileHover={{ scale: 1.01 }}
                    >
                      {!isOwnMessage && showAvatar && (
                        <p className="text-[11px] font-medium mb-1 text-[#5e6ad2]">
                          {message.userName}
                        </p>
                      )}
                      <p className="text-[14px] leading-relaxed break-words">
                        {message.content}
                      </p>
                    </motion.div>

                    {/* Quick react button */}
                    <motion.button
                      onClick={() => setShowEmojiPicker(showEmojiPicker === message.id ? null : message.id)}
                      className={`absolute ${isOwnMessage ? 'left-0 -translate-x-9' : 'right-0 translate-x-9'} top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-[#141518] border border-[#1e2024] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Smile className="w-4 h-4 text-[#6f7177]" strokeWidth={1.5} />
                    </motion.button>
                  </div>

                  {/* Emoji picker */}
                  <AnimatePresence>
                    {showEmojiPicker === message.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -5 }}
                        className="bg-[#141518] border border-[#1e2024] rounded-xl p-2 flex gap-1"
                      >
                        {quickEmojis.map(emoji => (
                          <motion.button
                            key={emoji}
                            onClick={() => handleReaction(message.id, emoji)}
                            className="w-8 h-8 rounded-lg hover:bg-[#1e2024] transition-all flex items-center justify-center text-lg"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {emoji}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Reactions */}
                  {(message.reactions?.length ?? 0) > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {Object.entries(
                        (message.reactions || []).reduce((acc, r) => {
                          acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([emoji, count]) => (
                        <motion.button
                          key={emoji}
                          onClick={() => handleReaction(message.id, emoji)}
                          className={`px-2 py-0.5 rounded-md text-[12px] flex items-center gap-1 transition-all ${
                            (message.reactions || []).some(r => r.userId === currentUserId && r.emoji === emoji)
                              ? 'bg-[#5e6ad2]/20 border border-[#5e6ad2]'
                              : 'bg-[#1e2024] border border-[#26282d] hover:border-[#5e6ad2]'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>{emoji}</span>
                          <span className="text-[#8b8d93] font-medium">{count}</span>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  <p className="text-[11px] text-[#4a4b50] px-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 bg-[#141518] border-t border-[#1e2024] flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Votre message..."
            className="flex-1 h-12 px-4 rounded-xl bg-[#0e0f11] border border-[#1e2024] text-[14px] text-[#ececed] placeholder:text-[#4a4b50] focus:border-[#5e6ad2] focus:outline-none transition-all"
          />

          <motion.button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isLoading}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
              newMessage.trim() && !isLoading
                ? 'bg-[#5e6ad2] text-white'
                : 'bg-[#1e2024] text-[#4a4b50] cursor-not-allowed'
            }`}
            whileHover={newMessage.trim() && !isLoading ? { scale: 1.02 } : {}}
            whileTap={newMessage.trim() && !isLoading ? { scale: 0.98 } : {}}
          >
            <Send className="w-5 h-5" strokeWidth={1.5} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default SquadChatScreen;
