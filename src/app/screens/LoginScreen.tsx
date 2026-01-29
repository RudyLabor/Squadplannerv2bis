import { useState } from 'react';
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowRight, RefreshCw, Sparkles, Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/contexts/AuthContext';
import { supabase } from '@/utils/supabase/client';

interface LoginScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  onLogin?: (email: string, isPremium: boolean) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export function LoginScreen({ onNavigate, onLogin, showToast }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [showCacheClearHint, setShowCacheClearHint] = useState(false);
  const { signIn, clearAllCache } = useAuth();

  const handleForgotPassword = async () => {
    if (!email) {
      showToast?.('Entrez votre email pour réinitialiser le mot de passe', 'error');
      return;
    }

    setIsResettingPassword(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
      showToast?.('Email de réinitialisation envoyé ! Vérifiez votre boîte mail.', 'success');
    } catch (error: any) {
      showToast?.(`Erreur: ${error.message}`, 'error');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleLogin = async () => {
    console.log('[LoginScreen] handleLogin called with email:', email);

    if (!email || !password) {
      showToast?.('Veuillez remplir tous les champs', 'error');
      return;
    }

    console.log('[LoginScreen] Starting login attempt...');
    setIsLoading(true);

    try {
      await signIn(email, password);
      onLogin?.(email, true);
      showToast?.(`Bienvenue !`, 'success');
      onNavigate?.('home');
    } catch (error: any) {
      console.error('[LoginScreen] Login error:', error);
      let errorMessage = error.message || 'Erreur lors de la connexion';

      if (errorMessage.includes('Invalid login credentials')) {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (errorMessage.includes('Email not confirmed')) {
        errorMessage = 'Veuillez confirmer votre email avant de vous connecter';
      } else if (errorMessage.includes('timeout')) {
        errorMessage = 'Connexion lente - réessayez';
        setShowCacheClearHint(true);
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        errorMessage = 'Problème de connexion réseau';
        setShowCacheClearHint(true);
      }

      setShowCacheClearHint(true);
      showToast?.(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-48 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-pink-400/25 to-orange-400/25 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        {/* Logo Section */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <motion.div
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 180, damping: 12 }}
            className="inline-flex items-center justify-center mb-6 relative"
          >
            {/* Premium Logo Container */}
            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[3px] shadow-2xl shadow-indigo-500/30">
              <div className="w-full h-full rounded-[22px] bg-white flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-pink-50/80" />
                <div className="relative flex items-center justify-center w-full h-full">
                  <span
                    className="text-[38px] font-black bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                    style={{
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontWeight: 900,
                      letterSpacing: '-0.04em',
                      lineHeight: 1,
                    }}
                  >
                    SP
                  </span>
                </div>
              </div>

              {/* Animated ring */}
              <motion.div
                className="absolute -inset-2 rounded-[28px] border-2 border-indigo-300/50"
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Squad Planner
            </h1>
            <p className="text-gray-500 text-sm font-medium flex items-center justify-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              L'infrastructure de coordination gaming
            </p>
          </motion.div>
        </motion.div>

        {/* Login Card */}
        <motion.div variants={itemVariants}>
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Connexion
            </h2>

            <div className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50/80 rounded-xl text-gray-800 placeholder:text-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm font-medium"
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Votre mot de passe"
                    className="w-full pl-12 pr-12 py-4 bg-gray-50/80 rounded-xl text-gray-800 placeholder:text-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm font-medium"
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <motion.button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Connexion...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" strokeWidth={2} />
                    <span>Se connecter</span>
                  </>
                )}
              </motion.button>

              {/* Forgot Password */}
              <div className="text-center pt-1">
                <button
                  onClick={handleForgotPassword}
                  disabled={isResettingPassword}
                  className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors disabled:opacity-50"
                >
                  {isResettingPassword ? 'Envoi en cours...' : 'Mot de passe oublié ?'}
                </button>
              </div>

              {/* Cache Clear Hint */}
              {showCacheClearHint && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl"
                >
                  <p className="text-xs text-amber-800 mb-2">
                    Problème de connexion ? Essayez de vider le cache.
                  </p>
                  <button
                    onClick={clearAllCache}
                    className="flex items-center gap-2 text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Vider le cache et réessayer
                  </button>
                </motion.div>
              )}
            </div>

            {/* Divider */}
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-gray-400 font-medium">ou</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-4 font-medium">
                Pas encore de compte ?
              </p>
              <motion.button
                onClick={() => onNavigate?.('signup')}
                className="w-full py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:border-indigo-300 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <span>Créer un compte</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            En continuant, vous acceptez nos{' '}
            <button className="text-indigo-500 hover:text-indigo-600 font-medium transition-colors">
              Conditions d'utilisation
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LoginScreen;
