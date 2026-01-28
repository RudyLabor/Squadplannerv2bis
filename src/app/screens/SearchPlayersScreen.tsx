import { ArrowLeft, Search, UserPlus, Users, Trophy, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface SearchPlayersScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface Player {
  id: string;
  name: string;
  level: number;
  reliabilityScore: number;
  games: string[];
  commonSquads: number;
  isOnline: boolean;
}

export function SearchPlayersScreen({ onNavigate, showToast }: SearchPlayersScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<string>('all');

  const mockPlayers: Player[] = [
    { id: '1', name: 'MaxGaming', level: 38, reliabilityScore: 92, games: ['Valorant', 'LoL'], commonSquads: 2, isOnline: true },
    { id: '2', name: 'NightOwl', level: 42, reliabilityScore: 88, games: ['CS2', 'Valorant'], commonSquads: 0, isOnline: true },
    { id: '3', name: 'ProPlayer', level: 35, reliabilityScore: 95, games: ['LoL', 'Apex'], commonSquads: 1, isOnline: false },
    { id: '4', name: 'ShadowKing', level: 40, reliabilityScore: 76, games: ['Valorant', 'CS2'], commonSquads: 0, isOnline: false },
  ];

  const games = ['all', 'Valorant', 'League of Legends', 'CS2', 'Apex Legends'];

  const handleAddFriend = (playerId: string, playerName: string) => {
    showToast(`Invitation envoyée à ${playerName}`, 'success');
  };

  const handleViewProfile = (playerId: string) => {
    onNavigate('public-profile');
  };

  const filteredPlayers = mockPlayers.filter(player => {
    const matchesQuery = player.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGame = selectedGame === 'all' || player.games.some(g => g.includes(selectedGame));
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
              Rechercher Joueurs
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] font-medium mt-1">
              Trouve de nouveaux coéquipiers
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--fg-tertiary)]" strokeWidth={2} />
            <input
              type="text"
              placeholder="Rechercher par pseudo..."
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
            {filteredPlayers.length} résultat{filteredPlayers.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Players List */}
        <div className="space-y-3">
          {filteredPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-4 mb-4">
                {/* Avatar */}
                <button
                  onClick={() => handleViewProfile(player.id)}
                  className="relative flex-shrink-0"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] flex items-center justify-center text-white font-bold text-xl">
                    {player.name[0]}
                  </div>
                  {player.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[var(--success-500)] rounded-full border-2 border-white" />
                  )}
                </button>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => handleViewProfile(player.id)}
                    className="text-left w-full"
                  >
                    <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1 hover:text-[var(--primary-500)] transition-colors">
                      {player.name}
                    </div>
                    <div className="flex items-center gap-3 text-xs mb-2">
                      <span className="text-[var(--fg-tertiary)] font-medium">
                        Niveau {player.level}
                      </span>
                      <span className={`font-semibold ${
                        player.reliabilityScore >= 90 ? 'text-[var(--success-500)]' :
                        player.reliabilityScore >= 75 ? 'text-[var(--primary-500)]' :
                        'text-[var(--fg-secondary)]'
                      }`}>
                        {player.reliabilityScore} fiabilité
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {player.games.map((game) => (
                        <span
                          key={game}
                          className="px-2 py-1 bg-[var(--primary-50)] text-[var(--primary-500)] rounded-lg text-[10px] font-bold"
                        >
                          {game}
                        </span>
                      ))}
                    </div>
                  </button>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleAddFriend(player.id, player.name)}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white flex items-center justify-center hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] shadow-lg shadow-[var(--primary-500)]/20 transition-all duration-200 flex-shrink-0"
                >
                  <UserPlus className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>

              {/* Common Squads */}
              {player.commonSquads > 0 && (
                <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-subtle)]">
                  <Users className="w-4 h-4 text-[var(--fg-tertiary)]" strokeWidth={2} />
                  <span className="text-xs text-[var(--fg-secondary)] font-semibold">
                    {player.commonSquads} squad{player.commonSquads > 1 ? 's' : ''} en commun
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPlayers.length === 0 && searchQuery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-2xl bg-[var(--primary-50)] flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[var(--primary-500)]" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-2">
              Aucun résultat
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
              <TrendingUp className="w-5 h-5 text-[var(--primary-500)] flex-shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <div className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                  Trouve des joueurs fiables
                </div>
                <div className="text-xs text-[var(--fg-secondary)] font-medium leading-relaxed">
                  Recherche par pseudo et filtre par jeu pour trouver des coéquipiers compatibles avec ton style de jeu.
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
export default SearchPlayersScreen;
