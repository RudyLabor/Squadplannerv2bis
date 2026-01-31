import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';

// Mot de passe pour accéder au site en beta
const BETA_PASSWORD = 'ruudboy92';

// Clé localStorage pour mémoriser l'accès
const STORAGE_KEY = 'squadplanner_beta_access';

interface BetaProtectionProps {
  children: React.ReactNode;
}

export function BetaProtection({ children }: BetaProtectionProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà accès
    const hasAccess = localStorage.getItem(STORAGE_KEY);
    if (hasAccess === 'true') {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === BETA_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsAuthorized(true);
      setError('');
    } else {
      setError('Mot de passe incorrect');
      setPassword('');
    }
  };

  // Pendant le chargement
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#5e6dd2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Si autorisé, afficher l'app
  if (isAuthorized) {
    return <>{children}</>;
  }

  // Écran de protection
  return (
    <div className="min-h-screen bg-[#08090a] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-[#5e6dd2]" />
            <div className="w-3 h-3 rounded-sm bg-[#5e6dd2]" />
            <div className="w-3 h-3 rounded-sm bg-[#5e6dd2] opacity-60" />
            <div className="w-3 h-3 rounded-sm bg-[#5e6dd2] opacity-60" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[#f7f8f8] text-center mb-2">
          Squad Planner
        </h1>
        <p className="text-[#8b8d90] text-center mb-8">
          Version Beta - Accès restreint
        </p>

        {/* Card */}
        <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[rgba(94,109,210,0.15)] flex items-center justify-center">
              <Lock className="w-8 h-8 text-[#5e6dd2]" />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-[#f7f8f8] text-center mb-2">
            Accès Beta Privé
          </h2>
          <p className="text-[#8b8d90] text-sm text-center mb-6">
            Cette application est en cours de développement. Entrez le mot de passe pour accéder.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe beta"
                className="w-full h-12 px-4 pr-12 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl text-[#f7f8f8] placeholder-[#5e6063] focus:border-[rgba(94,109,210,0.5)] focus:ring-2 focus:ring-[rgba(94,109,210,0.15)] transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5e6063] hover:text-[#8b8d90] transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {error && (
              <p className="text-[#f87171] text-sm text-center mb-4">{error}</p>
            )}

            <motion.button
              type="submit"
              className="w-full h-12 bg-[#5e6dd2] hover:bg-[#6a79db] text-white font-semibold rounded-xl shadow-lg shadow-[#5e6dd2]/20 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Accéder
            </motion.button>
          </form>
        </div>

        <p className="text-[#5e6063] text-xs text-center mt-6">
          Contactez l'administrateur pour obtenir l'accès
        </p>
      </motion.div>
    </div>
  );
}
