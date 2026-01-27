/**
 * ➕ CREATE SQUAD SCREEN - Aligné sur maquette Figma
 * Design System v2 - Mobile-first
 */

import { useState } from "react";
import { ArrowLeft, Gamepad2, Users } from "lucide-react";
import { squadsAPI } from "@/utils/api";
import { ActionButton, Input } from "@/app/components/ui/DesignSystem";

interface CreateSquadScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const GAMES = [
  { id: "valorant", name: "Valorant", icon: "🎯" },
  { id: "lol", name: "League of Legends", icon: "⚔️" },
  { id: "cs2", name: "CS2", icon: "🔫" },
  { id: "apex", name: "Apex Legends", icon: "🦊" },
  { id: "overwatch", name: "Overwatch 2", icon: "🎮" },
  { id: "fortnite", name: "Fortnite", icon: "🏗️" },
  { id: "rocket-league", name: "Rocket League", icon: "🚀" },
  { id: "other", name: "Autre", icon: "🎲" },
];

const DAYS = [
  { id: "lun", label: "Lun" },
  { id: "mar", label: "Mar" },
  { id: "mer", label: "Mer" },
  { id: "jeu", label: "Jeu" },
  { id: "ven", label: "Ven" },
  { id: "sam", label: "Sam" },
  { id: "dim", label: "Dim" },
];

const DURATIONS = ["1h", "2h", "3h", "4h"];

export function CreateSquadScreen({ onNavigate, showToast }: CreateSquadScreenProps) {
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
      await squadsAPI.createSquad({
        name: name.trim(),
        game: game?.name || selectedGame,
        preferredDays: selectedDays,
        sessionDuration: duration,
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

  return (
    <div className="min-h-screen pb-24">
      <div className="px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => onNavigate("squads")}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Créer une Squad</h1>
            <p className="text-sm text-gray-500">
              Configure ta nouvelle équipe en 2 minutes
            </p>
          </div>
        </div>

        {/* Squad Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom de la Squad
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Les Légendes"
            maxLength={30}
            className="w-full h-12 px-4 bg-white rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
          <p className="text-xs text-gray-400 mt-1">{name.length}/30 caractères</p>
        </div>

        {/* Game Picker */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jeu Principal
          </label>
          <button
            onClick={() => setShowGamePicker(true)}
            className="w-full h-24 bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
          >
            {selectedGameData ? (
              <>
                <span className="text-2xl mb-1">{selectedGameData.icon}</span>
                <span className="text-sm font-medium text-gray-900">
                  {selectedGameData.name}
                </span>
              </>
            ) : (
              <>
                <Gamepad2 className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-sm text-gray-500">Choisir un jeu</span>
              </>
            )}
          </button>
        </div>

        {/* Preferred Days */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jours de jeu préférés (optionnel)
          </label>
          <div className="flex gap-2">
            {DAYS.map((day) => (
              <button
                key={day.id}
                onClick={() => toggleDay(day.id)}
                className={`flex-1 h-10 rounded-full text-sm font-medium transition-colors ${
                  selectedDays.includes(day.id)
                    ? "bg-amber-500 text-white"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timezone */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fuseau horaire
          </label>
          <select className="w-full h-12 px-4 bg-white rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
            <option>Paris (CET/CEST)</option>
            <option>Londres (GMT/BST)</option>
            <option>New York (EST/EDT)</option>
            <option>Los Angeles (PST/PDT)</option>
          </select>
        </div>

        {/* Session Duration */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Durée typique des sessions
          </label>
          <div className="flex gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`flex-1 h-12 rounded-full text-sm font-medium transition-colors ${
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

        {/* Create Button */}
        <ActionButton
          variant="primary"
          icon={Users}
          onClick={handleCreate}
          disabled={isCreating}
          className="w-full"
        >
          {isCreating ? "Création..." : "Créer la Squad"}
        </ActionButton>
      </div>

      {/* Game Picker Modal */}
      {showGamePicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[70vh] overflow-auto">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
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

export default CreateSquadScreen;
