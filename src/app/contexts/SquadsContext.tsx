import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { squadsAPI } from '@/app/services/api';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

interface Squad {
  id: string;
  name: string;
  description?: string;
  game: string;
  game_mode?: string;
  owner_id: string;
  invite_code: string;
  is_public: boolean;
  avatar_url?: string;
  max_members: number;
  total_members: number;
  reliability_score: number;
  created_at: string;
  owner?: any;
  members?: any[];
}

interface SquadsContextType {
  squads: Squad[];
  loading: boolean;
  error: string | null;
  currentSquad: Squad | null;
  setCurrentSquad: (squad: Squad | null) => void;
  refreshSquads: () => Promise<void>;
  createSquad: (data: any) => Promise<Squad>;
  joinSquad: (inviteCode: string) => Promise<Squad>;
  leaveSquad: (squadId: string) => Promise<void>;
  updateSquad: (squadId: string, data: any) => Promise<Squad>;
  getSquadById: (squadId: string) => Promise<Squad>;
}

const SquadsContext = createContext<SquadsContextType | undefined>(undefined);

export function SquadsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [squads, setSquads] = useState<Squad[]>([]);
  const [currentSquad, setCurrentSquad] = useState<Squad | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      refreshSquads();
    } else {
      setSquads([]);
    }
  }, [user]);

  // Real-time subscriptions for squads and squad members
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('squads_realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'squads',
        },
        (payload: any) => {
          console.log('Squad updated:', payload.new);
          setSquads((prev) =>
            prev.map((s) => (s.id === payload.new.id ? { ...s, ...payload.new } : s))
          );

          if (currentSquad?.id === payload.new.id) {
            setCurrentSquad((prev) => (prev ? { ...prev, ...payload.new } : null));
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'squad_members',
        },
        (payload: any) => {
          console.log('Squad member changed:', payload);
          // Refresh the affected squad to get updated member count
          const squadId = payload.new?.squad_id || payload.old?.squad_id;
          if (squadId) {
            getSquadById(squadId).catch(console.error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, currentSquad?.id]);

  const refreshSquads = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const { squads: data } = await squadsAPI.getAll();
      setSquads(data);
    } catch (err: any) {
      console.error('Error fetching squads:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createSquad = async (data: any) => {
    try {
      const { squad } = await squadsAPI.create(data);
      setSquads(prev => [squad, ...prev]);
      return squad;
    } catch (err: any) {
      console.error('Error creating squad:', err);
      throw err;
    }
  };

  const joinSquad = async (inviteCode: string) => {
    try {
      const { squad } = await squadsAPI.join(inviteCode);
      setSquads(prev => [squad, ...prev]);
      return squad;
    } catch (err: any) {
      console.error('Error joining squad:', err);
      throw err;
    }
  };

  const leaveSquad = async (squadId: string) => {
    try {
      await squadsAPI.leave(squadId);
      setSquads(prev => prev.filter(s => s.id !== squadId));
      if (currentSquad?.id === squadId) {
        setCurrentSquad(null);
      }
    } catch (err: any) {
      console.error('Error leaving squad:', err);
      throw err;
    }
  };

  const updateSquad = async (squadId: string, data: any) => {
    try {
      const { squad } = await squadsAPI.update(squadId, data);
      setSquads(prev => prev.map(s => s.id === squadId ? squad : s));
      if (currentSquad?.id === squadId) {
        setCurrentSquad(squad);
      }
      return squad;
    } catch (err: any) {
      console.error('Error updating squad:', err);
      throw err;
    }
  };

  const getSquadById = async (squadId: string) => {
    try {
      const { squad } = await squadsAPI.getById(squadId);
      setCurrentSquad(squad);
      return squad;
    } catch (err: any) {
      console.error('Error fetching squad:', err);
      throw err;
    }
  };

  return (
    <SquadsContext.Provider
      value={{
        squads,
        loading,
        error,
        currentSquad,
        setCurrentSquad,
        refreshSquads,
        createSquad,
        joinSquad,
        leaveSquad,
        updateSquad,
        getSquadById,
      }}
    >
      {children}
    </SquadsContext.Provider>
  );
}

export function useSquads() {
  const context = useContext(SquadsContext);
  if (!context) {
    throw new Error('useSquads must be used within SquadsProvider');
  }
  return context;
}
