import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { authAPI } from '@/utils/api';

export interface UserProfile {
  id?: string;
  displayName: string;
  username: string;
  email: string;
  bio: string;
  location: string;
  birthday: string;
  favoriteGame: string;
  playStyle: string;
  // availableHours removed as it is not in DB schema
  avatarUrl: string;
  isPremium?: boolean; // ✨ Premium status
  reliabilityScore?: number;
  totalSessions?: number;
  attendedSessions?: number;
  createdAt?: string;
  integrations?: {
    google?: {
      connected: boolean;
      email?: string;
      accessToken?: string;
    };
    discord?: {
      connected: boolean;
      username?: string;
    };
    [key: string]: any;
  };
  notificationSettings?: {
    pushReminder24h?: boolean;
    pushReminder1h?: boolean;
    emailReminder24h?: boolean;
    smartNudges?: boolean;
  };
}

interface UserContextType {
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  refreshProfile: () => Promise<void>;
  isLoadingProfile: boolean;
}

const defaultProfile: UserProfile = {
  displayName: 'Joueur',
  username: '@joueur',
  email: '',
  bio: 'Gamer passionné 🎮',
  location: 'France',
  birthday: '',
  favoriteGame: 'Valorant',
  playStyle: 'Flexible',
  avatarUrl: 'https://images.unsplash.com/photo-1599220274056-a6cdbe06c2c0?w=400',
  reliabilityScore: 100,
  totalSessions: 0,
  attendedSessions: 0,
  notificationSettings: {
    pushReminder24h: true,
    pushReminder1h: true,
    emailReminder24h: false,
    smartNudges: true,
  },
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  
  // Get auth context with safe fallback for hot-reload
  let authContext;
  try {
    authContext = useAuth();
  } catch (error) {
    return (
      <UserContext.Provider
        value={{
          userProfile: defaultProfile,
          updateUserProfile: () => {},
          refreshProfile: async () => {},
          isLoadingProfile: false,
        }}
      >
        {children}
      </UserContext.Provider>
    );
  }
  
  const { user, isAuthenticated } = authContext;
  
  // Load profile from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadProfileFromBackend();
    } else {
      setUserProfile(defaultProfile);
      setIsLoadingProfile(false);
    }
  }, [isAuthenticated, user]);

  const loadProfileFromBackend = async () => {
    setIsLoadingProfile(true);
    try {
      const { supabase } = await import('@/utils/supabase/client');
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        // Use default profile with basic info
        setUserProfile({
          ...defaultProfile,
          email: user?.email || '',
        });
        setIsLoadingProfile(false);
        return;
      }

      try {
        const { profile } = await authAPI.getProfile();
        
        if (profile) {
          setUserProfile({
            id: profile.id,
            displayName: profile.name || defaultProfile.displayName,
            username: `@${profile.name?.toLowerCase().replace(/\s+/g, '')}` || defaultProfile.username,
            email: profile.email || user?.email || '',
            bio: profile.bio || defaultProfile.bio,
            location: profile.location || defaultProfile.location,
            birthday: profile.birthday || defaultProfile.birthday,
            favoriteGame: profile.favoriteGame || defaultProfile.favoriteGame,
            playStyle: profile.playStyle || defaultProfile.playStyle,
            avatarUrl: profile.avatar || defaultProfile.avatarUrl,
            isPremium: profile.isPremium || false,
            reliabilityScore: profile.reliabilityScore || 100,
            totalSessions: profile.totalSessions || 0,
            attendedSessions: profile.attendedSessions || 0,
            createdAt: profile.createdAt,
            integrations: profile.integrations || {},
          });
        } else {
          setUserProfile({
            ...defaultProfile,
            email: user?.email || '',
          });
        }
      } catch (error: any) {
        console.log('⚠️ Profile load failed, using default:', error.message);
        setUserProfile({
          ...defaultProfile,
          email: user?.email || '',
        });
      }
    } catch (error: any) {
      console.error('❌ Error checking session:', error);
      setUserProfile({
        ...defaultProfile,
        email: user?.email || '',
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    const updatedProfile = { ...userProfile, ...updates };
    setUserProfile(updatedProfile);

    if (isAuthenticated) {
      try {
        await authAPI.updateProfile({
          username: updates.displayName || userProfile.displayName,
          bio: updates.bio || userProfile.bio,
          location: updates.location || userProfile.location,
          birthday: updates.birthday || userProfile.birthday,
          favorite_game: updates.favoriteGame || userProfile.favoriteGame,
          play_style: updates.playStyle || userProfile.playStyle,
          avatar_url: updates.avatarUrl || userProfile.avatarUrl,
        });
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  const refreshProfile = async () => {
    if (isAuthenticated) {
      await loadProfileFromBackend();
    }
  };

  return (
    <UserContext.Provider value={{ userProfile, updateUserProfile, refreshProfile, isLoadingProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    if (process.env.NODE_ENV === 'development') {
      return {
        userProfile: {
          id: '',
          email: '',
          displayName: '',
          username: '',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
          bio: '',
          location: '',
          birthday: '',
          favoriteGame: 'Valorant',
          playStyle: 'Balanced',
          createdAt: new Date().toISOString(),
          reliabilityScore: 100,
          sessionsAttended: 0,
          sessionsProposed: 0,
          isPremium: false,
          notificationSettings: {
            pushReminder24h: true,
            pushReminder1h: true,
            emailReminder24h: false,
            smartNudges: true,
          },
          integrations: {
            discord: { connected: false },
            google: { connected: false },
          },
        },
        updateUserProfile: () => {},
        refreshProfile: async () => {},
        isLoadingProfile: false,
      };
    }
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
