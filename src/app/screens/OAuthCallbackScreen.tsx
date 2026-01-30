// @ts-nocheck
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { oauthHelper } from '@/utils/oauth';
import { Logo } from '@/app/components/Logo';
import { Card } from '@/design-system';

interface OAuthCallbackScreenProps {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function OAuthCallbackScreen({ showToast }: OAuthCallbackScreenProps) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [provider, setProvider] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    try {
      const result = await oauthHelper.handleCallback();

      setProvider(result.provider);

      if (result.success) {
        setStatus('success');
        setMessage(`Connexion a ${formatProviderName(result.provider)} reussie !`);
        showToast(`Connexion a ${formatProviderName(result.provider)} reussie !`, 'success');

        setTimeout(() => {
          navigate('/integrations');
        }, 2000);
      } else {
        setStatus('error');
        setMessage(result.error || 'Erreur de connexion');
        showToast(result.error || 'Erreur de connexion', 'error');

        setTimeout(() => {
          navigate('/integrations');
        }, 3000);
      }
    } catch (error: any) {
      console.error('[OAuth Callback] Unexpected error:', error);
      setStatus('error');
      setMessage(error.message || 'Erreur inattendue');
      showToast('Erreur lors de la connexion', 'error');

      setTimeout(() => {
        navigate('/integrations');
      }, 3000);
    }
  };

  const formatProviderName = (provider: string): string => {
    const names: Record<string, string> = {
      discord: 'Discord',
      google: 'Google Calendar',
      twitch: 'Twitch',
      steam: 'Steam',
      riot: 'Riot Games',
      battlenet: 'Battle.net',
    };
    return names[provider] || provider;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[var(--color-primary-50)] via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[var(--color-primary-400)]/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center relative z-10"
      >
        <Logo className="w-16 h-16 mx-auto mb-6" variant="full" />

        {status === 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card variant="elevated" padding="xl" className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-3xl border-[var(--border-subtle)]/50 shadow-xl">
              <motion.div
                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 mx-auto mb-6 flex items-center justify-center shadow-xl shadow-[var(--color-primary-500)]/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-10 h-10 text-white" strokeWidth={2} />
              </motion.div>
              <h2 className="text-xl font-bold text-[var(--fg-primary)] mb-2">
                Connexion en cours...
              </h2>
              <p className="text-[var(--fg-secondary)] font-medium">
                Finalisation de l'authentification
              </p>
            </Card>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card variant="elevated" padding="xl" className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-3xl border-emerald-200 shadow-xl">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 mx-auto mb-6 flex items-center justify-center shadow-xl shadow-emerald-500/30"
              >
                <CheckCircle className="w-10 h-10 text-white" strokeWidth={2} />
              </motion.div>
              <h2 className="text-xl font-bold text-[var(--fg-primary)] mb-2">
                Connexion reussie !
              </h2>
              <p className="text-[var(--fg-secondary)] font-medium">{message}</p>
              <p className="text-sm text-[var(--fg-tertiary)] mt-3">
                Redirection vers les integrations...
              </p>
            </Card>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card variant="elevated" padding="xl" className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-3xl border-red-200 shadow-xl">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-orange-500 mx-auto mb-6 flex items-center justify-center shadow-xl shadow-red-500/30"
              >
                <XCircle className="w-10 h-10 text-white" strokeWidth={2} />
              </motion.div>
              <h2 className="text-xl font-bold text-[var(--fg-primary)] mb-2">
                Erreur de connexion
              </h2>
              <p className="text-[var(--fg-secondary)] font-medium">{message}</p>
              <p className="text-sm text-[var(--fg-tertiary)] mt-3">
                Redirection vers les integrations...
              </p>
            </Card>
          </motion.div>
        )}

        {provider && (
          <div className="mt-8 text-xs text-[var(--fg-tertiary)] font-medium">
            Provider: {formatProviderName(provider)}
          </div>
        )}
      </motion.div>
    </div>
  );
}
