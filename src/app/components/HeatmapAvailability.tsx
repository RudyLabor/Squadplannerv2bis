import { motion } from 'framer-motion';
import { Clock, TrendingUp } from 'lucide-react';

interface TimeSlot {
  hour: number;
  day: number;
  availability: number; // 0-100
  sessionsCount: number;
}

interface HeatmapAvailabilityProps {
  data?: TimeSlot[];
  onSlotClick?: (hour: number, day: number) => void;
  showLegend?: boolean;
}

export function HeatmapAvailability({ 
  data = generateMockData(), 
  onSlotClick,
  showLegend = true 
}: HeatmapAvailabilityProps) {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const relevantHours = hours.filter(h => h >= 8 && h <= 23); // 8h - 23h

  const getSlotData = (hour: number, day: number): TimeSlot | undefined => {
    return data.find(slot => slot.hour === hour && slot.day === day);
  };

  const getColorIntensity = (availability: number): string => {
    if (availability >= 80) return 'bg-[var(--success-500)] border-[var(--success-600)]';
    if (availability >= 60) return 'bg-[var(--success-400)] border-[var(--success-500)]';
    if (availability >= 40) return 'bg-[var(--warning-400)] border-[var(--warning-500)]';
    if (availability >= 20) return 'bg-[var(--warning-300)] border-[var(--warning-400)]';
    if (availability > 0) return 'bg-[var(--border-medium)] border-[var(--border-strong)]';
    return 'bg-[var(--bg-tertiary)] border-[var(--border-subtle)]';
  };

  const getBestSlot = () => {
    if (data.length === 0) return null;
    return data.reduce((best, current) => 
      current.availability > best.availability ? current : best
    );
  };

  const bestSlot = getBestSlot();

  return (
    <div className="space-y-4">
      {/* Header with Best Slot */}
      {bestSlot && (
        <div className="bg-gradient-to-br from-[var(--success-50)] to-[var(--success-100)] rounded-2xl p-4 border-[0.5px] border-[var(--success-200)]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="text-xs text-[var(--success-700)] font-medium mb-1 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} />
                Meilleur créneau
              </div>
              <div className="text-lg font-bold text-[var(--success-700)] mb-0.5">
                {days[bestSlot.day]} à {bestSlot.hour}h
              </div>
              <div className="text-xs text-[var(--success-600)] font-medium">
                {bestSlot.availability}% de disponibilité • {bestSlot.sessionsCount} sessions
              </div>
            </div>
            <div className="w-14 h-14 rounded-xl bg-[var(--success-500)] flex items-center justify-center text-white">
              <Clock className="w-7 h-7" strokeWidth={2} />
            </div>
          </div>
        </div>
      )}

      {/* Heatmap Grid */}
      <div className="bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Days Header */}
          <div className="flex gap-1 mb-2 ml-14">
            {days.map((day, index) => (
              <div 
                key={day}
                className="flex-1 text-center text-xs font-semibold text-[var(--fg-secondary)]"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="space-y-1">
            {relevantHours.map((hour) => (
              <div key={hour} className="flex items-center gap-1">
                {/* Hour Label */}
                <div className="w-12 text-right text-xs font-medium text-[var(--fg-tertiary)] pr-2">
                  {hour}h
                </div>

                {/* Day Slots */}
                {days.map((_, dayIndex) => {
                  const slotData = getSlotData(hour, dayIndex);
                  const availability = slotData?.availability || 0;
                  const sessionsCount = slotData?.sessionsCount || 0;

                  return (
                    <motion.button
                      key={dayIndex}
                      onClick={() => onSlotClick?.(hour, dayIndex)}
                      className={`
                        flex-1 h-7 rounded-lg border transition-all
                        ${getColorIntensity(availability)}
                        ${availability > 0 ? 'hover:scale-105 hover:shadow-md cursor-pointer' : 'cursor-default'}
                      `}
                      whileHover={availability > 0 ? { scale: 1.05 } : {}}
                      whileTap={availability > 0 ? { scale: 0.95 } : {}}
                      title={
                        availability > 0 
                          ? `${days[dayIndex]} ${hour}h: ${availability}% disponible (${sessionsCount} sessions)`
                          : 'Aucune donnée'
                      }
                    >
                      {sessionsCount > 0 && (
                        <span className="text-[9px] font-bold text-white/80">
                          {sessionsCount}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="bg-white rounded-xl p-4 border-[0.5px] border-[var(--border-subtle)]">
          <div className="text-xs font-semibold text-[var(--fg-secondary)] mb-3">
            Légende
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {[
              { label: 'Aucune donnée', color: 'bg-[var(--bg-tertiary)]' },
              { label: '1-20%', color: 'bg-[var(--warning-300)]' },
              { label: '20-40%', color: 'bg-[var(--warning-400)]' },
              { label: '40-60%', color: 'bg-[var(--success-400)]' },
              { label: '60-80%', color: 'bg-[var(--success-500)]' },
              { label: '80-100%', color: 'bg-[var(--success-600)]' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className={`w-4 h-4 rounded ${item.color}`} />
                <span className="text-xs text-[var(--fg-tertiary)] font-medium">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Mock data generator
function generateMockData(): TimeSlot[] {
  const data: TimeSlot[] = [];
  
  // Simulate realistic gaming availability patterns
  for (let day = 0; day < 7; day++) {
    for (let hour = 8; hour <= 23; hour++) {
      let availability = 0;
      let sessionsCount = 0;

      // Weekend patterns (Fri, Sat, Sun)
      if (day >= 4) {
        if (hour >= 14 && hour <= 23) {
          availability = 70 + Math.random() * 30;
          sessionsCount = Math.floor(Math.random() * 8) + 2;
        }
      } 
      // Weekday patterns (Mon-Thu)
      else {
        if (hour >= 19 && hour <= 23) {
          availability = 60 + Math.random() * 30;
          sessionsCount = Math.floor(Math.random() * 5) + 1;
        } else if (hour >= 17 && hour < 19) {
          availability = 30 + Math.random() * 30;
          sessionsCount = Math.floor(Math.random() * 3);
        }
      }

      if (availability > 0) {
        data.push({
          hour,
          day,
          availability: Math.round(availability),
          sessionsCount: Math.round(sessionsCount)
        });
      }
    }
  }

  return data;
}
