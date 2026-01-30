import { ArrowLeft, Users, Check, AlertCircle, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input, Button, IconButton } from '@/design-system';
import { squadsAPI } from '@/utils/api';

interface JoinSquadScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
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

export function JoinSquadScreen({ onNavigate, showToast }: JoinSquadScreenProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      showToast('Veuillez entrer un code d\'invitation', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const { squad, message } = await squadsAPI.joinSquad(inviteCode.trim());
      showToast(message || 'Vous avez rejoint la squad !', 'success');
      setTimeout(() => {
        onNavigate('squad-detail', { squadId: squad.id });
      }, 500);
    } catch (error: any) {
      console.error('Join squad error:', error);
      showToast(error.message || 'Code d\'invitation invalide', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-[var(--color-primary-50)] via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations - Static for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[var(--color-primary-400)]/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-10">
            <IconButton
              variant="secondary"
              size="md"
              icon={<ArrowLeft className="w-5 h-5" strokeWidth={2} />}
              onClick={() => onNavigate('home')}
              aria-label="Retour"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[var(--color-primary-600)] to-purple-600 bg-clip-text text-transparent">
                Rejoindre une squad
              </h1>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 flex items-center justify-center shadow-lg shadow-[var(--color-primary-500)]/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Users className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center py-6 mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 mb-4 shadow-xl shadow-[var(--color-primary-500)]/30">
              <Users className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--fg-primary)] mb-2">
              Rejoins ton équipe
            </h2>
            <p className="text-[var(--fg-secondary)] text-sm max-w-md mx-auto">
              Entre le code d'invitation fourni par un membre de la squad
            </p>
          </motion.div>

          {/* Info Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-amber-100/80 to-orange-100/80 backdrop-blur-sm rounded-2xl p-5 mb-8 border border-amber-200/50"
          >
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md">
                <AlertCircle className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-800 mb-1">
                  Code d'invitation requis
                </h3>
                <p className="text-sm text-amber-700">
                  Demandez le code à un membre de la squad ou utilisez le lien d'invitation.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Invite Code Input */}
          <motion.div variants={itemVariants} className="mb-8">
            <label className="text-sm text-[var(--fg-primary)] mb-3 block font-bold">
              Code d'invitation
            </label>
            <Input
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="Ex: ABC123"
              size="lg"
              className="text-center text-lg font-bold tracking-[0.3em]"
            />
          </motion.div>

          {/* Check Button */}
          <motion.div variants={itemVariants}>
            <Button
              variant="primary"
              size="lg"
              onClick={handleJoin}
              disabled={!inviteCode.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Verification...
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" strokeWidth={2} />
                  Verifier le code
                </span>
              )}
            </Button>
          </motion.div>

          {/* Tips */}
          <motion.div
            variants={itemVariants}
            className="mt-8 bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl p-5 border border-[var(--border-subtle)] shadow-lg"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[var(--color-primary-500)]" />
              <h3 className="font-bold tracking-tight text-[var(--fg-primary)]">Conseils</h3>
            </div>
            <ul className="text-sm text-[var(--fg-secondary)] space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-500)] mt-2 flex-shrink-0" />
                <span>Le code est composé de lettres et de chiffres (ex: ABC123)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-500)] mt-2 flex-shrink-0" />
                <span>Les codes sont sensibles à la casse</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-500)] mt-2 flex-shrink-0" />
                <span>Demandez un nouveau code si celui-ci ne fonctionne pas</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default JoinSquadScreen;
