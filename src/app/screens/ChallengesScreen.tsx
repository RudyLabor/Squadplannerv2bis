import { ArrowLeft, Target, Trophy, Clock, Zap, Award, TrendingUp, CheckCircle, Flame, Star, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { challengesAPI } from '@/utils/api';

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
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
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

const difficultyConfig: Record<Challenge['difficulty'], { color: string; bgColor: string; label: string; icon: React.ElementType }> = {
  easy: { color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', label: 'Facile', icon: Star },
  medium: { color: 'text-[#f5a623]', bgColor: 'bg-[#f5a623]/10', label: 'Moyen', icon: Flame },
  hard: { color: 'text-red-400', bgColor: 'bg-red-500/10', label: 'Difficile', icon: Zap },
};

interface ChallengeCardProps {
  challenge: Challenge;
  index: number;
  onClaim: () => void;
}

function ChallengeCard({ challenge, index, onClaim }: ChallengeCardProps) {
  const progressPercent = challenge.total > 0 ? Math.round((challenge.progress / challenge.total) * 100) : 0;
  const config = difficultyConfig[challenge.difficulty];
  const DifficultyIcon = config.icon;

  return (
    <motion.div
      variants={itemVariants}
      custom={index}
      layout
      className={`relative rounded-xl border transition-all duration-200 ${
        challenge.completed
          ? 'bg-emerald-500/5 border-emerald-500/20'
          : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.08]'
      }`}
      whileHover={{ scale: 1.01 }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className={`text-[15px] font-semibold ${
                challenge.completed ? 'text-emerald-400' : 'text-white'
              }`}>
                {challenge.name}
              </h3>
              {challenge.completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
                </motion.div>
              )}
            </div>
            <p className="text-[13px] text-[#8a8f98] mb-2.5 leading-relaxed">
              {challenge.description}
            </p>
            <div className="flex items-center gap-2.5">
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${config.bgColor} ${config.color} flex items-center gap-1`}>
                <DifficultyIcon className="w-3 h-3" />
                {config.label}
              </span>
              <div className="flex items-center gap-1 text-[11px] text-[#6b7280]">
                <Clock className="w-3 h-3" strokeWidth={2} />
                {challenge.expiresIn}
              </div>
            </div>
          </div>

          {/* Icon */}
          <motion.div
            className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${
              challenge.completed
                ? 'bg-emerald-500/10'
                : 'bg-[#f5a623]/10'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <Target className={`w-5 h-5 ${
              challenge.completed ? 'text-emerald-400' : 'text-[#f5a623]'
            }`} strokeWidth={2} />
          </motion.div>
        </div>

        {/* Reward Banner */}
        <div className={`flex items-center gap-2 mb-3 p-2.5 rounded-lg ${
          challenge.completed
            ? 'bg-[#f5a623]/10 border border-[#f5a623]/20'
            : 'bg-white/[0.02] border border-white/[0.04]'
        }`}>
          <Award className={`w-4 h-4 flex-shrink-0 ${challenge.completed ? 'text-[#f5a623]' : 'text-[#f5a623]'}`} strokeWidth={2} />
          <span className={`text-[13px] font-medium ${challenge.completed ? 'text-[#f5a623]' : 'text-[#8a8f98]'}`}>
            {challenge.reward}
          </span>
        </div>

        {/* Progress / Claim Button */}
        {challenge.completed ? (
          <motion.button
            onClick={onClaim}
            className="w-full py-2.5 rounded-lg bg-[#f5a623] text-[#08090a] font-semibold text-[13px] flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02, backgroundColor: '#f5b03d' }}
            whileTap={{ scale: 0.98 }}
          >
            <Trophy className="w-4 h-4" strokeWidth={2} />
            Réclamer la récompense
            <Sparkles className="w-4 h-4" />
          </motion.button>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[13px] text-white font-medium">
                {challenge.progress}/{challenge.total}
              </span>
              <span className="text-[12px] text-[#6b7280]">
                {progressPercent}%
              </span>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#f5a623] rounded-full"
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
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    loadChallenges();
  }, [activePeriod]);

  const loadChallenges = async () => {
    setLoading(true);
    try {
      // Get active challenges
      const { challenges: activeChallenges } = await challengesAPI.getActive();
      // Get user progress
      const { progress: userProgress } = await challengesAPI.getUserProgress();

      // Filter by period and map
      const mappedChallenges: Challenge[] = (activeChallenges || [])
        .filter((c: any) => {
          if (activePeriod === 'weekly') return c.type === 'weekly' || c.type === 'daily';
          return c.type === 'monthly' || c.type === 'seasonal';
        })
        .map((c: any) => {
          const progress = userProgress?.find((p: any) => p.challenge_id === c.id);
          return {
            id: c.id,
            name: c.name,
            description: c.description,
            reward: c.rewards?.xp ? `${c.rewards.xp} XP` : '100 XP',
            progress: progress?.progress || 0,
            total: progress?.total_required || c.objective?.target || 10,
            completed: progress?.completed || false,
            expiresIn: formatExpiry(c.end_date),
            difficulty: getDifficulty(c.objective?.target),
          };
        });

      setChallenges(mappedChallenges);
    } catch (error) {
      console.error('Error loading challenges:', error);
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  const formatExpiry = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Expiré';
    if (diffDays === 1) return 'Demain';
    return `Dans ${diffDays} jours`;
  };

  const getDifficulty = (target: number): 'easy' | 'medium' | 'hard' => {
    if (!target || target <= 5) return 'easy';
    if (target <= 15) return 'medium';
    return 'hard';
  };

  const handleClaimReward = async (challengeId: string) => {
    try {
      await challengesAPI.claimReward(challengeId);
      showToast('Récompense réclamée !', 'success');
      loadChallenges();
    } catch (error) {
      showToast('Erreur lors de la réclamation', 'error');
    }
  };

  const completedCount = challenges.filter(c => c.completed).length;
  const totalProgress = challenges.length > 0 ? Math.round((completedCount / challenges.length) * 100) : 0;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#f5a623] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return (
    <div className="min-h-screen pb-24 md:pb-8 pt-safe bg-[#08090a]">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <motion.button
              onClick={() => onNavigate('home')}
              className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[#8a8f98]" strokeWidth={2} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-white">
                Defis
              </h1>
              <p className="text-[13px] text-[#6b7280]">
                Releve des challenges et gagne des recompenses
              </p>
            </div>
            <motion.div
              className="w-10 h-10 rounded-lg bg-[#f5a623]/10 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <Trophy className="w-5 h-5 text-[#f5a623]" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Period Tabs */}
          <motion.div variants={itemVariants} className="flex gap-1.5 p-1 bg-white/[0.03] rounded-lg border border-white/[0.06] mb-5">
            {(['weekly', 'monthly'] as ChallengePeriod[]).map((period) => (
              <motion.button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`flex-1 h-9 rounded-md font-medium text-[13px] transition-all duration-200 ${
                  activePeriod === period
                    ? 'bg-[#f5a623] text-[#08090a]'
                    : 'text-[#8a8f98] hover:text-white hover:bg-white/[0.05]'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                {period === 'weekly' ? 'Hebdomadaires' : 'Mensuels'}
              </motion.button>
            ))}
          </motion.div>

          {/* Progress Card */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl border border-[#f5a623]/20 bg-[#f5a623]/5 p-5 mb-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[13px] text-[#8a8f98] mb-1">
                  Progression {activePeriod === 'weekly' ? 'hebdomadaire' : 'mensuelle'}
                </div>
                <div className="text-3xl font-bold text-white">
                  {completedCount}<span className="text-[#6b7280]">/{challenges.length}</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-xl bg-[#f5a623]/10 flex items-center justify-center">
                <Trophy className="w-7 h-7 text-[#f5a623]" strokeWidth={2} />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#f5a623] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${totalProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>

            {/* Bonus text */}
            {completedCount === challenges.length && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center gap-2 text-[#f5a623] text-[13px] font-medium"
              >
                <Sparkles className="w-4 h-4" />
                Tous les defis completes ! Bonus XP debloque !
              </motion.div>
            )}
          </motion.div>

          {/* Section Title */}
          <motion.div variants={itemVariants} className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-[#f5a623]" strokeWidth={2} />
            <h2 className="text-[13px] font-medium text-[#8a8f98] uppercase tracking-wider">
              {activePeriod === 'weekly' ? 'Defis de la semaine' : 'Defis du mois'}
            </h2>
          </motion.div>

          {/* Challenges List */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePeriod}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {challenges.map((challenge, index) => (
                <ChallengeCard
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
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 mt-6"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#f5a623]/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-[#f5a623]" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-white mb-1">
                  De nouveaux defis chaque semaine
                </h3>
                <p className="text-[13px] text-[#6b7280] leading-relaxed">
                  Complete les defis pour gagner de l'XP, debloquer des badges exclusifs et monter dans les classements.
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
