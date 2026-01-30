/**
 * SIGNUP SCREEN - LINEAR DESIGN SYSTEM
 * Premium, Dark, Minimal - Onboarding experience
 */

import { useState } from 'react';
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/contexts/AuthContext';
import { Logo } from '@/app/components/Logo';

interface SignupScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  onSignup?: (email: string, name: string, isPremium: boolean) => void;
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

export function SignupScreen({ onNavigate, onSignup, showToast }: SignupScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  // Password validation
  const passwordChecks = {
    length: password.length >= 6,
    match: password === confirmPassword && confirmPassword.length > 0,
  };

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      showToast?.('Veuillez remplir tous les champs', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast?.('Les mots de passe ne correspondent pas', 'error');
      return;
    }

    if (password.length < 6) {
      showToast?.('Le mot de passe doit contenir au moins 6 caractères', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp(email, password, name) as any;

      if (result?.emailConfirmationRequired) {
        showToast?.(
          'Compte créé ! Vérifiez votre email pour confirmer.',
          'success'
        );
        return;
      }

      onSignup?.(email, name, true);
      showToast?.(`Bienvenue ${name} !`, 'success');
      onNavigate?.('home');
    } catch (error: any) {
      const errorMessage = error.message || 'Erreur lors de la création du compte';

      if (errorMessage.includes('already been registered') || errorMessage.includes('already exists')) {
        showToast?.('Un compte existe déjà avec cet email.', 'error');
        setTimeout(() => onNavigate?.('login'), 3000);
      } else {
        showToast?.(errorMessage, 'error');
      }
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
        {/* Back Button */}
        <motion.div variants={itemVariants} className="mb-6">
          <motion.button
            onClick={() => onNavigate?.('login')}
            className="flex items-center gap-2 text-[13px] text-[#6f7177] hover:text-[#ececed] transition-colors py-1"
            whileHover={{ x: -2 }}
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            Retour à la connexion
          </motion.button>
        </motion.div>

        {/* Logo */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <Logo variant="icon" size="lg" className="mx-auto mb-4" />
          <h1 className="text-[22px] md:text-[24px] font-semibold text-[#ececed] tracking-tight">
            Créer un compte
          </h1>
          <p className="text-[13px] text-[#6f7177] mt-1.5">
            Rejoignez Squad Planner gratuitement
          </p>
        </motion.div>

        {/* Signup Form Card */}
        <motion.div variants={itemVariants}>
          <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-[#161719] to-[#131416] border border-[#1e2024] shadow-xl shadow-black/20">
            <div className="space-y-5">
              {/* Username Input */}
              <div>
                <label className="block text-[12px] font-medium text-[#8b8d93] mb-2.5 uppercase tracking-wide">
                  Nom d'utilisateur
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#4a4b50] group-focus-within:text-[#6f7177] transition-colors" strokeWidth={1.5} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre pseudo gaming"
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-[#111214] border border-[#1e2024] text-[14px] text-[#ececed] placeholder:text-[#3a3b40] focus:border-[#5e6ad2] focus:bg-[#141518] focus:outline-none transition-all duration-150"
                  />
                </div>
              </div>

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
                    placeholder="Min. 6 caractères"
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

              {/* Confirm Password Input */}
              <div>
                <label className="block text-[12px] font-medium text-[#8b8d93] mb-2.5 uppercase tracking-wide">
                  Confirmer le mot de passe
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#4a4b50] group-focus-within:text-[#6f7177] transition-colors" strokeWidth={1.5} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Répétez le mot de passe"
                    onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
                    className="w-full h-12 pl-12 pr-12 rounded-xl bg-[#111214] border border-[#1e2024] text-[14px] text-[#ececed] placeholder:text-[#3a3b40] focus:border-[#5e6ad2] focus:bg-[#141518] focus:outline-none transition-all duration-150"
                  />
                  {confirmPassword && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {passwordChecks.match ? (
                        <Check className="w-[18px] h-[18px] text-[#4ade80]" strokeWidth={2} />
                      ) : (
                        <X className="w-[18px] h-[18px] text-[#f87171]" strokeWidth={2} />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Password Requirements */}
              <AnimatePresence>
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-3"
                  >
                    <div className={`flex items-center gap-1.5 text-[12px] ${passwordChecks.length ? 'text-[#4ade80]' : 'text-[#4a4b50]'}`}>
                      {passwordChecks.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      6+ caractères
                    </div>
                    {confirmPassword && (
                      <div className={`flex items-center gap-1.5 text-[12px] ${passwordChecks.match ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                        {passwordChecks.match ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        Mots de passe identiques
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Signup Button */}
              <motion.button
                onClick={handleSignup}
                disabled={isLoading || !passwordChecks.length || (confirmPassword && !passwordChecks.match)}
                className="w-full h-12 flex items-center justify-center gap-2.5 rounded-xl bg-[#5e6ad2] text-white text-[14px] font-semibold hover:bg-[#6872d9] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#5e6ad2]/20 transition-colors"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Créer mon compte'
                )}
              </motion.button>
            </div>

            {/* Terms */}
            <p className="mt-6 text-[12px] text-[#4a4b50] text-center leading-relaxed">
              En créant un compte, vous acceptez nos{' '}
              <button className="text-[#6f7177] hover:text-[#8b8d93] transition-colors underline-offset-2 hover:underline">
                Conditions
              </button>{' '}
              et notre{' '}
              <button className="text-[#6f7177] hover:text-[#8b8d93] transition-colors underline-offset-2 hover:underline">
                Politique de confidentialité
              </button>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="mt-8 text-center">
          <p className="text-[13px] text-[#6f7177]">
            Déjà un compte ?{' '}
            <motion.button
              onClick={() => onNavigate?.('login')}
              className="text-[#5e6ad2] hover:text-[#7c85e0] font-medium transition-colors"
              whileHover={{ x: 2 }}
            >
              Se connecter →
            </motion.button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default SignupScreen;
