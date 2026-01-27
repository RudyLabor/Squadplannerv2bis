/**
 * 👑 PREMIUM SCREEN - Aligné sur maquette Figma
 * Design System v2 - Mobile-first
 */

import { useState } from "react";
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
} from "lucide-react";
import { ActionButton, Badge } from "@/app/components/ui/DesignSystem";

interface PremiumScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

export function PremiumScreen({ onNavigate, showToast }: PremiumScreenProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const price = billingCycle === "yearly" ? "2,99" : "4,99";
  const yearlyPrice = "35,88";
  const originalYearlyPrice = "59,88";
  const discount = "-40%";

  const features = [
    {
      icon: Brain,
      title: "Suggestions IA",
      description: "Créneaux optimaux basés sur votre historique",
      isPro: true,
    },
    {
      icon: BarChart3,
      title: "Stats avancées",
      description: "Analyse détaillée de vos performances",
      isPro: true,
    },
    {
      icon: Clock,
      title: "Historique illimité",
      description: "Accès à toutes vos sessions passées",
      isPro: true,
    },
    {
      icon: Calendar,
      title: "Export calendrier",
      description: "Sync Google, Apple, Outlook",
      isPro: true,
    },
    {
      icon: Bot,
      title: "Bot Discord avancé",
      description: "Automatisation complète Discord",
      isPro: true,
    },
    {
      icon: Users,
      title: "Rôles personnalisés",
      description: "Coach, Manager, Capitaine, etc.",
      isPro: true,
    },
    {
      icon: Crown,
      title: "Squads illimitées",
      description: "Créez autant de squads que vous voulez",
      isPro: true,
    },
  ];

  const testimonials = [
    {
      text: "Les suggestions IA sont incroyables. On a doublé notre fréquence de jeu !",
      author: "RudyFramade",
      squad: "FragGirls",
    },
    {
      text: "Export calendrier = game changer. Plus aucune excuse de no-show.",
      author: "KANA",
      squad: "Apex Legends Squad",
    },
  ];

  const handleSubscribe = () => {
    showToast("Redirection vers le paiement...", "info");
    // In real app, redirect to Stripe/payment
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => onNavigate("profile")}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-500" />
            <h1 className="text-lg font-semibold text-gray-900">
              Squad Planner Premium
            </h1>
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-6 border border-amber-100">
          <p className="text-sm text-gray-500 text-center mb-4">
            Débloquez tout le potentiel de votre squad
          </p>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Crown className="w-7 h-7 text-white" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 text-center mb-1">
            Premium
          </h2>
          <p className="text-sm text-gray-500 text-center mb-4">
            Pour les squads sérieuses
          </p>

          <p className="text-xs text-gray-500 text-center max-w-xs mx-auto">
            Intelligence artificielle, stats avancées, automatisation complète.
            Tout ce dont vous avez besoin pour organiser vos sessions comme des
            pros.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`text-sm font-medium transition-colors ${
              billingCycle === "monthly" ? "text-gray-900" : "text-gray-400"
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              billingCycle === "yearly"
                ? "bg-amber-500 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Annuel
            {billingCycle === "yearly" && (
              <span className="ml-2 text-xs bg-white/20 px-1.5 py-0.5 rounded">
                {discount}
              </span>
            )}
          </button>
        </div>

        {/* Price */}
        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-gray-900">{price}</span>
            <span className="text-lg text-gray-500">€/mois</span>
          </div>
          {billingCycle === "yearly" && (
            <p className="text-sm text-gray-500 mt-1">
              Soit {yearlyPrice} € / an{" "}
              <span className="line-through">(au lieu de {originalYearlyPrice} €)</span>
            </p>
          )}
        </div>

        {/* CTA Button */}
        <ActionButton
          variant="primary"
          onClick={handleSubscribe}
          className="w-full mb-2"
        >
          Passer Premium
        </ActionButton>
        <p className="text-xs text-gray-400 text-center mb-8">
          Annulation possible à tout moment • 7 jours d'essai gratuit
        </p>

        {/* Features */}
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Tout ce qui est inclus
        </h3>
        <div className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 text-sm">
                    {feature.title}
                  </span>
                  {feature.isPro && <Badge variant="pro">PRO</Badge>}
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {feature.description}
                </p>
              </div>
              <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            </div>
          ))}
        </div>

        {/* Premium Tools */}
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Outils Premium
        </h3>
        <div className="space-y-2 mb-8">
          {[
            { label: "Stats Avancées", screen: "advanced-stats" },
            { label: "Coaching Tools", screen: "coaching-tools" },
            { label: "Export Calendrier", screen: "calendar-sync" },
          ].map((tool, index) => (
            <button
              key={index}
              onClick={() => onNavigate(tool.screen)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">
                {tool.label}
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>

        {/* Testimonials */}
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Ce que disent nos utilisateurs Premium
        </h3>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 space-y-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-4">
              <p className="text-sm text-gray-700 italic mb-2">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  {testimonial.author} • {testimonial.squad}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PremiumScreen;
