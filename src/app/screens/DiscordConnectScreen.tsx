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
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Shield,
    title: 'Synchro des Rôles',
    description: 'Attribuez automatiquement le rôle "In Session" aux joueurs présents.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Recevez des notifications Discord pour les sessions et les rappels.',
    gradient: 'from-amber-500 to-orange-500',
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
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[#5865F2]/30 to-[#7289DA]/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
            <motion.button
              onClick={() => onNavigate('integrations')}
              className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#5865F2] to-[#7289DA] bg-clip-text text-transparent">
                Discord
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Connectez votre compte Discord
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-[#5865F2] flex items-center justify-center shadow-lg shadow-[#5865F2]/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </motion.div>
          </motion.div>

          {/* Connection Status Card */}
          <AnimatePresence mode="wait">
            {!loading && isConnected && discordUser && (
              <motion.div
                variants={itemVariants}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 mb-6 border border-emerald-200/50 shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {discordUser.avatar_url ? (
                      <img
                        src={discordUser.avatar_url}
                        alt="Discord Avatar"
                        className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-[#5865F2] flex items-center justify-center border-2 border-white shadow-md">
                        <User className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <motion.div
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-md"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </motion.div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-emerald-700 text-lg">Connecté</p>
                    <p className="text-sm text-emerald-600 font-medium truncate">{discordUser.username}</p>
                  </div>
                  <motion.button
                    onClick={handleDisconnect}
                    disabled={connecting}
                    className="w-12 h-12 rounded-xl bg-white text-red-500 flex items-center justify-center hover:bg-red-50 transition-all border border-red-200 shadow-sm"
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
            className="bg-[#5865F2] rounded-3xl p-8 text-center text-white mb-6 shadow-2xl shadow-[#5865F2]/30 relative overflow-hidden"
          >
            {/* Animated background circles */}
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"
              animate={{ scale: [1, 1.3, 1], y: [0, -20, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
            />

            <div className="relative">
              <motion.div
                className="w-24 h-24 bg-white/15 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <svg className="w-14 h-14 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </motion.div>

              <h2 className="text-3xl font-black mb-3">
                {isConnected ? 'Discord Connecté' : 'Connecter Discord'}
              </h2>
              <p className="text-white/80 mb-8 max-w-sm mx-auto leading-relaxed font-medium">
                {isConnected
                  ? 'Votre compte Discord est lié. Vous pouvez maintenant utiliser les fonctionnalités avancées.'
                  : 'Connectez votre compte Discord pour synchroniser vos sessions et recevoir des notifications.'}
              </p>

              {!isConnected && (
                <motion.button
                  onClick={handleConnect}
                  disabled={connecting || loading}
                  className="w-full h-14 bg-white text-[#5865F2] hover:bg-white/95 font-bold text-base rounded-2xl disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
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
                      <Zap className="w-5 h-5" />
                      Se connecter avec Discord
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div variants={itemVariants} className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Fonctionnalités
            </h3>
            <div className="space-y-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    variants={itemVariants}
                    custom={index}
                    className={`bg-white/80 backdrop-blur-sm p-5 rounded-2xl border ${
                      isConnected ? 'border-emerald-200/50 bg-emerald-50/30' : 'border-white/50'
                    } shadow-lg flex gap-4 transition-all`}
                    whileHover={{ scale: 1.01, y: -2 }}
                  >
                    <motion.div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 flex items-center gap-2">
                        {feature.title}
                        {isConnected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          </motion.div>
                        )}
                      </h4>
                      <p className="text-sm text-gray-500 font-medium line-clamp-2">
                        {feature.description}
                      </p>
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
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-[#5865F2]" />
                  Bot Discord (Optionnel)
                </h3>
                <motion.div
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-4 mb-5">
                    <motion.div
                      className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#5865F2] to-[#7289DA] flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Gamepad2 className="w-7 h-7 text-white" />
                    </motion.div>
                    <div>
                      <p className="font-bold text-gray-800">Squad Planner Bot</p>
                      <p className="text-sm text-gray-500 font-medium">Invitez le bot sur votre serveur</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => onNavigate('discord-bot')}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#5865F2] to-[#7289DA] text-white font-bold hover:shadow-lg hover:shadow-[#5865F2]/30 transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ExternalLink className="w-5 h-5" />
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
