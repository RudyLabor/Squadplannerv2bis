/**
 * CREATE SQUAD SCREEN - LINEAR DESIGN SYSTEM
 * Premium, Dark, Minimal - Squad creation flow
 *
 * SYSTÈME UNIFIÉ: La liste GAMES est la source de vérité unique
 * utilisée dans toute l'app (création squad, sessions, filtres, stats)
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Gamepad2, Users, Check, Clock, Calendar, X, Search, Star, Sparkles } from "lucide-react";
import { useSquads } from "@/app/contexts/SquadsContext";

interface CreateSquadScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

/**
 * SOURCE DE VÉRITÉ UNIQUE - LISTE DES JEUX
 * À importer depuis un fichier partagé dans une version production
 * Ne JAMAIS dupliquer cette liste ailleurs dans l'app
 */
export const GAMES = [
  // Populaires 2026
  { id: "valorant", name: "Valorant", icon: "🎯", popular: true, recent: true },
  { id: "lol", name: "League of Legends", icon: "⚔️", popular: true, recent: false },
  { id: "fortnite", name: "Fortnite", icon: "🏗️", popular: true, recent: true },
  { id: "cod-warzone", name: "Call of Duty: Warzone", icon: "🪖", popular: true, recent: true },
  { id: "cs2", name: "CS2", icon: "🔫", popular: true, recent: true },
  { id: "apex", name: "Apex Legends", icon: "🦊", popular: true, recent: false },
  { id: "rocket-league", name: "Rocket League", icon: "🚀", popular: true, recent: false },
  { id: "gta-online", name: "GTA Online", icon: "🚗", popular: true, recent: false },
  { id: "fc25", name: "EA Sports FC 25", icon: "⚽", popular: true, recent: true },
  { id: "nba2k25", name: "NBA 2K25", icon: "🏀", popular: false, recent: true },
  { id: "minecraft", name: "Minecraft", icon: "⛏️", popular: true, recent: false },
  { id: "overwatch", name: "Overwatch 2", icon: "🎮", popular: true, recent: false },
  { id: "r6", name: "Rainbow Six Siege", icon: "🛡️", popular: true, recent: false },
  { id: "dota2", name: "Dota 2", icon: "🗡️", popular: true, recent: false },
  // Autres jeux
  { id: "destiny2", name: "Destiny 2", icon: "🌌", popular: false, recent: false },
  { id: "pubg", name: "PUBG", icon: "🪂", popular: false, recent: false },
  { id: "warframe", name: "Warframe", icon: "⚙️", popular: false, recent: false },
  { id: "elden-ring", name: "Elden Ring", icon: "🗡️", popular: false, recent: false },
  { id: "diablo4", name: "Diablo IV", icon: "😈", popular: false, recent: true },
  { id: "other", name: "Autre jeu", icon: "🎲", popular: false, recent: false },
];

const DAYS = [
  { id: "lun", label: "L", fullLabel: "Lundi" },
  { id: "mar", label: "M", fullLabel: "Mardi" },
  { id: "mer", label: "M", fullLabel: "Mercredi" },
  { id: "jeu", label: "J", fullLabel: "Jeudi" },
  { id: "ven", label: "V", fullLabel: "Vendredi" },
  { id: "sam", label: "S", fullLabel: "Samedi" },
  { id: "dim", label: "D", fullLabel: "Dimanche" },
];

const DURATIONS = [
  { value: "1h", label: "1h", desc: "Quick" },
  { value: "2h", label: "2h", desc: "Standard", default: true },
  { value: "3h", label: "3h", desc: "Long" },
  { value: "4h", label: "4h+", desc: "Marathon" },
];

// Linear-style animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.02 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }
  }
};

