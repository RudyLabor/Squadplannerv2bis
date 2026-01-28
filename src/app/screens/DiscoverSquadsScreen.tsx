import { ArrowLeft, Users, TrendingUp, Globe, Lock, UserPlus, Search, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface DiscoverSquadsScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface Squad {
  id: string;
  name: string;
  game: string;
  members: number;
  maxMembers: number;
  activityRate: number;
  avgReliability: number;
  isPublic: boolean;
  description: string;
  tags: string[];
}

export function DiscoverSquadsScreen({ onNavigate, showToast }: DiscoverSquadsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<string>('all');

  const mockSquads: Squad[] = [
    {
      id: '1',
      name: 'Elite Warriors',
      game: 'Valorant',
      members: 4,
      maxMembers: 6,
      activityRate: 92,
      avgReliability: 88,
      isPublic: true,
      description: 'Squad compétitive cherchant joueurs sérieux',
      tags: ['Compétitif', 'Ranked', 'Soir'],
    },
    {
      id: '2',
      name: 'Chill Gamers',
      game: 'League of Legends',
      members: 5,
      maxMembers: 5,
      activityRate: 78,
      avgReliability: 85,
      isPublic: true,
      description: 'On joue pour le fun, bonne ambiance garantie',
      tags: ['Casual', 'Fun', 'Tous niveaux'],
    },
    {
      id: '3',
      name: 'Night Owls',
      game: 'CS2',
      members: 3,
      maxMembers: 6,
      activityRate: 95,
      avgReliability: 92,
      isPublic: true,
      description: 'Sessions nocturnes régulières (22h-2h)',
      tags: ['Nuit', 'Régulier', 'Adultes'],
    },
    {
      id: '4',
      name: 'Weekend Warriors',
      game: 'Apex Legends',
      members: 2,
      maxMembers: 4,
      activityRate: 85,
      avgReliability: 79,
      isPublic: true,
      description: 'On joue que le weekend, vibes positives',
      tags: ['Weekend', 'Débutants ok'],
    },
  ];

  const games = ['all', 'Valorant', 'League of Legends', 'CS2', 'Apex Legends'];

  const handleRequestJoin = (squadId: string, squadName: string) => {
    showToast(`Demande envoyée à ${squadName}`, 'success');
  };

  const filteredSquads = mockSquads.filter(squad => {
    const matchesQuery = squad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        squad.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGame = selectedGame === 'all' || squad.game === selectedGame;
    return matchesQuery && matchesGame;
  });

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
              Découvrir Squads
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium mt-1">
              Trouve ta prochaine équipe
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--fg-tertiary)]" strokeWidth={2} />
            <input
              type="text"
              placeholder="Rechercher une squad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white border-[0.5px] border-[var(--border-subtle)] text-sm font-medium text-[var(--fg-primary)] placeholder:text-[var(--fg-tertiary)] focus:outline-none focus:border-[var(--primary-500)] focus:ring-2 focus:ring-[var(--primary-100)] shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Game Filters */}
        <div className="mb-6">
          <div className="text-sm font-semibold text-[var(--fg-primary)] mb-3">
            Filtrer par jeu
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {games.map((game) => (
              <button
                key={game}
                onClick={() => setSelectedGame(game)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedGame === game
                    ? 'bg-[var(--primary-500)] text-white shadow-sm'
                    : 'bg-white text-[var(--fg-secondary)] border-[0.5px] border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
                }`}
              >
                {game === 'all' ? 'Tous' : game}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <div className="text-sm text-[var(--fg-secondary)] font-semibold">
            {filteredSquads.length} squad{filteredSquads.length > 1 ? 's' : ''} disponible{filteredSquads.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Squads List */}
        <div className="space-y-4">
          {filteredSquads.map((squad, index) => {
            const spotsLeft = squad.maxMembers - squad.members;
            const isFull = spotsLeft === 0;
            
            return (
              <motion.div
                key={squad.id}
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
                        {squad.name}
                      </h3>
                      {squad.isPublic ? (
                        <Globe className="w-4 h-4 text-[var(--success-500)]" strokeWidth={2} />
                      ) : (
                        <Lock className="w-4 h-4 text-[var(--fg-tertiary)]" strokeWidth={2} />
                      )}
                    </div>
                    <div className="text-sm text-[var(--fg-secondary)] font-medium mb-2">
                      {squad.game}
                    </div>
                    <p className="text-sm text-[var(--fg-tertiary)] font-medium">
                      {squad.description}
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-[var(--primary-50)] flex items-center justify-center flex-shrink-0">
                    <Users className="w-7 h-7 text-[var(--primary-500)]" strokeWidth={2} />
                  </div>
                </div>

                {/* Tags */}
                <div className="flex gap-2 flex-wrap mb-4">
                  {squad.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-[var(--primary-50)] text-[var(--primary-500)] rounded-lg text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-[var(--fg-primary)]">
                      {squad.members}/{squad.maxMembers}
                    </div>
                    <div className="text-[10px] text-[var(--fg-tertiary)] font-semibold uppercase tracking-wider">
                      Membres
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${
                      squad.activityRate >= 85 ? 'text-[var(--success-500)]' :
                      squad.activityRate >= 70 ? 'text-[var(--primary-500)]' :
                      'text-[var(--fg-secondary)]'
                    }`}>
                      {squad.activityRate}%
                    </div>
                    <div className="text-[10px] text-[var(--fg-tertiary)] font-semibold uppercase tracking-wider">
                      Activité
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${
                      squad.avgReliability >= 85 ? 'text-[var(--success-500)]' :
                      squad.avgReliability >= 70 ? 'text-[var(--primary-500)]' :
                      'text-[var(--fg-secondary)]'
                    }`}>
                      {squad.avgReliability}
                    </div>
                    <div className="text-[10px] text-[var(--fg-tertiary)] font-semibold uppercase tracking-wider">
                      Fiabilité
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                {isFull ? (
                  <button
                    disabled
                    className="w-full h-10 rounded-xl bg-gray-100 text-gray-400 font-semibold text-sm cursor-not-allowed"
                  >
                    Squad complète
                  </button>
                ) : (
                  <button
                    onClick={() => handleRequestJoin(squad.id, squad.name)}
                    className="w-full h-10 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white font-semibold text-sm hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] shadow-lg shadow-[var(--primary-500)]/20 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" strokeWidth={2} />
                    Demander à rejoindre ({spotsLeft} place{spotsLeft > 1 ? 's' : ''})
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredSquads.length === 0 && searchQuery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-2xl bg-[var(--primary-50)] flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[var(--primary-500)]" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-2">
              Aucune squad trouvée
            </h3>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium">
              Essaye une autre recherche
            </p>
          </motion.div>
        )}

        {/* Info Banner */}
        {searchQuery.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-[var(--primary-50)] to-[var(--secondary-50)] rounded-2xl p-5 border-[0.5px] border-[var(--primary-100)] mt-8"
          >
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-[var(--primary-500)] flex-shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                  Trouve ta squad idéale
                </div>
                <div className="text-xs text-[var(--fg-secondary)] font-medium leading-relaxed">
                  Parcours les squads publiques, filtre par jeu et vérifie leur niveau d'activité avant de rejoindre.
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
export default DiscoverSquadsScreen;
