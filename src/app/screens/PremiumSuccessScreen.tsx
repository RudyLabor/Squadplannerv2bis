/**
 * Premium Success Screen - Post-Checkout Confirmation
 * Shown after successful Stripe payment
 */

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useSubscription } from "@/app/contexts/SubscriptionContext";
import {
  Crown,
  Check,
  Sparkles,
  ArrowRight,
  PartyPopper,
  Zap,
  Brain,
  BarChart3,
  Calendar,
  Users,
} from "lucide-react";
import { SkeletonPage } from "@/design-system";

interface PremiumSuccessScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
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

export function PremiumSuccessScreen({ onNavigate, showToast }: PremiumSuccessScreenProps) {
  const [searchParams] = useSearchParams();
  const { refreshSubscription } = useSubscription();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setIsVerifying(false);
        return;
      }

      try {
        // Wait a moment for Stripe webhook to process
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Refresh subscription data
        await refreshSubscription();

        setVerified(true);
        showToast("Bienvenue dans la famille Premium!", "success");
      } catch (error) {
        console.error("[PremiumSuccess] Verification error:", error);
        showToast("Vérification en cours...", "info");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, refreshSubscription, showToast]);

  const unlockedFeatures = [
    { icon: Brain, label: "Suggestions IA", description: "Créneaux optimaux" },
    { icon: BarChart3, label: "Stats avancées", description: "Analyse détaillée" },
    { icon: Calendar, label: "Export calendrier", description: "Sync complète" },
    { icon: Users, label: "Squads illimitées", description: "Sans limite" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-32 overflow-hidden">
      {/* Background - Static for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 -left-20 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="relative px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Loading state */}
        {isVerifying && (
          <motion.div
            className="min-h-[60vh]"
            variants={itemVariants}
          >
            <SkeletonPage />
          </motion.div>
        )}

        {/* Success state */}
        {!isVerifying && verified && (
          <>
            {/* Success icon */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="relative"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                  <Check className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <PartyPopper className="w-8 h-8 text-amber-400" />
                </div>
              </motion.div>
            </motion.div>

            {/* Success message */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h1 className="text-3xl font-black tracking-tight text-white mb-2">
                Bienvenue Premium!
              </h1>
              <p className="text-white/60">
                Votre abonnement est maintenant actif
              </p>
            </motion.div>

            {/* Premium badge */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-8"
            >
              <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 flex items-center gap-3 shadow-xl shadow-amber-500/30">
                <Crown className="w-6 h-6 text-white" />
                <span className="text-lg font-bold text-white">Squad Planner Premium</span>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </motion.div>

            {/* Unlocked features */}
            <motion.div variants={itemVariants} className="mb-8">
              <h3 className="text-lg font-bold tracking-tight text-white mb-4 flex items-center gap-2 justify-center">
                <Zap className="w-5 h-5 text-amber-400" />
                Fonctionnalités débloquées
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {unlockedFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white text-sm">{feature.label}</p>
                        <p className="text-xs text-white/50">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA buttons */}
            <motion.div variants={itemVariants} className="space-y-3">
              <motion.button
                onClick={() => onNavigate("home")}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Commencer à explorer
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                onClick={() => onNavigate("smart-suggestions")}
                className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Brain className="w-4 h-4" />
                Essayer les suggestions IA
              </motion.button>
            </motion.div>
          </>
        )}

        {/* Error/No session state */}
        {!isVerifying && !verified && (
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
              <Crown className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white mb-2">
              Vérification en cours
            </h2>
            <p className="text-white/60 mb-6 max-w-xs">
              Votre paiement est en cours de traitement. Cela peut prendre quelques instants.
            </p>
            <motion.button
              onClick={() => onNavigate("premium")}
              className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Retour aux offres Premium
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default PremiumSuccessScreen;
