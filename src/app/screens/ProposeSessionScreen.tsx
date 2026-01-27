/**
 * 📅 PROPOSE SESSION SCREEN - Aligné sur maquette Figma
 * Design System v2 - Mobile-first
 */

import { useState, useEffect } from "react";
import { ArrowLeft, Gamepad2, Users, Calendar, Clock } from "lucide-react";
import { sessionsAPI, squadsAPI } from "@/utils/api";
import { ActionButton } from "@/app/components/ui/DesignSystem";

interface ProposeSessionScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  data?: { squadId?: string };
}

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
  const [isCreating, setIsCreating] = useState(false);
  const [squads, setSquads] = useState<any[]>([]);
  const [selectedSquad, setSelectedSquad] = useState<string | null>(data?.squadId || null);

  useEffect(() => {
    loadSquads();
  }, []);

  const loadSquads = async () => {
    try {
      const response = await squadsAPI.getSquads();
      setSquads(response.squads || []);
      if (data?.squadId) {
        setSelectedSquad(data.squadId);
      } else if (response.squads?.length > 0) {
        setSelectedSquad(response.squads[0].id);
      }
    } catch (error) {
      console.error("Load squads error:", error);
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
      await sessionsAPI.createSession({
        squadId: selectedSquad,
        title: title.trim(),
        game: game?.name || selectedGame || "Non spécifié",
        date: `${date}T${time}:00`,
        duration,
        totalSlots: playerCount,
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
    <div className="min-h-screen pb-24">
      <div className="px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => onNavigate("sessions")}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Proposer une session
            </h1>
            <p className="text-sm text-gray-500">Organise ta prochaine partie</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="bg-gray-100 rounded-full p-1 flex mb-6">
          <button
            onClick={() => setMode("single")}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
              mode === "single"
                ? "bg-amber-500 text-white"
                : "text-gray-600"
            }`}
          >
            Session unique
          </button>
          <button
            onClick={() => setMode("multi")}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
              mode === "multi"
                ? "bg-amber-500 text-white"
                : "text-gray-600"
            }`}
          >
            Proposer plusieurs créneaux
          </button>
        </div>

        {/* Squad Selector */}
        {squads.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Squad
            </label>
            <select
              value={selectedSquad || ""}
              onChange={(e) => setSelectedSquad(e.target.value)}
              className="w-full h-12 px-4 bg-white rounded-xl border border-gray-200 text-gray-900"
            >
              {squads.map((squad) => (
                <option key={squad.id} value={squad.id}>
                  {squad.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre de la session
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Ranked Valorant"
            className="w-full h-12 px-4 bg-white rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        {/* Game Picker */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jeu
          </label>
          <button
            onClick={() => setShowGamePicker(true)}
            className="w-full h-20 bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
          >
            {selectedGameData ? (
              <>
                <span className="text-xl mb-1">{selectedGameData.icon}</span>
                <span className="text-sm font-medium text-gray-900">
                  {selectedGameData.name}
                </span>
              </>
            ) : (
              <>
                <Gamepad2 className="w-5 h-5 text-gray-400 mb-1" />
                <span className="text-sm text-gray-500">Choisir un jeu</span>
              </>
            )}
          </button>
        </div>

        {/* Player Count */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Joueurs requis
          </label>
          <div className="flex gap-2">
            {PLAYER_COUNTS.map((count) => (
              <button
                key={count}
                onClick={() => setPlayerCount(count)}
                className={`flex-1 h-12 rounded-xl flex flex-col items-center justify-center transition-colors ${
                  playerCount === count
                    ? "bg-teal-500 text-white"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                <Users className="w-4 h-4 mb-0.5" />
                <span className="text-xs font-medium">{count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date & Time */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date et heure
          </label>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p className="text-xs text-gray-400 mb-1">DATE</p>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 bg-white rounded-xl border border-gray-200 text-gray-900"
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">HEURE</p>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 bg-white rounded-xl border border-gray-200 text-gray-900"
                />
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">DURÉE</p>
            <div className="flex gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`flex-1 h-10 rounded-full text-sm font-medium transition-colors ${
                    duration === d
                      ? "bg-amber-500 text-white"
                      : "bg-white text-gray-600 border border-gray-200"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Comment */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Commentaire (optionnel)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Stratégie, rôles, objectifs..."
            rows={3}
            className="w-full p-4 bg-white rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
          />
        </div>

        {/* Create Button */}
        <ActionButton
          variant="primary"
          onClick={handleCreate}
          disabled={isCreating}
          className="w-full"
        >
          {isCreating ? "Création..." : "Créer la session"}
        </ActionButton>
      </div>

      {/* Game Picker Modal */}
      {showGamePicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Choisir un jeu</h2>
              <button
                onClick={() => setShowGamePicker(false)}
                className="text-gray-500"
              >
                Fermer
              </button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {GAMES.map((game) => (
                <button
                  key={game.id}
                  onClick={() => {
                    setSelectedGame(game.id);
                    setShowGamePicker(false);
                  }}
                  className={`p-4 rounded-xl text-center transition-colors ${
                    selectedGame === game.id
                      ? "bg-amber-100 border-2 border-amber-500"
                      : "bg-gray-50 border-2 border-transparent"
                  }`}
                >
                  <span className="text-2xl block mb-2">{game.icon}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {game.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProposeSessionScreen;
