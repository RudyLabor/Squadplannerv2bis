/**
 * DATE PICKER - LINEAR DARK DESIGN
 * Clean, minimal date picker with dark theme
 */

import { ChevronLeft, ChevronRight, Calendar, X, Zap } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (date: string) => void;
  selectedDate?: string;
  minDate?: string;
}

// Helper pour formater la date en ISO
function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper pour obtenir le nom du jour
function getDayName(date: Date): string {
  return date.toLocaleDateString('fr-FR', { weekday: 'long' });
}

export function DatePicker({ isOpen, onClose, onSelect, selectedDate, minDate }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempSelectedDate, setTempSelectedDate] = useState<string | undefined>(selectedDate);

  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(new Date(selectedDate));
    }
  }, [selectedDate]);

  // Generer les raccourcis rapides
  const quickDates = useMemo(() => {
    const dates = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Aujourd'hui
    dates.push({
      label: "Aujourd'hui",
      date: formatDateToISO(now),
      sublabel: now.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }),
      emoji: '📅'
    });

    // Demain
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    dates.push({
      label: 'Demain',
      date: formatDateToISO(tomorrow),
      sublabel: tomorrow.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }),
      emoji: '🌅'
    });

    // Apres-demain
    const dayAfter = new Date(now);
    dayAfter.setDate(dayAfter.getDate() + 2);
    const dayAfterName = getDayName(dayAfter);
    dates.push({
      label: dayAfterName.charAt(0).toUpperCase() + dayAfterName.slice(1),
      date: formatDateToISO(dayAfter),
      sublabel: dayAfter.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      emoji: '📆'
    });

    // Prochain week-end (Samedi)
    const nextSaturday = new Date(now);
    const daysUntilSaturday = (6 - nextSaturday.getDay() + 7) % 7;
    nextSaturday.setDate(nextSaturday.getDate() + (daysUntilSaturday === 0 ? 7 : daysUntilSaturday));
    if (nextSaturday > dayAfter) {
      dates.push({
        label: 'Samedi',
        date: formatDateToISO(nextSaturday),
        sublabel: nextSaturday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        emoji: '🎮'
      });
    } else {
      // Si samedi est proche, ajouter dimanche
      const nextSunday = new Date(now);
      const daysUntilSunday = (7 - nextSunday.getDay()) % 7;
      nextSunday.setDate(nextSunday.getDate() + (daysUntilSunday === 0 ? 7 : daysUntilSunday));
      dates.push({
        label: 'Dimanche',
        date: formatDateToISO(nextSunday),
        sublabel: nextSunday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        emoji: '🛋️'
      });
    }

    return dates.slice(0, 4);
  }, []);

  const monthNames = [
    'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'
  ];

  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
    let firstDayOfWeek = firstDay.getDay();
    // Convert Sunday (0) to 7 to make Monday (1) the first day
    if (firstDayOfWeek === 0) firstDayOfWeek = 7;

    const days: (number | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 1; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleSelectDay = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const selectedDateObj = new Date(year, month, day);
    const dateString = selectedDateObj.toISOString().split('T')[0];

    // Check if date is before minDate
    if (minDate && dateString < minDate) {
      return;
    }

    setTempSelectedDate(dateString);
  };

  const handleConfirm = () => {
    if (tempSelectedDate) {
      onSelect(tempSelectedDate);
      onClose();
    }
  };

  const isDateDisabled = (day: number) => {
    if (!minDate) return false;
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const dateString = new Date(year, month, day).toISOString().split('T')[0];
    return dateString < minDate;
  };

  const isDateSelected = (day: number) => {
    if (!tempSelectedDate) return false;
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const dateString = new Date(year, month, day).toISOString().split('T')[0];
    return dateString === tempSelectedDate;
  };

  const isToday = (day: number) => {
    const today = new Date();
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const days = getDaysInMonth(currentMonth);

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
              <div className="w-10 h-10 rounded-xl bg-[rgba(245,166,35,0.15)] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#f5a623]" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-[16px] font-semibold text-[#f7f8f8]">
                  Choisir une date
                </h2>
                <p className="text-[12px] text-[#5e6063] mt-0.5">
                  {tempSelectedDate ? new Date(tempSelectedDate + 'T00:00:00').toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  }) : 'Selectionnez une date'}
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

          {/* Quick Date Shortcuts */}
          <div className="px-5 pt-4 pb-2">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-3.5 h-3.5 text-[#f5a623]" strokeWidth={1.5} />
              <span className="text-[10px] font-medium text-[#5e6063] uppercase tracking-wider">Raccourcis</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickDates.map((quick, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setTempSelectedDate(quick.date);
                    // Auto-navigate to the month of the selected date
                    setCurrentMonth(new Date(quick.date + 'T00:00:00'));
                  }}
                  className={`p-3 rounded-xl text-left transition-all ${
                    tempSelectedDate === quick.date
                      ? 'bg-[rgba(245,166,35,0.15)] border border-[rgba(245,166,35,0.3)]'
                      : 'bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)]'
                  }`}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{quick.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-[12px] truncate ${
                        tempSelectedDate === quick.date ? 'text-[#f5a623]' : 'text-[#f7f8f8]'
                      }`}>
                        {quick.label}
                      </p>
                      <p className={`text-[10px] truncate ${
                        tempSelectedDate === quick.date ? 'text-[#f5a623]/70' : 'text-[#5e6063]'
                      }`}>
                        {quick.sublabel}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div className="p-5 pt-4">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <motion.button
                onClick={handlePrevMonth}
                className="w-9 h-9 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#8b8d90] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#f7f8f8] transition-colors"
                whileHover={{ x: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
              </motion.button>

              <div className="text-center">
                <div className="text-[14px] font-semibold text-[#f7f8f8]">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </div>
              </div>

              <motion.button
                onClick={handleNextMonth}
                className="w-9 h-9 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#8b8d90] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#f7f8f8] transition-colors"
                whileHover={{ x: 1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
              </motion.button>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-1.5 mb-2">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-[10px] font-medium text-[#5e6063] py-2 uppercase tracking-wider"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} />;
                }

                const disabled = isDateDisabled(day);
                const selected = isDateSelected(day);
                const today = isToday(day);

                return (
                  <motion.button
                    key={day}
                    whileHover={!disabled ? { scale: 1.05 } : {}}
                    whileTap={!disabled ? { scale: 0.95 } : {}}
                    onClick={() => !disabled && handleSelectDay(day)}
                    disabled={disabled}
                    className={`aspect-square rounded-lg text-[13px] font-medium transition-all flex items-center justify-center ${
                      selected
                        ? 'bg-[#5e6dd2] text-white shadow-lg shadow-[#5e6dd2]/30'
                        : today
                        ? 'bg-[rgba(245,166,35,0.15)] text-[#f5a623] border border-[rgba(245,166,35,0.3)]'
                        : disabled
                        ? 'bg-transparent text-[#5e6063]/30 cursor-not-allowed'
                        : 'bg-[rgba(255,255,255,0.02)] text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.06)] border border-transparent hover:border-[rgba(255,255,255,0.08)]'
                    }`}
                  >
                    {day}
                  </motion.button>
                );
              })}
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
                disabled={!tempSelectedDate}
                className={`flex-1 h-11 rounded-xl text-[13px] font-semibold transition-all ${
                  tempSelectedDate
                    ? 'bg-[#5e6dd2] text-white shadow-lg shadow-[#5e6dd2]/20 hover:bg-[#6a79db]'
                    : 'bg-[rgba(255,255,255,0.04)] text-[#5e6063] cursor-not-allowed border border-[rgba(255,255,255,0.06)]'
                }`}
                whileHover={tempSelectedDate ? { y: -1 } : {}}
                whileTap={tempSelectedDate ? { scale: 0.98 } : {}}
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
