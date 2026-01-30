/**
 * PREMIUM SCREEN - Design System Linear Dark
 * Structure: Header, Hero Banner, 3 Plans, FAQ
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/contexts/AuthContext";
import { useSubscription } from "@/app/contexts/SubscriptionContext";
import { upgradeToPremium, openCustomerPortal } from "@/utils/stripe";
import {
  ArrowLeft,
  Crown,
  Check,
  X,
  ChevronDown,
  Zap,
  Users,
  Calendar,
  BarChart3,
  Bot,
  Brain,
  Shield,
  Sparkles,
} from "lucide-react";

interface PremiumScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

// Animation variants
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

// Plans data
const plans = [
  {
    id: "free",
    name: "Free",
    price: "0",
    period: "Gratuit pour toujours",
    description: "Pour découvrir Squad Planner",
    features: [
      { text: "1 squad maximum", included: true },
      { text: "5 membres par squad", included: true },
      { text: "Sessions basiques", included: true },
      { text: "Historique 30 jours", included: true },
      { text: "Suggestions IA", included: false },
      { text: "Stats avancées", included: false },
      { text: "Bot Discord", included: false },
      { text: "Export calendrier", included: false },
    ],
    cta: "Plan actuel",
    popular: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: "4,99",
    period: "/mois",
    yearlyPrice: "2,99",
    yearlyTotal: "35,88",
    description: "Pour les gamers sérieux",
    features: [
      { text: "5 squads maximum", included: true },
      { text: "20 membres par squad", included: true },
      { text: "Sessions illimitées", included: true },
      { text: "Historique illimité", included: true },
      { text: "Suggestions IA", included: true },
      { text: "Stats avancées", included: true },
      { text: "Bot Discord basique", included: true },
      { text: "Export calendrier", included: false },
    ],
    cta: "Upgrader",
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "9,99",
    period: "/mois",
    yearlyPrice: "7,99",
    yearlyTotal: "95,88",
    description: "Pour les équipes compétitives",
    features: [
      { text: "Squads illimitées", included: true },
      { text: "Membres illimités", included: true },
      { text: "Sessions illimitées", included: true },
      { text: "Historique illimité", included: true },
      { text: "Suggestions IA avancées", included: true },
      { text: "Stats pro + analytics", included: true },
      { text: "Bot Discord complet", included: true },
      { text: "Export tous calendriers", included: true },
    ],
    cta: "Upgrader",
    popular: false,
  },
];

// FAQ data
const faqItems = [
  {
    question: "Puis-je annuler mon abonnement ?",
    answer: "Oui, vous pouvez annuler votre abonnement a tout moment depuis votre profil. Vous conserverez l'acces Premium jusqu'a la fin de votre periode de facturation.",
  },
  {
    question: "Comment fonctionne l'essai gratuit ?",
    answer: "L'essai gratuit de 7 jours vous donne acces a toutes les fonctionnalites Premium. Aucun paiement n'est requis pour commencer. Vous serez facture uniquement apres les 7 jours.",
  },
  {
    question: "Puis-je changer de plan ?",
    answer: "Oui, vous pouvez upgrader ou downgrader votre plan a tout moment. Le changement sera effectif immediatement et le prorata sera calcule automatiquement.",
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer: "Nous acceptons toutes les cartes bancaires (Visa, Mastercard, American Express) ainsi que PayPal. Les paiements sont securises par Stripe.",
  },
  {
    question: "Y a-t-il un engagement ?",
    answer: "Non, aucun engagement. L'abonnement mensuel est sans engagement. L'abonnement annuel offre une reduction de 40% et peut etre annule avec remboursement sous 14 jours.",
  },
];

export function PremiumScreen({ onNavigate, showToast }: PremiumScreenProps) {
  const { user } = useAuth();
  const { subscription, isPremium, isPro, isEnterprise, loading: subLoading } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const isSubscribed = isPremium || isPro || isEnterprise;

  // Get current plan ID
  const getCurrentPlanId = () => {
    if (isPro || isEnterprise) return "pro";
    if (isPremium) return "premium";
    return "free";
  };

  const currentPlanId = getCurrentPlanId();

  const handleSubscribe = async (planId: string) => {
    if (planId === "free" || planId === currentPlanId) return;

    if (!user?.id) {
      showToast("Veuillez vous connecter pour continuer", "error");
      onNavigate("login");
      return;
    }

    setIsProcessing(true);
    showToast("Redirection vers le paiement...", "info");

    try {
      await upgradeToPremium(user.id, billingCycle);
    } catch (error: any) {
      console.error("[Premium] Checkout error:", error);
      showToast("Erreur lors du paiement. Reessayez.", "error");
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
      showToast("Erreur d'ouverture du portail. Reessayez.", "error");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090a] pb-32">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#5e6dd2]/5 via-transparent to-transparent pointer-events-none" />

      <motion.div
        className="relative px-4 py-6 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
          <button
            onClick={() => onNavigate("profile")}
            className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.05)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#8b8d90]" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5e6dd2] to-[#8b5cf6] flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[#f7f8f8]">
                Squad Planner Premium
              </h1>
              <p className="text-sm text-[#8b8d90]">Choisissez votre plan</p>
            </div>
          </div>
        </motion.div>

        {/* Hero Banner */}
        <motion.div
          variants={itemVariants}
          className="relative rounded-2xl p-6 mb-8 overflow-hidden bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]"
        >
          {/* Gradient accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#5e6dd2]/10 via-[#8b5cf6]/5 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#5e6dd2]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[#5e6dd2]" />
              <span className="text-sm font-medium text-[#5e6dd2]">Offre speciale</span>
            </div>
            <h2 className="text-2xl font-bold text-[#f7f8f8] mb-2">
              Debloquez tout le potentiel de Squad Planner
            </h2>
            <p className="text-[#8b8d90] mb-4 max-w-lg">
              Intelligence artificielle, statistiques avancees, bot Discord et bien plus.
              Organisez vos sessions comme des pros.
            </p>

            {/* Quick features */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Brain, label: "IA Suggestions" },
                { icon: BarChart3, label: "Stats avancees" },
                { icon: Bot, label: "Bot Discord" },
                { icon: Calendar, label: "Sync Calendrier" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]"
                >
                  <item.icon className="w-4 h-4 text-[#5e6dd2]" />
                  <span className="text-sm text-[#f7f8f8]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-[rgba(255,255,255,0.08)] text-[#f7f8f8]"
                  : "text-[#8b8d90] hover:text-[#f7f8f8]"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                billingCycle === "yearly"
                  ? "bg-[#5e6dd2] text-white"
                  : "text-[#8b8d90] hover:text-[#f7f8f8]"
              }`}
            >
              Annuel
              <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                -40%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          {plans.map((plan) => {
            const isCurrentPlan = plan.id === currentPlanId;
            const displayPrice = billingCycle === "yearly" && plan.yearlyPrice
              ? plan.yearlyPrice
              : plan.price;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-5 bg-[rgba(255,255,255,0.02)] border transition-all ${
                  isCurrentPlan
                    ? "border-[#5e6dd2]"
                    : plan.popular
                    ? "border-[rgba(255,255,255,0.12)]"
                    : "border-[rgba(255,255,255,0.06)]"
                } ${plan.popular ? "md:-mt-2 md:mb-2" : ""}`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#5e6dd2] text-xs font-semibold text-white">
                    Populaire
                  </div>
                )}

                {/* Current plan badge */}
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 text-xs font-semibold text-white">
                    Plan actuel
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-4 pt-2">
                  <h3 className="text-lg font-semibold text-[#f7f8f8] mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-[#8b8d90]">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-[#f7f8f8]">
                      {displayPrice}
                    </span>
                    <span className="text-lg text-[#8b8d90]">€</span>
                    <span className="text-sm text-[#8b8d90]">{plan.period}</span>
                  </div>
                  {billingCycle === "yearly" && plan.yearlyTotal && (
                    <p className="text-xs text-[#8b8d90] mt-1">
                      Facture {plan.yearlyTotal}€/an
                    </p>
                  )}
                </div>

                {/* Features list */}
                <div className="space-y-2.5 mb-5">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      {feature.included ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <Check className="w-3 h-3 text-emerald-400" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-[rgba(255,255,255,0.04)] flex items-center justify-center">
                          <X className="w-3 h-3 text-[#8b8d90]/50" />
                        </div>
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? "text-[#f7f8f8]" : "text-[#8b8d90]/50"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isProcessing || isCurrentPlan || plan.id === "free"}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isCurrentPlan
                      ? "bg-[rgba(255,255,255,0.04)] text-[#8b8d90] cursor-default"
                      : plan.id === "free"
                      ? "bg-[rgba(255,255,255,0.04)] text-[#8b8d90] cursor-default"
                      : plan.popular
                      ? "bg-[#5e6dd2] hover:bg-[#6a79db] text-white"
                      : "bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] text-[#f7f8f8]"
                  }`}
                >
                  {isProcessing && !isCurrentPlan && plan.id !== "free" ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Chargement...
                    </span>
                  ) : isCurrentPlan ? (
                    "Plan actuel"
                  ) : plan.id === "free" ? (
                    "Plan gratuit"
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4" />
                      Upgrader
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </motion.div>

        {/* Manage subscription button for subscribed users */}
        {isSubscribed && (
          <motion.div variants={itemVariants} className="mb-12">
            <button
              onClick={handleManageSubscription}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-[#f7f8f8] font-medium flex items-center justify-center gap-2 hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              <Shield className="w-4 h-4 text-[#5e6dd2]" />
              Gerer mon abonnement
            </button>
          </motion.div>
        )}

        {/* FAQ Section */}
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold text-[#f7f8f8] mb-4">
            Questions frequentes
          </h3>
          <div className="space-y-2">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                >
                  <span className="text-sm font-medium text-[#f7f8f8]">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8b8d90] transition-transform ${
                      expandedFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-sm text-[#8b8d90] leading-relaxed">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex items-center justify-center gap-6 text-[#8b8d90]"
        >
          <div className="flex items-center gap-2 text-xs">
            <Shield className="w-4 h-4" />
            <span>Paiement securise</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.1)]" />
          <div className="flex items-center gap-2 text-xs">
            <Check className="w-4 h-4" />
            <span>Annulation facile</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.1)]" />
          <div className="flex items-center gap-2 text-xs">
            <Users className="w-4 h-4" />
            <span>+10,000 gamers</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default PremiumScreen;
