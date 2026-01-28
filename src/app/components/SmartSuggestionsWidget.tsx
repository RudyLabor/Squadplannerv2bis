/**
 * 💡 SMART SUGGESTIONS WIDGET
 * Widget compact pour afficher les meilleures suggestions de créneaux
 * À intégrer sur la HomeScreen
 */

import { useState, useEffect } from 'react';
import { Sparkles, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getSmartSuggestions, TimeSlotSuggestion } from '@/utils/smart-suggestions';
import { useSquads } from '@/app/contexts/SquadsContext';

// Day names in French
const DAY_NAMES = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

interface SmartSuggestionsWidgetProps {
  onNavigate: (screen: string, data?: any) => void;
  maxSuggestions?: number;
}

export function SmartSuggestionsWidget({
  onNavigate,
  maxSuggestions = 2
}: SmartSuggestionsWidgetProps) {
  const { squads } = useSquads();
  const [suggestions, setSuggestions] = useState<TimeSlotSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuggestions();
  }, [squads]);

  const loadSuggestions = async () => {
    if (!squads || squads.length === 0) {
      setLoading(false);
      return;
    }

    try {
      // Get suggestions for the first squad (or all squads)
      const squadId = squads[0]?.id;
      if (squadId) {
        const result = await getSmartSuggestions(squadId, 7); // Last 7 days
        setSuggestions(result.slice(0, maxSuggestions));
      }
    } catch (err) {
      console.log('Error loading suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Don't show widget if no squads or loading
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-500/10 to-amber-500/10 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span className="font-medium text-gray-900">Suggestions IA</span>
        </div>
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null; // Don't show widget if no suggestions
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-500/10 to-amber-500/10 rounded-2xl p-4 mb-4 border border-purple-200/50"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Créneaux optimaux</p>
            <p className="text-xs text-gray-500">Basé sur votre historique</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('smart-suggestions')}
          className="text-xs text-purple-600 font-medium flex items-center gap-1 hover:text-purple-700"
        >
          Voir tout
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Suggestions */}
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => {
          const dayName = DAY_NAMES[suggestion.dayOfWeek];
          const timeStr = `${String(suggestion.hour).padStart(2, '0')}:00`;

          return (
            <motion.button
              key={`${suggestion.dayOfWeek}-${suggestion.hour}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onNavigate('propose-session', {
                prefillDay: suggestion.dayOfWeek,
                prefillTime: timeStr
              })}
              className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-purple-300 hover:shadow-sm transition-all text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">
                  {dayName} à {timeStr}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {suggestion.reason || `${suggestion.historicalData?.timesUsed || 0} sessions`}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-purple-600">
                  {Math.round(suggestion.confidence)}%
                </span>
                <span className="text-[10px] text-gray-400">confiance</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

export default SmartSuggestionsWidget;
