import { ArrowLeft, Target, Trophy, Clock, Zap, Award, TrendingUp, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface ChallengesScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

type ChallengePeriod = 'weekly' | 'monthly';

interface Challenge {
  id: string;
  name: string;
  description: string;
  reward: string;
  progress: number;
  total: number;
  completed: boolean;
  expiresIn: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export function ChallengesScreen({ onNavigate, showToast }: ChallengesScreenProps) {
  const [activePeriod, setActivePeriod] = useState<ChallengePeriod>('weekly');

  const weeklyChallenges: Challenge[] = [
    {
      id: 'w1',
      name: 'Marathon de Sessions',
      description: 'Participe à 5 sessions cette semaine',
      reward: '100 XP + Badge',
      progress: 3,
      total: 5,
      completed: false,
      expiresIn: 'Dans 2 jours',
      difficulty: 'easy',
    },
    {
      id: 'w2',
      name: 'Fiabilité Parfaite',
      description: 'Ne manque aucune session confirmée',
      reward: '200 XP + Badge Spécial',
      progress: 4,
      total: 4,
      completed: true,
      expiresIn: 'Dans 2 jours',
      difficulty: 'hard',
    },
    {
      id: 'w3',
      name: 'Social Butterfly',
      description: 'Ajoute 3 nouveaux amis',
      reward: '50 XP',
      progress: 1,
      total: 3,
      completed: false,
      expiresIn: 'Dans 2 jours',
      difficulty: 'easy',
    },
  ];

  const monthlyChallenges: Challenge[] = [
    {
      id: 'm1',
      name: 'Organisateur Pro',
      description: 'Crée 10 sessions ce mois',
      reward: '500 XP + Titre "Organisateur"',
      progress: 6,
      total: 10,
      completed: false,
      expiresIn: 'Dans 15 jours',
      difficulty: 'medium',
    },
    {
      id: 'm2',
      name: 'Légende de Squad',
      description: 'Atteins 95+ de fiabilité',
      reward: '300 XP + Badge Légendaire',
      progress: 88,
      total: 95,
      completed: false,
      expiresIn: 'Dans 15 jours',
      difficulty: 'hard',
    },
    {
      id: 'm3',
      name: 'Champion de Jeux',
      description: 'Joue à 3 jeux différents',
      reward: '200 XP',
      progress: 3,
      total: 3,
      completed: true,
      expiresIn: 'Dans 15 jours',
      difficulty: 'medium',
    },
  ];

  const challenges = activePeriod === 'weekly' ? weeklyChallenges : monthlyChallenges;
  const completedCount = challenges.filter(c => c.completed).length;

  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    const colors = {
      easy: { bg: 'bg-[var(--success-50)]', text: 'text-[var(--success-500)]' },
      medium: { bg: 'bg-[var(--primary-50)]', text: 'text-[var(--primary-500)]' },
      hard: { bg: 'bg-[var(--error-50)]', text: 'text-[var(--error-500)]' },
    };
    return colors[difficulty];
  };

  const handleClaimReward = (challengeId: string) => {
    showToast('Récompense réclamée ! 🎉', 'success');
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
          <div>
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Défis
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium mt-1">
              Relève des challenges et gagne des récompenses
            </p>
          </div>
        </div>

        {/* Period Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActivePeriod('weekly')}
            className={`flex-1 h-12 rounded-xl font-semibold text-sm transition-all duration-200 ${
              activePeriod === 'weekly'
                ? 'bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white shadow-lg shadow-[var(--primary-500)]/20'
                : 'bg-white text-[var(--fg-secondary)] border-[0.5px] border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
            }`}
          >
            Hebdomadaires
          </button>
          <button
            onClick={() => setActivePeriod('monthly')}
            className={`flex-1 h-12 rounded-xl font-semibold text-sm transition-all duration-200 ${
              activePeriod === 'monthly'
                ? 'bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white shadow-lg shadow-[var(--primary-500)]/20'
                : 'bg-white text-[var(--fg-secondary)] border-[0.5px] border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
            }`}
          >
            Mensuels
          </button>
        </div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] rounded-2xl p-6 mb-8 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-white/90 text-sm font-medium mb-1">
                Progression {activePeriod === 'weekly' ? 'hebdomadaire' : 'mensuelle'}
              </div>
              <div className="text-3xl font-bold text-white">
                {completedCount}/{challenges.length}
              </div>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${challenges.length > 0 ? (completedCount / challenges.length) * 100 : 0}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Challenges List */}
        <div className="space-y-4">
          {challenges.map((challenge, index) => {
            const progressPercent = (challenge.total > 0) 
              ? Math.round((challenge.progress / challenge.total) * 100)
              : 0;
            const difficultyColors = getDifficultyColor(challenge.difficulty);
            
            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl p-5 border-[0.5px] shadow-sm hover:shadow-md transition-all duration-200 ${
                  challenge.completed
                    ? 'border-[var(--success-200)] bg-[var(--success-50)]/30'
                    : 'border-[var(--border-subtle)]'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`text-lg font-semibold ${
                        challenge.completed ? 'text-[var(--success-500)]' : 'text-[var(--fg-primary)]'
                      }`}>
                        {challenge.name}
                      </h3>
                      {challenge.completed && (
                        <CheckCircle className="w-5 h-5 text-[var(--success-500)]" strokeWidth={2} />
                      )}
                    </div>
                    <p className="text-sm text-[var(--fg-tertiary)] font-medium mb-2">
                      {challenge.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${difficultyColors.bg} ${difficultyColors.text} capitalize`}>
                        {challenge.difficulty === 'easy' ? 'Facile' : challenge.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-[var(--fg-tertiary)] font-medium">
                        <Clock className="w-3 h-3" strokeWidth={2} />
                        {challenge.expiresIn}
                      </div>
                    </div>
                  </div>
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    challenge.completed ? 'bg-[var(--success-50)]' : 'bg-[var(--primary-50)]'
                  }`}>
                    <Target className={`w-7 h-7 ${
                      challenge.completed ? 'text-[var(--success-500)]' : 'text-[var(--primary-500)]'
                    }`} strokeWidth={2} />
                  </div>
                </div>

                {/* Reward */}
                <div className="flex items-center gap-2 mb-4 p-3 bg-[var(--primary-50)] rounded-xl">
                  <Award className="w-4 h-4 text-[var(--primary-500)] flex-shrink-0" strokeWidth={2} />
                  <span className="text-sm text-[var(--primary-500)] font-semibold">
                    {challenge.reward}
                  </span>
                </div>

                {/* Progress */}
                {challenge.completed ? (
                  <button
                    onClick={() => handleClaimReward(challenge.id)}
                    className="w-full h-10 rounded-xl bg-[var(--success-500)] text-white font-semibold text-sm hover:bg-[var(--success-600)] transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-4 h-4" strokeWidth={2} />
                    Réclamer la récompense
                  </button>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[var(--fg-secondary)] font-semibold">
                        {challenge.progress}/{challenge.total}
                      </span>
                      <span className="text-sm text-[var(--fg-tertiary)] font-medium">
                        {progressPercent}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[var(--primary-500)] to-[var(--secondary-500)] rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[var(--primary-50)] to-[var(--secondary-50)] rounded-2xl p-5 border-[0.5px] border-[var(--primary-100)] mt-8"
        >
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-[var(--primary-500)] flex-shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                De nouveaux défis chaque semaine
              </div>
              <div className="text-xs text-[var(--fg-secondary)] font-medium leading-relaxed">
                Complète les défis pour gagner de l'XP, débloquer des badges exclusifs et monter dans les classements.
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
export default ChallengesScreen;