export function CreateSquadScreen({ onNavigate, showToast }: CreateSquadScreenProps) {
  const { createSquad } = useSquads();
  const [name, setName] = useState("");
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [duration, setDuration] = useState("2h");
  const [showGamePicker, setShowGamePicker] = useState(false);
  const [gameSearch, setGameSearch] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Filtrer les jeux par recherche
  const filteredGames = useMemo(() => {
    if (!gameSearch.trim()) return GAMES;
    const search = gameSearch.toLowerCase();
    return GAMES.filter(game =>
      game.name.toLowerCase().includes(search)
    );
  }, [gameSearch]);

  // Séparer populaires et autres
  const popularGames = useMemo(() =>
    filteredGames.filter(g => g.popular), [filteredGames]);
  const otherGames = useMemo(() =>
    filteredGames.filter(g => !g.popular), [filteredGames]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      showToast("Nom de squad requis", "error");
      return;
    }
    if (!selectedGame) {
      showToast("Choisissez un jeu", "error");
      return;
    }

    setIsCreating(true);
    try {
      const game = GAMES.find((g) => g.id === selectedGame);
      await createSquad({
        name: name.trim(),
        game: game?.name || selectedGame,
      });
      showToast("Squad créée avec succès", "success");
      onNavigate("squads");
    } catch (error) {
      showToast("Erreur lors de la création", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const selectedGameData = GAMES.find((g) => g.id === selectedGame);
  const isValid = name.trim().length >= 2 && selectedGame;
  const requiredFieldsCount = (name.trim().length >= 2 ? 1 : 0) + (selectedGame ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#08090a] pb-24 md:pb-8">
      <motion.div
        className="max-w-lg mx-auto px-4 md:px-6 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header - Linear style */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
          <motion.button
            onClick={() => onNavigate("squads")}
            className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8b8d90] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#f7f8f8] transition-all"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-[24px] md:text-[28px] font-semibold text-[#f7f8f8]">
              Nouvelle Squad
            </h1>
            <p className="text-[13px] text-[#5e6063]">
              Crée ton équipe
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[rgba(94,109,210,0.1)] flex items-center justify-center">
            <Users className="w-5 h-5 text-[#5e6dd2]" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Progress indicator - Linear style */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${name.trim().length >= 2 ? 'bg-[#4ade80]' : 'bg-[rgba(255,255,255,0.1)]'}`} />
              <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${selectedGame ? 'bg-[#4ade80]' : 'bg-[rgba(255,255,255,0.1)]'}`} />
            </div>
            <span className="text-[12px] text-[#5e6063] ml-auto">
              {isValid ? (
                <span className="text-[#4ade80]">Prêt à créer</span>
              ) : (
                `${2 - requiredFieldsCount} champ${2 - requiredFieldsCount > 1 ? 's' : ''} requis`
              )}
            </span>
          </div>
          <div className="h-1 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#5e6dd2] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${requiredFieldsCount * 50}%` }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            />
          </div>
        </motion.div>

        {/* Squad Name - Linear style */}
        <motion.div variants={itemVariants} className="mb-6">
          <label className="flex items-center gap-2 text-[11px] font-medium text-[#5e6063] mb-2 uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-[#8b93ff]" strokeWidth={1.5} />
            Nom de la Squad
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 30))}
              placeholder="Ex : Les Légendes"
              className="w-full h-12 px-4 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl text-[14px] font-medium text-[#f7f8f8] placeholder:text-[#5e6063] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] focus:border-[rgba(94,109,210,0.5)] focus:ring-2 focus:ring-[rgba(94,109,210,0.15)] focus:outline-none transition-all"
            />
            <AnimatePresence>
              {name.trim().length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#4ade80] rounded-full flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-[#08090a]" strokeWidth={2} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex justify-between mt-2 px-1">
            <span className="text-[11px] text-[#5e6063]">Un nom mémorable</span>
            <span className={`text-[11px] transition-colors ${name.length > 25 ? 'text-[#f5a623]' : 'text-[#5e6063]'}`}>
              {name.length}/30
            </span>
          </div>
        </motion.div>

        {/* Game Picker Button - Linear style */}
        <motion.div variants={itemVariants} className="mb-6">
          <label className="flex items-center gap-2 text-[11px] font-medium text-[#5e6063] mb-2 uppercase tracking-wider">
            <Gamepad2 className="w-3.5 h-3.5 text-[#5e6dd2]" strokeWidth={1.5} />
            Jeu Principal
          </label>
          <motion.button
            onClick={() => setShowGamePicker(true)}
            className={`w-full h-16 rounded-xl flex items-center px-4 transition-all ${
              selectedGameData
                ? 'bg-[rgba(94,109,210,0.08)] border border-[rgba(94,109,210,0.25)]'
                : 'bg-[rgba(255,255,255,0.02)] border border-dashed border-[rgba(255,255,255,0.1)] hover:border-[rgba(94,109,210,0.3)] hover:bg-[rgba(255,255,255,0.04)]'
            }`}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.99 }}
          >
            {selectedGameData ? (
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-lg bg-[rgba(94,109,210,0.1)] flex items-center justify-center">
                  <span className="text-xl">{selectedGameData.icon}</span>
                </div>
                <div className="flex-1 text-left">
                  <span className="text-[14px] font-medium text-[#f7f8f8] block">
                    {selectedGameData.name}
                  </span>
                  <span className="text-[11px] text-[#5e6063]">Cliquer pour changer</span>
                </div>
                <Check className="w-4 h-4 text-[#5e6dd2]" strokeWidth={2} />
              </div>
            ) : (
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.04)] flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-[#5e6063]" strokeWidth={1.5} />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-[14px] text-[#8b8d90] block">Sélectionner un jeu</span>
                  <span className="text-[11px] text-[#5e6063]">Requis</span>
                </div>
              </div>
            )}
          </motion.button>
        </motion.div>

        {/* Preferred Days - Linear style */}
        <motion.div variants={itemVariants} className="mb-6">
          <label className="flex items-center gap-2 text-[11px] font-medium text-[#5e6063] mb-2 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-[#f5a623]" strokeWidth={1.5} />
            Jours préférés
            <span className="text-[#5e6063] font-normal lowercase">(optionnel)</span>
          </label>
          <div className="flex gap-2">
            {DAYS.map((day) => {
              const isSelected = selectedDays.includes(day.id);
              return (
                <motion.button
                  key={day.id}
                  onClick={() => toggleDay(day.id)}
                  className={`flex-1 h-10 rounded-lg text-[13px] font-medium transition-all ${
                    isSelected
                      ? "bg-[rgba(94,109,210,0.15)] text-[#8b93ff] border border-[rgba(94,109,210,0.3)]"
                      : "bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-[#8b8d90] hover:border-[rgba(255,255,255,0.1)] hover:text-[#f7f8f8]"
                  }`}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {day.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Session Duration - Linear style */}
        <motion.div variants={itemVariants} className="mb-10">
          <label className="flex items-center gap-2 text-[11px] font-medium text-[#5e6063] mb-2 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-[#60a5fa]" strokeWidth={1.5} />
            Durée typique
            <span className="text-[#5e6063] font-normal lowercase">(optionnel)</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {DURATIONS.map((d) => (
              <motion.button
                key={d.value}
                onClick={() => setDuration(d.value)}
                className={`relative p-3 rounded-xl text-center transition-all duration-100 ${
                  duration === d.value
                    ? "bg-[rgba(94,109,210,0.1)] border border-[rgba(94,109,210,0.3)]"
                    : "bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.04)]"
                }`}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={`block text-[16px] font-semibold ${duration === d.value ? 'text-[#f7f8f8]' : 'text-[#8b8d90]'}`}>
                  {d.label}
                </span>
                <span className={`block text-[10px] mt-0.5 ${duration === d.value ? 'text-[#8b93ff]' : 'text-[#5e6063]'}`}>
                  {d.desc}
                </span>
                {d.default && duration !== d.value && (
                  <span className="absolute -top-1 -right-1 text-[8px] bg-[rgba(94,109,210,0.2)] text-[#8b93ff] px-1.5 py-0.5 rounded-full font-medium">
                    Défaut
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Create Button - Linear style */}
        <motion.div variants={itemVariants}>
          <motion.button
            onClick={handleCreate}
            disabled={isCreating || !isValid}
            className={`w-full h-14 flex items-center justify-center gap-2.5 rounded-xl text-[14px] font-semibold transition-all duration-100 ${
              isValid
                ? "bg-[#5e6dd2] text-white hover:bg-[#6a79db] shadow-lg shadow-[#5e6dd2]/20"
                : "bg-[rgba(255,255,255,0.04)] text-[#5e6063] border border-[rgba(255,255,255,0.06)] cursor-not-allowed"
            }`}
            whileHover={isValid ? { y: -2 } : {}}
            whileTap={isValid ? { scale: 0.98 } : {}}
          >
            {isCreating ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Users className="w-5 h-5" strokeWidth={1.5} />
                Créer la Squad
              </>
            )}
          </motion.button>
          {!isValid && (
            <p className="text-center text-[12px] text-[#5e6063] mt-3">
              Remplis le nom et choisis un jeu
            </p>
          )}
        </motion.div>
      </motion.div>

      {/* Game Picker Modal - Linear style Bottom Sheet */}
      <AnimatePresence>
        {showGamePicker && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGamePicker(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed bottom-0 left-0 right-0 bg-[#101012] border-t border-[rgba(255,255,255,0.08)] rounded-t-2xl z-50 max-h-[85vh] flex flex-col"
            >
              {/* Handle */}
              <div className="flex justify-center py-3 flex-shrink-0">
                <div className="w-10 h-1 bg-[rgba(255,255,255,0.1)] rounded-full" />
              </div>

              {/* Header */}
              <div className="px-5 pb-4 flex items-center justify-between flex-shrink-0">
                <div>
                  <h2 className="text-[18px] font-semibold text-[#f7f8f8]">Choisir un jeu</h2>
                  <p className="text-[13px] text-[#5e6063]">Quel est ton jeu principal ?</p>
                </div>
                <motion.button
                  onClick={() => setShowGamePicker(false)}
                  className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.06)] transition-all"
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </motion.button>
              </div>

              {/* Search */}
              <div className="px-4 pb-4 flex-shrink-0">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5e6063]" strokeWidth={1.5} />
                  <input
                    type="text"
                    value={gameSearch}
                    onChange={(e) => setGameSearch(e.target.value)}
                    placeholder="Rechercher un jeu..."
                    className="w-full h-11 pl-11 pr-4 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl text-[14px] text-[#f7f8f8] placeholder:text-[#5e6063] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] focus:border-[rgba(94,109,210,0.5)] focus:ring-2 focus:ring-[rgba(94,109,210,0.15)] focus:outline-none transition-all"
                    autoFocus
                  />
                </div>
              </div>

              {/* Games list - scrollable */}
              <div className="flex-1 overflow-y-auto px-4 pb-8">
                {/* Popular games */}
                {popularGames.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3 px-1">
                      <Star className="w-3.5 h-3.5 text-[#f5a623]" strokeWidth={2} />
                      <span className="text-[11px] font-semibold text-[#5e6063] uppercase tracking-wider">
                        Populaires
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {popularGames.map((game, index) => (
                        <motion.button
                          key={game.id}
                          onClick={() => {
                            setSelectedGame(game.id);
                            setShowGamePicker(false);
                            setGameSearch("");
                          }}
                          className={`relative p-4 rounded-xl text-left transition-all duration-100 ${
                            selectedGame === game.id
                              ? "bg-[rgba(94,109,210,0.1)] border border-[rgba(94,109,210,0.3)]"
                              : "bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.04)]"
                          }`}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02, duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{game.icon}</span>
                            <div className="flex-1 min-w-0">
                              <span className={`text-[13px] font-medium block truncate ${
                                selectedGame === game.id ? 'text-[#f7f8f8]' : 'text-[#8b8d90]'
                              }`}>
                                {game.name}
                              </span>
                              {game.recent && (
                                <div className="flex items-center gap-1 mt-0.5">
                                  <Sparkles className="w-3 h-3 text-[#4ade80]" />
                                  <span className="text-[10px] text-[#4ade80] font-medium">2026</span>
                                </div>
                              )}
                            </div>
                          </div>
                          {selectedGame === game.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 w-5 h-5 bg-[#5e6dd2] rounded-full flex items-center justify-center"
                            >
                              <Check className="w-3 h-3 text-white" strokeWidth={2} />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other games */}
                {otherGames.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3 px-1">
                      <Gamepad2 className="w-3.5 h-3.5 text-[#8b8d90]" strokeWidth={2} />
                      <span className="text-[11px] font-semibold text-[#5e6063] uppercase tracking-wider">
                        Autres jeux
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {otherGames.map((game, index) => (
                        <motion.button
                          key={game.id}
                          onClick={() => {
                            setSelectedGame(game.id);
                            setShowGamePicker(false);
                            setGameSearch("");
                          }}
                          className={`relative p-4 rounded-xl text-left transition-all duration-100 ${
                            selectedGame === game.id
                              ? "bg-[rgba(94,109,210,0.1)] border border-[rgba(94,109,210,0.3)]"
                              : "bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.04)]"
                          }`}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (popularGames.length + index) * 0.02, duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{game.icon}</span>
                            <span className={`text-[13px] font-medium truncate ${
                              selectedGame === game.id ? 'text-[#f7f8f8]' : 'text-[#8b8d90]'
                            }`}>
                              {game.name}
                            </span>
                          </div>
                          {selectedGame === game.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 w-5 h-5 bg-[#5e6dd2] rounded-full flex items-center justify-center"
                            >
                              <Check className="w-3 h-3 text-white" strokeWidth={2} />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* No results */}
                {filteredGames.length === 0 && (
                  <div className="text-center py-12">
                    <Gamepad2 className="w-10 h-10 text-[rgba(255,255,255,0.1)] mx-auto mb-3" strokeWidth={1.5} />
                    <p className="text-[14px] text-[#8b8d90]">Aucun jeu trouvé</p>
                    <p className="text-[12px] text-[#5e6063] mt-1">Essaie "Autre jeu"</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CreateSquadScreen;
