import { ArrowLeft, Share2, Check, Twitter, MessageCircle, Copy, Sparkles, ExternalLink, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, Button } from '@/design-system';

interface ShareScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface ShareOption {
  id: string;
  name: string;
  icon: any;
  gradient: string;
  shadow: string;
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
    title: 'Fiabilite Parfaite',
    description: 'J\'ai debloque le trophee "Fiabilite Parfaite" sur Squad Planner !',
    imageUrl: 'https://example.com/achievement.png',
    link: 'https://squadplanner.app/achievement/123',
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareContent.link);
    setCopied(true);
    showToast('Lien copie !', 'success');
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
    showToast('Copie pour Discord !', 'success');
    navigator.clipboard.writeText(`${shareContent.description}\n${shareContent.link}`);
  };

  const shareOptions: ShareOption[] = [
    {
      id: 'twitter',
      name: 'Twitter / X',
      icon: Twitter,
      gradient: 'from-sky-400 to-blue-500',
      shadow: 'shadow-sky-500/30',
      action: handleShareTwitter,
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      gradient: 'from-emerald-400 to-green-500',
      shadow: 'shadow-emerald-500/30',
      action: handleShareWhatsApp,
    },
    {
      id: 'discord',
      name: 'Discord',
      icon: MessageCircle,
      gradient: 'from-indigo-400 to-violet-500',
      shadow: 'shadow-indigo-500/30',
      action: handleShareDiscord,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.35 }}
      className="min-h-screen pb-24 pt-safe bg-[var(--bg-base)] relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/15 to-yellow-400/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <motion.button
              onClick={() => onNavigate('achievements')}
              className="w-12 h-12 rounded-2xl bg-[var(--bg-elevated)] backdrop-blur-sm border border-[var(--border-subtle)] flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[var(--fg-secondary)]" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Partager
              </h1>
              <p className="text-sm text-[var(--fg-secondary)] font-medium mt-0.5">
                Montre ton accomplissement
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Share2 className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Preview Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="relative overflow-hidden p-6 mb-8 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 border-0 shadow-xl shadow-orange-500/30">
              {/* Shine effect - Static for performance */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="text-white/80 text-sm font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Apercu du partage
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
                      {shareContent.title}
                    </h2>
                    <p className="text-white/90 text-sm font-medium">
                      {shareContent.description}
                    </p>
                  </div>
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Trophy className="w-8 h-8 text-white" strokeWidth={2} />
                  </motion.div>
                </div>

                {/* Mock Image Preview */}
                <div className="bg-white/15 backdrop-blur-sm rounded-xl h-32 flex items-center justify-center border border-white/20">
                  <div className="text-white/70 text-sm font-medium flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Image du trophee
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Copy Link */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card
              className="p-5 mb-6 cursor-pointer hover:shadow-xl transition-all"
              interactive
              onClick={handleCopyLink}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-md ${
                    copied
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-500/30'
                      : 'bg-gradient-to-br from-indigo-500 to-purple-500 shadow-indigo-500/30'
                  }`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {copied ? (
                    <Check className="w-7 h-7 text-white" strokeWidth={2.5} />
                  ) : (
                    <Copy className="w-7 h-7 text-white" strokeWidth={2} />
                  )}
                </motion.div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-bold tracking-tight text-[var(--fg-primary)] mb-1">
                    {copied ? 'Lien copie !' : 'Copier le lien'}
                  </div>
                  <div className="text-sm text-[var(--fg-secondary)] font-medium truncate">
                    {shareContent.link}
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-[var(--fg-tertiary)]" strokeWidth={2} />
              </div>
            </Card>
          </motion.div>

          {/* Share Options */}
          <motion.div variants={itemVariants} className="mb-6">
            <h3 className="text-sm font-bold tracking-tight text-[var(--fg-primary)] mb-4">
              Partager sur
            </h3>
            <div className="space-y-3">
              {shareOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <motion.div
                    key={option.id}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card
                      className="p-4 cursor-pointer hover:shadow-xl transition-all"
                      interactive
                      onClick={option.action}
                    >
                      <div className="flex items-center gap-4">
                        <motion.div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.gradient} flex items-center justify-center shadow-md ${option.shadow}`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                        </motion.div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-bold tracking-tight text-[var(--fg-primary)]">
                            {option.name}
                          </div>
                        </div>
                        <Share2 className="w-5 h-5 text-[var(--fg-tertiary)]" strokeWidth={2} />
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Info Banner */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="relative overflow-hidden p-5 bg-gradient-to-br from-indigo-500 to-purple-600 border-0 shadow-xl">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

              <div className="relative z-10 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <Share2 className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <div className="text-base font-bold tracking-tight text-white mb-1">
                    Inspire ta communaute
                  </div>
                  <div className="text-sm text-white/90 font-medium leading-relaxed">
                    Partage tes accomplissements pour motiver tes amis et montrer ta progression. Chaque partage renforce la communaute Squad Planner !
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ShareScreen;
