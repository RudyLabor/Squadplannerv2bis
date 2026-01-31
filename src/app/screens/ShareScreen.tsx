import { ArrowLeft, Share2, Check, Twitter, MessageCircle, Copy, Sparkles, ExternalLink, Trophy, Link2, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ShareScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface ShareOption {
  id: string;
  name: string;
  description: string;
  icon: any;
  iconBg: string;
  action: () => void;
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

export function ShareScreen({ onNavigate, showToast }: ShareScreenProps) {
  const [copied, setCopied] = useState(false);

  // Mock data for what's being shared
  const shareContent = {
    type: 'achievement',
    title: 'Fiabilité Parfaite',
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
      description: 'Partager sur X',
      icon: Twitter,
      iconBg: 'bg-[#1DA1F2]',
      action: handleShareTwitter,
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      description: 'Envoyer à un contact',
      icon: MessageCircle,
      iconBg: 'bg-[#25D366]',
      action: handleShareWhatsApp,
    },
    {
      id: 'discord',
      name: 'Discord',
      description: 'Copier pour Discord',
      icon: MessageCircle,
      iconBg: 'bg-[#5865F2]',
      action: handleShareDiscord,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#08090a] pb-24 md:pb-8"
    >
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <motion.button
              onClick={() => onNavigate('achievements')}
              className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[#8b8d90]" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-[#f7f8f8]">
                Partager
              </h1>
              <p className="text-sm text-[#8b8d90]">
                Montre ton accomplissement
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#5e6dd2] flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Preview Card */}
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <div className="rounded-xl bg-gradient-to-br from-[#5e6dd2] to-[#8b5cf6] p-5 relative overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-white/70 text-xs font-medium mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      APERÇU DU PARTAGE
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-1">
                      {shareContent.title}
                    </h2>
                    <p className="text-sm text-white/80">
                      {shareContent.description}
                    </p>
                  </div>
                  <motion.div
                    className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Trophy className="w-7 h-7 text-white" />
                  </motion.div>
                </div>

                {/* Mock Image Preview */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg h-28 flex items-center justify-center border border-white/10">
                  <div className="text-white/60 text-sm flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Image du trophée
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Copy Link Section */}
          <motion.div variants={itemVariants} className="mb-6">
            <motion.button
              onClick={handleCopyLink}
              className="w-full rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] p-4 hover:bg-[rgba(255,255,255,0.04)] transition-all group"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  copied
                    ? 'bg-[#10b981]'
                    : 'bg-[#5e6dd2]'
                }`}>
                  {copied ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : (
                    <Link2 className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-[#f7f8f8] mb-0.5">
                    {copied ? 'Lien copié !' : 'Copier le lien'}
                  </div>
                  <div className="text-xs text-[#5e6063] truncate max-w-[200px] md:max-w-none">
                    {shareContent.link}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#5e6063] group-hover:text-[#8b8d90] transition-colors" />
              </div>
            </motion.button>
          </motion.div>

          {/* Share Options */}
          <motion.div variants={itemVariants} className="mb-6">
            <h3 className="text-xs font-medium text-[#5e6063] uppercase tracking-wider mb-3 px-1">
              Partager sur
            </h3>
            <div className="space-y-2">
              {shareOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <motion.button
                    key={option.id}
                    onClick={option.action}
                    className="w-full rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] p-4 hover:bg-[rgba(255,255,255,0.04)] transition-all group"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg ${option.iconBg} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-[#f7f8f8]">
                          {option.name}
                        </div>
                        <div className="text-xs text-[#5e6063]">
                          {option.description}
                        </div>
                      </div>
                      <Share2 className="w-4 h-4 text-[#5e6063] group-hover:text-[#8b8d90] transition-colors" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Info Banner */}
          <motion.div variants={itemVariants}>
            <div className="rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[rgba(94,109,210,0.15)] flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-[#5e6dd2]" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#f7f8f8] mb-1">
                    Inspire ta communauté
                  </div>
                  <div className="text-xs text-[#8b8d90] leading-relaxed">
                    Partage tes accomplissements pour motiver tes amis et montrer ta progression. Chaque partage renforce la communauté Squad Planner !
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Summary */}
          <motion.div
            variants={itemVariants}
            className="mt-6 grid grid-cols-3 gap-3"
          >
            {[
              { label: 'Partages', value: '24' },
              { label: 'Vues', value: '156' },
              { label: 'Clics', value: '42' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] p-4 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <div className="text-lg font-semibold text-[#f7f8f8]">{stat.value}</div>
                <div className="text-xs text-[#5e6063]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ShareScreen;
