import { X, Search, Check } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Game, games, categoryLabels, categoryIcons } from '@/data/games';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface GamePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (game: Game) => void;
  selectedGame?: Game | null;
}

export function GamePicker({ isOpen, onClose, onSelect, selectedGame }: GamePickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Game['category'] | 'all'>('all');

  const categories: Array<Game['category'] | 'all'> = [
    'all',
    'fps',
    'moba',
    'br',
    'rpg',
    'sports',
    'strategy',
    'coop',
    'casual',
  ];

  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.developer?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelect = (game: Game) => {
    onSelect(game);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--border-subtle)]">
            <div>
              <h2 className="text-xl font-semibold text-[var(--fg-primary)] tracking-tight">
                Choisir un jeu
              </h2>
              <p className="text-sm text-[var(--fg-tertiary)] mt-1">
                {filteredGames.length} jeux disponibles
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-muted)] flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-[var(--fg-secondary)]" strokeWidth={2} />
            </button>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-[var(--border-subtle)]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--fg-tertiary)]" strokeWidth={2} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un jeu..."
                className="w-full h-12 pl-12 pr-4 rounded-xl border-[0.5px] border-[var(--border-medium)] focus:border-[var(--primary-500)] focus:outline-none text-sm bg-[var(--bg-subtle)] transition-colors"
                autoFocus
              />
            </div>
          </div>

          {/* Categories */}
          <div className="px-6 py-4 border-b border-[var(--border-subtle)] overflow-x-auto hide-scrollbar">
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white shadow-lg shadow-[var(--primary-500)]/20'
                      : 'bg-[var(--bg-subtle)] text-[var(--fg-secondary)] hover:bg-[var(--bg-muted)]'
                  }`}
                >
                  {category === 'all' ? '🎮 Tous' : `${categoryIcons[category]} ${categoryLabels[category]}`}
                </button>
              ))}
            </div>
          </div>

          {/* Games Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredGames.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🎮</div>
                <p className="text-sm text-[var(--fg-tertiary)]">
                  Aucun jeu trouvé
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredGames.map((game) => (
                  <motion.button
                    key={game.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => handleSelect(game)}
                    className={`relative rounded-2xl overflow-hidden bg-white border-[0.5px] transition-all duration-200 group ${
                      selectedGame?.id === game.id
                        ? 'border-[var(--primary-500)] ring-2 ring-[var(--primary-500)]/20 shadow-lg'
                        : 'border-[var(--border-subtle)] hover:border-[var(--border-medium)] shadow-sm hover:shadow-md'
                    }`}
                  >
                    {/* Game Image */}
                    <div className="aspect-video relative overflow-hidden">
                      <ImageWithFallback
                        src={game.image}
                        alt={game.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-xl border border-white/20">
                        <span className="text-xs font-semibold text-white">
                          {categoryIcons[game.category]} {categoryLabels[game.category]}
                        </span>
                      </div>

                      {/* Selected Check */}
                      {selectedGame?.id === game.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[var(--primary-500)] flex items-center justify-center shadow-lg"
                        >
                          <Check className="w-5 h-5 text-white" strokeWidth={3} />
                        </motion.div>
                      )}

                      {/* Ranked Badge */}
                      {game.ranked && (
                        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-[var(--warning-500)]/90 backdrop-blur-xl border border-[var(--warning-300)]">
                          <span className="text-xs font-bold text-white">🏆</span>
                        </div>
                      )}
                    </div>

                    {/* Game Info */}
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-[var(--fg-primary)] mb-1 truncate">
                        {game.name}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-[var(--fg-tertiary)]">
                        <span>{game.players}</span>
                        {game.developer && (
                          <span className="truncate ml-2">{game.developer}</span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {selectedGame && (
            <div className="p-6 border-t border-[var(--border-subtle)] bg-gradient-to-br from-[var(--primary-50)] to-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={selectedGame.image}
                    alt={selectedGame.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-[var(--fg-primary)] truncate">
                    {selectedGame.name}
                  </h4>
                  <p className="text-xs text-[var(--fg-tertiary)]">
                    {categoryLabels[selectedGame.category]} • {selectedGame.players}
                  </p>
                </div>
                <button
                  onClick={() => handleSelect(selectedGame)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white text-sm font-semibold shadow-lg shadow-[var(--primary-500)]/20 hover:shadow-xl hover:shadow-[var(--primary-500)]/30 transition-all duration-200"
                >
                  Confirmer
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
