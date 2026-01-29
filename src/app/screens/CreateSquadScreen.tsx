import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Gamepad2, Users, Sparkles, Check, Clock, Calendar } from "lucide-react";
import { useSquads } from "@/app/contexts/SquadsContext";

interface CreateSquadScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const GAMES = [
  { id: "valorant", name: "Valorant", icon: "🎯", color: "from-red-500 to-rose-600" },
  { id: "lol", name: "League of Legends", icon: "⚔️", color: "from-blue-500 to-indigo-600" },
  { id: "cs2", name: "CS2", icon: "🔫", color: "from-orange-500 to-amber-600" },
  { id: "apex", name: "Apex Legends", icon: "🦊", color: "from-red-500 to-orange-600" },
  { id: "overwatch", name: "Overwatch 2", icon: "🎮", color: "from-orange-400 to-yellow-500" },
  { id: "fortnite", name: "Fortnite", icon: "🏗️", color: "from-purple-500 to-pink-600" },
  { id: "rocket-league", name: "Rocket League", icon: "🚀", color: "from-blue-400 to-cyan-500" },
  { id: "other", name: "Autre", icon: "🎲", color: "from-gray-500 to-slate-600" },
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
  { value: "1h", label: "1h", desc: "Quick game" },
  { value: "2h", label: "2h", desc: "Classique" },
  { value: "3h", label: "3h", desc: "Session longue" },
  { value: "4h", label: "4h+", desc: "Marathon" },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
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

const modalVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  exit: {
    opacity: 0,
    y: 100,
    transition: { duration: 0.2 }
  }
};

