import { ArrowLeft, Share2, Link as LinkIcon, Check, Twitter, MessageCircle, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ShareScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface ShareOption {
  id: string;
  name: string;
  icon: any;
  color: string;
  bg: string;
  action: () => void;
}

export function ShareScreen({ onNavigate, showToast }: ShareScreenProps) {
  const [copied, setCopied] = useState(false);

  // Mock data for what's being shared
  const shareContent = {
    type: 'achievement',
    title: 'Fiabilité Parfaite 🏆',
    description: 'J\'ai débloqué le trophée "Fiabilité Parfaite" sur Squad Planner !',
    imageUrl: 'https://example.com/achievement.png',
    link: 'https://squadplanner.app/achievement/123',
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareContent.link);
    setCopied(true);
    showToast('Lien copié !', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`${shareContent.description}\n\n${shareContent.link}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    showToast('Ouverture de Twitter...', 'info');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`${shareContent.description}\n\n${shareContent.link}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    showToast('Ouverture de WhatsApp...', 'info');
  };

  const handleShareDiscord = () => {
    showToast('Copié pour Discord !', 'success');
    navigator.clipboard.writeText(`${shareContent.description}\n${shareContent.link}`);
  };

  const shareOptions: ShareOption[] = [
    {
      id: 'twitter',
      name: 'Twitter / X',
      icon: Twitter,
      color: 'text-[#1DA1F2]',
      bg: 'bg-[#1DA1F2]/10',
      action: handleShareTwitter,
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'text-[#25D366]',
      bg: 'bg-[#25D366]/10',
      action: handleShareWhatsApp,
    },
    {
      id: 'discord',
      name: 'Discord',
      icon: MessageCircle,
      color: 'text-[#5865F2]',
      bg: 'bg-[#5865F2]/10',
      action: handleShareDiscord,
    },
  ];

  return (
    <div className="min-h-screen pb-24 pt-safe">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => onNavigate('achievements')}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Partager
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium mt-1">
              Montre ton accomplissement
            </p>
          </div>
        </div>

        {/* Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] rounded-2xl p-6 mb-8 shadow-lg"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="text-white/90 text-sm font-semibold mb-2">
                Aperçu du partage
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {shareContent.title}
              </h2>
              <p className="text-white/90 text-sm font-medium">
                {shareContent.description}
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Share2 className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
          </div>
          
          {/* Mock Image Preview */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl h-32 flex items-center justify-center border border-white/20">
            <div className="text-white/60 text-sm font-medium">Image du trophée</div>
          </div>
        </motion.div>

        {/* Copy Link */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={handleCopyLink}
          className="w-full bg-white rounded-2xl p-5 mb-6 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
              copied ? 'bg-[var(--success-50)]' : 'bg-[var(--primary-50)]'
            }`}>
              {copied ? (
                <Check className="w-7 h-7 text-[var(--success-500)]" strokeWidth={2} />
              ) : (
                <Copy className="w-7 h-7 text-[var(--primary-500)]" strokeWidth={2} />
              )}
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                {copied ? 'Lien copié !' : 'Copier le lien'}
              </div>
              <div className="text-xs text-[var(--fg-tertiary)] font-medium truncate">
                {shareContent.link}
              </div>
            </div>
          </div>
        </motion.button>

        {/* Share Options */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[var(--fg-primary)] mb-4">
            Partager sur
          </h3>
          <div className="space-y-3">
            {shareOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onClick={option.action}
                  className="w-full bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${option.bg} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${option.color}`} strokeWidth={2} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-semibold text-[var(--fg-primary)]">
                        {option.name}
                      </div>
                    </div>
                    <Share2 className="w-5 h-5 text-[var(--fg-tertiary)]" strokeWidth={2} />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[var(--primary-50)] to-[var(--secondary-50)] rounded-2xl p-5 border-[0.5px] border-[var(--primary-100)]"
        >
          <div className="flex items-start gap-3">
            <Share2 className="w-5 h-5 text-[var(--primary-500)] flex-shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                Inspire ta communauté
              </div>
              <div className="text-xs text-[var(--fg-secondary)] font-medium leading-relaxed">
                Partage tes accomplissements pour motiver tes amis et montrer ta progression. Chaque partage renforce la communauté Squad Planner !
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
export default ShareScreen;
