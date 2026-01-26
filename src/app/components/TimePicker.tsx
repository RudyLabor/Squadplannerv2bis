import { Clock, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TimePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (time: string) => void;
  selectedTime?: string;
}

export function TimePicker({ isOpen, onClose, onSelect, selectedTime }: TimePickerProps) {
  const [tempHour, setTempHour] = useState('20');
  const [tempMinute, setTempMinute] = useState('00');

  useEffect(() => {
    if (selectedTime) {
      const [hour, minute] = selectedTime.split(':');
      setTempHour(hour);
      setTempMinute(minute);
    }
  }, [selectedTime]);

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];

  const handleConfirm = () => {
    onSelect(`${tempHour}:${tempMinute}`);
    onClose();
  };

  const quickTimes = [
    { label: 'Matin', time: '10:00', icon: '🌅' },
    { label: 'Midi', time: '12:00', icon: '☀️' },
    { label: 'Après-midi', time: '15:00', icon: '🌤️' },
    { label: 'Soirée', time: '19:00', icon: '🌆' },
    { label: 'Nuit', time: '21:00', icon: '🌙' },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--secondary-500)] to-[var(--secondary-600)] flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--fg-primary)] tracking-tight">
                  Choisir une heure
                </h2>
                <p className="text-xs text-[var(--fg-tertiary)] mt-0.5">
                  {tempHour}:{tempMinute}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-muted)] flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-[var(--fg-secondary)]" strokeWidth={2} />
            </button>
          </div>

          <div className="p-6">
            {/* Quick Times */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-[var(--fg-tertiary)] mb-3 block">
                Créneaux rapides
              </label>
              <div className="grid grid-cols-5 gap-2">
                {quickTimes.map(({ label, time, icon }) => {
                  const [hour, minute] = time.split(':');
                  const isSelected = tempHour === hour && tempMinute === minute;
                  
                  return (
                    <button
                      key={time}
                      onClick={() => {
                        setTempHour(hour);
                        setTempMinute(minute);
                      }}
                      className={`p-3 rounded-xl text-center transition-all duration-200 ${
                        isSelected
                          ? 'bg-gradient-to-br from-[var(--secondary-500)] to-[var(--secondary-600)] text-white shadow-lg shadow-[var(--secondary-500)]/20'
                          : 'bg-[var(--bg-subtle)] text-[var(--fg-secondary)] hover:bg-[var(--bg-muted)] hover:shadow-sm'
                      }`}
                    >
                      <div className="text-lg mb-1">{icon}</div>
                      <div className="text-xs font-semibold">{label}</div>
                      <div className={`text-xs mt-1 ${isSelected ? 'text-white/90' : 'text-[var(--fg-tertiary)]'}`}>
                        {time}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Digital Clock Display */}
            <div className="mb-6 py-8 bg-gradient-to-br from-[var(--secondary-50)] to-white rounded-2xl border-[0.5px] border-[var(--secondary-200)]">
              <div className="text-center">
                <div className="text-5xl font-semibold text-[var(--fg-primary)] tracking-tight">
                  {tempHour}<span className="text-[var(--fg-tertiary)] animate-pulse">:</span>{tempMinute}
                </div>
                <div className="text-sm text-[var(--fg-tertiary)] mt-2">
                  {parseInt(tempHour) < 12 ? 'Matin' : parseInt(tempHour) < 18 ? 'Après-midi' : 'Soirée'}
                </div>
              </div>
            </div>

            {/* Hour & Minute Pickers */}
            <div className="grid grid-cols-2 gap-4">
              {/* Hours */}
              <div>
                <label className="text-xs font-semibold text-[var(--fg-tertiary)] mb-2 block">
                  Heures
                </label>
                <div className="h-48 overflow-y-auto hide-scrollbar bg-[var(--bg-subtle)] rounded-xl p-2">
                  <div className="space-y-1">
                    {hours.map((hour) => (
                      <button
                        key={hour}
                        onClick={() => setTempHour(hour)}
                        className={`w-full py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          tempHour === hour
                            ? 'bg-gradient-to-br from-[var(--secondary-500)] to-[var(--secondary-600)] text-white shadow-md'
                            : 'bg-transparent text-[var(--fg-secondary)] hover:bg-white hover:shadow-sm'
                        }`}
                      >
                        {hour}h
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Minutes */}
              <div>
                <label className="text-xs font-semibold text-[var(--fg-tertiary)] mb-2 block">
                  Minutes
                </label>
                <div className="h-48 overflow-y-auto hide-scrollbar bg-[var(--bg-subtle)] rounded-xl p-2">
                  <div className="space-y-1">
                    {minutes.map((minute) => (
                      <button
                        key={minute}
                        onClick={() => setTempMinute(minute)}
                        className={`w-full py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          tempMinute === minute
                            ? 'bg-gradient-to-br from-[var(--secondary-500)] to-[var(--secondary-600)] text-white shadow-md'
                            : 'bg-transparent text-[var(--fg-secondary)] hover:bg-white hover:shadow-sm'
                        }`}
                      >
                        {minute}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[var(--border-subtle)] bg-gradient-to-br from-[var(--secondary-50)] to-white">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 h-12 rounded-xl bg-[var(--bg-subtle)] text-[var(--fg-secondary)] text-sm font-semibold hover:bg-[var(--bg-muted)] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 h-12 rounded-xl bg-gradient-to-br from-[var(--secondary-500)] to-[var(--secondary-600)] text-white text-sm font-semibold shadow-lg shadow-[var(--secondary-500)]/20 hover:shadow-xl hover:shadow-[var(--secondary-500)]/30 transition-all duration-200"
              >
                Confirmer
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
