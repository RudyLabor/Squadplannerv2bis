/**
 * No-Show Prediction Component
 * Affiche les prédictions de présence pour une session
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingUp, User, Loader2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { intelligenceEngine } from '@/utils/intelligence';

interface NoShowPredictionProps {
  sessionId: string;
  rsvps?: Array<{
    user_id: string;
    response: 'yes' | 'no' | 'maybe';
    user?: {
      id: string;
      username: string;
      display_name?: string;
      avatar_url?: string;
      reliability_score?: number;
    };
  }>;
  className?: string;
}

interface PredictionResult {
  userId: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  reliabilityScore: number;
  noShowProbability: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high';
  factors: string[];
}

export function NoShowPrediction({ sessionId, rsvps = [], className = '' }: NoShowPredictionProps) {
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [overallRisk, setOverallRisk] = useState(0);

  useEffect(() => {
    calculatePredictions();
  }, [sessionId, rsvps]);

  const calculatePredictions = async () => {
    setIsLoading(true);
    try {
      // Filtrer les RSVPs "yes" ou "maybe" (ceux qui sont susceptibles de venir)
      const relevantRsvps = rsvps.filter(r => r.response === 'yes' || r.response === 'maybe');

      if (relevantRsvps.length === 0) {
        setPredictions([]);
        setOverallRisk(0);
        setIsLoading(false);
        return;
      }

      // Calculer les prédictions pour chaque membre
      const results: PredictionResult[] = relevantRsvps.map(rsvp => {
        const user = rsvp.user;
        const reliabilityScore = user?.reliability_score || 100;

        // Facteurs de risque
        const factors: string[] = [];
        let baseRisk = 0;

        // 1. Score de fiabilité (facteur principal)
        if (reliabilityScore < 70) {
          baseRisk += 40;
          factors.push('Fiabilité faible');
        } else if (reliabilityScore < 85) {
          baseRisk += 20;
          factors.push('Fiabilité moyenne');
        }

        // 2. Type de réponse
        if (rsvp.response === 'maybe') {
          baseRisk += 35;
          factors.push('Réponse incertaine');
        }

        // 3. Ajustement basé sur le score de fiabilité inversé
        const reliabilityPenalty = Math.max(0, (100 - reliabilityScore) * 0.3);
        baseRisk += reliabilityPenalty;

        // Plafonner le risque
        const noShowProbability = Math.min(95, Math.max(0, Math.round(baseRisk)));

        // Déterminer le niveau de risque
        let riskLevel: 'low' | 'medium' | 'high' = 'low';
        if (noShowProbability >= 50) {
          riskLevel = 'high';
        } else if (noShowProbability >= 25) {
          riskLevel = 'medium';
        }

        if (factors.length === 0 && noShowProbability < 10) {
          factors.push('Historique fiable');
        }

        return {
          userId: rsvp.user_id,
          username: user?.username || 'Joueur',
          displayName: user?.display_name,
          avatarUrl: user?.avatar_url,
          reliabilityScore,
          noShowProbability,
          riskLevel,
          factors,
        };
      });

      // Trier par probabilité de no-show (décroissant)
      results.sort((a, b) => b.noShowProbability - a.noShowProbability);

      // Calculer le risque global (moyenne pondérée)
      const totalRisk = results.reduce((sum, r) => sum + r.noShowProbability, 0);
      const avgRisk = results.length > 0 ? Math.round(totalRisk / results.length) : 0;

      setPredictions(results);
      setOverallRisk(avgRisk);
    } catch (error) {
      console.error('Error calculating predictions:', error);
      setPredictions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Compter les risques par niveau
  const riskCounts = {
    high: predictions.filter(p => p.riskLevel === 'high').length,
    medium: predictions.filter(p => p.riskLevel === 'medium').length,
    low: predictions.filter(p => p.riskLevel === 'low').length,
  };

  // Ne pas afficher si pas de données pertinentes
  if (!isLoading && predictions.length === 0) {
    return null;
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-amber-600 bg-amber-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-amber-50 border-amber-200';
      default: return 'bg-green-50 border-green-200';
    }
  };

  const getOverallRiskLevel = () => {
    if (overallRisk >= 40) return { level: 'high', label: 'Risque élevé', color: 'text-red-600' };
    if (overallRisk >= 20) return { level: 'medium', label: 'Risque modéré', color: 'text-amber-600' };
    return { level: 'low', label: 'Risque faible', color: 'text-green-600' };
  };

  const riskInfo = getOverallRiskLevel();

  return (
    <div className={`bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 overflow-hidden ${className}`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              Prédiction No-Show
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-200 text-purple-700 font-bold">
                IA
              </span>
            </h3>
            {isLoading ? (
              <p className="text-sm text-gray-500">Analyse en cours...</p>
            ) : (
              <p className={`text-sm font-medium ${riskInfo.color}`}>
                {riskInfo.label} • {overallRisk}% de risque moyen
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isLoading && riskCounts.high > 0 && (
            <span className="px-2 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-bold">
              {riskCounts.high} à risque
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                </div>
              ) : (
                <>
                  {/* Risk Summary */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 rounded-xl bg-green-100">
                      <div className="text-lg font-bold text-green-700">{riskCounts.low}</div>
                      <div className="text-[10px] text-green-600 font-medium">Fiable</div>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-amber-100">
                      <div className="text-lg font-bold text-amber-700">{riskCounts.medium}</div>
                      <div className="text-[10px] text-amber-600 font-medium">Incertain</div>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-red-100">
                      <div className="text-lg font-bold text-red-700">{riskCounts.high}</div>
                      <div className="text-[10px] text-red-600 font-medium">À risque</div>
                    </div>
                  </div>

                  {/* Individual Predictions */}
                  <div className="space-y-2">
                    {predictions.map((prediction) => (
                      <div
                        key={prediction.userId}
                        className={`p-3 rounded-xl border ${getRiskBgColor(prediction.riskLevel)}`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="relative">
                            {prediction.avatarUrl ? (
                              <img
                                src={prediction.avatarUrl}
                                alt={prediction.username}
                                className="w-10 h-10 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold">
                                {prediction.username[0]?.toUpperCase()}
                              </div>
                            )}
                            {/* Risk indicator */}
                            {prediction.riskLevel === 'high' && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                                <AlertTriangle className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 truncate">
                                {prediction.displayName || prediction.username}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getRiskColor(prediction.riskLevel)}`}>
                                {prediction.noShowProbability}%
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                              <TrendingUp className="w-3 h-3" />
                              Fiabilité: {prediction.reliabilityScore}%
                            </div>
                          </div>

                          {/* Factors */}
                          <div className="text-right">
                            {prediction.factors.slice(0, 1).map((factor, i) => (
                              <span key={i} className="text-[10px] text-gray-500">
                                {factor}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recommendation */}
                  {riskCounts.high > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-purple-100 border border-purple-200">
                      <p className="text-sm text-purple-700">
                        <strong>Conseil :</strong> {riskCounts.high} joueur{riskCounts.high > 1 ? 's' : ''} présente{riskCounts.high > 1 ? 'nt' : ''} un risque élevé de no-show.
                        Pensez à leur envoyer un rappel ou à prévoir des remplaçants.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NoShowPrediction;
