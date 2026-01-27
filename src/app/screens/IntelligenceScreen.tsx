import { ArrowLeft, Sparkles, Calendar, Clock, TrendingUp, Zap, Target, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/Button';
import { HeatmapAvailability } from '@/app/components/HeatmapAvailability';

interface IntelligenceScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface Pattern {
  id: string;
  type: 'time' | 'day' | 'player' | 'game';
  title: string;
  description: string;
  confidence: number; // 0-100
  icon: any;
}

interface Suggestion {
  id: string;
  type: 'optimal-slot' | 'risk-alert' | 'recurring' | 'member-alert';
  title: string;
  description: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
  data: any;
}

export function IntelligenceScreen({ onNavigate, showToast }: IntelligenceScreenProps) {
  // Mock patterns detected by AI
  const patterns: Pattern[] = [
    {
      id: 'best-day',
      type: 'day',
      title: 'Mardi soir = succès garanti',
      description: 'Vos sessions du mardi ont 96% de taux de présence. C\'est votre créneau optimal.',
      confidence: 96,
      icon: Calendar,
    },
    {
      id: 'best-time',
      type: 'time',
      title: '21h-23h : La zone de confort',
      description: '82% de vos sessions réussies se déroulent entre 21h et 23h.',
      confidence: 82,
      icon: Clock,
    },
    {
      id: 'player-synergy',
      type: 'player',
      title: 'KANA + Maxence = duo fiable',
      description: 'Ces deux joueurs acceptent ensemble dans 98% des cas.',
      confidence: 98,
      icon: TrendingUp,
    },
    {
      id: 'game-trend',
      type: 'game',
      title: 'Valorant en hausse',
      description: 'Les sessions Valorant ont +23% de participation ce mois-ci.',
      confidence: 78,
      icon: Zap,
    },
  ];

  // AI-generated suggestions
  const suggestions: Suggestion[] = [
    {
      id: 'suggest-1',
      type: 'optimal-slot',
      title: 'Créneau optimal détecté',
      description: 'Mardi 21h donne 95% de présence pour votre squad',
      impact: '+15% participation',
      priority: 'high',
      data: {
        suggestedDay: 'Mardi',
        suggestedTime: '21:00',
        expectedAttendance: 95
      }
    },
    {
      id: 'noshow-prediction',
      type: 'risk-alert',
      title: 'Risque de no-show détecté',
      description: 'MaxGamer a 68% de probabilité d\'absence jeudi soir (historique)',
      impact: 'Alerte moyenne',
      priority: 'medium',
      data: {
        player: 'MaxGamer',
        probability: 68,
        reason: 'Historique d\'absences les jeudis'
      }
    },
    {
      id: 'suggest-2',
      type: 'recurring',
      title: 'Créer un rituel hebdomadaire',
      description: 'Automatisez une session tous les mercredis 20h',
      impact: '+25% régularité',
      priority: 'high',
      data: {
        day: 'Mercredi',
        time: '20:00',
        frequency: 'weekly'
      }
    },
    {
      id: 'suggest-3',
      type: 'member-alert',
      title: 'Activité en baisse',
      description: 'SaraGames n\'a pas joué depuis 2 semaines',
      impact: 'Risque de départ',
      priority: 'medium',
      data: {
        member: 'SaraGames',
        lastSession: '14 jours'
      }
    },
    {
      id: 'suggest-4',
      type: 'optimal-slot',
      title: 'Alternative weekend',
      description: 'Samedi 19h fonctionne aussi pour 4/5 membres',
      impact: '+10% flexibilité',
      priority: 'low',
      data: {
        suggestedDay: 'Samedi',
        suggestedTime: '19:00',
        expectedAttendance: 80
      }
    },
  ];

  const handleSlotClick = (hour: number, day: number) => {
    showToast(`Créer une session pour ${['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][day]} à ${hour}h ?`, 'info');
  };

  const handleSuggestionAction = (suggestion: Suggestion) => {
    if (suggestion.id === 'suggest-1' || suggestion.id === 'suggest-4') {
      onNavigate('propose-session', suggestion.data);
      showToast('Formulaire pré-rempli avec les suggestions !', 'success');
    } else if (suggestion.id === 'suggest-2') {
      onNavigate('recurring-config');
    } else {
      showToast('Action en cours...', 'info');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'primary';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'tertiary';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Priorité haute';
      case 'medium': return 'Priorité moyenne';
      case 'low': return 'Suggestion';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-safe">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[var(--primary-500)]" strokeWidth={2} />
              Intelligence IA
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium">
              Suggestions basées sur vos habitudes
            </p>
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] rounded-3xl p-6 mb-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-7 h-7" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">L'IA analyse vos sessions</h2>
              <p className="text-sm opacity-90 leading-relaxed mb-4">
                Basé sur {Math.floor(Math.random() * 100) + 50} sessions analysées, voici les patterns identifiés et les recommandations pour optimiser votre planning.
              </p>
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                  <span className="font-semibold">{patterns.length} patterns détectés</span>
                </div>
                <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-lg">
                  <Target className="w-3.5 h-3.5" strokeWidth={2} />
                  <span className="font-semibold">{suggestions.filter(s => s.priority === 'high').length} actions recommandées</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Patterns détectés */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 px-1">
            Patterns détectés
          </h2>
          <div className="grid gap-3">
            {patterns.map((pattern, index) => (
              <motion.div
                key={pattern.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--primary-50)] flex items-center justify-center flex-shrink-0">
                    <pattern.icon className="w-5 h-5 text-[var(--primary-600)]" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-bold text-[var(--fg-primary)]">
                        {pattern.title}
                      </h3>
                      <div className="flex items-center gap-1 bg-[var(--success-50)] px-2 py-0.5 rounded-lg flex-shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--success-500)]" />
                        <span className="text-xs font-bold text-[var(--success-700)]">
                          {pattern.confidence}%
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--fg-tertiary)] leading-relaxed">
                      {pattern.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Heatmap de disponibilité */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 px-1">
            Carte de chaleur des disponibilités
          </h2>
          <HeatmapAvailability onSlotClick={handleSlotClick} />
        </div>

        {/* Suggestions intelligentes */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 px-1">
            Suggestions intelligentes
          </h2>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => {
              const priorityColor = getPriorityColor(suggestion.priority);
              
              return (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    bg-[var(--${priorityColor}-50)] rounded-2xl p-4 border-[0.5px] border-[var(--${priorityColor}-200)]
                    ${suggestion.priority === 'high' ? 'ring-2 ring-[var(--primary-200)]' : ''}
                  `}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-sm font-bold text-[var(--${priorityColor}-700)]`}>
                          {suggestion.title}
                        </h3>
                        {suggestion.priority === 'high' && (
                          <div className="flex items-center gap-1 bg-[var(--primary-600)] text-white px-2 py-0.5 rounded-lg">
                            <Zap className="w-3 h-3" strokeWidth={2} />
                            <span className="text-xs font-bold">
                              Recommandé
                            </span>
                          </div>
                        )}
                      </div>
                      <p className={`text-xs text-[var(--${priorityColor}-600)] leading-relaxed`}>
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant={suggestion.priority === 'high' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => handleSuggestionAction(suggestion)}
                    className="w-full h-11"
                  >
                    {suggestion.action}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Info Footer */}
        <div className="bg-[var(--primary-50)] rounded-2xl p-4 border-[0.5px] border-[var(--primary-200)]">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[var(--primary-600)] flex-shrink-0 mt-0.5" strokeWidth={2} />
            <div className="flex-1">
              <div className="text-sm font-semibold text-[var(--primary-700)] mb-1">
                Comment ça marche ?
              </div>
              <div className="text-xs text-[var(--primary-600)] leading-relaxed">
                L'IA analyse vos sessions passées, les taux de présence, les créneaux qui fonctionnent le mieux, 
                et génère des recommandations personnalisées pour maximiser la participation de votre squad.
              </div>
            </div>
          </div>
        </div>

        {/* Advanced AI Tools */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 px-1">
            Outils IA Avancés
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('squad-composition')}
              className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-medium)] shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                Composition Optimale
              </div>
              <div className="text-xs text-[var(--fg-tertiary)]">
                Analysez votre squad
              </div>
            </button>

            <button
              onClick={() => onNavigate('leadership-analysis')}
              className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-medium)] shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="text-2xl mb-2">👑</div>
              <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                Leadership
              </div>
              <div className="text-xs text-[var(--fg-tertiary)]">
                Détectez les leaders
              </div>
            </button>

            <button
              onClick={() => onNavigate('squad-management')}
              className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-medium)] shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="text-2xl mb-2">🔀</div>
              <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                Split & Merge
              </div>
              <div className="text-xs text-[var(--fg-tertiary)]">
                Optimisez vos squads
              </div>
            </button>

            <button
              onClick={() => onNavigate('auto-coaching')}
              className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-medium)] shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="text-2xl mb-2">🧠</div>
              <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                Coaching Auto
              </div>
              <div className="text-xs text-[var(--fg-tertiary)]">
                Conseils personnalisés
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default IntelligenceScreen;
