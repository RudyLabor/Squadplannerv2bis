import { useState } from 'react';
import { UserPlus, Mail, Lock, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/contexts/AuthContext';

interface SignupScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  onSignup?: (email: string, name: string, isPremium: boolean) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function SignupScreen({ onNavigate, onSignup, showToast }: SignupScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

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
      console.log('📝 Starting signup process for:', email);

      // Real signup via backend
      const result = await signUp(email, password, name) as any;

      // Check if email confirmation is required
      if (result?.emailConfirmationRequired) {
        console.log('📧 Email confirmation required');
        showToast?.(
          'Compte créé ! Un email de confirmation a été envoyé à votre adresse. Vérifiez votre boîte mail.',
          'success'
        );
        // Optionally redirect to a "check your email" page
        // For now, just stay on this page with the success message
        return;
      }

      const isPremium = true; // All new users get Premium for now

      onSignup?.(email, name, isPremium);
      showToast?.(`Compte créé ! Bienvenue ${name} ! 🎉`, 'success');
      onNavigate?.('home');
    } catch (error: any) {
      console.error('❌ Signup error:', error);

      // Handle specific error cases
      const errorMessage = error.message || 'Erreur lors de la création du compte';

      if (errorMessage.includes('already been registered') || errorMessage.includes('already exists')) {
        console.log('⚠️ Account already exists for:', email);
        showToast?.('Un compte existe déjà avec cet email. Essayez de vous connecter ou contactez le support si vous avez oublié votre mot de passe.', 'error');
        // Auto-redirect to login after 3 seconds
        setTimeout(() => onNavigate?.('login'), 3000);
      } else {
        showToast?.(errorMessage, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--secondary-500)] via-[var(--secondary-600)] to-[var(--primary-600)] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <button
          onClick={() => onNavigate?.('login')}
          className="mb-4 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={2} />
          <span className="text-sm font-medium">Retour</span>
        </button>

        {/* Logo & Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-2xl mb-4"
          >
            <span className="text-4xl">🎮</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Rejoignez Squad Planner</h1>
          <p className="text-white/80 text-sm">
            Créez votre compte et devenez Premium
          </p>
        </div>

        {/* Signup Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-8 shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
            Créer un compte
          </h2>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" strokeWidth={2} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre pseudo gaming"
                  className="w-full pl-12 pr-4 py-3.5 bg-[var(--background)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary-500)] transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" strokeWidth={2} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-[var(--background)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary-500)] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" strokeWidth={2} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Au moins 6 caractères"
                  className="w-full pl-12 pr-12 py-3.5 bg-[var(--background)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary-500)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" strokeWidth={2} />
                  ) : (
                    <Eye className="w-5 h-5" strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" strokeWidth={2} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Répétez votre mot de passe"
                  className="w-full pl-12 pr-4 py-3.5 bg-[var(--background)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary-500)] transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
                />
              </div>
            </div>

            {/* Signup Button */}
            <button
              onClick={handleSignup}
              disabled={isLoading}
              className="w-full py-3.5 bg-[var(--secondary-600)] text-white rounded-xl font-semibold hover:bg-[var(--secondary-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" strokeWidth={2} />
                  Créer mon compte
                </>
              )}
            </button>
          </div>

          {/* Terms */}
          <p className="text-xs text-[var(--text-tertiary)] text-center mt-6">
            En créant un compte, vous acceptez nos{' '}
            <button className="text-[var(--secondary-600)] hover:underline">
              Conditions d'utilisation
            </button>{' '}
            et notre{' '}
            <button className="text-[var(--secondary-600)] hover:underline">
              Politique de confidentialité
            </button>
          </p>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-6">
          Déjà un compte ?{' '}
          <button
            onClick={() => onNavigate?.('login')}
            className="text-white font-semibold hover:underline"
          >
            Se connecter
          </button>
        </p>
      </motion.div>
    </div>
  );
}
export default SignupScreen;
