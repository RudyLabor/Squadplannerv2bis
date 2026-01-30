/**
 * PROPOSE SESSION SCREEN - LINEAR DESIGN SYSTEM
 * Clean, minimal form for session creation
 */

import { useState, useEffect } from "react";
import { ArrowLeft, Gamepad2, Users, Calendar, Clock, Plus, Check, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sessionsAPI, squadsAPI } from "@/utils/api";
import { TimePicker } from "@/app/components/TimePicker";
import { DatePicker } from "@/app/components/DatePicker";

interface ProposeSessionScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  data?: { squadId?: string };
}

// Linear animations
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

const GAMES = [
  { id: "valorant", name: "Valorant", icon: "🎯" },
  { id: "lol", name: "League of Legends", icon: "⚔️" },
  { id: "cs2", name: "CS2", icon: "🔫" },
  { id: "apex", name: "Apex Legends", icon: "🦊" },
  { id: "overwatch", name: "Overwatch 2", icon: "🎮" },
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
    <div className="min-h-screen bg-[#08090a] pb-24 md:pb-8">
      <motion.div
        className="max-w-2xl mx-auto px-4 md:px-6 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header - Linear style */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
          <motion.button
            onClick={() => onNavigate("sessions")}
            className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8b8d90] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#f7f8f8] transition-all"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-[24px] md:text-[28px] font-semibold text-[#f7f8f8]">
              Proposer une session
            </h1>
            <p className="text-[13px] text-[#5e6063]">
              Organise ta prochaine partie
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center">
            <Calendar className="w-5 h-5 text-[#f5a623]" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Mode Toggle - Linear style */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex gap-2 p-1 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
            <motion.button
              onClick={() => setMode("single")}
              className={`flex-1 py-2.5 rounded-md text-[13px] font-medium transition-all ${
                mode === "single"
                  ? "bg-[rgba(94,109,210,0.15)] text-[#8b93ff] border border-[rgba(94,109,210,0.3)]"
                  : "text-[#8b8d90] hover:text-[#f7f8f8]"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              Session unique
            </motion.button>
            <motion.button
              onClick={() => setMode("multi")}
              className={`flex-1 py-2.5 rounded-md text-[13px] font-medium transition-all ${
                mode === "multi"
                  ? "bg-[rgba(94,109,210,0.15)] text-[#8b93ff] border border-[rgba(94,109,210,0.3)]"
                  : "text-[#8b8d90] hover:text-[#f7f8f8]"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              Plusieurs créneaux
            </motion.button>
          </div>
        </motion.div>

        {/* Squad Selector - Linear style */}
        {squads.length > 0 && (
          <motion.div variants={itemVariants} className="mb-6">
            <label className="block text-[11px] font-medium text-[#5e6063] uppercase tracking-wider mb-2">
              Squad
            </label>
            <div className="relative">
              <select
                value={selectedSquad || ""}
                onChange={(e) => setSelectedSquad(e.target.value)}
                className="w-full h-12 px-4 pr-10 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl text-[#f7f8f8] text-[14px] font-medium appearance-none hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] focus:border-[rgba(94,109,210,0.5)] focus:ring-2 focus:ring-[rgba(94,109,210,0.15)] focus:outline-none transition-all"
              >
                {squads.map((squad) => (
                  <option key={squad.id} value={squad.id} className="bg-[#18191b]">
                    {squad.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5e6063] pointer-events-none" />
            </div>
          </motion.div>
        )}

        {/* Title - Linear style */}
        <motion.div variants={itemVariants} className="mb-6">
          <label className="block text-[11px] font-medium text-[#5e6063] uppercase tracking-wider mb-2">
            Titre de la session
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Ranked Valorant"
            className="w-full h-12 px-4 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl text-[#f7f8f8] text-[14px] placeholder:text-[#5e6063] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] focus:border-[rgba(94,109,210,0.5)] focus:ring-2 focus:ring-[rgba(94,109,210,0.15)] focus:outline-none transition-all"
          />
        </motion.div>

        {/* Game Picker - Linear style */}
        <motion.div variants={itemVariants} className="mb-6">
          <label className="block text-[11px] font-medium text-[#5e6063] uppercase tracking-wider mb-2">
            Jeu
          </label>
          <motion.button
            onClick={() => setShowGamePicker(true)}
            className={`w-full h-16 bg-[rgba(255,255,255,0.02)] border rounded-xl flex items-center justify-center transition-all group ${
              selectedGameData
                ? 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.12)]'
                : 'border-dashed border-[rgba(255,255,255,0.1)] hover:border-[rgba(94,109,210,0.3)]'
            }`}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.99 }}
          >
            {selectedGameData ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[rgba(94,109,210,0.1)] flex items-center justify-center">
                  <span className="text-xl">{selectedGameData.icon}</span>
                </div>
                <span className="text-[14px] font-medium text-[#f7f8f8]">{selectedGameData.name}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[#5e6063] group-hover:text-[#8b8d90]">
                <Gamepad2 className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-[14px] font-medium">Choisir un jeu</span>
              </div>
            )}
          </motion.button>
        </motion.div>

        {/* Player Count - Linear style */}
        <motion.div variants={itemVariants} className="mb-6">
          <label className="block text-[11px] font-medium text-[#5e6063] uppercase tracking-wider mb-2">
            Joueurs requis
          </label>
          <div className="flex gap-2">
            {PLAYER_COUNTS.map((count) => (
              <motion.button
                key={count}
                onClick={() => setPlayerCount(count)}
                className={`flex-1 h-12 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  playerCount === count
                    ? "bg-[rgba(74,222,128,0.15)] text-[#4ade80] border border-[rgba(74,222,128,0.3)]"
                    : "bg-[rgba(255,255,255,0.02)] text-[#8b8d90] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] hover:text-[#f7f8f8]"
                }`}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Users className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-[13px] font-semibold">{count}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Date & Time - Linear style */}
        <motion.div variants={itemVariants} className="mb-6">
          <label className="block text-[11px] font-medium text-[#5e6063] uppercase tracking-wider mb-2">
            Date et heure
          </label>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <motion.button
              type="button"
              onClick={() => setShowDatePicker(true)}
              className="h-14 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl text-left px-4 flex items-center gap-3 hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] transition-all group"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="w-9 h-9 rounded-lg bg-[rgba(245,166,35,0.1)] flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[#f5a623]" strokeWidth={1.5} />
              </div>
              <div>
                <span className="text-[10px] text-[#5e6063] font-medium block uppercase">Date</span>
                <span className={`text-[13px] font-medium ${date ? 'text-[#f7f8f8]' : 'text-[#5e6063]'}`}>
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
              className="h-14 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl text-left px-4 flex items-center gap-3 hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] transition-all group"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="w-9 h-9 rounded-lg bg-[rgba(96,165,250,0.1)] flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#60a5fa]" strokeWidth={1.5} />
              </div>
              <div>
                <span className="text-[10px] text-[#5e6063] font-medium block uppercase">Heure</span>
                <span className={`text-[13px] font-medium ${time ? 'text-[#f7f8f8]' : 'text-[#5e6063]'}`}>
                  {time ? `${time.split(':')[0]}h${time.split(':')[1]}` : 'Choisir'}
                </span>
              </div>
            </motion.button>
          </div>
          <div>
            <span className="text-[10px] text-[#5e6063] font-medium block mb-2 uppercase">Durée</span>
            <div className="flex gap-2">
              {DURATIONS.map((d) => (
                <motion.button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`flex-1 h-10 rounded-lg text-[13px] font-medium transition-all ${
                    duration === d
                      ? "bg-[rgba(94,109,210,0.15)] text-[#8b93ff] border border-[rgba(94,109,210,0.3)]"
                      : "bg-[rgba(255,255,255,0.02)] text-[#8b8d90] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] hover:text-[#f7f8f8]"
                  }`}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {d}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Comment - Linear style */}
        <motion.div variants={itemVariants} className="mb-8">
          <label className="block text-[11px] font-medium text-[#5e6063] uppercase tracking-wider mb-2">
            Commentaire (optionnel)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Stratégie, rôles, objectifs..."
            rows={3}
            className="w-full p-4 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl text-[#f7f8f8] text-[14px] placeholder:text-[#5e6063] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] focus:border-[rgba(94,109,210,0.5)] focus:ring-2 focus:ring-[rgba(94,109,210,0.15)] focus:outline-none transition-all resize-none"
          />
        </motion.div>

        {/* Create Button - Linear style */}
        <motion.button
          onClick={handleCreate}
          disabled={isCreating}
          className="w-full h-12 rounded-xl bg-[#5e6dd2] text-white text-[14px] font-semibold flex items-center justify-center gap-2.5 hover:bg-[#6a79db] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#5e6dd2]/20 transition-all"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          {isCreating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Création...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" strokeWidth={2} />
              Créer la session
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Game Picker Modal - Linear style */}
      <AnimatePresence>
        {showGamePicker && (
          <motion.div
            className="fixed inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm z-50 flex items-end md:items-center md:justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGamePicker(false)}
          >
            <motion.div
              className="bg-[#101012] border-t md:border border-[rgba(255,255,255,0.08)] rounded-t-2xl md:rounded-2xl w-full md:max-w-md md:mx-4"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-[rgba(255,255,255,0.1)] rounded-full mx-auto my-3 md:hidden" />
              <div className="p-4 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-[#f7f8f8]">Choisir un jeu</h2>
                <motion.button
                  onClick={() => setShowGamePicker(false)}
                  className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-[#8b8d90] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#f7f8f8] transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </motion.button>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3 pb-8 md:pb-4">
                {GAMES.map((game, index) => (
                  <motion.button
                    key={game.id}
                    onClick={() => {
                      setSelectedGame(game.id);
                      setShowGamePicker(false);
                    }}
                    className={`p-4 rounded-xl text-center transition-all relative ${
                      selectedGame === game.id
                        ? "bg-[rgba(94,109,210,0.15)] border border-[rgba(94,109,210,0.3)]"
                        : "bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)]"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.15 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-2xl block mb-2">{game.icon}</span>
                    <span className={`text-[13px] font-medium ${
                      selectedGame === game.id ? 'text-[#8b93ff]' : 'text-[#f7f8f8]'
                    }`}>
                      {game.name}
                    </span>
                    {selectedGame === game.id && (
                      <motion.div
                        className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[rgba(94,109,210,0.3)] flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check className="w-3 h-3 text-[#8b93ff]" />
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
