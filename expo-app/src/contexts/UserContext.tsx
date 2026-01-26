import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../utils/api';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isPremium: boolean;
  reliabilityScore: number;
  level: number;
  xp: number;
}

interface UserContextType {
  userProfile: UserProfile | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  userProfile: null,
  isLoading: true,
  refreshProfile: async () => {},
  updateProfile: async () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, accessToken, isAuthenticated } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = async () => {
    if (!accessToken) {
      setUserProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await api.getProfile(accessToken);
      if (data.profile) {
        setUserProfile(data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!accessToken || !user) return;

    try {
      const result = await api.updateProfile(accessToken, user.id, data);
      if (result.success) {
        await refreshProfile();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      refreshProfile();
    } else {
      setUserProfile(null);
      setIsLoading(false);
    }
  }, [isAuthenticated, accessToken]);

  return (
    <UserContext.Provider value={{ userProfile, isLoading, refreshProfile, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};
