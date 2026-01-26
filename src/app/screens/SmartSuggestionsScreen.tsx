import { ArrowLeft, Sparkles, Calendar, Clock, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/Button';
import { intelligenceAPI } from '@/utils/api';

interface SmartSuggestionsScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  data?: {
    squadId?: string;
  };
}

interface Suggestion {
  id: string;
  day: number;
  dayName: string;
  hour: number;
  time: string;
  score: number;
  confidence: number;
  sessionsCount: number;
  title: string;
  description: string;
}

export function SmartSuggestionsScreen({ onNavigate, showToast, data }: SmartSuggestionsScreenProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuggestions();
  }, [data?.squadId]);

  const loadSuggestions = async () => {
    if (!data?.squadId) return;

    setLoading(true);
    try {
      const response = await intelligenceAPI.getSmartSuggestions(data.squadId);
      setSuggestions(response.suggestions || []);
    } catch (error: any) {
      console.error('Load suggestions error:', error);
      showToast(error.message || 'Erreur lors du chargement des suggestions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    // Navigate to create session with pre-filled data
    onNavigate('create-session', {
      squadId: data?.squadId,
      prefilledDay: suggestion.day,
      prefilledTime: suggestion.time,
    });
  };

  return (
    <div className="min-h-screen pb-24 pt-safe bg-[var(--bg-base)]">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="w-10 h-10 rounded-xl bg-white border-[0.5px] border-[var(--border-medium)] hover:border-[var(--border-strong)] flex items-center justify-center shadow-sm transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-secondary)]" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Suggestions Intelligentes
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] mt-1">
              Basées sur l'historique de votre squad
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-[var(--fg-tertiary)]">
              <div className="w-5 h-5 border-2 border-[var(--primary-500)] border-t-transparent rounded-full animate-spin"></div>
              <span>Analyse en cours...</span>
            </div>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border-[0.5px] border-[var(--border-subtle)] shadow-sm text-center">
            <Sparkles className="w-12 h-12 text-[var(--fg-tertiary)] mx-auto mb-4" strokeWidth={1.5} />
            <p className="text-sm text-[var(--fg-secondary)] mb-2">
              Pas encore de suggestions
            </p>
            <p className="text-xs text-[var(--fg-tertiary)]">
              Jouez plus de sessions pour débloquer les suggestions intelligentes
            </p>
          </div>
        ) : (
          <>
            {/* Info Banner */}
            <div className="bg-gradient-to-br from-[var(--primary-50)] to-[var(--secondary-50)] rounded-2xl p-5 mb-6 border-[0.5px] border-[var(--primary-200)]">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[var(--primary-500)] flex-shrink-0 mt-0.5" strokeWidth={2} />
                <div>
                  <p className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                    ✨ Top 3 Créneaux Recommandés
                  </p>
                  <p className="text-xs text-[var(--fg-tertiary)]">
                    Ces créneaux ont historiquement le meilleur taux de participation dans votre squad
                  </p>
                </div>
              </div>
            </div>

            {/* Suggestions List */}
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-5 border-[0.5px] border-[var(--border-medium)] shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {/* Rank Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${
                        index === 0 ? 'bg-gradient-to-br from-[var(--warning-500)] to-[var(--warning-600)] text-white' :
                        index === 1 ? 'bg-gradient-to-br from-[var(--fg-tertiary)] to-[var(--fg-secondary)] text-white' :
                        'bg-[var(--primary-50)] text-[var(--primary-500)]'
                      }`}>
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--fg-primary)] tracking-tight">
                          {suggestion.title}
                        </h3>
                        <p className="text-xs text-[var(--fg-tertiary)] mt-0.5">
                          {suggestion.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[var(--bg-subtle)] rounded-xl p-3">
                      <div className="flex items-center gap-2 text-[var(--success-500)] mb-1">
                        <TrendingUp className="w-4 h-4" strokeWidth={2} />
                        <span className="text-xs font-semibold">Confiance</span>
                      </div>
                      <div className="text-2xl font-bold text-[var(--fg-primary)]">
                        {suggestion.confidence}%
                      </div>
                    </div>
                    <div className="bg-[var(--bg-subtle)] rounded-xl p-3">
                      <div className="flex items-center gap-2 text-[var(--primary-500)] mb-1">
                        <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                        <span className="text-xs font-semibold">Sessions</span>
                      </div>
                      <div className="text-2xl font-bold text-[var(--fg-primary)]">
                        {suggestion.sessionsCount}
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    variant="primary"
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="w-full h-11 text-sm font-semibold bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] text-white rounded-xl shadow-lg shadow-[var(--primary-500)]/20 transition-all duration-200"
                  >
                    <Calendar className="w-4 h-4" strokeWidth={2} />
                    Créer cette session
                  </Button>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
