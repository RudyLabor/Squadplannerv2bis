import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked' | 'rejected';
  created_at: string;
  accepted_at?: string;
  friend?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string;
    reliability_score: number;
  };
}

interface FriendRequest {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending';
  created_at: string;
  user?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string;
  };
}

interface FriendsContextType {
  friends: Friend[];
  requests: FriendRequest[];
  loading: boolean;
  error: string | null;
  refreshFriends: () => Promise<void>;
  sendRequest: (friendId: string) => Promise<void>;
  acceptRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
  removeFriend: (friendshipId: string) => Promise<void>;
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

export function FriendsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      refreshFriends();
    } else {
      setFriends([]);
      setRequests([]);
    }
  }, [user]);

  // Real-time subscriptions for friendships
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('friendships_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'friendships',
          filter: `friend_id=eq.${user.id}`,
        },
        (payload: any) => {
          console.log('New friend request:', payload.new);
          // Add to requests if status is pending
          if (payload.new.status === 'pending') {
            setRequests((prev) => [payload.new as FriendRequest, ...prev]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'friendships',
          filter: `user_id=eq.${user.id}`,
        },
        (payload: any) => {
          console.log('Friendship updated:', payload.new);

          if (payload.new.status === 'accepted') {
            // Move from requests to friends
            setRequests((prev) => prev.filter((r) => r.id !== payload.new.id));
            setFriends((prev) => [payload.new as Friend, ...prev]);
          } else if (payload.new.status === 'rejected') {
            // Remove from requests
            setRequests((prev) => prev.filter((r) => r.id !== payload.new.id));
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'friendships',
          filter: `friend_id=eq.${user.id}`,
        },
        (payload: any) => {
          console.log('Friend request updated:', payload.new);

          if (payload.new.status === 'accepted') {
            setRequests((prev) => prev.filter((r) => r.id !== payload.new.id));
            setFriends((prev) => [payload.new as Friend, ...prev]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'friendships',
        },
        (payload: any) => {
          console.log('Friendship deleted:', payload.old.id);
          setFriends((prev) => prev.filter((f) => f.id !== payload.old.id));
          setRequests((prev) => prev.filter((r) => r.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const refreshFriends = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      // Fetch accepted friends
      const { data: friendsData, error: friendsError } = await supabase
        .from('friendships')
        .select('*, friend:users!friend_id(id, username, display_name, avatar_url, reliability_score)')
        .eq('user_id', user.id)
        .eq('status', 'accepted');

      if (friendsError) throw friendsError;
      setFriends((friendsData || []) as unknown as Friend[]);

      // Fetch pending requests (received)
      const { data: requestsData, error: requestsError } = await supabase
        .from('friendships')
        .select('*, user:users!user_id(id, username, display_name, avatar_url)')
        .eq('friend_id', user.id)
        .eq('status', 'pending');

      if (requestsError) throw requestsError;
      setRequests((requestsData || []) as unknown as FriendRequest[]);
    } catch (err: any) {
      console.error('Error fetching friends:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (friendId: string) => {
    if (!user) throw new Error('Not authenticated');

    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: user.id,
          friend_id: friendId,
          status: 'pending',
        });

      if (error) throw error;
    } catch (err: any) {
      console.error('Error sending friend request:', err);
      throw err;
    }
  };

  const acceptRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) throw error;

      // Real-time will handle updating state
    } catch (err: any) {
      console.error('Error accepting friend request:', err);
      throw err;
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;

      // Real-time will handle updating state
    } catch (err: any) {
      console.error('Error rejecting friend request:', err);
      throw err;
    }
  };

  const removeFriend = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);

      if (error) throw error;

      // Real-time will handle updating state
    } catch (err: any) {
      console.error('Error removing friend:', err);
      throw err;
    }
  };

  return (
    <FriendsContext.Provider
      value={{
        friends,
        requests,
        loading,
        error,
        refreshFriends,
        sendRequest,
        acceptRequest,
        rejectRequest,
        removeFriend,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
}

export function useFriends() {
  const context = useContext(FriendsContext);
  if (!context) {
    throw new Error('useFriends must be used within FriendsProvider');
  }
  return context;
}
