/**
 * 📅 PROPOSE SESSION SCREEN - Premium UI Design
 * Design System v2 - Mobile-first with Framer Motion
 */

import { useState, useEffect } from "react";
import { ArrowLeft, Gamepad2, Users, Calendar, Clock, Sparkles, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sessionsAPI, squadsAPI } from "@/utils/api";
import { TimePicker } from "@/app/components/TimePicker";
import { DatePicker } from "@/app/components/DatePicker";

interface ProposeSessionScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  data?: { squadId?: string };
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

const GAMES = [
  { id: "valorant", name: "Valorant", icon: "🎯", gradient: "from-red-500 to-pink-500" },
  { id: "lol", name: "League of Legends", icon: "⚔️", gradient: "from-blue-500 to-cyan-500" },
  { id: "cs2", name: "CS2", icon: "🔫", gradient: "from-amber-500 to-orange-500" },
  { id: "apex", name: "Apex Legends", icon: "🦊", gradient: "from-red-600 to-orange-500" },
  { id: "overwatch", name: "Overwatch 2", icon: "🎮", gradient: "from-orange-500 to-amber-400" },
];

const PLAYER_COUNTS = [2, 3, 4, 5, 6];
const DURATIONS = ["1h", "2h", "3h", "4h"];

export function ProposeSessionScreen({
  onNavigate,
  showToast,
  data,
}: ProposeSessionScreenProps) {
  const [mode, setMode] = useState<"single" | "multi">("single");
  const [title, setTitle] = useState("");
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [playerCount, setPlayerCount] = useState(5);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("2h");
  const [comment, setComment] = useState("");
  const [showGamePicker, setShowGamePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [squads, setSquads] = useState<any[]>([]);
  const [selectedSquad, setSelectedSquad] = useState<string | null>(data?.squadId || null);

  useEffect(() => {
    loadSquads();
  }, []);

  const calculateEndTime = (start: string, durationStr: string) => {
    const startDate = new Date(start);
    const hours = parseInt(durationStr.replace('h', ''));
    startDate.setHours(startDate.getHours() + hours);
    return startDate.toISOString();
  };

  const loadSquads = async () => {
    try {
      const response = await squadsAPI.getSquads();
      const loadedSquads = response.squads || [];
      setSquads(loadedSquads);

      if (data?.squadId) {
        setSelectedSquad(data.squadId);
      } else if (!selectedSquad && loadedSquads.length > 0) {
        setSelectedSquad(loadedSquads[0].id);
      }
    } catch (error) {
      console.error("Load squads error:", error);
      showToast("Impossible de charger vos squads", "error");
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      showToast("Titre requis", "error");
      return;
    }
    if (!date || !time) {
      showToast("Date et heure requises", "error");
      return;
    }
    if (!selectedSquad) {
      showToast("Sélectionnez une squad", "error");
      return;
    }

    setIsCreating(true);
    try {
      const game = GAMES.find((g) => g.id === selectedGame);
      await sessionsAPI.createSession(selectedSquad, {
        title: title.trim(),
        game: game?.name || selectedGame || "Non spécifié",
        start_time: `${date}T${time}:00`,
        end_time: calculateEndTime(`${date}T${time}:00`, duration),
        description: comment,
      });
      showToast("Session créée avec succès !", "success");
      onNavigate("sessions");
    } catch (error) {
      showToast("Erreur lors de la création", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const selectedGameData = GAMES.find((g) => g.id === selectedGame);

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
            <motion.button
              onClick={() => onNavigate("sessions")}
              className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Proposer une session
              </h1>
              <p className="text-sm text-indigo-500 font-medium mt-0.5">
                Organise ta prochaine partie
              </p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Calendar className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {/* Mode Toggle */}
          <motion.div
            variants={itemVariants}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-1.5 flex mb-6 border border-white/50"
          >
            <motion.button
              onClick={() => setMode("single")}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                mode === "single"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                  : "text-gray-500"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              Session unique
            </motion.button>
            <motion.button
              onClick={() => setMode("multi")}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                mode === "multi"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                  : "text-gray-500"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              Plusieurs créneaux
            </motion.button>
          </motion.div>

          {/* Squad Selector */}
          {squads.length > 0 && (
            <motion.div variants={itemVariants} className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Squad
              </label>
              <div className="relative">
                <select
                  value={selectedSquad || ""}
                  onChange={(e) => setSelectedSquad(e.target.value)}
                  className="w-full h-14 px-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 text-gray-800 font-medium appearance-none shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                >
                  {squads.map((squad) => (
                    <option key={squad.id} value={squad.id}>
                      {squad.name}
                    </option>
                  ))}
                </select>
                <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </motion.div>
          )}

          {/* Title */}
          <motion.div variants={itemVariants} className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Titre de la session
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Ranked Valorant"
              className="w-full h-14 px-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 text-gray-800 placeholder:text-gray-400 font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </motion.div>

          {/* Game Picker */}
          <motion.div variants={itemVariants} className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jeu
            </label>
            <motion.button
              onClick={() => setShowGamePicker(true)}
              className={`w-full h-20 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 flex flex-col items-center justify-center shadow-lg ${
                selectedGameData ? '' : 'border-dashed'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {selectedGameData ? (
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedGameData.gradient} flex items-center justify-center shadow-md`}>
                    <span className="text-2xl">{selectedGameData.icon}</span>
                  </div>
                  <span className="font-semibold text-gray-800">{selectedGameData.name}</span>
                </div>
              ) : (
                <>
                  <Gamepad2 className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-sm text-gray-500 font-medium">Choisir un jeu</span>
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Player Count */}
          <motion.div variants={itemVariants} className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Joueurs requis
            </label>
            <div className="flex gap-2">
              {PLAYER_COUNTS.map((count) => (
                <motion.button
                  key={count}
                  onClick={() => setPlayerCount(count)}
                  className={`flex-1 h-14 rounded-xl flex flex-col items-center justify-center transition-all shadow-md ${
                    playerCount === count
                      ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
                      : "bg-white/80 backdrop-blur-sm text-gray-600 border border-white/50"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Users className="w-4 h-4 mb-0.5" />
                  <span className="text-xs font-bold">{count}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Date & Time */}
          <motion.div variants={itemVariants} className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date et heure
            </label>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <motion.button
                type="button"
                onClick={() => setShowDatePicker(true)}
                className="h-14 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 text-left px-4 flex items-center gap-3 shadow-lg"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium block">DATE</span>
                  <span className={date ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                    {date ? new Date(date + 'T00:00:00').toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short'
                    }) : 'Choisir'}
                  </span>
                </div>
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setShowTimePicker(true)}
                className="h-14 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 text-left px-4 flex items-center gap-3 shadow-lg"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium block">HEURE</span>
                  <span className={time ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                    {time ? `${time.split(':')[0]}h${time.split(':')[1]}` : 'Choisir'}
                  </span>
                </div>
              </motion.button>
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium block mb-2">DURÉE</span>
              <div className="flex gap-2">
                {DURATIONS.map((d) => (
                  <motion.button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`flex-1 h-12 rounded-xl text-sm font-semibold transition-all shadow-md ${
                      duration === d
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                        : "bg-white/80 backdrop-blur-sm text-gray-600 border border-white/50"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {d}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Comment */}
          <motion.div variants={itemVariants} className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Commentaire (optionnel)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Stratégie, rôles, objectifs..."
              rows={3}
              className="w-full p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 text-gray-800 placeholder:text-gray-400 font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
            />
          </motion.div>

          {/* Create Button */}
          <motion.button
            variants={itemVariants}
            onClick={handleCreate}
            disabled={isCreating}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl font-semibold flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/30 disabled:opacity-50"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {isCreating ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Création...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Créer la session
              </>
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* Game Picker Modal */}
      <AnimatePresence>
        {showGamePicker && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGamePicker(false)}
          >
            <motion.div
              className="bg-white rounded-t-3xl w-full"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3" />
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900 text-lg">Choisir un jeu</h2>
                <motion.button
                  onClick={() => setShowGamePicker(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-gray-500" />
                </motion.button>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3 pb-8">
                {GAMES.map((game, index) => (
                  <motion.button
                    key={game.id}
                    onClick={() => {
                      setSelectedGame(game.id);
                      setShowGamePicker(false);
                    }}
                    className={`p-4 rounded-2xl text-center transition-all ${
                      selectedGame === game.id
                        ? `bg-gradient-to-br ${game.gradient} text-white shadow-lg`
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-3xl block mb-2">{game.icon}</span>
                    <span className={`text-sm font-semibold ${
                      selectedGame === game.id ? 'text-white' : 'text-gray-800'
                    }`}>
                      {game.name}
                    </span>
                    {selectedGame === game.id && (
                      <motion.div
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/30 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time Picker Modal */}
      <TimePicker
        isOpen={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onSelect={(selectedTime) => setTime(selectedTime)}
        selectedTime={time}
      />

      {/* Date Picker Modal */}
      <DatePicker
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={(selectedDate) => setDate(selectedDate)}
        selectedDate={date}
        minDate={new Date().toISOString().split('T')[0]}
      />
    </div>
  );
}

export default ProposeSessionScreen;
