import { useState } from 'react';
import { projectId } from '/utils/supabase/info';
import { useAuth } from '@/app/contexts/AuthContext';

export function useGoogleCalendar() {
  const [isSyncing, setIsSyncing] = useState(false);
  const { getAccessToken } = useAuth();

  /**
   * Sync a session to Google Calendar
   */
  const syncSessionToCalendar = async (sessionId: string, squadId: string) => {
    setIsSyncing(true);
    try {
      const token = await getAccessToken();
      
      if (!token) {
        throw new Error('Non connecté');
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e884809f/calendar/sync`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ sessionId, squadId }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur de synchronisation');
      }

      const data = await response.json();
      console.log('✅ Session synced to Google Calendar:', data);
      
      return data;
    } catch (error: any) {
      console.error('❌ Sync calendar error:', error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * List upcoming Google Calendar events
   */
  const listCalendarEvents = async () => {
    try {
      const token = await getAccessToken();
      
      if (!token) {
        throw new Error('Non connecté');
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e884809f/calendar/events`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur de récupération');
      }

      const data = await response.json();
      return data.events;
    } catch (error: any) {
      console.error('❌ List calendar events error:', error);
      throw error;
    }
  };

  /**
   * Check free/busy slots
   */
  const checkFreeBusy = async (timeMin: string, timeMax: string) => {
    try {
      const token = await getAccessToken();
      
      if (!token) {
        throw new Error('Non connecté');
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e884809f/calendar/freebusy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ timeMin, timeMax }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur de vérification');
      }

      const data = await response.json();
      return data.freeBusy;
    } catch (error: any) {
      console.error('❌ Check free/busy error:', error);
      throw error;
    }
  };

  return {
    syncSessionToCalendar,
    listCalendarEvents,
    checkFreeBusy,
    isSyncing,
  };
}
