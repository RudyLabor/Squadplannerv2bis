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
import { Button, IconButton } from "@/design-system";

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

  const loadSquads = async () => {
    try {
      // squadsAPI.getSquads() returns an array directly, not { squads: [] }
      const loadedSquads = await squadsAPI.getSquads();
      setSquads(Array.isArray(loadedSquads) ? loadedSquads : []);

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
      // API expects: scheduled_date (YYYY-MM-DD), scheduled_time (HH:MM), duration, game, description
      await sessionsAPI.createSession(selectedSquad, {
        title: title.trim(),
        game: game?.name || selectedGame || "Non spécifié",
        scheduled_date: date,
        scheduled_time: time,
        duration: duration,
        description: comment,
        required_players: playerCount,
      });
      showToast("Session créée avec succès !", "success");
      onNavigate("sessions");
    } catch (error) {
      console.error("Session creation error:", error);
      showToast("Erreur lors de la création", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const selectedGameData = GAMES.find((g) => g.id === selectedGame);

  return (
    <div className="min-h-screen pb-24 pt-safe bg-[var(--bg-base)] relative overflow-hidden">
      {/* Background decorations - Static for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[var(--color-primary-400)]/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.35 }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
              <IconButton
                aria-label="Retour"
                icon={<ArrowLeft className="w-5 h-5" />}
                variant="secondary"
                size="lg"
                onClick={() => onNavigate("sessions")}
                className="rounded-2xl bg-[var(--bg-elevated)]/80 backdrop-blur-sm border-[var(--border-subtle)]/50 shadow-lg"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[var(--color-primary-600)] to-purple-600 bg-clip-text text-transparent">
                  Proposer une session
                </h1>
                <p className="text-sm text-[var(--color-primary-500)] font-medium mt-0.5">
                  Organise ta prochaine partie
                </p>
              </div>
              <motion.div
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-600 flex items-center justify-center shadow-lg shadow-[var(--color-primary-500)]/30"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <Calendar className="w-6 h-6 text-white" strokeWidth={2} />
              </motion.div>
            </motion.div>

          {/* Mode Toggle */}
          <motion.div
            variants={itemVariants}
            className="bg-[var(--bg-elevated)]/60 backdrop-blur-sm rounded-2xl p-1.5 flex mb-6 border border-[var(--border-subtle)]/50"
          >
            <motion.button
              onClick={() => setMode("single")}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                mode === "single"
                  ? "bg-gradient-to-r from-[var(--color-primary-500)] to-purple-500 text-white shadow-md"
                  : "text-[var(--fg-secondary)]"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              Session unique
            </motion.button>
            <motion.button
              onClick={() => setMode("multi")}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                mode === "multi"
                  ? "bg-gradient-to-r from-[var(--color-primary-500)] to-purple-500 text-white shadow-md"
                  : "text-[var(--fg-secondary)]"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              Plusieurs créneaux
            </motion.button>
          </motion.div>

          {/* Squad Selector */}
          {squads.length > 0 && (
            <motion.div variants={itemVariants} className="mb-6">
              <label className="block text-sm font-semibold text-[var(--fg-primary)] mb-2">
                Squad
              </label>
              <div className="relative">
                <select
                  value={selectedSquad || ""}
                  onChange={(e) => setSelectedSquad(e.target.value)}
                  className="w-full h-14 px-4 bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl border border-[var(--border-subtle)]/50 text-[var(--fg-primary)] font-medium appearance-none shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/30"
                >
                  {squads.map((squad) => (
                    <option key={squad.id} value={squad.id}>
                      {squad.name}
                    </option>
                  ))}
                </select>
                <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--fg-tertiary)] pointer-events-none" />
              </div>
            </motion.div>
          )}

          {/* Title */}
          <motion.div variants={itemVariants} className="mb-6">
            <label className="block text-sm font-semibold text-[var(--fg-primary)] mb-2">
              Titre de la session
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Ranked Valorant"
              className="w-full h-14 px-4 bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl border border-[var(--border-subtle)]/50 text-[var(--fg-primary)] placeholder:text-[var(--fg-tertiary)] font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/30"
            />
          </motion.div>

          {/* Game Picker */}
          <motion.div variants={itemVariants} className="mb-6">
            <label className="block text-sm font-semibold text-[var(--fg-primary)] mb-2">
              Jeu
            </label>
            <motion.button
              onClick={() => setShowGamePicker(true)}
              className={`w-full h-20 bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl border border-[var(--border-subtle)]/50 flex flex-col items-center justify-center shadow-lg ${
                selectedGameData ? '' : 'border-dashed'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
            >
              {selectedGameData ? (
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedGameData.gradient} flex items-center justify-center shadow-md`}>
                    <span className="text-2xl">{selectedGameData.icon}</span>
                  </div>
                  <span className="font-semibold text-[var(--fg-primary)]">{selectedGameData.name}</span>
                </div>
              ) : (
                <>
                  <Gamepad2 className="w-6 h-6 text-[var(--fg-tertiary)] mb-1" />
                  <span className="text-sm text-[var(--fg-secondary)] font-medium">Choisir un jeu</span>
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Player Count */}
          <motion.div variants={itemVariants} className="mb-6">
            <label className="block text-sm font-semibold text-[var(--fg-primary)] mb-2">
              Joueurs requis
            </label>
            <div className="flex gap-2">
              {PLAYER_COUNTS.map((count) => (
                <motion.button
                  key={count}
                  onClick={() => setPlayerCount(count)}
                  className={`flex-1 h-14 rounded-xl flex flex-col items-center justify-center transition-all shadow-md ${
                    playerCount === count
                      ? "bg-gradient-to-br from-[var(--color-success-500)] to-teal-500 text-white"
                      : "bg-[var(--bg-elevated)]/80 backdrop-blur-sm text-[var(--fg-secondary)] border border-[var(--border-subtle)]/50"
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
            <label className="block text-sm font-semibold text-[var(--fg-primary)] mb-2">
              Date et heure
            </label>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <motion.button
                type="button"
                onClick={() => setShowDatePicker(true)}
                className="h-14 bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl border border-[var(--border-subtle)]/50 text-left px-4 flex items-center gap-3 shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-500 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xs text-[var(--fg-tertiary)] font-medium block">DATE</span>
                  <span className={date ? 'text-[var(--fg-primary)] font-semibold' : 'text-[var(--fg-tertiary)]'}>
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
                className="h-14 bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl border border-[var(--border-subtle)]/50 text-left px-4 flex items-center gap-3 shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-warning-500)] to-orange-500 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xs text-[var(--fg-tertiary)] font-medium block">HEURE</span>
                  <span className={time ? 'text-[var(--fg-primary)] font-semibold' : 'text-[var(--fg-tertiary)]'}>
                    {time ? `${time.split(':')[0]}h${time.split(':')[1]}` : 'Choisir'}
                  </span>
                </div>
              </motion.button>
            </div>
            <div>
              <span className="text-xs text-[var(--fg-tertiary)] font-medium block mb-2">DUREE</span>
              <div className="flex gap-2">
                {DURATIONS.map((d) => (
                  <motion.button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`flex-1 h-12 rounded-xl text-sm font-semibold transition-all shadow-md ${
                      duration === d
                        ? "bg-gradient-to-r from-[var(--color-primary-500)] to-purple-500 text-white"
                        : "bg-[var(--bg-elevated)]/80 backdrop-blur-sm text-[var(--fg-secondary)] border border-[var(--border-subtle)]/50"
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
            <label className="block text-sm font-semibold text-[var(--fg-primary)] mb-2">
              Commentaire (optionnel)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Strategie, roles, objectifs..."
              rows={3}
              className="w-full p-4 bg-[var(--bg-elevated)]/80 backdrop-blur-sm rounded-2xl border border-[var(--border-subtle)]/50 text-[var(--fg-primary)] placeholder:text-[var(--fg-tertiary)] font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/30 resize-none"
            />
          </motion.div>

          {/* Create Button */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleCreate}
            disabled={isCreating}
            icon={isCreating ? undefined : <Sparkles className="w-5 h-5" />}
            className="shadow-lg shadow-[var(--color-primary-500)]/30"
          >
            {isCreating ? "Creation..." : "Creer la session"}
          </Button>
          </motion.div>
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
              className="bg-[var(--bg-elevated)] rounded-t-3xl w-full"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-[var(--border-subtle)] rounded-full mx-auto my-3" />
              <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
                <h2 className="font-bold tracking-tight text-[var(--fg-primary)] text-lg">Choisir un jeu</h2>
                <motion.button
                  onClick={() => setShowGamePicker(false)}
                  className="w-8 h-8 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-[var(--fg-secondary)]" />
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
                    className={`p-4 rounded-2xl text-center transition-all relative ${
                      selectedGame === game.id
                        ? `bg-gradient-to-br ${game.gradient} text-white shadow-lg`
                        : "bg-[var(--bg-subtle)] hover:bg-[var(--bg-subtle)]/80"
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-3xl block mb-2">{game.icon}</span>
                    <span className={`text-sm font-semibold ${
                      selectedGame === game.id ? 'text-white' : 'text-[var(--fg-primary)]'
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
