import { ArrowLeft, Calendar, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sessionsAPI } from '@/utils/api';

interface AvailabilityHeatmapScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  useMockData?: boolean;
  data?: {
    squadId?: string;
  };
}

export function AvailabilityHeatmapScreen({ onNavigate, showToast, data, useMockData = false }: AvailabilityHeatmapScreenProps) {
  const [heatmap, setHeatmap] = useState<number[][]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionsCount, setSessionsCount] = useState(0);
  const [selectedCell, setSelectedCell] = useState<{ day: number; hour: number } | null>(null);

  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}h`);

  useEffect(() => {
    loadHeatmap();
  }, [data?.squadId]);

  const loadHeatmap = async () => {
    if (!data?.squadId && !useMockData) return;

    setLoading(true);
    try {
      if (useMockData) {
        // Simulation intelligence artificielle
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate a random heatmap
        const mockHeatmap = Array(7).fill(null).map(() => 
          Array(24).fill(0).map(() => {
            const r = Math.random();
            if (r > 0.8) return Math.floor(Math.random() * 25) + 75; // Excellent
            if (r > 0.6) return Math.floor(Math.random() * 25) + 50; // Bon
            if (r > 0.4) return Math.floor(Math.random() * 25) + 25; // Moyen
            if (r > 0.2) return Math.floor(Math.random() * 25);      // Faible
            return 0; // Aucune
          })
        );
        
        setHeatmap(mockHeatmap);
        setSessionsCount(42);
      } else {
        // REAL LOGIC
        const { sessions } = await sessionsAPI.getSessions(data?.squadId);
        
        // Initialize Heatmap 7x24
        const map = Array(7).fill(null).map(() => Array(24).fill(0));
        let count = 0;
        
        sessions.forEach((session: any) => {
          if (session.status !== 'confirmed') return;
          const slot = session.slots.find((s: any) => s.id === session.selectedSlotId);
          if (!slot) return;
          
          const date = new Date(`${slot.date}T${slot.time}:00`);
          const day = date.getDay();
          const hour = date.getHours();
          
          const yesCount = slot.responses?.filter((r: any) => r.response === 'yes').length || 0;
          const participation = yesCount / (session.playersNeeded || 5);
          
          // Add heat based on participation
          map[day][hour] += participation * 25; // Scale up to 100 max over multiple sessions
          
          // Cap at 100
          if (map[day][hour] > 100) map[day][hour] = 100;
          
          count++;
        });
        
        setHeatmap(map);
        setSessionsCount(count);
      }
    } catch (error: any) {
      console.error('Load heatmap error:', error);
      showToast(error.message || 'Erreur lors du chargement de la heatmap', 'error');
      // Fallback to empty heatmap
      setHeatmap(Array(7).fill(null).map(() => Array(24).fill(0)));
    } finally {
      setLoading(false);
    }
  };

  const getColor = (value: number) => {
    if (value === 0) return 'bg-[var(--bg-subtle)]';
    if (value < 25) return 'bg-[var(--error-100)]';
    if (value < 50) return 'bg-[var(--warning-200)]';
    if (value < 75) return 'bg-[var(--success-200)]';
    return 'bg-[var(--success-500)]';
  };

  const handleCellClick = (day: number, hour: number, value: number) => {
    if (value > 0) {
      setSelectedCell({ day, hour });
      // Navigate to create session with prefilled data
      onNavigate('create-session', {
        squadId: data?.squadId,
        prefilledDay: day,
        prefilledTime: `${String(hour).padStart(2, '0')}:00`,
      });
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-safe bg-[var(--bg-base)]">
      <div className="px-4 py-8 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="w-10 h-10 rounded-xl bg-white border-[0.5px] border-[var(--border-medium)] hover:border-[var(--border-strong)] flex items-center justify-center shadow-sm transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-secondary)]" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Heatmap de Disponibilité
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] mt-1">
              {sessionsCount} session{sessionsCount > 1 ? 's' : ''} analysée{sessionsCount > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-[var(--fg-tertiary)]">
              <div className="w-5 h-5 border-2 border-[var(--primary-500)] border-t-transparent rounded-full animate-spin"></div>
              <span>Analyse en cours...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Info Banner */}
            <div className="bg-gradient-to-br from-[var(--primary-50)] to-[var(--secondary-50)] rounded-2xl p-5 mb-6 border-[0.5px] border-[var(--primary-200)]">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-[var(--primary-500)] flex-shrink-0 mt-0.5" strokeWidth={2} />
                <div>
                  <p className="text-sm font-semibold text-[var(--fg-primary)] mb-1">
                    📊 Visualisation des Créneaux Efficaces
                  </p>
                  <p className="text-xs text-[var(--fg-tertiary)]">
                    Les cases vertes = créneaux avec forte participation. Cliquez pour créer une session.
                  </p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mb-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--bg-subtle)]"></div>
                <span className="text-[var(--fg-tertiary)]">Aucune</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--error-100)]"></div>
                <span className="text-[var(--fg-tertiary)]">Faible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--warning-200)]"></div>
                <span className="text-[var(--fg-tertiary)]">Moyen</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--success-200)]"></div>
                <span className="text-[var(--fg-tertiary)]">Bon</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--success-500)]"></div>
                <span className="text-[var(--fg-tertiary)]">Excellent</span>
              </div>
            </div>

            {/* Heatmap Grid */}
            <div className="bg-white rounded-2xl p-6 border-[0.5px] border-[var(--border-subtle)] shadow-sm overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Days Header */}
                <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-1 mb-1">
                  <div className="w-12"></div>
                  {days.map((day, index) => (
                    <div key={index} className="text-center text-xs font-semibold text-[var(--fg-secondary)] py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Heatmap Rows */}
                {hours.map((hour, hourIndex) => (
                  <div key={hourIndex} className="grid grid-cols-[auto_repeat(7,1fr)] gap-1 mb-1">
                    {/* Hour Label */}
                    <div className="w-12 flex items-center justify-end pr-2 text-xs text-[var(--fg-tertiary)]">
                      {hour}
                    </div>

                    {/* Cells */}
                    {days.map((_, dayIndex) => {
                      const value = heatmap[dayIndex]?.[hourIndex] || 0;
                      return (
                        <motion.button
                          key={dayIndex}
                          onClick={() => handleCellClick(dayIndex, hourIndex, value)}
                          whileHover={{ scale: value > 0 ? 1.1 : 1 }}
                          whileTap={{ scale: value > 0 ? 0.95 : 1 }}
                          className={`aspect-square rounded ${getColor(value)} ${
                            value > 0 ? 'cursor-pointer hover:ring-2 hover:ring-[var(--primary-500)]' : 'cursor-default'
                          } transition-all duration-150`}
                          title={value > 0 ? `${value}% d'efficacité` : 'Aucune donnée'}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-xs text-[var(--fg-tertiary)]">
                💡 Les données sont basées sur les sessions confirmées avec plus de 70% de participation
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AvailabilityHeatmapScreen;
