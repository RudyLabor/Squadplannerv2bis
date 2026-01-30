/**
 * LOGIN SCREEN - LINEAR DESIGN SYSTEM
 * Premium, Dark, Minimal - First impression matters
 */

import { useState } from 'react';
import { Mail, Lock, ArrowRight, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/contexts/AuthContext';
import { supabase } from '@/utils/supabase/client';
import { Logo } from '@/app/components/Logo';

interface LoginScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  onLogin?: (email: string, isPremium: boolean) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

// Linear-style animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }
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
      showToast?.('Email de réinitialisation envoyé !', 'success');
    } catch (error: any) {
      showToast?.(`Erreur: ${error.message}`, 'error');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast?.('Veuillez remplir tous les champs', 'error');
      return;
    }

    setIsLoading(true);

    try {
      await signIn(email, password);
      onLogin?.(email, true);
      showToast?.('Bienvenue !', 'success');
      onNavigate?.('home');
    } catch (error: any) {
      let errorMessage = error.message || 'Erreur lors de la connexion';

      if (errorMessage.includes('Invalid login credentials')) {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (errorMessage.includes('Email not confirmed')) {
        errorMessage = 'Veuillez confirmer votre email';
      } else if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
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
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[#0e0f11]">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#5e6ad2]/[0.02] via-transparent to-transparent pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[380px] relative"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <Logo variant="full" size="lg" className="mx-auto" />
        </motion.div>

        {/* Login Form Card */}
        <motion.div variants={itemVariants}>
          <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-[#161719] to-[#131416] border border-[#1e2024] shadow-xl shadow-black/20">
            <h2 className="text-[18px] md:text-[20px] font-semibold text-[#ececed] mb-6">
              Connexion
            </h2>

            <div className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-[12px] font-medium text-[#8b8d93] mb-2.5 uppercase tracking-wide">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#4a4b50] group-focus-within:text-[#6f7177] transition-colors" strokeWidth={1.5} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-[#111214] border border-[#1e2024] text-[14px] text-[#ececed] placeholder:text-[#3a3b40] focus:border-[#5e6ad2] focus:bg-[#141518] focus:outline-none transition-all duration-150"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-[12px] font-medium text-[#8b8d93] mb-2.5 uppercase tracking-wide">
                  Mot de passe
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#4a4b50] group-focus-within:text-[#6f7177] transition-colors" strokeWidth={1.5} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full h-12 pl-12 pr-12 rounded-xl bg-[#111214] border border-[#1e2024] text-[14px] text-[#ececed] placeholder:text-[#3a3b40] focus:border-[#5e6ad2] focus:bg-[#141518] focus:outline-none transition-all duration-150"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a4b50] hover:text-[#6f7177] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" strokeWidth={1.5} /> : <Eye className="w-[18px] h-[18px]" strokeWidth={1.5} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <motion.button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full h-12 flex items-center justify-center gap-2.5 rounded-xl bg-[#5e6ad2] text-white text-[14px] font-semibold hover:bg-[#6872d9] disabled:opacity-50 shadow-lg shadow-[#5e6ad2]/20 transition-colors"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Se connecter'
                )}
              </motion.button>

              {/* Forgot Password */}
              <motion.button
                onClick={handleForgotPassword}
                disabled={isResettingPassword}
                className="w-full text-center text-[13px] text-[#6f7177] hover:text-[#8b8d93] transition-colors disabled:opacity-50 py-1"
                whileHover={{ x: 2 }}
              >
                {isResettingPassword ? 'Envoi en cours...' : 'Mot de passe oublié ?'}
              </motion.button>

              {/* Cache Clear Hint */}
              {showCacheClearHint && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="p-4 bg-[#f5a623]/10 border border-[#f5a623]/20 rounded-xl"
                >
                  <p className="text-[13px] text-[#f5a623] mb-2.5">
                    Problème de connexion ?
                  </p>
                  <motion.button
                    onClick={clearAllCache}
                    className="flex items-center gap-2 text-[13px] font-medium text-[#f5a623] hover:text-[#f5a623]/80 transition-colors"
                    whileTap={{ scale: 0.98 }}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Vider le cache et réessayer
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#26282d] to-transparent" />
              <span className="text-[11px] text-[#4a4b50] uppercase tracking-wider">ou</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#26282d] to-transparent" />
            </div>

            {/* Sign Up */}
            <div className="text-center">
              <p className="text-[13px] text-[#6f7177] mb-4">
                Pas encore de compte ?
              </p>
              <motion.button
                onClick={() => onNavigate?.('signup')}
                className="w-full h-12 flex items-center justify-center gap-2.5 rounded-xl bg-[#111214] text-[#ececed] text-[14px] font-medium border border-[#1e2024] hover:bg-[#1a1b1f] hover:border-[#26282d] transition-all duration-150"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                Créer un compte
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="mt-8 text-center">
          <p className="text-[12px] text-[#4a4b50] leading-relaxed">
            En continuant, vous acceptez nos{' '}
            <button className="text-[#6f7177] hover:text-[#8b8d93] transition-colors underline-offset-2 hover:underline">
              Conditions d'utilisation
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LoginScreen;
