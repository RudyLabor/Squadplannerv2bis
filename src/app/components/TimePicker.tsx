/**
 * TIME PICKER - LINEAR DARK DESIGN
 * Clean, minimal time picker with dark theme
 */

import { Clock, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    { label: 'Aprem', time: '15:00', icon: '🌤️' },
    { label: 'Soir', time: '19:00', icon: '🌆' },
    { label: 'Nuit', time: '21:00', icon: '🌙' },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#101012] border-t sm:border border-[rgba(255,255,255,0.08)] rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[rgba(96,165,250,0.15)] flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#60a5fa]" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-[16px] font-semibold text-[#f7f8f8]">
                  Choisir une heure
                </h2>
                <p className="text-[12px] text-[#5e6063] mt-0.5">
                  {tempHour}:{tempMinute}
                </p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="w-9 h-9 rounded-lg bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-[#8b8d90] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#f7f8f8] transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </motion.button>
          </div>

          <div className="p-5">
            {/* Quick Times */}
            <div className="mb-5">
              <label className="text-[10px] font-medium text-[#5e6063] uppercase tracking-wider mb-3 block">
                Creneaux rapides
              </label>
              <div className="grid grid-cols-5 gap-2">
                {quickTimes.map(({ label, time, icon }) => {
                  const [hour, minute] = time.split(':');
                  const isSelected = tempHour === hour && tempMinute === minute;

                  return (
                    <motion.button
                      key={time}
                      onClick={() => {
                        setTempHour(hour);
                        setTempMinute(minute);
                      }}
                      className={`p-2.5 rounded-xl text-center transition-all ${
                        isSelected
                          ? 'bg-[rgba(94,109,210,0.2)] border border-[rgba(94,109,210,0.4)]'
                          : 'bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)]'
                      }`}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-base mb-0.5">{icon}</div>
                      <div className={`text-[10px] font-medium ${isSelected ? 'text-[#8b93ff]' : 'text-[#f7f8f8]'}`}>
                        {label}
                      </div>
                      <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#8b93ff]/70' : 'text-[#5e6063]'}`}>
                        {time}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Digital Clock Display */}
            <div className="mb-5 py-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl">
              <div className="text-center">
                <div className="text-4xl font-semibold text-[#f7f8f8] tracking-tight font-mono">
                  {tempHour}<span className="text-[#5e6063] animate-pulse">:</span>{tempMinute}
                </div>
                <div className="text-[12px] text-[#5e6063] mt-2">
                  {parseInt(tempHour) < 12 ? 'Matin' : parseInt(tempHour) < 18 ? 'Apres-midi' : 'Soiree'}
                </div>
              </div>
            </div>

            {/* Hour & Minute Pickers */}
            <div className="grid grid-cols-2 gap-4">
              {/* Hours */}
              <div>
                <label className="text-[10px] font-medium text-[#5e6063] uppercase tracking-wider mb-2 block">
                  Heures
                </label>
                <div className="h-44 overflow-y-auto scrollbar-thin scrollbar-thumb-[rgba(255,255,255,0.1)] scrollbar-track-transparent bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-2">
                  <div className="space-y-1">
                    {hours.map((hour) => (
                      <motion.button
                        key={hour}
                        onClick={() => setTempHour(hour)}
                        className={`w-full py-2 px-3 rounded-lg text-[13px] font-medium transition-all ${
                          tempHour === hour
                            ? 'bg-[rgba(94,109,210,0.2)] text-[#8b93ff] border border-[rgba(94,109,210,0.3)]'
                            : 'bg-transparent text-[#8b8d90] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#f7f8f8]'
                        }`}
                        whileTap={{ scale: 0.98 }}
                      >
                        {hour}h
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Minutes */}
              <div>
                <label className="text-[10px] font-medium text-[#5e6063] uppercase tracking-wider mb-2 block">
                  Minutes
                </label>
                <div className="h-44 overflow-y-auto scrollbar-thin scrollbar-thumb-[rgba(255,255,255,0.1)] scrollbar-track-transparent bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-2">
                  <div className="space-y-1">
                    {minutes.map((minute) => (
                      <motion.button
                        key={minute}
                        onClick={() => setTempMinute(minute)}
                        className={`w-full py-2 px-3 rounded-lg text-[13px] font-medium transition-all ${
                          tempMinute === minute
                            ? 'bg-[rgba(94,109,210,0.2)] text-[#8b93ff] border border-[rgba(94,109,210,0.3)]'
                            : 'bg-transparent text-[#8b8d90] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#f7f8f8]'
                        }`}
                        whileTap={{ scale: 0.98 }}
                      >
                        {minute}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
            <div className="flex gap-3">
              <motion.button
                onClick={onClose}
                className="flex-1 h-11 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#8b8d90] text-[13px] font-semibold hover:bg-[rgba(255,255,255,0.06)] hover:text-[#f7f8f8] transition-all"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                Annuler
              </motion.button>
              <motion.button
                onClick={handleConfirm}
                className="flex-1 h-11 rounded-xl bg-[#5e6dd2] text-white text-[13px] font-semibold shadow-lg shadow-[#5e6dd2]/20 hover:bg-[#6a79db] transition-all"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                Confirmer
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
