import { Calendar, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { useGoogleCalendar } from '@/app/hooks/useGoogleCalendar';
import { useUser } from '@/app/contexts/UserContext';

interface GoogleCalendarSyncButtonProps {
  sessionId: string;
  squadId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

/**
 * 🗓️ Google Calendar Sync Button
 * 
 * Synchronize session to Google Calendar with visual feedback
 */
export function GoogleCalendarSyncButton({
  sessionId,
  squadId,
  onSuccess,
  onError,
  className = '',
}: GoogleCalendarSyncButtonProps) {
  const { userProfile: user } = useUser();
  const { syncSessionToCalendar, isSyncing } = useGoogleCalendar();
  const [isSynced, setIsSynced] = useState(false);

  // Check if Google is connected
  const isGoogleConnected = user?.integrations?.google?.connected;

  const handleSync = async () => {
    if (!isGoogleConnected) {
      onError?.('Vous devez connecter Google Calendar dans vos paramètres');
      return;
    }

    try {
      const result = await syncSessionToCalendar(sessionId, squadId);
      setIsSynced(true);
      onSuccess?.();
      
      // Reset after 3 seconds
      setTimeout(() => setIsSynced(false), 3000);
    } catch (error: any) {
      console.error('Sync error:', error);
      onError?.(error.message || 'Erreur lors de la synchronisation');
    }
  };

  if (!isGoogleConnected) {
    return null; // Don't show button if Google not connected
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Button
        variant="ghost"
        onClick={handleSync}
        disabled={isSyncing || isSynced}
        className={`w-full h-11 text-sm font-semibold ${
          isSynced
            ? 'bg-[var(--success-50)] border-[var(--success-300)] text-[var(--success-700)]'
            : 'bg-white border-[var(--border-medium)] hover:border-[var(--primary-500)] hover:bg-[var(--primary-50)]'
        } border-[0.5px] rounded-xl shadow-sm transition-all duration-200 ${className}`}
      >
        {isSyncing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
            Synchronisation...
          </>
        ) : isSynced ? (
          <>
            <Check className="w-4 h-4 text-[var(--success-600)]" strokeWidth={2} />
            Synchronisé !
          </>
        ) : (
          <>
            <Calendar className="w-4 h-4" strokeWidth={2} />
            Ajouter à Google Calendar
          </>
        )}
      </Button>
    </motion.div>
  );
}
