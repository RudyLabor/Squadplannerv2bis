import { ArrowLeft, Trophy, Users, Calendar, Clock, Award, Target, Sparkles, Crown, Star, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { tournamentsAPI } from '@/utils/api';

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

const gameColors: Record<string, string> = {
  'Valorant': '#ff4655',
  'League of Legends': '#c89b3c',
  'Counter-Strike 2': '#f5a623',
  'Apex Legends': '#da292a',
  'default': '#f5a623'
};

export function TournamentsScreen({ onNavigate, showToast }: TournamentsScreenProps) {
  const [activeTab, setActiveTab] = useState<TournamentTab>('active');
  const [loading, setLoading] = useState(true);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    setLoading(true);
    try {
      const { tournaments: tournamentsData } = await tournamentsAPI.getAll();
      const mappedTournaments: Tournament[] = (tournamentsData || []).map((t: any) => ({
        id: t.id,
        name: t.name,
        game: t.game || 'Valorant',
        status: getStatus(t.start_date, t.end_date),
        startDate: formatDate(t.start_date),
        teamsRegistered: t.current_participants || 0,
        maxTeams: t.max_participants || 16,
        prize: t.prizes?.first_place || '500€',
        format: t.format || 'Best of 3',
        duration: t.duration || '2 jours',
      }));
      setTournaments(mappedTournaments);
    } catch (error) {
      console.error('Error loading tournaments:', error);
      setTournaments([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (startDate: string, endDate: string): TournamentStatus => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (now < start) return 'registration';
    if (now > end) return 'completed';
    return 'ongoing';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Demain';
    return `Dans ${diffDays} jours`;
  };

  const tabs: { key: TournamentTab; label: string; count: number }[] = [
    { key: 'active', label: 'En cours', count: tournaments.filter(t => t.status === 'ongoing').length },
    { key: 'upcoming', label: 'À venir', count: tournaments.filter(t => t.status === 'registration').length },
    { key: 'past', label: 'Terminés', count: tournaments.filter(t => t.status === 'completed').length },
  ];

  const getStatusConfig = (status: TournamentStatus) => {
    const configs = {
      registration: { label: 'Inscriptions ouvertes', color: '#f5a623', bgColor: 'rgba(245, 166, 35, 0.12)' },
      ongoing: { label: 'En cours', color: '#00c853', bgColor: 'rgba(0, 200, 83, 0.12)' },
      completed: { label: 'Terminé', color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.12)' },
    };
    return configs[status];
  };

  const handleRegister = async (tournamentId: string) => {
    try {
      // Registration requires squadId - simplified for now
      showToast('Inscription au tournoi confirmée !', 'success');
      loadTournaments();
    } catch (error) {
      showToast('Erreur lors de l\'inscription', 'error');
    }
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
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <motion.button
              onClick={() => onNavigate('home')}
              className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[#8a8f98]" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-white tracking-tight">
                Tournois
              </h1>
              <p className="text-sm text-[#6b7280] mt-0.5">
                Affrontez d'autres squads
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(245, 166, 35, 0.12)' }}
            >
              <Trophy className="w-5 h-5" style={{ color: '#f5a623' }} strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Featured Banner */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-2xl mb-6 border border-white/[0.06]"
            style={{ background: 'linear-gradient(135deg, rgba(245, 166, 35, 0.15) 0%, rgba(245, 166, 35, 0.05) 100%)' }}
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-4 h-4" style={{ color: '#f5a623' }} strokeWidth={1.5} />
                    <span className="text-xs font-medium" style={{ color: '#f5a623' }}>
                      Tournoi en vedette
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-white mb-1">
                    Valorant Champions Cup
                  </h2>
                  <div className="flex items-center gap-1.5 text-sm text-[#8a8f98]">
                    <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>Aujourd'hui 20h</span>
                  </div>
                </div>
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(245, 166, 35, 0.2)' }}
                >
                  <Trophy className="w-7 h-7" style={{ color: '#f5a623' }} strokeWidth={1.5} />
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                  style={{ backgroundColor: 'rgba(245, 166, 35, 0.12)' }}
                >
                  <Award className="w-3.5 h-3.5" style={{ color: '#f5a623' }} strokeWidth={1.5} />
                  <span className="text-xs font-semibold" style={{ color: '#f5a623' }}>500€</span>
                </div>
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
                >
                  <Users className="w-3.5 h-3.5 text-[#8a8f98]" strokeWidth={1.5} />
                  <span className="text-xs font-medium text-[#8a8f98]">14/16 squads</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: '#f5a623' }}
                    initial={{ width: 0 }}
                    animate={{ width: '87.5%' }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                  />
                </div>
              </div>

              <motion.button
                onClick={() => handleRegister('1')}
                className="w-full h-11 rounded-xl font-medium text-sm transition-all"
                style={{ backgroundColor: '#f5a623', color: '#08090a' }}
                whileHover={{ scale: 1.02, opacity: 0.9 }}
                whileTap={{ scale: 0.98 }}
              >
                Inscrire ma squad (2 places restantes)
              </motion.button>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={itemVariants} className="flex gap-1 p-1 mb-6 bg-white/[0.03] rounded-xl border border-white/[0.06]">
            {tabs.map((tab) => (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-white/[0.08] text-white'
                    : 'text-[#6b7280] hover:text-[#8a8f98]'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                    style={{
                      backgroundColor: activeTab === tab.key ? 'rgba(245, 166, 35, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                      color: activeTab === tab.key ? '#f5a623' : '#6b7280'
                    }}
                  >
                    {tab.count}
                  </span>
                )}
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
                className="space-y-3"
              >
                {filteredTournaments.map((tournament, index) => {
                  const statusConfig = getStatusConfig(tournament.status);
                  const registrationPercent = Math.round((tournament.teamsRegistered / tournament.maxTeams) * 100);
                  const gameColor = gameColors[tournament.game] || gameColors.default;

                  return (
                    <motion.div
                      key={tournament.id}
                      variants={itemVariants}
                      custom={index}
                      className="bg-white/[0.02] backdrop-blur-sm rounded-xl p-4 border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-200"
                      whileHover={{ scale: 1.01 }}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="text-[15px] font-semibold text-white truncate">
                              {tournament.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="px-2 py-0.5 rounded-md text-[11px] font-semibold"
                              style={{ backgroundColor: `${gameColor}20`, color: gameColor }}
                            >
                              {tournament.game}
                            </span>
                            <span
                              className="px-2 py-0.5 rounded-md text-[11px] font-medium"
                              style={{ backgroundColor: statusConfig.bgColor, color: statusConfig.color }}
                            >
                              {statusConfig.label}
                            </span>
                          </div>
                        </div>
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ml-3"
                          style={{ backgroundColor: `${gameColor}15` }}
                        >
                          <Trophy className="w-5 h-5" style={{ color: gameColor }} strokeWidth={1.5} />
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="flex flex-col items-center p-2 rounded-lg bg-white/[0.03]">
                          <Calendar className="w-3.5 h-3.5 text-[#6b7280] mb-1" strokeWidth={1.5} />
                          <span className="text-[10px] text-[#8a8f98] text-center leading-tight">
                            {tournament.startDate}
                          </span>
                        </div>
                        <div className="flex flex-col items-center p-2 rounded-lg bg-white/[0.03]">
                          <Clock className="w-3.5 h-3.5 text-[#6b7280] mb-1" strokeWidth={1.5} />
                          <span className="text-[10px] text-[#8a8f98] text-center leading-tight">
                            {tournament.duration}
                          </span>
                        </div>
                        <div className="flex flex-col items-center p-2 rounded-lg" style={{ backgroundColor: 'rgba(245, 166, 35, 0.08)' }}>
                          <Award className="w-3.5 h-3.5 mb-1" style={{ color: '#f5a623' }} strokeWidth={1.5} />
                          <span className="text-[10px] font-semibold" style={{ color: '#f5a623' }}>
                            {tournament.prize}
                          </span>
                        </div>
                        <div className="flex flex-col items-center p-2 rounded-lg bg-white/[0.03]">
                          <Target className="w-3.5 h-3.5 text-[#6b7280] mb-1" strokeWidth={1.5} />
                          <span className="text-[10px] text-[#8a8f98] text-center leading-tight">
                            {tournament.format}
                          </span>
                        </div>
                      </div>

                      {/* Teams Progress */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#6b7280]" strokeWidth={1.5} />
                            <span className="text-xs text-[#8a8f98]">
                              {tournament.teamsRegistered}/{tournament.maxTeams} squads
                            </span>
                          </div>
                          <span className="text-xs text-[#6b7280]">
                            {registrationPercent}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: gameColor }}
                            initial={{ width: 0 }}
                            animate={{ width: `${registrationPercent}%` }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
                          />
                        </div>
                      </div>

                      {/* Action Button */}
                      {tournament.status === 'registration' && (
                        <motion.button
                          onClick={() => handleRegister(tournament.id)}
                          className="w-full h-10 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all"
                          style={{ backgroundColor: '#f5a623', color: '#08090a' }}
                          whileHover={{ scale: 1.02, opacity: 0.9 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Inscrire ma squad
                          <ChevronRight className="w-4 h-4" strokeWidth={2} />
                        </motion.button>
                      )}
                      {tournament.status === 'ongoing' && (
                        <motion.button
                          onClick={() => handleViewBracket(tournament.id)}
                          className="w-full h-10 rounded-lg font-medium text-sm flex items-center justify-center gap-2 bg-white/[0.06] text-white border border-white/[0.08] hover:bg-white/[0.1] transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Voir le bracket
                          <ChevronRight className="w-4 h-4" strokeWidth={2} />
                        </motion.button>
                      )}
                      {tournament.status === 'completed' && (
                        <motion.button
                          onClick={() => showToast('Résultats du tournoi', 'info')}
                          className="w-full h-10 rounded-lg font-medium text-sm flex items-center justify-center gap-2 bg-white/[0.04] text-[#6b7280] border border-white/[0.06] hover:bg-white/[0.06] transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Voir les résultats
                          <ChevronRight className="w-4 h-4" strokeWidth={2} />
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
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: 'rgba(245, 166, 35, 0.12)' }}
                >
                  <Trophy className="w-8 h-8" style={{ color: '#f5a623' }} strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">
                  Aucun tournoi
                </h3>
                <p className="text-sm text-[#6b7280] max-w-xs mx-auto">
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
            <div
              className="rounded-xl p-4 border border-white/[0.06]"
              style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.03) 100%)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)' }}
                >
                  <Sparkles className="w-5 h-5" style={{ color: '#8b5cf6' }} strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    Créer votre propre tournoi
                  </p>
                  <p className="text-xs text-[#6b7280] mt-0.5">
                    Disponible avec l'abonnement Premium
                  </p>
                </div>
                <Star className="w-5 h-5" style={{ color: '#f5a623', fill: '#f5a623' }} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default TournamentsScreen;
