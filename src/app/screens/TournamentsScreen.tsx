import { ArrowLeft, Trophy, Users, Calendar, Clock, Award, Target, Zap, Sparkles, Crown, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface TournamentsScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

type TournamentTab = 'active' | 'upcoming' | 'past';
type TournamentStatus = 'registration' | 'ongoing' | 'completed';

interface Tournament {
  id: string;
  name: string;
  game: string;
  status: TournamentStatus;
  startDate: string;
  teamsRegistered: number;
  maxTeams: number;
  prize: string;
  format: string;
  duration: string;
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

const gameGradients: Record<string, string> = {
  'Valorant': 'from-red-500 to-pink-500',
  'League of Legends': 'from-amber-500 to-yellow-500',
  'Counter-Strike 2': 'from-orange-500 to-amber-500',
  'Apex Legends': 'from-red-600 to-orange-500',
  'default': 'from-indigo-500 to-purple-500'
};

export function TournamentsScreen({ onNavigate, showToast }: TournamentsScreenProps) {
  const [activeTab, setActiveTab] = useState<TournamentTab>('active');

  const tournaments: Tournament[] = [
    {
      id: '1',
      name: 'Valorant Champions Cup',
      game: 'Valorant',
      status: 'ongoing',
      startDate: 'Aujourd\'hui 20h',
      teamsRegistered: 14,
      maxTeams: 16,
      prize: '500€',
      format: 'Best of 3',
      duration: '3 jours',
    },
    {
      id: '2',
      name: 'League of Legends Clash',
      game: 'League of Legends',
      status: 'registration',
      startDate: 'Dans 3 jours',
      teamsRegistered: 8,
      maxTeams: 16,
      prize: '300€',
      format: 'Best of 1',
      duration: '1 jour',
    },
    {
      id: '3',
      name: 'CS2 Weekend Tournament',
      game: 'Counter-Strike 2',
      status: 'registration',
      startDate: 'Dans 5 jours',
      teamsRegistered: 12,
      maxTeams: 32,
      prize: '1000€',
      format: 'Best of 3',
      duration: '2 jours',
    },
    {
      id: '4',
      name: 'Apex Legends Arena',
      game: 'Apex Legends',
      status: 'completed',
      startDate: 'Il y a 1 semaine',
      teamsRegistered: 16,
      maxTeams: 16,
      prize: '400€',
      format: 'Best of 3',
      duration: '2 jours',
    },
  ];

  const tabs: { key: TournamentTab; label: string }[] = [
    { key: 'active', label: 'En cours' },
    { key: 'upcoming', label: 'À venir' },
    { key: 'past', label: 'Terminés' },
  ];

  const getStatusBadge = (status: TournamentStatus) => {
    const configs = {
      registration: { label: 'Inscriptions ouvertes', gradient: 'from-indigo-500 to-purple-500' },
      ongoing: { label: 'En cours', gradient: 'from-emerald-500 to-teal-500' },
      completed: { label: 'Terminé', gradient: 'from-gray-400 to-gray-500' },
    };
    return configs[status];
  };

  const handleRegister = (tournamentId: string) => {
    showToast('Inscription au tournoi confirmée !', 'success');
  };

  const handleViewBracket = (tournamentId: string) => {
    showToast('Bracket du tournoi', 'info');
  };

  const filteredTournaments = tournaments.filter(t => {
    if (activeTab === 'active') return t.status === 'ongoing';
    if (activeTab === 'upcoming') return t.status === 'registration';
    if (activeTab === 'past') return t.status === 'completed';
    return true;
  });

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
          className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-pink-400/15 to-red-400/15 rounded-full blur-3xl"
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Tournois
              </h1>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                Affrontez d'autres squads
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Trophy className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Featured Banner */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-3xl mb-6"
          >
            <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-6 shadow-xl">
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-5 h-5 text-yellow-200" strokeWidth={2} />
                      <span className="text-white/90 text-sm font-semibold">
                        Tournoi en vedette
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Valorant Champions Cup
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-white/90 font-medium">
                      <Calendar className="w-4 h-4" strokeWidth={2} />
                      Aujourd'hui 20h
                    </div>
                  </div>
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    <Trophy className="w-8 h-8 text-white" strokeWidth={2} />
                  </motion.div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                    <Award className="w-4 h-4 text-yellow-200" strokeWidth={2} />
                    <span className="text-white text-sm font-bold">500€</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                    <Users className="w-4 h-4 text-white" strokeWidth={2} />
                    <span className="text-white text-sm font-semibold">14/16 squads</span>
                  </div>
                </div>

                <motion.button
                  onClick={() => handleRegister('1')}
                  className="w-full h-12 rounded-xl bg-white text-orange-600 font-bold text-sm shadow-lg"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Inscrire ma squad (2 places restantes)
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={itemVariants} className="flex gap-2 mb-6">
            {tabs.map((tab) => (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-white/80 backdrop-blur-sm text-gray-600 border border-white/50 hover:border-orange-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Tournaments List */}
          <AnimatePresence mode="wait">
            {filteredTournaments.length > 0 ? (
              <motion.div
                key={activeTab}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {filteredTournaments.map((tournament, index) => {
                  const statusBadge = getStatusBadge(tournament.status);
                  const registrationPercent = Math.round((tournament.teamsRegistered / tournament.maxTeams) * 100);
                  const gameGradient = gameGradients[tournament.game] || gameGradients.default;

                  return (
                    <motion.div
                      key={tournament.id}
                      variants={itemVariants}
                      custom={index}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.01, y: -2 }}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-800">
                              {tournament.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded-lg bg-gradient-to-r ${gameGradient} text-white text-xs font-bold`}>
                              {tournament.game}
                            </span>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full bg-gradient-to-r ${statusBadge.gradient} text-white text-xs font-bold`}>
                            {statusBadge.label}
                          </span>
                        </div>
                        <motion.div
                          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gameGradient} flex items-center justify-center flex-shrink-0 shadow-lg`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Trophy className="w-7 h-7 text-white" strokeWidth={2} />
                        </motion.div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50">
                          <Calendar className="w-4 h-4 text-gray-400" strokeWidth={2} />
                          <span className="text-xs text-gray-600 font-medium">
                            {tournament.startDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50">
                          <Clock className="w-4 h-4 text-gray-400" strokeWidth={2} />
                          <span className="text-xs text-gray-600 font-medium">
                            {tournament.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50">
                          <Award className="w-4 h-4 text-amber-500" strokeWidth={2} />
                          <span className="text-xs text-amber-700 font-semibold">
                            {tournament.prize}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50">
                          <Target className="w-4 h-4 text-gray-400" strokeWidth={2} />
                          <span className="text-xs text-gray-600 font-medium">
                            {tournament.format}
                          </span>
                        </div>
                      </div>

                      {/* Teams Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" strokeWidth={2} />
                            <span className="text-xs text-gray-600 font-semibold">
                              {tournament.teamsRegistered}/{tournament.maxTeams} squads
                            </span>
                          </div>
                          <span className="text-xs text-gray-400 font-medium">
                            {registrationPercent}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${gameGradient} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${registrationPercent}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      {/* Action Button */}
                      {tournament.status === 'registration' && (
                        <motion.button
                          onClick={() => handleRegister(tournament.id)}
                          className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm shadow-lg shadow-orange-500/30"
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Inscrire ma squad
                        </motion.button>
                      )}
                      {tournament.status === 'ongoing' && (
                        <motion.button
                          onClick={() => handleViewBracket(tournament.id)}
                          className="w-full h-11 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold text-sm hover:border-orange-300 hover:text-orange-600 transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Voir le bracket
                        </motion.button>
                      )}
                      {tournament.status === 'completed' && (
                        <motion.button
                          onClick={() => showToast('Résultats du tournoi', 'info')}
                          className="w-full h-11 rounded-xl bg-gray-100 text-gray-500 font-semibold text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Voir les résultats
                        </motion.button>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16"
              >
                <motion.div
                  className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/30"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Trophy className="w-10 h-10 text-white" strokeWidth={1.5} />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Aucun tournoi
                </h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                  Les tournois apparaîtront ici
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Create Tournament CTA */}
          <motion.div
            variants={itemVariants}
            className="mt-6"
          >
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-4 border border-indigo-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-indigo-800">
                    Créer votre propre tournoi
                  </p>
                  <p className="text-[10px] text-indigo-600 mt-0.5">
                    Disponible avec l'abonnement Premium
                  </p>
                </div>
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default TournamentsScreen;
