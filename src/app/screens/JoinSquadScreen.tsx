import { ArrowLeft, Users, Ticket, Sparkles, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { squadsAPI } from '@/utils/api';

interface JoinSquadScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
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
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 28 }
  }
};

export function JoinSquadScreen({ onNavigate, showToast }: JoinSquadScreenProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inviteCode.trim()) {
      handleJoin();
    }
  };

  return (
    <div className="min-h-screen bg-[#08090a] pb-24 md:pb-8">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 mb-8"
          >
            <motion.button
              onClick={() => onNavigate('home')}
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.05)] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-[#f7f8f8]">
                Rejoindre une squad
              </h1>
              <p className="text-sm text-[#5e6063]">
                Entre le code d'invitation
              </p>
            </div>
            <motion.div
              className="w-10 h-10 rounded-xl bg-[rgba(94,109,210,0.1)] border border-[rgba(94,109,210,0.2)] flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <Users className="w-5 h-5 text-[#5e6dd2]" strokeWidth={1.5} />
            </motion.div>
          </motion.div>

          {/* Icon Hero */}
          <motion.div variants={itemVariants} className="flex flex-col items-center py-8">
            <div className="relative">
              <motion.div
                className="w-20 h-20 rounded-2xl bg-[rgba(94,109,210,0.15)] border border-[rgba(94,109,210,0.2)] flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <Users className="w-10 h-10 text-[#5e6dd2]" strokeWidth={1.5} />
              </motion.div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-[#22c55e] flex items-center justify-center border-2 border-[#08090a]">
                <Ticket className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
            </div>
            <h2 className="mt-5 text-xl font-semibold text-[#f7f8f8]">
              Rejoins ton equipe
            </h2>
            <p className="mt-2 text-sm text-[#8b8d90] text-center max-w-xs">
              Utilise le code fourni par un membre de ta squad pour les rejoindre
            </p>
          </motion.div>

          {/* Code Input Card */}
          <motion.div
            variants={itemVariants}
            className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 mb-4"
          >
            <label className="block text-sm font-medium text-[#8b8d90] mb-3">
              Code d'invitation
            </label>
            <div className={`relative rounded-xl transition-all duration-200 ${
              isFocused
                ? 'ring-2 ring-[#5e6dd2]/50 ring-offset-2 ring-offset-[#08090a]'
                : ''
            }`}>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="ABC123"
                className="w-full h-14 px-4 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl text-[#f7f8f8] text-center text-xl font-mono tracking-[0.4em] placeholder:text-[#5e6063] placeholder:tracking-[0.4em] focus:outline-none focus:border-[rgba(94,109,210,0.5)] transition-colors"
              />
            </div>

            {/* Helper text */}
            <p className="mt-3 text-xs text-[#5e6063] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#5e6dd2]" />
              Le code contient 6 caracteres alphanumeriques
            </p>
          </motion.div>

          {/* Info Card */}
          <motion.div
            variants={itemVariants}
            className="bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.15)] rounded-xl p-4 mb-6"
          >
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-[rgba(245,158,11,0.15)] flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-[#f59e0b]" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#f59e0b]">
                  Pas de code ?
                </h3>
                <p className="mt-1 text-sm text-[#8b8d90]">
                  Demande le code d'invitation a un membre de la squad ou utilise le lien partage.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Join Button */}
          <motion.button
            variants={itemVariants}
            onClick={handleJoin}
            disabled={!inviteCode.trim() || isLoading}
            whileHover={{ scale: inviteCode.trim() && !isLoading ? 1.01 : 1 }}
            whileTap={{ scale: inviteCode.trim() && !isLoading ? 0.99 : 1 }}
            className={`w-full h-12 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              inviteCode.trim() && !isLoading
                ? 'bg-[#5e6dd2] text-white hover:bg-[#6a79db]'
                : 'bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-[#5e6063] cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Verification...
              </>
            ) : (
              <>
                <Users className="w-4 h-4" strokeWidth={1.5} />
                Rejoindre la squad
              </>
            )}
          </motion.button>

          {/* Tips Section */}
          <motion.div variants={itemVariants} className="pt-4">
            <h3 className="text-xs font-medium text-[#5e6063] uppercase tracking-wider mb-3">
              Conseils
            </h3>
            <div className="space-y-2">
              {[
                'Le code est insensible a la casse',
                'Les codes expirent apres 7 jours',
                'Une squad peut avoir plusieurs codes actifs'
              ].map((tip, index) => (
                <div key={index} className="flex items-center gap-2.5 text-sm text-[#8b8d90]">
                  <span className="w-1 h-1 rounded-full bg-[#5e6dd2]" />
                  {tip}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default JoinSquadScreen;
