import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Download, Link2, Check, MessageCircle } from 'lucide-react';
import { generateICS, downloadICS, copyToClipboard } from '@/utils/dateUtils';

interface ShareSessionProps {
  session: {
    id: string;
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    squad: string;
    confirmedCount: number;
    totalSlots: number;
  };
  onClose?: () => void;
  className?: string;
}

export function ShareSession({ session, onClose, className = '' }: ShareSessionProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, type: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleExportICS = () => {
    const ics = generateICS(session);
    downloadICS(ics, `${session.title.replace(/\s+/g, '-').toLowerCase()}.ics`);
  };

  const sessionUrl = `${window.location.origin}/session/${session.id}`;

  const discordMessage = `🎮 **${session.title}**
📅 ${session.startDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
🏆 ${session.squad}
👥 ${session.confirmedCount}/${session.totalSlots} confirmés
🔗 ${sessionUrl}

Clique pour répondre ! ⚡`;

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6 rounded-2xl glass-3 border border-white/10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-[var(--primary-500)]/10">
            <Share2 className="w-6 h-6 text-[var(--primary-500)]" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black text-[var(--fg-primary)]">
              Partager la session
            </h3>
            <p className="text-sm text-[var(--fg-tertiary)]">
              {session.title}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Export ICS (Google Calendar, Outlook, etc.) */}
          <motion.button
            onClick={handleExportICS}
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[var(--primary-500)]/30 transition-all text-left"
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-lg bg-[var(--primary-500)]/10">
                <Download className="w-5 h-5 text-[var(--primary-500)]" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-[var(--fg-primary)]">
                  📅 Exporter vers calendrier
                </p>
                <p className="text-xs text-[var(--fg-tertiary)] mt-0.5">
                  Google Calendar, Outlook, Apple Calendar...
                </p>
              </div>
            </div>
          </motion.button>

          {/* Copier le lien */}
          <motion.button
            onClick={() => handleCopy(sessionUrl, 'link')}
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[var(--primary-500)]/30 transition-all text-left"
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-lg bg-[var(--primary-500)]/10">
                {copied === 'link' ? (
                  <Check className="w-5 h-5 text-[var(--success-500)]" />
                ) : (
                  <Link2 className="w-5 h-5 text-[var(--primary-500)]" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-bold text-[var(--fg-primary)]">
                  🔗 Copier le lien
                </p>
                <p className="text-xs text-[var(--fg-tertiary)] mt-0.5 truncate">
                  {sessionUrl}
                </p>
              </div>
              <AnimatePresence>
                {copied === 'link' && (
                  <motion.div
                    className="px-2 py-1 rounded-full bg-[var(--success-500)]/10 border border-[var(--success-500)]/30"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                  >
                    <span className="text-xs font-bold text-[var(--success-500)]">
                      Copié !
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.button>

          {/* Partager sur Discord */}
          <motion.button
            onClick={() => handleCopy(discordMessage, 'discord')}
            className="w-full p-4 rounded-xl bg-gradient-to-r from-[#5865F2]/10 to-[#5865F2]/5 border border-[#5865F2]/30 hover:border-[#5865F2]/50 transition-all text-left"
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-lg bg-[#5865F2]/20">
                {copied === 'discord' ? (
                  <Check className="w-5 h-5 text-[var(--success-500)]" />
                ) : (
                  <MessageCircle className="w-5 h-5 text-[#5865F2]" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-bold text-[var(--fg-primary)]">
                  💬 Partager sur Discord
                </p>
                <p className="text-xs text-[var(--fg-tertiary)] mt-0.5">
                  Copie le message formaté pour Discord
                </p>
              </div>
              <AnimatePresence>
                {copied === 'discord' && (
                  <motion.div
                    className="px-2 py-1 rounded-full bg-[var(--success-500)]/10 border border-[var(--success-500)]/30"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                  >
                    <span className="text-xs font-bold text-[var(--success-500)]">
                      Copié !
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.button>

          {/* Preview du message Discord */}
          <div className="p-4 rounded-xl bg-[#2B2D31] border border-[#40444B]">
            <p className="text-[10px] font-bold text-[#B5BAC1] mb-2 uppercase tracking-wider">
              Aperçu Discord
            </p>
            <div className="space-y-1 font-mono text-xs">
              <p className="text-white">🎮 <span className="font-bold">{session.title}</span></p>
              <p className="text-[#B5BAC1]">📅 {session.startDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
              <p className="text-[#B5BAC1]">🏆 {session.squad}</p>
              <p className="text-[#B5BAC1]">👥 {session.confirmedCount}/{session.totalSlots} confirmés</p>
              <p className="text-[#00AFF4] break-all">🔗 {sessionUrl}</p>
              <p className="text-[#B5BAC1] mt-2">Clique pour répondre ! ⚡</p>
            </div>
          </div>
        </div>

        {/* Close button */}
        {onClose && (
          <motion.button
            onClick={onClose}
            className="w-full mt-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--fg-secondary)] font-bold hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Fermer
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// Bouton compact pour partager
export function ShareButton({
  session,
  variant = 'default',
  className = ''
}: {
  session: ShareSessionProps['session'];
  variant?: 'default' | 'icon';
  className?: string;
}) {
  const [showModal, setShowModal] = useState(false);

  if (variant === 'icon') {
    return (
      <>
        <motion.button
          onClick={() => setShowModal(true)}
          className={`p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-[var(--primary-500)]/10 hover:border-[var(--primary-500)]/30 transition-all ${className}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Partager"
        >
          <Share2 className="w-4 h-4 text-[var(--fg-tertiary)]" />
        </motion.button>

        <AnimatePresence>
          {showModal && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[var(--z-modal)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
              />

              {/* Modal */}
              <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 pointer-events-none">
                <div className="pointer-events-auto max-w-md w-full">
                  <ShareSession session={session} onClose={() => setShowModal(false)} />
                </div>
              </div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      <motion.button
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-[var(--primary-500)]/10 hover:border-[var(--primary-500)]/30 transition-all ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Share2 className="w-4 h-4" />
        <span className="font-bold text-sm">Partager</span>
      </motion.button>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[var(--z-modal)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />

            <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 pointer-events-none">
              <div className="pointer-events-auto max-w-md w-full">
                <ShareSession session={session} onClose={() => setShowModal(false)} />
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
