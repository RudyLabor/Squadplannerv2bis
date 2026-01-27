import { ArrowLeft, Users, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { squadsAPI } from '@/utils/api';

interface JoinSquadScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

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
      const { squad, message } = await squadsAPI.join(inviteCode.trim());
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
    <div className="min-h-screen pb-24 pt-safe">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => onNavigate('home')}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
            Rejoindre une squad
          </h1>
        </div>

        {/* Info Card */}
        <div className="bg-[var(--secondary-50)] rounded-2xl p-5 mb-8 border-[0.5px] border-[var(--secondary-200)]">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[var(--secondary-500)] flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                Code d'invitation requis
              </h3>
              <p className="text-sm text-[var(--fg-tertiary)]">
                Demandez le code à un membre de la squad ou utilisez le lien d'invitation.
              </p>
            </div>
          </div>
        </div>

        {/* Invite Code Input */}
        <div className="mb-8">
          <label className="text-sm text-[var(--fg-secondary)] mb-3 block font-semibold">
            Code d'invitation
          </label>
          <Input
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            placeholder="Ex: ABC123"
            className="h-14 bg-white border-[0.5px] border-[var(--border-medium)] rounded-2xl shadow-sm focus:border-[var(--primary-500)] focus:ring-2 focus:ring-[var(--primary-500)]/20 text-center text-lg font-semibold tracking-wider"
          />
        </div>

        {/* Check Button */}
        <Button
          variant="primary"
          onClick={handleJoin}
          disabled={!inviteCode.trim() || isLoading}
          className="w-full h-14 bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] text-white rounded-2xl shadow-lg shadow-[var(--primary-500)]/20 hover:shadow-xl hover:shadow-[var(--primary-500)]/30 font-semibold disabled:opacity-40 transition-all duration-200"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Vérification...
            </div>
          ) : (
            'Vérifier le code'
          )}
        </Button>

      </div>
    </div>
  );
}
export default JoinSquadScreen;
