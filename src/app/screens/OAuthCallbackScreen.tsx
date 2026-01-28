import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { oauthHelper } from '@/utils/oauth';
import { Logo } from '@/app/components/Logo';

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
        setMessage(`Connexion à ${formatProviderName(result.provider)} réussie !`);
        showToast(`Connexion à ${formatProviderName(result.provider)} réussie !`, 'success');

        // Redirect to integrations page after 2 seconds
        setTimeout(() => {
          navigate('/integrations');
        }, 2000);
      } else {
        setStatus('error');
        setMessage(result.error || 'Erreur de connexion');
        showToast(result.error || 'Erreur de connexion', 'error');

        // Redirect to integrations page after 3 seconds even on error
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <Logo className="w-16 h-16 mx-auto mb-6" variant="full" />

        {status === 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <Loader2 className="w-12 h-12 mx-auto text-[var(--brand-primary)] animate-spin" />
            <div>
              <h2 className="text-xl font-semibold text-[var(--fg-primary)] mb-2">
                Connexion en cours...
              </h2>
              <p className="text-[var(--fg-secondary)]">
                Finalisation de l'authentification
              </p>
            </div>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
            </motion.div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--fg-primary)] mb-2">
                Connexion réussie !
              </h2>
              <p className="text-[var(--fg-secondary)]">{message}</p>
              <p className="text-sm text-[var(--fg-tertiary)] mt-3">
                Redirection vers les intégrations...
              </p>
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <XCircle className="w-16 h-16 mx-auto text-red-500" />
            </motion.div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--fg-primary)] mb-2">
                Erreur de connexion
              </h2>
              <p className="text-[var(--fg-secondary)]">{message}</p>
              <p className="text-sm text-[var(--fg-tertiary)] mt-3">
                Redirection vers les intégrations...
              </p>
            </div>
          </motion.div>
        )}

        <div className="mt-8 text-xs text-[var(--fg-tertiary)]">
          {provider && `Provider: ${formatProviderName(provider)}`}
        </div>
      </motion.div>
    </div>
  );
}
