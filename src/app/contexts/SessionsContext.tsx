import React, { createContext, useContext, useState, ReactNode } from 'react';
import { sessionsAPI, squadsAPI } from '@/app/services/api';
import { useAuth } from './AuthContext';

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

  const getSquadSessions = async (squadId: string, status?: 'upcoming' | 'past' | 'all') => {
    setLoading(true);
    setError(null);
    try {
      const { sessions: data } = await squadsAPI.getSessions(squadId, status);
      setSessions(data);
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
      setSessions(prev => [session, ...prev]);
      return session;
    } catch (err: any) {
      console.error('Error creating session:', err);
      throw err;
    }
  };

  const updateSession = async (sessionId: string, data: any) => {
    try {
      const { session } = await sessionsAPI.update(sessionId, data);
      setSessions(prev => prev.map(s => s.id === sessionId ? session : s));
      if (currentSession?.id === sessionId) {
        setCurrentSession(session);
      }
      return session;
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
      setSessions(prev => prev.map(s => s.id === sessionId ? session : s));
      if (currentSession?.id === sessionId) {
        setCurrentSession(session);
      }
    } catch (err: any) {
      console.error('Error responding to session:', err);
      throw err;
    }
  };

  const getSessionById = async (sessionId: string) => {
    try {
      const { session } = await sessionsAPI.getById(sessionId);
      setCurrentSession(session);
      return session;
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
