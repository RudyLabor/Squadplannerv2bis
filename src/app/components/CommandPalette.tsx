import { memo, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Users, Calendar, Plus, Home, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandPaletteComponent = ({ isOpen, onClose }: CommandPaletteProps) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: Command[] = useMemo(() => [
    {
      id: 'home',
      label: 'Aller à l\'accueil',
      description: 'Vue d\'ensemble et prochaines sessions',
      icon: <Home className="w-4 h-4" />,
      action: () => { navigate('/home'); onClose(); },
      keywords: ['home', 'accueil', 'dashboard']
    },
    {
      id: 'squads',
      label: 'Voir mes squads',
      description: 'Liste de toutes vos équipes',
      icon: <Users className="w-4 h-4" />,
      action: () => { navigate('/squads'); onClose(); },
      keywords: ['squads', 'équipes', 'teams']
    },
    {
      id: 'sessions',
      label: 'Voir mes sessions',
      description: 'Sessions passées et à venir',
      icon: <Calendar className="w-4 h-4" />,
      action: () => { navigate('/sessions'); onClose(); },
      keywords: ['sessions', 'planning', 'calendar']
    },
    {
      id: 'profile',
      label: 'Mon profil',
      description: 'Statistiques et paramètres',
      icon: <User className="w-4 h-4" />,
      action: () => { navigate('/profile'); onClose(); },
      keywords: ['profil', 'profile', 'stats']
    },
    {
      id: 'create-squad',
      label: 'Créer une squad',
      description: 'Nouvelle équipe de jeu',
      icon: <Plus className="w-4 h-4" />,
      action: () => { navigate('/create-squad'); onClose(); },
      keywords: ['créer', 'squad', 'nouveau', 'équipe']
    },
    {
      id: 'create-session',
      label: 'Planifier une session',
      description: 'Proposer un nouveau créneau',
      icon: <Plus className="w-4 h-4" />,
      action: () => { navigate('/create-session'); onClose(); },
      keywords: ['planifier', 'session', 'nouveau', 'créer']
    }
  ], [navigate, onClose]);

  const filteredCommands = useMemo(() => {
    if (!search) return commands;
    
    const lowerSearch = search.toLowerCase();
    return commands.filter(cmd => 
      cmd.label.toLowerCase().includes(lowerSearch) ||
      cmd.description?.toLowerCase().includes(lowerSearch) ||
      cmd.keywords?.some(k => k.includes(lowerSearch))
    );
  }, [search, commands]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, filteredCommands, selectedIndex]);

  // Reset state on open/close
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[var(--z-modal-backdrop)]"
          />

          {/* Command Palette */}
          <div className="fixed inset-0 z-[var(--z-modal)] flex items-start justify-center pt-[20vh] px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -20 }}
              transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
              className="w-full max-w-xl glass-4 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Search Input */}
              <div className="p-4 border-b border-[var(--border-medium)]">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-[var(--fg-tertiary)]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setSelectedIndex(0);
                    }}
                    placeholder="Rechercher une action..."
                    autoFocus
                    className="flex-1 bg-transparent text-[var(--text-base)] text-[var(--fg-primary)] outline-none placeholder:text-[var(--fg-quaternary)]"
                  />
                  <kbd className="px-2 py-1 text-[var(--text-xs)] text-[var(--fg-tertiary)] glass-2 rounded">
                    ESC
                  </kbd>
                </div>
              </div>

              {/* Commands List */}
              <div className="max-h-[400px] overflow-y-auto">
                {filteredCommands.length > 0 ? (
                  <div className="p-2">
                    {filteredCommands.map((cmd, index) => (
                      <motion.button
                        key={cmd.id}
                        onClick={cmd.action}
                        onMouseEnter={() => setSelectedIndex(index)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.15, delay: index * 0.02 }}
                        className={`
                          w-full flex items-center gap-3 px-3 py-3 rounded-xl
                          transition-all duration-150
                          ${selectedIndex === index 
                            ? 'glass-3 text-[var(--fg-primary)]' 
                            : 'text-[var(--fg-secondary)] hover:glass-2'
                          }
                        `}
                      >
                        <span className="text-[var(--fg-tertiary)]">
                          {cmd.icon}
                        </span>
                        <div className="flex-1 text-left">
                          <div className="text-[var(--text-sm)] font-medium">
                            {cmd.label}
                          </div>
                          {cmd.description && (
                            <div className="text-[var(--text-xs)] text-[var(--fg-tertiary)] mt-0.5">
                              {cmd.description}
                            </div>
                          )}
                        </div>
                        {selectedIndex === index && (
                          <kbd className="px-2 py-1 text-[var(--text-xs)] text-[var(--fg-tertiary)] glass-2 rounded">
                            ↵
                          </kbd>
                        )}
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-[var(--text-sm)] text-[var(--fg-tertiary)]">
                      Aucun résultat trouvé
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-[var(--border-medium)] flex items-center justify-between text-[var(--text-xs)] text-[var(--fg-quaternary)]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 glass-2 rounded">↑</kbd>
                    <kbd className="px-1.5 py-0.5 glass-2 rounded">↓</kbd>
                    <span className="ml-1">Naviguer</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 glass-2 rounded">↵</kbd>
                    <span className="ml-1">Sélectionner</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 glass-2 rounded">ESC</kbd>
                  <span className="ml-1">Fermer</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

CommandPaletteComponent.displayName = 'CommandPalette';

export const CommandPalette = memo(CommandPaletteComponent);

// Hook to manage command palette
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev)
  };
}
