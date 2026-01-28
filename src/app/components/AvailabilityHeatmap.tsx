/**
 * 🌡️ AVAILABILITY HEATMAP - Phase 2
 * Visualisation des meilleurs créneaux pour le squad
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users } from 'lucide-react';
import {
  generateAvailabilityHeatmap,
  formatDayOfWeek,
  formatHour,
  type AvailabilityHeatmap as HeatmapData,
} from '@/utils/smart-suggestions';

interface AvailabilityHeatmapProps {
  squadId: string;
  onSlotClick?: (day: number, hour: number) => void;
}

export function AvailabilityHeatmap({ squadId, onSlotClick }: AvailabilityHeatmapProps) {
  const [heatmap, setHeatmap] = useState<HeatmapData>({});
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<{ day: number; hour: number } | null>(null);

  const hoursToShow = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]; // 8h-23h

  useEffect(() => {
    loadHeatmap();
  }, [squadId]);

  const loadHeatmap = async () => {
    setLoading(true);
    try {
      const data = await generateAvailabilityHeatmap(squadId);
      setHeatmap(data);
    } catch (error) {
      console.error('Error loading heatmap:', error);
    } finally {
      setLoading(false);
    }
  };

  const getColorForScore = (score: number): string => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-green-400';
    if (score >= 40) return 'bg-yellow-400';
    if (score >= 20) return 'bg-orange-400';
    if (score > 0) return 'bg-red-400';
    return 'bg-gray-100';
  };

  const handleSlotClick = (day: number, hour: number) => {
    setSelectedSlot({ day, hour });
    onSlotClick?.(day, hour);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Heatmap de Disponibilité
          </h3>
          <p className="text-sm text-gray-600">
            Meilleurs créneaux basés sur l'historique
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-medium text-gray-600">
            Analyse intelligente
          </span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Header avec jours */}
          <div className="flex gap-1 mb-2">
            <div className="w-12" /> {/* Spacer pour les heures */}
            {[0, 1, 2, 3, 4, 5, 6].map((day) => (
              <div
                key={day}
                className="flex-1 min-w-[50px] text-center text-xs font-semibold text-gray-700"
              >
                {formatDayOfWeek(day, true)}
              </div>
            ))}
          </div>

          {/* Grille */}
          {hoursToShow.map((hour) => (
            <div key={hour} className="flex gap-1 mb-1">
              {/* Label heure */}
              <div className="w-12 text-right text-xs text-gray-500 font-medium pt-1">
                {formatHour(hour)}
              </div>

              {/* Cellules */}
              {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                const cell = heatmap[day]?.[hour];
                const score = cell?.score || 0;
                const sessions = cell?.sessions || 0;
                const attendees = cell?.attendees || 0;

                const isSelected = selectedSlot?.day === day && selectedSlot?.hour === hour;

                return (
                  <motion.button
                    key={`${day}-${hour}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSlotClick(day, hour)}
                    className={`flex-1 min-w-[50px] h-8 rounded-lg border-2 transition-all relative ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-transparent'
                    } ${getColorForScore(score)}`}
                    title={`${formatDayOfWeek(day)} ${formatHour(hour)}\n${sessions} sessions\n${attendees} participants\nScore: ${score.toFixed(0)}%`}
                  >
                    {sessions > 0 && (
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow">
                        {sessions}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Légende */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 font-medium">Légende:</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-emerald-500" />
              <span className="text-gray-600">Excellent (80%+)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-green-400" />
              <span className="text-gray-600">Bon (60%+)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-yellow-400" />
              <span className="text-gray-600">Moyen (40%+)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-gray-100" />
              <span className="text-gray-600">Non testé</span>
            </div>
          </div>
        </div>
      </div>

      {/* Détails slot sélectionné */}
      {selectedSlot && heatmap[selectedSlot.day]?.[selectedSlot.hour] && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-1">
                {formatDayOfWeek(selectedSlot.day)} à {formatHour(selectedSlot.hour)}
              </h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>
                  <strong>{heatmap[selectedSlot.day][selectedSlot.hour].sessions}</strong> sessions
                  historiques
                </p>
                <p>
                  <strong>{heatmap[selectedSlot.day][selectedSlot.hour].attendees}</strong> participants
                  au total
                </p>
                <p>
                  Score de disponibilité:{' '}
                  <strong>{heatmap[selectedSlot.day][selectedSlot.hour].score.toFixed(0)}%</strong>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
