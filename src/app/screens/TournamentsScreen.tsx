import { ArrowLeft, Trophy, Users, Calendar, Clock, Award, TrendingUp, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
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
      registration: { label: 'Inscriptions ouvertes', bg: 'bg-[var(--primary-50)]', text: 'text-[var(--primary-500)]' },
      ongoing: { label: 'En cours', bg: 'bg-[var(--success-50)]', text: 'text-[var(--success-500)]' },
      completed: { label: 'Terminé', bg: 'bg-gray-100', text: 'text-gray-600' },
    };
    return configs[status];
  };

  const handleRegister = (tournamentId: string) => {
    showToast('Inscription au tournoi confirmée !', 'success');
  };

  const handleViewBracket = (tournamentId: string) => {
    showToast('Bracket du tournoi', 'info');
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
              Tournois
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium mt-1">
              Affrontez d'autres squads
            </p>
          </div>
        </div>

        {/* Featured Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] rounded-2xl p-6 mb-8 shadow-lg"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-white/90 text-sm font-semibold mb-2">
                🏆 Tournoi en vedette
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Valorant Champions Cup
              </h2>
              <div className="flex items-center gap-2 text-sm text-white/90 font-medium">
                <Calendar className="w-4 h-4" strokeWidth={2} />
                Aujourd'hui 20h
              </div>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
          </div>
          <button
            onClick={() => handleRegister('1')}
            className="w-full h-12 rounded-xl bg-white text-[var(--primary-500)] font-semibold text-sm hover:bg-white/90 transition-all shadow-md"
          >
            Inscrire ma squad (14/16 places)
          </button>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-[var(--primary-500)] text-white shadow-sm'
                  : 'bg-white text-[var(--fg-secondary)] border-[0.5px] border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tournaments List */}
        <div className="space-y-4">
          {tournaments
            .filter(t => {
              if (activeTab === 'active') return t.status === 'ongoing';
              if (activeTab === 'upcoming') return t.status === 'registration';
              if (activeTab === 'past') return t.status === 'completed';
              return true;
            })
            .map((tournament, index) => {
              const statusBadge = getStatusBadge(tournament.status);
              const registrationPercent = Math.round((tournament.teamsRegistered / tournament.maxTeams) * 100);
              
              return (
                <motion.div
                  key={tournament.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-5 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-[var(--fg-primary)]">
                          {tournament.name}
                        </h3>
                      </div>
                      <div className="text-sm text-[var(--fg-secondary)] font-medium mb-2">
                        {tournament.game}
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold ${statusBadge.bg} ${statusBadge.text}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-[var(--primary-50)] flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-7 h-7 text-[var(--primary-500)]" strokeWidth={2} />
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[var(--fg-tertiary)]" strokeWidth={2} />
                      <span className="text-xs text-[var(--fg-secondary)] font-medium">
                        {tournament.startDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[var(--fg-tertiary)]" strokeWidth={2} />
                      <span className="text-xs text-[var(--fg-secondary)] font-medium">
                        {tournament.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[var(--fg-tertiary)]" strokeWidth={2} />
                      <span className="text-xs text-[var(--fg-secondary)] font-medium">
                        {tournament.prize}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-[var(--fg-tertiary)]" strokeWidth={2} />
                      <span className="text-xs text-[var(--fg-secondary)] font-medium">
                        {tournament.format}
                      </span>
                    </div>
                  </div>

                  {/* Teams Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[var(--fg-tertiary)]" strokeWidth={2} />
                        <span className="text-xs text-[var(--fg-secondary)] font-semibold">
                          {tournament.teamsRegistered}/{tournament.maxTeams} squads
                        </span>
                      </div>
                      <span className="text-xs text-[var(--fg-tertiary)] font-medium">
                        {registrationPercent}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[var(--primary-500)] to-[var(--secondary-500)] rounded-full"
                        style={{ width: `${registrationPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  {tournament.status === 'registration' && (
                    <button
                      onClick={() => handleRegister(tournament.id)}
                      className="w-full h-10 rounded-xl bg-[var(--primary-500)] text-white font-semibold text-sm hover:bg-[var(--primary-600)] transition-all shadow-sm"
                    >
                      Inscrire ma squad
                    </button>
                  )}
                  {tournament.status === 'ongoing' && (
                    <button
                      onClick={() => handleViewBracket(tournament.id)}
                      className="w-full h-10 rounded-xl bg-white border-[0.5px] border-[var(--border-medium)] text-[var(--fg-primary)] font-semibold text-sm hover:border-[var(--primary-500)] hover:text-[var(--primary-500)] transition-all"
                    >
                      Voir le bracket
                    </button>
                  )}
                  {tournament.status === 'completed' && (
                    <button
                      onClick={() => showToast('Résultats du tournoi', 'info')}
                      className="w-full h-10 rounded-xl bg-white border-[0.5px] border-[var(--border-medium)] text-[var(--fg-secondary)] font-semibold text-sm hover:border-[var(--border-strong)] transition-all"
                    >
                      Voir les résultats
                    </button>
                  )}
                </motion.div>
              );
            })}
        </div>

        {/* Empty State */}
        {tournaments.filter(t => {
          if (activeTab === 'active') return t.status === 'ongoing';
          if (activeTab === 'upcoming') return t.status === 'registration';
          if (activeTab === 'past') return t.status === 'completed';
          return true;
        }).length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-2xl bg-[var(--primary-50)] flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-[var(--primary-500)]" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-2">
              Aucun tournoi
            </h3>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium">
              Les tournois apparaîtront ici
            </p>
          </motion.div>
        )}

      </div>
    </div>
  );
}
export default TournamentsScreen;