export function CreateSquadScreen({ onNavigate, showToast }: CreateSquadScreenProps) {
  const { createSquad } = useSquads();
  const [name, setName] = useState("");
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [duration, setDuration] = useState("2h");
  const [showGamePicker, setShowGamePicker] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

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
      showToast("Squad créée avec succès !", "success");
      onNavigate("squads");
    } catch (error) {
      showToast("Erreur lors de la création", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const selectedGameData = GAMES.find((g) => g.id === selectedGame);
  const progress = [name.trim(), selectedGame].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 pb-32">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-orange-400/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="relative px-4 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with glassmorphism */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate("squads")}
            className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg shadow-black/5 flex items-center justify-center group transition-all hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Créer une Squad
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Rassemble ton équipe de choc
            </p>
          </div>
          <motion.div
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-100/80 backdrop-blur-sm"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700">{progress}/2</span>
          </motion.div>
        </motion.div>

        {/* Progress bar */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(progress / 2) * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </motion.div>

        {/* Squad Name - Hero input */}
        <motion.div variants={itemVariants} className="mb-8">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Users className="w-4 h-4" />
            Nom de la Squad
          </label>
          <div className="relative">
            <motion.input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Les Légendes"
              maxLength={30}
              className="w-full h-16 px-5 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-transparent text-xl font-semibold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-amber-400 shadow-lg shadow-black/5 transition-all"
              whileFocus={{ scale: 1.01 }}
            />
            <AnimatePresence>
              {name.trim() && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-5 h-5 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex justify-between mt-2 px-1">
            <p className="text-xs text-gray-400">Choisis un nom mémorable</p>
            <p className={`text-xs font-medium ${name.length > 25 ? 'text-amber-500' : 'text-gray-400'}`}>
              {name.length}/30
            </p>
          </div>
        </motion.div>

        {/* Game Picker - Interactive card */}
        <motion.div variants={itemVariants} className="mb-8">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Gamepad2 className="w-4 h-4" />
            Jeu Principal
          </label>
          <motion.button
            onClick={() => setShowGamePicker(true)}
            className={`w-full h-28 rounded-2xl flex items-center justify-center overflow-hidden transition-all shadow-lg ${
              selectedGameData
                ? `bg-gradient-to-br ${selectedGameData.color} shadow-lg`
                : 'bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-200 hover:border-amber-300'
            }`}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {selectedGameData ? (
              <div className="flex flex-col items-center text-white">
                <motion.span
                  className="text-5xl mb-2"
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  {selectedGameData.icon}
                </motion.span>
                <span className="text-lg font-bold tracking-wide">
                  {selectedGameData.name}
                </span>
                <span className="text-xs text-white/70 mt-1">Tap pour changer</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Gamepad2 className="w-10 h-10 text-gray-300 mb-2" />
                </motion.div>
                <span className="text-gray-500 font-medium">Choisir un jeu</span>
                <span className="text-xs text-gray-400 mt-1">8 jeux disponibles</span>
              </div>
            )}
          </motion.button>
        </motion.div>

        {/* Preferred Days - Pill selector */}
        <motion.div variants={itemVariants} className="mb-8">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Calendar className="w-4 h-4" />
            Jours de jeu préférés
            <span className="text-xs font-normal text-gray-400 ml-1">(optionnel)</span>
          </label>
          <div className="flex gap-2">
            {DAYS.map((day, index) => (
              <motion.button
                key={day.id}
                onClick={() => toggleDay(day.id)}
                className={`flex-1 h-14 rounded-xl text-sm font-bold transition-all relative overflow-hidden ${
                  selectedDays.includes(day.id)
                    ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                    : "bg-white/80 backdrop-blur-sm text-gray-500 border border-gray-100 hover:border-amber-200"
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {selectedDays.includes(day.id) && (
                  <motion.div
                    layoutId="dayHighlight"
                    className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{day.label}</span>
              </motion.button>
            ))}
          </div>
          {selectedDays.length > 0 && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-amber-600 mt-2 px-1"
            >
              {selectedDays.length} jour{selectedDays.length > 1 ? 's' : ''} sélectionné{selectedDays.length > 1 ? 's' : ''}
            </motion.p>
          )}
        </motion.div>

        {/* Session Duration - Visual cards */}
        <motion.div variants={itemVariants} className="mb-10">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Clock className="w-4 h-4" />
            Durée typique des sessions
          </label>
          <div className="grid grid-cols-4 gap-3">
            {DURATIONS.map((d, index) => (
              <motion.button
                key={d.value}
                onClick={() => setDuration(d.value)}
                className={`relative p-4 rounded-2xl text-center transition-all overflow-hidden ${
                  duration === d.value
                    ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-xl"
                    : "bg-white/80 backdrop-blur-sm text-gray-600 border border-gray-100 hover:border-gray-200"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <span className="block text-xl font-bold">{d.label}</span>
                <span className={`block text-[10px] mt-1 ${
                  duration === d.value ? 'text-gray-300' : 'text-gray-400'
                }`}>
                  {d.desc}
                </span>
                {duration === d.value && (
                  <motion.div
                    layoutId="durationCheck"
                    className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-gray-900" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Create Button - Premium CTA */}
        <motion.div variants={itemVariants}>
          <motion.button
            onClick={handleCreate}
            disabled={isCreating || !name.trim() || !selectedGame}
            className={`w-full h-16 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl ${
              name.trim() && selectedGame
                ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
            whileHover={name.trim() && selectedGame ? { scale: 1.02, y: -2 } : {}}
            whileTap={name.trim() && selectedGame ? { scale: 0.98 } : {}}
            animate={name.trim() && selectedGame ? {
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            } : {}}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ backgroundSize: "200% 200%" }}
          >
            {isCreating ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Création en cours...
              </>
            ) : (
              <>
                <Users className="w-5 h-5" />
                Créer la Squad
                <Sparkles className="w-5 h-5" />
              </>
            )}
          </motion.button>
          {(!name.trim() || !selectedGame) && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-xs text-gray-400 mt-3"
            >
              Remplis le nom et choisis un jeu pour continuer
            </motion.p>
          )}
        </motion.div>
      </motion.div>

      {/* Game Picker Modal - Premium bottom sheet */}
      <AnimatePresence>
        {showGamePicker && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGamePicker(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2rem] z-50 max-h-[80vh] overflow-hidden shadow-2xl"
            >
              {/* Handle bar */}
              <div className="flex justify-center py-3">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-6 pb-4 flex items-center justify-between border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Choisir un jeu</h2>
                  <p className="text-sm text-gray-500">Quel est ton jeu principal ?</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowGamePicker(false)}
                  className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  ✕
                </motion.button>
              </div>

              {/* Games grid */}
              <div className="p-4 pb-8 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-2 gap-4">
                  {GAMES.map((game, index) => (
                    <motion.button
                      key={game.id}
                      onClick={() => {
                        setSelectedGame(game.id);
                        setShowGamePicker(false);
                      }}
                      className={`relative p-5 rounded-2xl text-center transition-all overflow-hidden ${
                        selectedGame === game.id
                          ? `bg-gradient-to-br ${game.color} shadow-lg`
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <motion.span
                        className="text-4xl block mb-3"
                        animate={selectedGame === game.id ? {
                          scale: [1, 1.2, 1],
                          rotate: [0, -10, 10, 0]
                        } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {game.icon}
                      </motion.span>
                      <span className={`text-sm font-bold block ${
                        selectedGame === game.id ? 'text-white' : 'text-gray-900'
                      }`}>
                        {game.name}
                      </span>
                      {selectedGame === game.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"
                        >
                          <Check className="w-4 h-4 text-green-500" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CreateSquadScreen;
