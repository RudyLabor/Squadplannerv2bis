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
  availableHours: string;
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
  availableHours: '19:00 - 23:00',
  avatarUrl: 'https://images.unsplash.com/photo-1599220274056-a6cdbe06c2c0?w=400',
  reliabilityScore: 100,
  totalSessions: 0,
  attendedSessions: 0,
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
    // During hot-reload, the auth context might not be available yet
    // Return a minimal working context to prevent crashes
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
      // Reset to default if not authenticated
      setUserProfile(defaultProfile);
      setIsLoadingProfile(false); // ✅ Stop loading if not authenticated
    }
  }, [isAuthenticated, user]);

  const loadProfileFromBackend = async () => {
    setIsLoadingProfile(true);
    try {
      // Double-check that we have a valid session before making the API call
      const { getSupabase } = await import('@/utils/supabase/client');
      const supabase = getSupabase();
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.log('⚠️ No valid session found, using default profile');
        // Use default profile with basic info
        setUserProfile({
          ...defaultProfile,
          email: user?.email || '',
        });
        setIsLoadingProfile(false);
        return;
      }

      console.log('📥 Loading profile from backend with valid session');
      
      try {
        const { profile } = await authAPI.getProfile();
        
        if (profile) {
          console.log('✅ Profile loaded successfully:', profile.id);
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
            availableHours: profile.availableHours || defaultProfile.availableHours,
            avatarUrl: profile.avatar || defaultProfile.avatarUrl,
            isPremium: profile.isPremium || false, // ✨ Premium status
            reliabilityScore: profile.reliabilityScore || 100,
            totalSessions: profile.totalSessions || 0,
            attendedSessions: profile.attendedSessions || 0,
            createdAt: profile.createdAt,
            integrations: profile.integrations || {}, // ✅ Integrations from backend
          });
        } else {
          console.log('⚠️ No profile returned, using default');
          // Use default profile but keep user email
          setUserProfile({
            ...defaultProfile,
            email: user?.email || '',
          });
        }
      } catch (error: any) {
        console.log('⚠️ Profile load failed, using default:', error.message);
        // If profile load fails, use default but don't throw error
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

    // Also update on backend if authenticated
    if (isAuthenticated) {
      try {
        await authAPI.updateProfile({
          name: updates.displayName || userProfile.displayName,
          bio: updates.bio || userProfile.bio,
          location: updates.location || userProfile.location,
          birthday: updates.birthday || userProfile.birthday,
          favoriteGame: updates.favoriteGame || userProfile.favoriteGame,
          playStyle: updates.playStyle || userProfile.playStyle,
          availableHours: updates.availableHours || userProfile.availableHours,
          avatar: updates.avatarUrl || userProfile.avatarUrl,
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
    // During hot-reload, the context might not be available yet
    if (process.env.NODE_ENV === 'development') {
      // Don't log warning - this is normal during hot-reload
      // Return a default context to prevent crashes during development
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
          availableHours: '20:00 - 00:00',
          createdAt: new Date().toISOString(),
          reliabilityScore: 100,
          sessionsAttended: 0,
          sessionsProposed: 0,
          isPremium: false,
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