import { useState } from 'react';
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowRight, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/contexts/AuthContext';
import { supabase } from '@/utils/supabase/client';

interface LoginScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  onLogin?: (email: string, isPremium: boolean) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

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
      showToast?.(`Bienvenue ! 🎮`, 'success');
      onNavigate?.('home');
    } catch (error: any) {
      console.error('[LoginScreen] Login error:', error);
      let errorMessage = error.message || 'Erreur lors de la connexion';

      // Translate common Supabase errors to French
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

      // Show cache clear hint for any persistent errors
      setShowCacheClearHint(true);
      showToast?.(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background inherits from body - grillage orange déjà présent */}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo Section - Ultra Premium 2026 */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.1, 
              type: 'spring', 
              stiffness: 180,
              damping: 12
            }}
            className="inline-flex items-center justify-center mb-6 relative"
          >
            {/* Logo Container - Rounded square avec gradient */}
            <div className="relative w-24 h-24 rounded-[22px] bg-gradient-to-br from-[var(--primary-500)] via-[var(--primary-600)] to-[var(--warning-600)] p-[3px] shadow-[0_8px_32px_rgba(245,158,11,0.24)]">
              {/* Inner white bg */}
              <div className="w-full h-full rounded-[20px] bg-[var(--bg-elevated)] flex items-center justify-center relative overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-orange-50/60 to-amber-50/80" />
                
                {/* Logo Text SP - Style ultra-moderne - CENTRÉ et NON TRONQUÉ */}
                <div className="relative flex items-center justify-center w-full h-full">
                  <span 
                    className="text-[38px] font-black bg-gradient-to-br from-[var(--primary-600)] via-[var(--primary-500)] to-[var(--warning-600)] bg-clip-text text-transparent"
                    style={{ 
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontWeight: 900,
                      letterSpacing: '-0.04em',
                      lineHeight: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingLeft: '2px' // Compensation optique
                    }}
                  >
                    SP
                  </span>
                </div>
              </div>
              
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-[22px] bg-gradient-to-br from-[var(--primary-400)] to-[var(--warning-500)] opacity-0 hover:opacity-20 transition-opacity duration-500 blur-md -z-10" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <h1 className="text-4xl font-semibold text-[var(--fg-primary)] mb-2 tracking-tight">
              Squad Planner
            </h1>
            <p className="text-[var(--fg-tertiary)] text-sm font-medium">
              L'infrastructure de coordination gaming
            </p>
          </motion.div>
        </div>

        {/* Login Card - Style cohérent avec la charte */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Card avec fond beige foncé pour contraste */}
          <div className="bg-[var(--bg-elevated)] rounded-[24px] p-8 shadow-[0_2px_16px_rgba(120,113,108,0.08),0_0_0_0.5px_rgba(120,113,108,0.12)] border border-[var(--border-subtle)]">
            <h2 className="text-2xl font-semibold text-[var(--fg-primary)] mb-6 tracking-tight">
              Connexion
            </h2>

            <div className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-[var(--fg-secondary)] mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[var(--fg-tertiary)]" strokeWidth={2} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-[var(--bg-subtle)] rounded-xl text-[var(--fg-primary)] placeholder:text-[var(--fg-placeholder)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]/30 focus:border-[var(--primary-500)] transition-all text-sm font-medium"
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-[var(--fg-secondary)] mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[var(--fg-tertiary)]" strokeWidth={2} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 bg-[var(--bg-subtle)] rounded-xl text-[var(--fg-primary)] placeholder:text-[var(--fg-placeholder)] border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]/30 focus:border-[var(--primary-500)] transition-all text-sm font-medium"
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--fg-tertiary)] hover:text-[var(--fg-primary)] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-[18px] h-[18px]" strokeWidth={2} />
                    ) : (
                      <Eye className="w-[18px] h-[18px]" strokeWidth={2} />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white rounded-xl font-semibold text-sm hover:shadow-[var(--shadow-primary)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-sm"
              >
                {isLoading ? (
                  <>
                    <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Connexion...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-[18px] h-[18px]" strokeWidth={2} />
                    <span>Se connecter</span>
                  </>
                )}
              </button>

              {/* Forgot Password */}
              <div className="text-center pt-1">
                <button
                  onClick={handleForgotPassword}
                  disabled={isResettingPassword}
                  className="text-sm font-medium text-[var(--fg-tertiary)] hover:text-[var(--primary-600)] transition-colors disabled:opacity-50"
                >
                  {isResettingPassword ? 'Envoi en cours...' : 'Mot de passe oublié ?'}
                </button>
              </div>

              {/* Cache Clear Hint - shown after errors */}
              {showCacheClearHint && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl"
                >
                  <p className="text-xs text-amber-800 mb-2">
                    Problème de connexion ? Essayez de vider le cache.
                  </p>
                  <button
                    onClick={clearAllCache}
                    className="flex items-center gap-2 text-xs font-medium text-amber-700 hover:text-amber-900 transition-colors"
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
                <div className="w-full border-t border-[var(--border-subtle)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[var(--bg-elevated)] text-[var(--fg-quaternary)] font-medium">ou</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-[var(--fg-secondary)] text-sm mb-4 font-medium">
                Pas encore de compte ?
              </p>
              <button
                onClick={() => onNavigate?.('signup')}
                className="w-full py-3.5 bg-[var(--bg-subtle)] text-[var(--fg-primary)] border border-[var(--border-medium)] rounded-xl font-semibold text-sm hover:bg-[var(--bg-base)] hover:border-[var(--border-strong)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm group"
              >
                <span>Créer un compte</span>
                <ArrowRight className="w-[18px] h-[18px] group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-[var(--text-tertiary)]">
            En continuant, vous acceptez nos{' '}
            <button className="text-[var(--primary-500)] hover:text-[var(--primary-400)] font-medium transition-colors">
              Conditions d'utilisation
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LoginScreen;