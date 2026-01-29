import { useState } from 'react';
import { UserPlus, Mail, Lock, User, ArrowLeft, Eye, EyeOff, Sparkles, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/contexts/AuthContext';

interface SignupScreenProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  onSignup?: (email: string, name: string, isPremium: boolean) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
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
      console.log('Starting signup process for:', email);

      const result = await signUp(email, password, name) as any;

      if (result?.emailConfirmationRequired) {
        console.log('Email confirmation required');
        showToast?.(
          'Compte créé ! Un email de confirmation a été envoyé à votre adresse. Vérifiez votre boîte mail.',
          'success'
        );
        return;
      }

      const isPremium = true;

      onSignup?.(email, name, isPremium);
      showToast?.(`Compte créé ! Bienvenue ${name} !`, 'success');
      onNavigate?.('home');
    } catch (error: any) {
      console.error('Signup error:', error);

      const errorMessage = error.message || 'Erreur lors de la création du compte';

      if (errorMessage.includes('already been registered') || errorMessage.includes('already exists')) {
        showToast?.('Un compte existe déjà avec cet email. Essayez de vous connecter.', 'error');
        setTimeout(() => onNavigate?.('login'), 3000);
      } else {
        showToast?.(errorMessage, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-48 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/25 to-cyan-400/25 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Back Button */}
          <motion.button
            variants={itemVariants}
            onClick={() => onNavigate?.('login')}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
            whileHover={{ x: -4 }}
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2} />
            <span className="text-sm font-medium">Retour</span>
          </motion.button>

          {/* Logo & Title */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-indigo-500/30 mb-4"
            >
              <Sparkles className="w-10 h-10 text-white" strokeWidth={1.5} />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Rejoignez Squad Planner
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Créez votre compte et devenez Premium
            </p>
          </motion.div>

          {/* Premium Benefits */}
          <motion.div variants={itemVariants} className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <div className="flex-shrink-0 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 shadow-md">
              <div className="flex items-center gap-2 text-white">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-semibold whitespace-nowrap">Squads illimitées</span>
              </div>
            </div>
            <div className="flex-shrink-0 px-3 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-md">
              <div className="flex items-center gap-2 text-gray-700">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold whitespace-nowrap">Stats avancées</span>
              </div>
            </div>
            <div className="flex-shrink-0 px-3 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-md">
              <div className="flex items-center gap-2 text-gray-700">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-semibold whitespace-nowrap">IA suggestions</span>
              </div>
            </div>
          </motion.div>

          {/* Signup Form */}
          <motion.div variants={itemVariants}>
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Créer un compte
              </h2>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Nom d'utilisateur
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Votre pseudo gaming"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/80 rounded-xl text-gray-800 placeholder:text-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Email */}
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
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/80 rounded-xl text-gray-800 placeholder:text-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Password */}
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
                      placeholder="Au moins 6 caractères"
                      className="w-full pl-12 pr-12 py-4 bg-gray-50/80 rounded-xl text-gray-800 placeholder:text-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all text-sm font-medium"
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

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Répétez votre mot de passe"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/80 rounded-xl text-gray-800 placeholder:text-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all text-sm font-medium"
                      onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
                    />
                  </div>
                </div>

                {/* Signup Button */}
                <motion.button
                  onClick={handleSignup}
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      Création...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" strokeWidth={2} />
                      Créer mon compte
                    </>
                  )}
                </motion.button>
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed">
                En créant un compte, vous acceptez nos{' '}
                <button className="text-indigo-500 hover:underline font-medium">
                  Conditions d'utilisation
                </button>{' '}
                et notre{' '}
                <button className="text-indigo-500 hover:underline font-medium">
                  Politique de confidentialité
                </button>
              </p>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.p variants={itemVariants} className="text-center text-gray-500 text-sm mt-6">
            Déjà un compte ?{' '}
            <button
              onClick={() => onNavigate?.('login')}
              className="text-indigo-600 font-semibold hover:text-purple-600 transition-colors"
            >
              Se connecter
            </button>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

export default SignupScreen;
