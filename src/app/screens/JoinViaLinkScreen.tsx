/**
 * JOIN VIA LINK SCREEN - Linear Dark Design System
 * Handles deep link invitations (e.g., squadplanner.app/join/ABC123)
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Check, X, ArrowLeft, Link2 } from 'lucide-react';
import { squadsAPI } from '@/app/services/api';

// Linear dark design tokens
const colors = {
  bg: {
    primary: '#08090a',
    secondary: 'rgba(255,255,255,0.02)',
    tertiary: 'rgba(255,255,255,0.04)',
    elevated: 'rgba(255,255,255,0.06)',
  },
  fg: {
    primary: '#f7f8f8',
    secondary: '#8b8d90',
    tertiary: '#5e6063',
  },
  accent: {
    primary: '#5e6dd2',
    success: '#4ade80',
    error: '#ef4444',
  },
  border: {
    subtle: 'rgba(255, 255, 255, 0.06)',
    default: 'rgba(255, 255, 255, 0.08)',
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 28 }
  }
};

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
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: colors.bg.primary }}
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 px-4 py-3"
        style={{
          backgroundColor: `${colors.bg.primary}ee`,
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${colors.border.subtle}`
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: colors.bg.tertiary,
              border: `1px solid ${colors.border.subtle}`
            }}
          >
            <ArrowLeft size={18} style={{ color: colors.fg.secondary }} />
          </button>
          <div>
            <h1
              className="text-lg font-semibold tracking-tight"
              style={{ color: colors.fg.primary }}
            >
              Rejoindre une Squad
            </h1>
            <p
              className="text-xs"
              style={{ color: colors.fg.tertiary }}
            >
              Invitation par lien
            </p>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Loading State */}
          {status === 'loading' && (
            <motion.div
              variants={itemVariants}
              className="rounded-2xl p-8 text-center"
              style={{
                backgroundColor: colors.bg.secondary,
                border: `1px solid ${colors.border.subtle}`
              }}
            >
              <div className="relative w-20 h-20 mx-auto mb-6">
                <motion.div
                  className="absolute inset-0 rounded-full border-4"
                  style={{
                    borderColor: colors.bg.tertiary,
                    borderTopColor: colors.accent.primary
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users size={28} style={{ color: colors.accent.primary }} />
                </div>
              </div>
              <h2
                className="text-xl font-semibold tracking-tight mb-2"
                style={{ color: colors.fg.primary }}
              >
                Rejoindre la squad...
              </h2>
              <p
                className="text-sm mb-4"
                style={{ color: colors.fg.secondary }}
              >
                Verification du code d'invitation
              </p>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{
                  backgroundColor: colors.bg.tertiary,
                  border: `1px solid ${colors.border.default}`
                }}
              >
                <Link2 size={14} style={{ color: colors.fg.tertiary }} />
                <code
                  className="text-sm font-mono font-semibold"
                  style={{ color: colors.accent.primary }}
                >
                  {code}
                </code>
              </div>
            </motion.div>
          )}

          {/* Success State */}
          {status === 'success' && squadInfo && (
            <motion.div
              variants={itemVariants}
              className="rounded-2xl p-8 text-center"
              style={{
                backgroundColor: colors.bg.secondary,
                border: `1px solid rgba(74, 222, 128, 0.2)`
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent.success}, #22c55e)`,
                  boxShadow: `0 8px 24px rgba(74, 222, 128, 0.3)`
                }}
              >
                <Check size={36} color="white" strokeWidth={3} />
              </motion.div>
              <h2
                className="text-xl font-semibold tracking-tight mb-2"
                style={{ color: colors.fg.primary }}
              >
                Bienvenue !
              </h2>
              <p
                className="text-sm mb-1"
                style={{ color: colors.fg.secondary }}
              >
                Vous avez rejoint
              </p>
              <p
                className="text-lg font-semibold"
                style={{ color: colors.accent.success }}
              >
                {squadInfo.name}
              </p>
              <p
                className="text-xs mt-4"
                style={{ color: colors.fg.tertiary }}
              >
                Redirection en cours...
              </p>
            </motion.div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <motion.div
              variants={itemVariants}
              className="rounded-2xl p-8 text-center"
              style={{
                backgroundColor: colors.bg.secondary,
                border: `1px solid rgba(239, 68, 68, 0.2)`
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent.error}, #dc2626)`,
                  boxShadow: `0 8px 24px rgba(239, 68, 68, 0.3)`
                }}
              >
                <X size={36} color="white" strokeWidth={2} />
              </motion.div>
              <h2
                className="text-xl font-semibold tracking-tight mb-2"
                style={{ color: colors.fg.primary }}
              >
                Oups !
              </h2>
              <p
                className="text-sm mb-6"
                style={{ color: colors.fg.secondary }}
              >
                {errorMessage}
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('join-squad')}
                  className="w-full py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    backgroundColor: colors.accent.primary,
                    color: 'white',
                    boxShadow: `0 4px 16px rgba(94, 106, 210, 0.3)`
                  }}
                >
                  Entrer un code manuellement
                </button>
                <button
                  onClick={() => onNavigate('home')}
                  className="w-full py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    backgroundColor: colors.bg.tertiary,
                    color: colors.fg.secondary,
                    border: `1px solid ${colors.border.default}`
                  }}
                >
                  Retour a l'accueil
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default JoinViaLinkScreen;
