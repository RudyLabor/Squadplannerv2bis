import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { squadsAPI } from '@/app/services/api';
import { useAuth } from './AuthContext';
import { supabase, initializeSession } from '@/lib/supabase';

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
  getSquadById: (squadId: string) => Promise<Squad | null>;
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
  // NOTE: Ne PAS inclure currentSquad dans les deps pour éviter les re-subscriptions infinies
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
          console.log('[Squads] Squad updated:', payload.new.id);
          setSquads((prev) =>
            prev.map((s) => (s.id === payload.new.id ? { ...s, ...payload.new } : s))
          );

          // Mise à jour de currentSquad via callback pour éviter les dépendances
          setCurrentSquad((prev) =>
            prev?.id === payload.new.id ? { ...prev, ...payload.new } : prev
          );
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
          console.log('[Squads] Squad member changed:', payload.eventType);
          // NE PAS appeler getSquadById ici pour éviter les boucles !
          // Les membres seront mis à jour au prochain chargement explicite
          const squadId = payload.new?.squad_id || payload.old?.squad_id;
          if (squadId) {
            // Marquer le squad comme nécessitant un rafraîchissement
            setSquads((prev) =>
              prev.map((s) => (s.id === squadId ? { ...s, _membersUpdated: Date.now() } : s))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]); // IMPORTANT: Ne PAS inclure currentSquad ou getSquadById

  const refreshSquads = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      // S'assurer que la session Supabase est initialisée avant les requêtes
      await initializeSession();

      const { squads: data } = await squadsAPI.getAll();
      setSquads(data as unknown as Squad[]);
    } catch (err: any) {
      console.error('Error fetching squads:', err);

      // Si erreur 401 ou "Not authenticated", le token est invalide
      // On met quand même loading à false pour éviter le timeout
      if (err.message?.includes('401') || err.message?.includes('Not authenticated')) {
        console.warn('[Squads] Token invalide, session expirée');
        setSquads([]); // Retourner une liste vide
      }

      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createSquad = async (data: any) => {
    try {
      const { squad } = await squadsAPI.create(data);
      const typedSquad = squad as unknown as Squad;
      setSquads(prev => [typedSquad, ...prev]);
      return typedSquad;
    } catch (err: any) {
      console.error('Error creating squad:', err);
      throw err;
    }
  };

  const joinSquad = async (inviteCode: string) => {
    try {
      const { squad } = await squadsAPI.join(inviteCode);
      const typedSquad = squad as unknown as Squad;
      setSquads(prev => [typedSquad, ...prev]);
      return typedSquad;
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
      const typedSquad = squad as unknown as Squad;
      setSquads(prev => prev.map(s => s.id === squadId ? typedSquad : s));
      if (currentSquad?.id === squadId) {
        setCurrentSquad(typedSquad);
      }
      return typedSquad;
    } catch (err: any) {
      console.error('Error updating squad:', err);
      throw err;
    }
  };

  const getSquadById = async (squadId: string): Promise<Squad | null> => {
    try {
      // Vérifier d'abord le cache local
      const cachedSquad = squads.find(s => s.id === squadId);
      if (cachedSquad) {
        console.log('[Squads] Squad trouvée dans le cache:', squadId);
        setCurrentSquad(cachedSquad);
        return cachedSquad;
      }

      // Appeler l'API
      console.log('[Squads] Chargement squad depuis API:', squadId);
      const { squad } = await squadsAPI.getById(squadId);

      if (!squad) {
        console.warn('[Squads] Squad non trouvée pour ID:', squadId);
        return null;
      }

      const typedSquad = squad as unknown as Squad;
      setCurrentSquad(typedSquad);

      // Ajouter au cache local si pas présent
      setSquads(prev => {
        const exists = prev.some(s => s.id === squadId);
        return exists ? prev : [...prev, typedSquad];
      });

      return typedSquad;
    } catch (err: any) {
      console.error('[Squads] Error fetching squad:', err);
      // Retourner null au lieu de throw pour un affichage gracieux
      return null;
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
