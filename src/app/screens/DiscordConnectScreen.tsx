import { ArrowLeft, Gamepad2, Shield, ExternalLink, CheckCircle2, Loader2, LogOut, User, MessageSquare, Bell, Zap, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/app/contexts/UserContext';
import { supabase } from '@/utils/supabase/client';

interface DiscordConnectScreenProps {
  onNavigate: (screen: string) => void;
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

const features = [
  {
    icon: MessageSquare,
    title: 'Commandes Slash',
    description: 'Utilisez /plan pour créer une session et /join pour rejoindre sans quitter Discord.',
  },
  {
    icon: Shield,
    title: 'Synchro des Rôles',
    description: 'Attribuez automatiquement le rôle "In Session" aux joueurs présents.',
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Recevez des notifications Discord pour les sessions et les rappels.',
  },
];

export function DiscordConnectScreen({ onNavigate, showToast }: DiscordConnectScreenProps) {
  const { userProfile, updateUserProfile } = useUser();
  const [connecting, setConnecting] = useState(false);
  const [discordUser, setDiscordUser] = useState<{ username?: string; avatar_url?: string; id?: string } | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkDiscordConnection();
  }, [userProfile]);

  const checkDiscordConnection = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const discordIdentity = user.identities?.find(id => id.provider === 'discord');
        if (discordIdentity) {
          setIsConnected(true);
          setDiscordUser({
            username: discordIdentity.identity_data?.full_name || discordIdentity.identity_data?.name || discordIdentity.identity_data?.global_name,
            avatar_url: discordIdentity.identity_data?.avatar_url,
            id: discordIdentity.identity_data?.provider_id,
          });
        } else if (userProfile?.integrations?.discord?.connected) {
          setIsConnected(true);
          const discordIntegration = userProfile.integrations.discord as { connected: boolean; username?: string };
          setDiscordUser({
            username: discordIntegration.username,
          });
        } else {
          setIsConnected(false);
          setDiscordUser(null);
        }
      }
    } catch (error) {
      console.error('Error checking Discord connection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: `${window.location.origin}/discord-connect`,
          scopes: 'identify guilds',
          skipBrowserRedirect: false,
        },
      });

      if (error) throw error;
      showToast('Redirection vers Discord...', 'info');
    } catch (error: any) {
      console.error('Discord connection error:', error);
      showToast(error.message || 'Erreur de connexion Discord', 'error');
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setConnecting(true);
    try {
      await updateUserProfile({
        integrations: {
          ...userProfile.integrations,
          discord: {
            connected: false,
            username: undefined,
          },
        },
      });

      setIsConnected(false);
      setDiscordUser(null);
      showToast('Discord déconnecté de l\'app', 'info');
    } catch (error: any) {
      console.error('Discord disconnect error:', error);
      showToast('Erreur lors de la déconnexion', 'error');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-safe bg-[#08090a] relative overflow-hidden">
      {/* Background subtle gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#5865F2]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#5865F2]/5 rounded-full blur-[100px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }}
      />

      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <motion.button
              onClick={() => onNavigate('integrations')}
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.1)] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[#8b8d90]" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-[#f7f8f8]">
                Discord
              </h1>
              <p className="text-sm text-[#5e6063]">
                Connectez votre compte Discord
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#5865F2] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </div>
          </motion.div>

          {/* Connection Status Card */}
          <AnimatePresence mode="wait">
            {!loading && isConnected && discordUser && (
              <motion.div
                variants={itemVariants}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-emerald-500/10 rounded-2xl p-4 mb-6 border border-emerald-500/20"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {discordUser.avatar_url ? (
                      <img
                        src={discordUser.avatar_url}
                        alt="Discord Avatar"
                        className="w-14 h-14 rounded-xl object-cover border border-[rgba(255,255,255,0.06)]"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-[#5865F2] flex items-center justify-center border border-[rgba(255,255,255,0.06)]">
                        <User className="w-7 h-7 text-[#f7f8f8]" />
                      </div>
                    )}
                    <motion.div
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#08090a] flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                    >
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </motion.div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-emerald-400">Connecte</p>
                    <p className="text-sm text-[#8b8d90] truncate">{discordUser.username}</p>
                  </div>
                  <motion.button
                    onClick={handleDisconnect}
                    disabled={connecting}
                    className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {connecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hero Section */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl p-6 text-center mb-6 border border-[#5865F2]/30 bg-gradient-to-b from-[#5865F2]/10 to-transparent relative overflow-hidden"
          >
            {/* Glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-[#5865F2]/20 blur-3xl" />

            <div className="relative">
              <motion.div
                className="w-20 h-20 bg-[#5865F2]/20 border border-[#5865F2]/30 rounded-2xl flex items-center justify-center mx-auto mb-5"
                whileHover={{ scale: 1.05 }}
              >
                <svg className="w-10 h-10 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </motion.div>

              <h2 className="text-2xl font-bold text-[#f7f8f8] mb-2">
                {isConnected ? 'Discord Connecté' : 'Connecter Discord'}
              </h2>
              <p className="text-[#8b8d90] mb-6 max-w-sm mx-auto text-sm leading-relaxed">
                {isConnected
                  ? 'Votre compte Discord est lié. Vous pouvez maintenant utiliser les fonctionnalités avancées.'
                  : 'Connectez votre compte Discord pour synchroniser vos sessions et recevoir des notifications.'}
              </p>

              {!isConnected && (
                <motion.button
                  onClick={handleConnect}
                  disabled={connecting || loading}
                  className="w-full h-12 bg-[#5865F2] hover:bg-[#4752C4] text-[#f7f8f8] font-medium text-sm rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : connecting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Se connecter avec Discord
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div variants={itemVariants} className="mb-6">
            <h3 className="text-sm font-medium text-[#5e6063] mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#5865F2]" />
              Fonctionnalites
            </h3>
            <div className="space-y-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    variants={itemVariants}
                    custom={index}
                    className={`p-4 rounded-xl border transition-all ${
                      isConnected
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)]'
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isConnected
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-[#5865F2]/20 text-[#5865F2]'
                      }`}>
                        <Icon className="w-5 h-5" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-[#f7f8f8] flex items-center gap-2 text-sm">
                          {feature.title}
                          {isConnected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500 }}
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            </motion.div>
                          )}
                        </h4>
                        <p className="text-xs text-[#5e6063] mt-1 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Bot Invite Section */}
          <AnimatePresence>
            {isConnected && (
              <motion.div
                variants={itemVariants}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <h3 className="text-sm font-medium text-[#5e6063] mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <Gamepad2 className="w-4 h-4 text-[#5865F2]" />
                  Bot Discord (Optionnel)
                </h3>
                <motion.div
                  className="rounded-xl p-5 border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]"
                  whileHover={{ borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/30 flex items-center justify-center">
                      <Gamepad2 className="w-6 h-6 text-[#5865F2]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#f7f8f8]">Squad Planner Bot</p>
                      <p className="text-xs text-[#5e6063]">Invitez le bot sur votre serveur</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => onNavigate('discord-bot')}
                    className="w-full py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-[#f7f8f8] font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Configurer le Bot
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default DiscordConnectScreen;
