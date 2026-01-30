import { ArrowLeft, Users, Ticket, Sparkles, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { squadsAPI } from '@/utils/api';

interface JoinSquadScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

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
    <div className="min-h-screen bg-[#08090a] pb-24 pt-safe">
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#5e6dd2]/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#5e6dd2]/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-6 max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <button
            onClick={() => onNavigate('home')}
            className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.06] flex items-center justify-center text-[#9ca3af] hover:text-white hover:bg-white/[0.08] transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-white tracking-tight">
              Rejoindre une squad
            </h1>
            <p className="text-sm text-[#6b7280]">
              Entre le code d'invitation
            </p>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Icon Hero */}
          <div className="flex flex-col items-center py-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#5e6dd2] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-[#5e6dd2]/20">
                <Users className="w-10 h-10 text-white" strokeWidth={1.5} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-[#10b981] flex items-center justify-center border-2 border-[#08090a]">
                <Ticket className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
            </div>
            <h2 className="mt-5 text-xl font-semibold text-white">
              Rejoins ton equipe
            </h2>
            <p className="mt-2 text-sm text-[#6b7280] text-center max-w-xs">
              Utilise le code fourni par un membre de ta squad pour les rejoindre
            </p>
          </div>

          {/* Code Input Card */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
            <label className="block text-sm font-medium text-[#9ca3af] mb-3">
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
                className="w-full h-14 px-4 bg-[#0f1011] border border-white/[0.08] rounded-xl text-white text-center text-xl font-mono tracking-[0.4em] placeholder:text-[#3f3f46] placeholder:tracking-[0.4em] focus:outline-none focus:border-[#5e6dd2]/50 transition-colors"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#5e6dd2]/0 via-[#5e6dd2]/5 to-[#5e6dd2]/0 pointer-events-none" />
            </div>

            {/* Helper text */}
            <p className="mt-3 text-xs text-[#4b5563] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#5e6dd2]" />
              Le code contient 6 caracteres alphanumeriques
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-[#1c1917]/50 border border-[#78350f]/30 rounded-xl p-4">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#78350f]/30 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-[#fbbf24]" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#fbbf24]">
                  Pas de code ?
                </h3>
                <p className="mt-1 text-sm text-[#a3a3a3]">
                  Demande le code d'invitation a un membre de la squad ou utilise le lien partage.
                </p>
              </div>
            </div>
          </div>

          {/* Join Button */}
          <motion.button
            onClick={handleJoin}
            disabled={!inviteCode.trim() || isLoading}
            whileHover={{ scale: inviteCode.trim() && !isLoading ? 1.01 : 1 }}
            whileTap={{ scale: inviteCode.trim() && !isLoading ? 0.98 : 1 }}
            className={`w-full h-12 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              inviteCode.trim() && !isLoading
                ? 'bg-[#5e6dd2] text-white hover:bg-[#6b7be0] shadow-lg shadow-[#5e6dd2]/25'
                : 'bg-white/[0.05] text-[#6b7280] cursor-not-allowed'
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
                <Users className="w-4 h-4" strokeWidth={2} />
                Rejoindre la squad
              </>
            )}
          </motion.button>

          {/* Tips Section */}
          <div className="pt-4">
            <h3 className="text-xs font-medium text-[#6b7280] uppercase tracking-wider mb-3">
              Conseils
            </h3>
            <div className="space-y-2">
              {[
                'Le code est insensible a la casse',
                'Les codes expirent apres 7 jours',
                'Une squad peut avoir plusieurs codes actifs'
              ].map((tip, index) => (
                <div key={index} className="flex items-center gap-2.5 text-sm text-[#9ca3af]">
                  <span className="w-1 h-1 rounded-full bg-[#5e6dd2]" />
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default JoinSquadScreen;
