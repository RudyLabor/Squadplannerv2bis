/**
 * 👑 PREMIUM SCREEN - Refonte UI Premium
 * Design System v3 - Animations + Glassmorphism
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/contexts/AuthContext";
import { useSubscription } from "@/app/contexts/SubscriptionContext";
import { upgradeToPremium, openCustomerPortal } from "@/utils/stripe";
import {
  ArrowLeft,
  Crown,
  Brain,
  BarChart3,
  Clock,
  Calendar,
  Bot,
  Users,
  Check,
  ChevronRight,
  Star,
  Sparkles,
  Zap,
  Shield,
  Gift,
} from "lucide-react";
import { IconButton, SkeletonPage } from "@/design-system";

interface PremiumScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
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

const featureVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, type: "spring", stiffness: 300, damping: 24 }
  })
};

export function PremiumScreen({ onNavigate, showToast }: PremiumScreenProps) {
  const { user } = useAuth();
  const { subscription, isPremium, isPro, isEnterprise, loading: subLoading } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const isSubscribed = isPremium || isPro || isEnterprise;

  const price = billingCycle === "yearly" ? "2,99" : "4,99";
  const yearlyPrice = "35,88";
  const originalYearlyPrice = "59,88";
  const discount = "40%";

  const features = [
    {
      icon: Brain,
      title: "Suggestions IA",
      description: "Créneaux optimaux basés sur votre historique",
      gradient: "from-purple-500 to-indigo-600",
    },
    {
      icon: BarChart3,
      title: "Stats avancées",
      description: "Analyse détaillée de vos performances",
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      icon: Clock,
      title: "Historique illimité",
      description: "Accès à toutes vos sessions passées",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: Calendar,
      title: "Export calendrier",
      description: "Sync Google, Apple, Outlook",
      gradient: "from-orange-500 to-amber-600",
    },
    {
      icon: Bot,
      title: "Bot Discord avancé",
      description: "Automatisation complète Discord",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      icon: Users,
      title: "Rôles personnalisés",
      description: "Coach, Manager, Capitaine, etc.",
      gradient: "from-pink-500 to-rose-600",
    },
    {
      icon: Crown,
      title: "Squads illimitées",
      description: "Créez autant de squads que vous voulez",
      gradient: "from-amber-500 to-orange-600",
    },
  ];

  const testimonials = [
    {
      text: "Les suggestions IA sont incroyables. On a doublé notre fréquence de jeu !",
      author: "RudyFramade",
      squad: "FragGirls",
      avatar: "🎮",
    },
    {
      text: "Export calendrier = game changer. Plus aucune excuse de no-show.",
      author: "KANA",
      squad: "Apex Legends Squad",
      avatar: "🦊",
    },
  ];

  const handleSubscribe = async () => {
    if (!user?.id) {
      showToast("Veuillez vous connecter pour continuer", "error");
      onNavigate("login");
      return;
    }

    setIsProcessing(true);
    showToast("Redirection vers le paiement...", "info");

    try {
      await upgradeToPremium(user.id, billingCycle);
      // Stripe will redirect to checkout page
    } catch (error: any) {
      console.error("[Premium] Checkout error:", error);
      showToast("Erreur lors du paiement. Réessayez.", "error");
      setIsProcessing(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsProcessing(true);
    showToast("Ouverture du portail de gestion...", "info");

    try {
      await openCustomerPortal();
    } catch (error: any) {
      console.error("[Premium] Portal error:", error);
      showToast("Erreur d'ouverture du portail. Réessayez.", "error");
      setIsProcessing(false);
    }
  };

  // Format subscription tier for display
  const getTierLabel = () => {
    if (isEnterprise) return "Enterprise";
    if (isPro) return "Pro";
    if (isPremium) return "Premium";
    return "Free";
  };

  const getNextBillingDate = () => {
    if (!subscription?.current_period_end) return null;
    return new Date(subscription.current_period_end).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-32 overflow-hidden">
      {/* Background elements - Static for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl" />
      </div>

      <motion.div
        className="relative px-4 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
          <IconButton
            icon={<ArrowLeft className="w-5 h-5 text-white/70" />}
            onClick={() => onNavigate("profile")}
            variant="ghost"
            aria-label="Retour au profil"
            className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-400" />
              <h1 className="text-xl font-bold tracking-tight text-white">
                Squad Planner
              </h1>
            </div>
            <p className="text-sm text-white/50">Passez au niveau supérieur</p>
          </div>
        </motion.div>

        {/* Loading state */}
        {subLoading && (
          <motion.div
            variants={itemVariants}
            className="py-8"
          >
            <SkeletonPage />
          </motion.div>
        )}

        {/* Already Subscribed Card */}
        {isSubscribed && !subLoading && (
          <motion.div
            variants={itemVariants}
            className="relative rounded-3xl p-6 mb-8 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/20 backdrop-blur-xl rounded-3xl border border-emerald-500/30" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-white">Abonnement {getTierLabel()}</h3>
                    <p className="text-sm text-emerald-400">Actif</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
              </div>

              {getNextBillingDate() && (
                <p className="text-sm text-white/60 mb-4">
                  Prochain renouvellement : {getNextBillingDate()}
                </p>
              )}

              <motion.button
                onClick={handleManageSubscription}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isProcessing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Gérer mon abonnement
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Hero Card with glassmorphism - Only show if not subscribed */}
        {!isSubscribed && !subLoading && (
          <motion.div
            variants={itemVariants}
            className="relative rounded-3xl p-6 mb-8 overflow-hidden"
          >
            {/* Glass background */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-pink-500/20 backdrop-blur-xl rounded-3xl border border-white/10" />

            {/* Subtle glow - static for performance */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0" />

            <div className="relative z-10">
              {/* Premium badge */}
              <div className="flex justify-center mb-4">
                <div className="px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-xs font-bold text-white flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  PREMIUM
                  <Sparkles className="w-3 h-3" />
                </div>
              </div>

              {/* Crown icon */}
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-amber-500/30">
                  <Crown className="w-10 h-10 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white text-center mb-2">
                Débloquez votre potentiel
              </h2>
              <p className="text-sm text-white/60 text-center max-w-xs mx-auto">
                Intelligence artificielle, stats avancées, automatisation complète.
                Tout pour organiser vos sessions comme des pros.
              </p>
            </div>
          </motion.div>
        )}

        {/* Billing Toggle - Premium style - Only show if not subscribed */}
        {!isSubscribed && !subLoading && (
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <motion.button
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white/70"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Mensuel
              </motion.button>
              <motion.button
                onClick={() => setBillingCycle("yearly")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all relative ${
                  billingCycle === "yearly"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                    : "text-white/50 hover:text-white/70"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Annuel
                {billingCycle === "yearly" && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] font-bold text-white"
                  >
                    -{discount}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Price - Big and bold - Only show if not subscribed */}
        {!isSubscribed && !subLoading && (
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="flex items-baseline justify-center gap-1">
              <motion.span
                key={price}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl font-black text-white"
              >
                {price}
              </motion.span>
              <span className="text-2xl text-white/50 font-medium">€</span>
              <span className="text-lg text-white/40">/mois</span>
            </div>
            <AnimatePresence mode="wait">
              {billingCycle === "yearly" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2"
                >
                  <p className="text-sm text-white/40">
                    Facturé {yearlyPrice}€/an
                    <span className="ml-2 line-through text-white/30">{originalYearlyPrice}€</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* CTA Button - Super premium - Only show if not subscribed */}
        {!isSubscribed && !subLoading && (
          <motion.div variants={itemVariants} className="mb-8">
            <motion.button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className={`w-full h-16 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white shadow-2xl shadow-amber-500/30 relative overflow-hidden ${isProcessing ? 'opacity-80 cursor-wait' : ''}`}
              whileHover={!isProcessing ? { scale: 1.02, y: -2 } : {}}
              whileTap={!isProcessing ? { scale: 0.98 } : {}}
            >
              {/* Subtle shine - static for performance */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="relative z-10 flex items-center gap-2">
                {isProcessing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="w-5 h-5" />
                    </motion.div>
                    Redirection en cours...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Commencer l'essai gratuit
                    <Gift className="w-5 h-5" />
                  </>
                )}
              </span>
            </motion.button>
            <motion.div
              className="flex items-center justify-center gap-4 mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-1.5 text-white/40 text-xs">
                <Shield className="w-3.5 h-3.5" />
                <span>7 jours gratuits</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-1.5 text-white/40 text-xs">
                <Check className="w-3.5 h-3.5" />
                <span>Annulation facile</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Features - Animated list */}
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-bold tracking-tight text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Tout ce qui est inclus
          </h3>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={featureVariants}
                initial="hidden"
                animate="visible"
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
                className="relative"
              >
                <motion.div
                  className={`flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all ${
                    hoveredFeature === index ? 'bg-white/10 border-white/20' : ''
                  }`}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">
                        {feature.title}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                        PRO
                      </span>
                    </div>
                    <p className="text-sm text-white/50 truncate">
                      {feature.description}
                    </p>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.3 }}
                  >
                    <Check className="w-5 h-5 text-emerald-400" />
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Premium Tools - Quick access */}
        <motion.div variants={itemVariants} className="mt-8">
          <h3 className="text-lg font-bold tracking-tight text-white mb-4">
            Outils Premium
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Stats", icon: BarChart3, screen: "advanced-stats", color: "from-blue-500 to-cyan-500" },
              { label: "Coaching", icon: Brain, screen: "coaching-tools", color: "from-purple-500 to-pink-500" },
              { label: "Calendrier", icon: Calendar, screen: "calendar-sync", color: "from-orange-500 to-amber-500" },
            ].map((tool, index) => (
              <motion.button
                key={index}
                onClick={() => onNavigate(tool.screen)}
                className="relative p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-20 transition-opacity`}
                />
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <tool.icon className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
                  <span className="text-xs font-medium text-white/70 group-hover:text-white transition-colors">
                    {tool.label}
                  </span>
                </div>
                <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-hover:text-white/50 transition-colors" />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Testimonials - Glowing cards */}
        <motion.div variants={itemVariants} className="mt-8">
          <h3 className="text-lg font-bold tracking-tight text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            Témoignages
          </h3>
          <div className="space-y-4">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="relative p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden"
              >
                {/* Glow effect */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-2xl" />

                <div className="relative z-10">
                  <p className="text-sm text-white/80 italic mb-4 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs text-white/50">
                        {testimonial.author} • {testimonial.squad}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          variants={itemVariants}
          className="mt-10 text-center"
        >
          <p className="text-white/50 text-sm">
            Rejoins +10,000 gamers Premium
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default PremiumScreen;
