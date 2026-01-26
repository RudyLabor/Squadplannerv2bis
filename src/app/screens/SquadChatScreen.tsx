import { ArrowLeft, Send, Smile, Plus, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
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
  const squadName = data?.squadName || 'Les Conquérants';
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { selection } = useHaptic();

  // Load messages from backend or use mock data
  useEffect(() => {
    // Mode démo: charger les mocks immédiatement
    if (useMockData === true) {
      setMessages(mockMessages);
      setTimeout(scrollToBottom, 100);
      return;
    }
    
    // Mode production: charger depuis l'API uniquement si useMockData est explicitement false
    if (useMockData === false && squadId) {
      loadMessages();
    }
    
    // Si useMockData est undefined, ne rien faire (attendre qu'il soit défini)
  }, [squadId, useMockData]);

  const loadMessages = async () => {
    // Protection supplémentaire: ne jamais charger en mode mock
    if (useMockData) {
      return;
    }
    
    try {
      const { messages: loadedMessages } = await squadsAPI.getMessages(squadId);
      setMessages(loadedMessages || []);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Load messages error:', error);
      // Keep empty messages on error
    }
  };

  const currentUserId = 'user-1'; // Mock - would come from auth

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    selection();
    
    // En mode démo, simuler l'envoi sans appel API
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
      showToast('Message envoyé', 'success');
      return;
    }
    
    // Mode production: envoyer via API
    setIsLoading(true);

    try {
      const { message: sentMessage } = await squadsAPI.sendMessage(squadId, newMessage.trim());
      setMessages([...messages, sentMessage]);
      setNewMessage('');
      showToast('Message envoyé', 'success');
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
        // Remove reaction
        return {
          ...msg,
          reactions: msg.reactions?.filter(
            r => !(r.userId === currentUserId && r.emoji === emoji)
          ),
        };
      } else {
        // Add reaction
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
      return `Il y a ${mins}min`;
    } else if (hours < 24) {
      return `Il y a ${hours}h`;
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  const quickEmojis = ['👍', '❤️', '🔥', '😂', '🎮', '✅'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-0 pt-safe flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 bg-white border-b-[0.5px] border-[var(--border-subtle)] flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('squad-detail', { id: squadId })}
            className="w-10 h-10 rounded-2xl bg-[var(--bg-base)] border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-[var(--fg-primary)] tracking-tight">
              {squadName}
            </h1>
            <p className="text-xs text-[var(--fg-tertiary)]">
              Chat de squad
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
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
                  <div className="bg-[var(--bg-muted)] rounded-2xl px-4 py-2 max-w-[85%]">
                    <p className="text-xs text-[var(--fg-tertiary)] text-center">
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
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white">
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
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        isOwnMessage
                          ? 'bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white shadow-md'
                          : 'bg-white border-[0.5px] border-[var(--border-subtle)] text-[var(--fg-primary)]'
                      }`}
                    >
                      {!isOwnMessage && showAvatar && (
                        <p className="text-xs font-semibold mb-1 opacity-70">
                          {message.userName}
                        </p>
                      )}
                      <p className="text-sm leading-relaxed break-words">
                        {message.content}
                      </p>
                    </div>

                    {/* Quick react button */}
                    <button
                      onClick={() => setShowEmojiPicker(showEmojiPicker === message.id ? null : message.id)}
                      className={`absolute ${isOwnMessage ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 ${isOwnMessage ? '-translate-x-10' : 'translate-x-10'} w-7 h-7 rounded-full bg-white border-[0.5px] border-[var(--border-medium)] shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110`}
                    >
                      <Smile className="w-4 h-4 text-[var(--fg-tertiary)]" strokeWidth={2} />
                    </button>
                  </div>

                  {/* Emoji picker */}
                  <AnimatePresence>
                    {showEmojiPicker === message.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -5 }}
                        className="bg-white rounded-2xl shadow-lg border-[0.5px] border-[var(--border-subtle)] p-2 flex gap-1"
                      >
                        {quickEmojis.map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleReaction(message.id, emoji)}
                            className="w-9 h-9 rounded-xl hover:bg-[var(--bg-muted)] transition-all flex items-center justify-center text-lg"
                          >
                            {emoji}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Reactions */}
                  {message.reactions?.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {Object.entries(
                        message.reactions.reduce((acc, r) => {
                          acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([emoji, count]) => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(message.id, emoji)}
                          className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 transition-all ${
                            message.reactions.some(r => r.userId === currentUserId && r.emoji === emoji)
                              ? 'bg-[var(--primary-100)] border-[0.5px] border-[var(--primary-500)]'
                              : 'bg-[var(--bg-muted)] border-[0.5px] border-transparent hover:border-[var(--border-medium)]'
                          }`}
                        >
                          <span>{emoji}</span>
                          <span className="text-[var(--fg-secondary)] font-medium">{count}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  <p className="text-xs text-[var(--fg-tertiary)] px-1">
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
      <div className="px-4 py-4 bg-white border-t-[0.5px] border-[var(--border-subtle)] flex-shrink-0 pb-safe">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Votre message..."
              className="rounded-2xl resize-none"
              rows={1}
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isLoading}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 flex-shrink-0 shadow-lg ${
              newMessage.trim() && !isLoading
                ? 'bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] text-white shadow-[var(--primary-500)]/20 hover:shadow-xl hover:shadow-[var(--primary-500)]/30 active:scale-95'
                : 'bg-[var(--bg-muted)] text-[var(--fg-tertiary)] cursor-not-allowed shadow-none'
            }`}
          >
            <Send className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}