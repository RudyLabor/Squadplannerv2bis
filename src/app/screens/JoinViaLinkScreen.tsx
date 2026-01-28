/**
 * JoinViaLinkScreen
 *
 * Handles deep link invitations (e.g., squadplanner.app/join/ABC123)
 * Automatically attempts to join the squad using the code from the URL.
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { squadsAPI } from '@/app/services/api';

interface JoinViaLinkScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function JoinViaLinkScreen({ onNavigate, showToast }: JoinViaLinkScreenProps) {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [squadInfo, setSquadInfo] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (code) {
      handleJoin(code);
    } else {
      setStatus('error');
      setErrorMessage('Code d\'invitation manquant');
    }
  }, [code]);

  const handleJoin = async (inviteCode: string) => {
    setStatus('loading');
    try {
      const result = await squadsAPI.join(inviteCode);
      setSquadInfo({ id: result.squad.id, name: result.squad.name });
      setStatus('success');
      showToast(`Bienvenue dans ${result.squad.name} !`, 'success');

      // Redirect after a short delay
      setTimeout(() => {
        onNavigate('squad-detail', { squadId: result.squad.id });
      }, 2000);
    } catch (error: any) {
      console.error('Join via link error:', error);
      setStatus('error');

      if (error.message?.includes('Already a member')) {
        setErrorMessage('Vous êtes déjà membre de cette squad');
      } else if (error.message?.includes('full')) {
        setErrorMessage('Cette squad est complète');
      } else if (error.message?.includes('Invalid')) {
        setErrorMessage('Code d\'invitation invalide ou expiré');
      } else {
        setErrorMessage(error.message || 'Impossible de rejoindre la squad');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--bg-base)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {status === 'loading' && (
          <div className="bg-white rounded-3xl p-10 text-center shadow-xl border-[0.5px] border-[var(--border-subtle)]">
            <div className="w-20 h-20 rounded-full bg-[var(--primary-50)] mx-auto mb-6 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-[var(--primary-500)] animate-spin" strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold text-[var(--fg-primary)] mb-2">
              Rejoindre la squad...
            </h2>
            <p className="text-sm text-[var(--fg-tertiary)]">
              Vérification du code d'invitation
            </p>
            <div className="mt-4 px-4 py-2 bg-[var(--bg-muted)] rounded-xl inline-block">
              <code className="text-sm font-mono text-[var(--fg-secondary)]">
                {code}
              </code>
            </div>
          </div>
        )}

        {status === 'success' && squadInfo && (
          <div className="bg-white rounded-3xl p-10 text-center shadow-xl border-[0.5px] border-[var(--success-200)]">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-20 h-20 rounded-full bg-[var(--success-500)] mx-auto mb-6 flex items-center justify-center"
            >
              <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </motion.div>
            <h2 className="text-xl font-bold text-[var(--fg-primary)] mb-2">
              Bienvenue !
            </h2>
            <p className="text-base text-[var(--fg-secondary)] mb-1">
              Vous avez rejoint
            </p>
            <p className="text-lg font-bold text-[var(--primary-600)]">
              {squadInfo.name}
            </p>
            <p className="text-xs text-[var(--fg-tertiary)] mt-4">
              Redirection en cours...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-white rounded-3xl p-10 text-center shadow-xl border-[0.5px] border-[var(--error-200)]">
            <div className="w-20 h-20 rounded-full bg-[var(--error-50)] mx-auto mb-6 flex items-center justify-center">
              <X className="w-10 h-10 text-[var(--error-500)]" strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold text-[var(--fg-primary)] mb-2">
              Oups !
            </h2>
            <p className="text-sm text-[var(--fg-tertiary)] mb-6">
              {errorMessage}
            </p>
            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={() => onNavigate('join-squad')}
                className="w-full h-12 rounded-xl font-semibold"
              >
                Entrer un code manuellement
              </Button>
              <Button
                variant="ghost"
                onClick={() => onNavigate('home')}
                className="w-full h-12 rounded-xl font-semibold"
              >
                Retour à l'accueil
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default JoinViaLinkScreen;
