import React, { useEffect } from 'react';
import { mockSquads, mockSessions, mockPlayers, mockAchievements, mockBadges, mockFriends, mockChallenges, mockActivities, mockUser } from '@/data/mockData';

/**
 * Wrapper component that provides mock data and default props to screens
 * Used in the Design Doc Gallery to ensure all screens display demo content
 * Suppresses API errors in demo mode
 */

interface ScreenWrapperProps {
  component: React.ComponentType<any>;
  route: string;
}

export function ScreenWrapper({ component: Component, route }: ScreenWrapperProps) {
  // Suppress console errors in demo mode
  useEffect(() => {
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = (...args: any[]) => {
      const message = args[0]?.toString() || '';
      // Suppress API and JWT errors in demo mode
      if (
        message.includes('JWT') ||
        message.includes('Authentication') ||
        message.includes('401') ||
        message.includes('API') ||
        message.includes('Load messages error') ||
        message.includes('Load sessions error') ||
        message.includes('Load squads error')
      ) {
        return;
      }
      originalError(...args);
    };

    console.warn = (...args: any[]) => {
      const message = args[0]?.toString() || '';
      // Suppress auth warnings in demo mode
      if (message.includes('authenticated') || message.includes('Auth')) {
        return;
      }
      originalWarn(...args);
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  // Default props to pass to all screens
  const defaultProps = {
    onNavigate: () => {},
    showToast: () => {},
    onLogin: () => {},
    onLogout: () => {},
    userEmail: mockUser.email,
    userName: mockUser.name,
    isPremium: mockUser.isPremium,
    useMockData: true,
    data: getDataForRoute(route),
  };

  return <Component {...defaultProps} />;
}

// Helper function to provide route-specific mock data
function getDataForRoute(route: string) {
  // Squad-specific routes
  if (route.includes('/squad/') || route.includes('squad-detail')) {
    return {
      squadId: mockSquads[0].id,
      squad: mockSquads[0],
      squadName: mockSquads[0].name,
    };
  }

  // Session-specific routes  
  if (route.includes('/session') || route.includes('check-in')) {
    return {
      sessionId: mockSessions[0].id,
      session: mockSessions[0],
      squadId: mockSquads[0].id,
    };
  }

  // Profile routes
  if (route.includes('/profile/')) {
    return {
      userId: mockPlayers[0].userId,
      user: mockPlayers[0],
    };
  }

  return {};
}