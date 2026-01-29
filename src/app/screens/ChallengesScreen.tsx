import { ArrowLeft, Target, Trophy, Clock, Zap, Award, TrendingUp, CheckCircle, Flame, Star, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
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

const difficultyConfig: Record<Challenge['difficulty'], { gradient: string; label: string; icon: React.ElementType; color: string }> = {
  easy: { gradient: 'from-emerald-500 to-teal-500', label: 'Facile', icon: Star, color: 'text-emerald-500' },
  medium: { gradient: 'from-amber-500 to-orange-500', label: 'Moyen', icon: Flame, color: 'text-amber-500' },
  hard: { gradient: 'from-red-500 to-pink-500', label: 'Difficile', icon: Zap, color: 'text-red-500' },
};

interface PremiumChallengeCardProps {
  challenge: Challenge;
  index: number;
  onClaim: () => void;
}

function PremiumChallengeCard({ challenge, index, onClaim }: PremiumChallengeCardProps) {
  const progressPercent = challenge.total > 0 ? Math.round((challenge.progress / challenge.total) * 100) : 0;
  const config = difficultyConfig[challenge.difficulty];
  const DifficultyIcon = config.icon;

  return (
    <motion.div
      variants={itemVariants}
      custom={index}
      layout
      className={`relative overflow-hidden rounded-2xl ${
        challenge.completed
          ? 'bg-gradient-to-br from-emerald-50 to-teal-50'
          : 'bg-white/80'
      } backdrop-blur-sm border ${
        challenge.completed
          ? 'border-emerald-200/50'
          : 'border-white/50'
      } shadow-lg transition-all duration-300`}
      whileHover={{ scale: 1.01, y: -2 }}
    >
      {/* Completed overlay shine */}
      {challenge.completed && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
      )}

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={`text-lg font-bold ${
                challenge.completed ? 'text-emerald-700' : 'text-gray-800'
              }`}>
                {challenge.name}
              </h3>
              {challenge.completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <CheckCircle className="w-5 h-5 text-emerald-500" strokeWidth={2.5} />
                </motion.div>
              )}
            </div>
            <p className="text-sm text-gray-500 font-medium mb-3">
              {challenge.description}
            </p>
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${config.gradient} text-white flex items-center gap-1`}>
                <DifficultyIcon className="w-3 h-3" />
                {config.label}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                {challenge.expiresIn}
              </div>
            </div>
          </div>

          {/* Icon */}
          <motion.div
            className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
              challenge.completed
                ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30'
                : 'bg-gradient-to-br from-indigo-100 to-purple-100'
            }`}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Target className={`w-7 h-7 ${
              challenge.completed ? 'text-white' : 'text-indigo-500'
            }`} strokeWidth={2} />
          </motion.div>
        </div>

        {/* Reward Banner */}
        <motion.div
          className={`flex items-center gap-2 mb-4 p-3 rounded-xl ${
            challenge.completed
              ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200/50'
              : 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200/50'
          }`}
          whileHover={{ scale: 1.01 }}
        >
          <Award className={`w-5 h-5 ${challenge.completed ? 'text-amber-500' : 'text-indigo-500'} flex-shrink-0`} strokeWidth={2} />
          <span className={`text-sm font-semibold ${challenge.completed ? 'text-amber-700' : 'text-indigo-700'}`}>
            {challenge.reward}
          </span>
        </motion.div>

        {/* Progress / Claim Button */}
        {challenge.completed ? (
          <motion.button
            onClick={onClaim}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Trophy className="w-4 h-4" strokeWidth={2} />
            Réclamer la récompense
            <Sparkles className="w-4 h-4" />
          </motion.button>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700 font-bold">
                {challenge.progress}/{challenge.total}
              </span>
              <span className="text-sm text-gray-400 font-medium">
                {progressPercent}%
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${config.gradient} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
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

  const handleClaimReward = (challengeId: string) => {
    showToast('Récompense réclamée ! 🎉', 'success');
  };

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
            <motion.button
              onClick={() => onNavigate('home')}
              className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Défis
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Relève des challenges et gagne des récompenses
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Trophy className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Period Tabs */}
          <motion.div variants={itemVariants} className="flex gap-2 mb-6">
            {(['weekly', 'monthly'] as ChallengePeriod[]).map((period) => (
              <motion.button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`flex-1 h-12 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  activePeriod === period
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-white/80 backdrop-blur-sm text-gray-600 border border-white/50 hover:bg-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {period === 'weekly' ? 'Hebdomadaires' : 'Mensuels'}
              </motion.button>
            ))}
          </motion.div>

          {/* Progress Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 mb-6 shadow-xl shadow-indigo-500/20 relative overflow-hidden"
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />

            <div className="relative flex items-center justify-between mb-4">
              <div>
                <div className="text-white/80 text-sm font-medium mb-1">
                  Progression {activePeriod === 'weekly' ? 'hebdomadaire' : 'mensuelle'}
                </div>
                <div className="text-4xl font-black text-white">
                  {completedCount}/{challenges.length}
                </div>
              </div>
              <motion.div
                className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Trophy className="w-8 h-8 text-white" strokeWidth={2} />
              </motion.div>
            </div>

            {/* Progress Bar */}
            <div className="h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${challenges.length > 0 ? (completedCount / challenges.length) * 100 : 0}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>

            {/* Bonus text */}
            {completedCount === challenges.length && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center gap-2 text-white/90 text-sm font-medium"
              >
                <Sparkles className="w-4 h-4" />
                Tous les défis complétés ! Bonus XP débloqué !
              </motion.div>
            )}
          </motion.div>

          {/* Challenges List */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePeriod}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {challenges.map((challenge, index) => (
                <PremiumChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  index={index}
                  onClaim={() => handleClaimReward(challenge.id)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Info Banner */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 mt-8 shadow-lg"
          >
            <div className="flex items-start gap-4">
              <motion.div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <TrendingUp className="w-6 h-6 text-white" strokeWidth={2} />
              </motion.div>
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-1">
                  De nouveaux défis chaque semaine
                </h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  Complète les défis pour gagner de l'XP, débloquer des badges exclusifs et monter dans les classements.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default ChallengesScreen;
