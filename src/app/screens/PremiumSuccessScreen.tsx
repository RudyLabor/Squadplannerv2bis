/**
 * Premium Success Screen - Post-Checkout Confirmation
 * Shown after successful Stripe payment
 * Design: Linear Dark Theme
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
  Zap,
  Brain,
  BarChart3,
  Calendar,
  Users,
  Loader2,
} from "lucide-react";

interface PremiumSuccessScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 28 }
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
    { icon: Brain, label: "Suggestions IA", description: "Créneaux optimaux basés sur l'IA" },
    { icon: BarChart3, label: "Stats avancées", description: "Analyse détaillée de votre squad" },
    { icon: Calendar, label: "Export calendrier", description: "Sync Google & Apple Calendar" },
    { icon: Users, label: "Squads illimitées", description: "Créez autant de squads que voulu" },
  ];

  return (
    <div className="min-h-screen bg-[#08090a] pb-24 md:pb-8">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#4ade80]/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        className="relative max-w-lg mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Loading state */}
        {isVerifying && (
          <motion.div
            className="min-h-[60vh] flex flex-col items-center justify-center"
            variants={itemVariants}
          >
            <div className="w-16 h-16 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center mb-6">
              <Loader2 className="w-8 h-8 text-[#5e6dd2] animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-[#f7f8f8] mb-2">
              Vérification du paiement...
            </h2>
            <p className="text-[#8b8d90] text-sm">
              Cela ne prendra que quelques secondes
            </p>
          </motion.div>
        )}

        {/* Success state */}
        {!isVerifying && verified && (
          <>
            {/* Success icon */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-8"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="relative"
              >
                <div className="w-20 h-20 rounded-full bg-[#4ade80] flex items-center justify-center shadow-[0_0_60px_rgba(74,222,128,0.3)]">
                  <Check className="w-10 h-10 text-[#08090a]" strokeWidth={3} />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#fbbf24] flex items-center justify-center"
                >
                  <Sparkles className="w-4 h-4 text-[#08090a]" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Success message */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-[#f7f8f8] mb-2">
                Bienvenue dans Premium!
              </h1>
              <p className="text-[#8b8d90]">
                Votre abonnement est maintenant actif
              </p>
            </motion.div>

            {/* Premium badge */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-8"
            >
              <div className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] flex items-center gap-2 shadow-[0_0_30px_rgba(251,191,36,0.2)]">
                <Crown className="w-5 h-5 text-[#08090a]" />
                <span className="text-sm font-semibold text-[#08090a]">Squad Planner Premium</span>
              </div>
            </motion.div>

            {/* Unlocked features card */}
            <motion.div
              variants={itemVariants}
              className="mb-8 p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]"
            >
              <h3 className="text-sm font-medium text-[#f7f8f8] mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#fbbf24]" />
                Fonctionnalités débloquées
              </h3>
              <div className="space-y-3">
                {unlockedFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[rgba(94,109,210,0.15)] flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-[#5e6dd2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#f7f8f8]">{feature.label}</p>
                      <p className="text-xs text-[#5e6063] truncate">{feature.description}</p>
                    </div>
                    <Check className="w-4 h-4 text-[#4ade80] flex-shrink-0" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA buttons */}
            <motion.div variants={itemVariants} className="space-y-3">
              <motion.button
                onClick={() => onNavigate("home")}
                className="w-full py-3.5 rounded-lg bg-[#5e6dd2] hover:bg-[#6a79db] text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Commencer à explorer
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                onClick={() => onNavigate("smart-suggestions")}
                className="w-full py-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] text-[#f7f8f8] text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Brain className="w-4 h-4 text-[#5e6dd2]" />
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
            <div className="w-16 h-16 rounded-2xl bg-[rgba(251,191,36,0.1)] flex items-center justify-center mb-6">
              <Crown className="w-8 h-8 text-[#fbbf24]" />
            </div>
            <h2 className="text-xl font-semibold text-[#f7f8f8] mb-2">
              Vérification en cours
            </h2>
            <p className="text-[#8b8d90] text-sm mb-6 max-w-xs">
              Votre paiement est en cours de traitement. Cela peut prendre quelques instants.
            </p>
            <motion.button
              onClick={() => onNavigate("premium")}
              className="px-5 py-2.5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] text-[#f7f8f8] text-sm font-medium transition-colors"
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
