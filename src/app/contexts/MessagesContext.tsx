import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { messagesAPI, squadsAPI } from '@/app/services/api';
import { useAuth } from './AuthContext';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

interface Message {
  id: string;
  squad_id: string;
  user_id: string;
  content: string;
  type: 'text' | 'system' | 'image' | 'file';
  created_at: string;
  user?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string;
  };
}

interface MessagesContextType {
  messages: Message[];
  loading: boolean;
  loadMessages: (squadId: string, limit?: number) => Promise<void>;
  sendMessage: (squadId: string, content: string, type?: string) => Promise<void>;
  clearMessages: () => void;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export function MessagesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentSquadId, setCurrentSquadId] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (currentSquadId) {
      unsubscribe = subscribeToMessages(currentSquadId);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentSquadId]);

  const loadMessages = async (squadId: string, limit = 50) => {
    setLoading(true);
    setCurrentSquadId(squadId);
    try {
      const response = await squadsAPI.getMessages(squadId, limit);
      // Assuming response structure matches user expectation or adapting if needed.
      // User code: const { messages: data } = ...
      setMessages(response.messages || []); // Adaptive check
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (squadId: string, content: string, type = 'text') => {
    try {
      await messagesAPI.send({ squadId, content, type: type as 'text' | 'system' | 'image' | 'file' });
      // Message added via realtime
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const subscribeToMessages = (squadId: string) => {
    const channel = supabase
      .channel(`messages:${squadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `squad_id=eq.${squadId}`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };


  const clearMessages = () => {
    setMessages([]);
    setCurrentSquadId(null);
  };

  return (
    <MessagesContext.Provider
      value={{
        messages,
        loading,
        loadMessages,
        sendMessage,
        clearMessages,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within MessagesProvider');
  }
  return context;
}
