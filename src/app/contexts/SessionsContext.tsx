// @ts-nocheck
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { sessionsAPI, squadsAPI } from '@/app/services/api';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

interface Session {
  id: string;
  squad_id: string;
  title: string;
  description?: string;
  scheduled_date: string;
  scheduled_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  required_players: number;
  proposed_by?: string;
  rsvps?: any[];
}

interface SessionsContextType {
  sessions: Session[];
  loading: boolean;
  error: string | null;
  currentSession: Session | null;
  setCurrentSession: (session: Session | null) => void;
  getSquadSessions: (squadId: string, status?: 'upcoming' | 'past' | 'all') => Promise<void>;
  createSession: (data: any) => Promise<Session>;
  updateSession: (sessionId: string, data: any) => Promise<Session>;
  rsvpToSession: (sessionId: string, response: 'yes' | 'no' | 'maybe', notes?: string) => Promise<void>;
  getSessionById: (sessionId: string) => Promise<Session>;
}

const SessionsContext = createContext<SessionsContextType | undefined>(undefined);

export function SessionsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Real-time subscriptions for sessions and RSVPs
  // NOTE: Ne PAS inclure currentSession dans les deps pour éviter les re-subscriptions infinies
  useEffect(() => {
    if (!user) return;

    // Subscribe to session updates
    const channel = supabase
      .channel('sessions_realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
        },
        (payload) => {
          console.log('[Sessions] Session updated:', payload.new.id);
          setSessions((prev) =>
            prev.map((s) => (s.id === payload.new.id ? { ...s, ...payload.new } : s))
          );

          // Mise à jour de currentSession via callback pour éviter les dépendances
          setCurrentSession((prev) =>
            prev?.id === payload.new.id ? { ...prev, ...payload.new } : prev
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sessions',
        },
        (payload) => {
          console.log('[Sessions] New session created:', payload.new.id);
          setSessions((prev) => [payload.new as Session, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'sessions',
        },
        (payload) => {
          console.log('[Sessions] Session deleted:', payload.old.id);
          setSessions((prev) => prev.filter((s) => s.id !== payload.old.id));

          setCurrentSession((prev) => prev?.id === payload.old.id ? null : prev);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_rsvps',
        },
        (payload: any) => {
          console.log('[Sessions] RSVP changed:', payload.eventType);
          // NE PAS appeler getSessionById ici pour éviter les boucles !
          // Les RSVPs seront mis à jour au prochain chargement explicite
          // Ou utiliser un rafraîchissement silencieux sans mettre à jour currentSession
          const sessionId = payload.new?.session_id || payload.old?.session_id;
          if (sessionId) {
            // Marquer la session comme nécessitant un rafraîchissement
            // mais ne pas déclencher de requête API automatique
            setSessions((prev) =>
              prev.map((s) => (s.id === sessionId ? { ...s, _rsvpUpdated: Date.now() } : s))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]); // IMPORTANT: Ne PAS inclure currentSession ou getSessionById

  const getSquadSessions = async (squadId: string, status?: 'upcoming' | 'past' | 'all') => {
    setLoading(true);
    setError(null);
    try {
      const { sessions: data } = await squadsAPI.getSessions(squadId, status);
      setSessions(data as unknown as Session[]);
    } catch (err: any) {
      console.error('Error fetching sessions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (data: any) => {
    try {
      const { session } = await sessionsAPI.create(data);
      const typedSession = session as unknown as Session;
      setSessions(prev => [typedSession, ...prev]);
      return typedSession;
    } catch (err: any) {
      console.error('Error creating session:', err);
      throw err;
    }
  };

  const updateSession = async (sessionId: string, data: any) => {
    try {
      const { session } = await sessionsAPI.update(sessionId, data);
      const typedSession = session as unknown as Session;
      setSessions(prev => prev.map(s => s.id === sessionId ? typedSession : s));
      if (currentSession?.id === sessionId) {
        setCurrentSession(typedSession);
      }
      return typedSession;
    } catch (err: any) {
      console.error('Error updating session:', err);
      throw err;
    }
  };

  const rsvpToSession = async (sessionId: string, response: 'yes' | 'no' | 'maybe', notes?: string) => {
    try {
      await sessionsAPI.rsvp(sessionId, response, notes);
      // Rafraîchir la session pour obtenir les RSVPs mis à jour
      const { session } = await sessionsAPI.getById(sessionId);
      const typedSession = session as unknown as Session;
      setSessions(prev => prev.map(s => s.id === sessionId ? typedSession : s));
      if (currentSession?.id === sessionId) {
        setCurrentSession(typedSession);
      }
    } catch (err: any) {
      console.error('Error responding to session:', err);
      throw err;
    }
  };

  const getSessionById = async (sessionId: string) => {
    try {
      const { session } = await sessionsAPI.getById(sessionId);
      const typedSession = session as unknown as Session;
      setCurrentSession(typedSession);
      return typedSession;
    } catch (err: any) {
      console.error('Error fetching session:', err);
      throw err;
    }
  };

  return (
    <SessionsContext.Provider
      value={{
        sessions,
        loading,
        error,
        currentSession,
        setCurrentSession,
        getSquadSessions,
        createSession,
        updateSession,
        rsvpToSession,
        getSessionById,
      }}
    >
      {children}
    </SessionsContext.Provider>
  );
}

export function useSessions() {
  const context = useContext(SessionsContext);
  if (!context) {
    throw new Error('useSessions must be used within SessionsProvider');
  }
  return context;
}
