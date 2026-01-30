/**
 * JoinViaLinkScreen - Premium UI
 * Handles deep link invitations (e.g., squadplanner.app/join/ABC123)
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Check, X } from 'lucide-react';
import { squadsAPI } from '@/app/services/api';
import { Button, Card } from '@/design-system';

interface JoinViaLinkScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function JoinViaLinkScreen({ onNavigate, showToast }: JoinViaLinkScreenProps) {
  const { code } = useParams<{ code: string }>();
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

      setTimeout(() => {
        onNavigate('squad-detail', { squadId: result.squad.id });
      }, 2000);
    } catch (error: any) {
      console.error('Join via link error:', error);
      setStatus('error');

      if (error.message?.includes('Already a member')) {
        setErrorMessage('Vous etes deja membre de cette squad');
      } else if (error.message?.includes('full')) {
        setErrorMessage('Cette squad est complete');
      } else if (error.message?.includes('Invalid')) {
        setErrorMessage('Code d\'invitation invalide ou expire');
      } else {
        setErrorMessage(error.message || 'Impossible de rejoindre la squad');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[var(--color-primary-50)] via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[var(--color-primary-400)]/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        {status === 'loading' && (
          <Card variant="elevated" padding="xl" className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-3xl text-center shadow-xl border-[var(--border-subtle)]/50">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-[var(--color-primary-200)]"
                style={{ borderTopColor: 'transparent' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Users className="w-8 h-8 text-[var(--color-primary-500)]" />
              </div>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--fg-primary)] mb-2">
              Rejoindre la squad...
            </h2>
            <p className="text-sm text-[var(--fg-secondary)] font-medium">
              Verification du code d'invitation
            </p>
            <div className="mt-4 px-4 py-2 bg-gradient-to-br from-[var(--color-primary-50)] to-purple-50 rounded-xl inline-block border border-[var(--color-primary-200)]">
              <code className="text-sm font-mono bg-gradient-to-r from-[var(--color-primary-600)] to-purple-600 bg-clip-text text-transparent font-bold">
                {code}
              </code>
            </div>
          </Card>
        )}

        {status === 'success' && squadInfo && (
          <Card variant="elevated" padding="xl" className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-3xl text-center shadow-xl border-emerald-200">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 mx-auto mb-6 flex items-center justify-center shadow-lg shadow-emerald-500/30"
            >
              <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </motion.div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--fg-primary)] mb-2">
              Bienvenue !
            </h2>
            <p className="text-sm text-[var(--fg-secondary)] font-medium mb-1">
              Vous avez rejoint
            </p>
            <p className="text-lg font-bold bg-gradient-to-r from-[var(--color-primary-600)] to-purple-600 bg-clip-text text-transparent">
              {squadInfo.name}
            </p>
            <p className="text-xs text-[var(--fg-tertiary)] font-medium mt-4">
              Redirection en cours...
            </p>
          </Card>
        )}

        {status === 'error' && (
          <Card variant="elevated" padding="xl" className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-3xl text-center shadow-xl border-red-200">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-orange-500 mx-auto mb-6 flex items-center justify-center shadow-lg shadow-red-500/30"
            >
              <X className="w-10 h-10 text-white" strokeWidth={2} />
            </motion.div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--fg-primary)] mb-2">
              Oups !
            </h2>
            <p className="text-sm text-[var(--fg-secondary)] font-medium mb-6">
              {errorMessage}
            </p>
            <div className="space-y-3">
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={() => onNavigate('join-squad')}
                className="rounded-xl shadow-lg shadow-[var(--color-primary-500)]/30"
              >
                Entrer un code manuellement
              </Button>
              <Button
                variant="secondary"
                fullWidth
                size="lg"
                onClick={() => onNavigate('home')}
                className="rounded-xl"
              >
                Retour a l'accueil
              </Button>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}

export default JoinViaLinkScreen;
