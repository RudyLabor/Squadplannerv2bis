import { ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (date: string) => void;
  selectedDate?: string;
  minDate?: string;
}

export function DatePicker({ isOpen, onClose, onSelect, selectedDate, minDate }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempSelectedDate, setTempSelectedDate] = useState<string | undefined>(selectedDate);

  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(new Date(selectedDate));
    }
  }, [selectedDate]);

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--fg-primary)] tracking-tight">
                  Choisir une date
                </h2>
                <p className="text-xs text-[var(--fg-tertiary)] mt-0.5">
                  {tempSelectedDate ? new Date(tempSelectedDate + 'T00:00:00').toLocaleDateString('fr-FR', { 
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) : 'Sélectionnez une date'}
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

          {/* Calendar */}
          <div className="p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePrevMonth}
                className="w-10 h-10 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-muted)] flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-[var(--fg-secondary)]" strokeWidth={2} />
              </button>
              
              <div className="text-center">
                <div className="text-base font-semibold text-[var(--fg-primary)]">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </div>
              </div>

              <button
                onClick={handleNextMonth}
                className="w-10 h-10 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-muted)] flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-[var(--fg-secondary)]" strokeWidth={2} />
              </button>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-[var(--fg-tertiary)] py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
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
                    className={`aspect-square rounded-xl text-sm font-semibold transition-all duration-200 ${
                      selected
                        ? 'bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white shadow-lg shadow-[var(--primary-500)]/20'
                        : today
                        ? 'bg-[var(--primary-100)] text-[var(--primary-600)] border-2 border-[var(--primary-300)]'
                        : disabled
                        ? 'bg-transparent text-[var(--fg-tertiary)]/30 cursor-not-allowed'
                        : 'bg-[var(--bg-subtle)] text-[var(--fg-primary)] hover:bg-[var(--bg-muted)] hover:shadow-sm'
                    }`}
                  >
                    {day}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          {tempSelectedDate && (
            <div className="p-6 border-t border-[var(--border-subtle)] bg-gradient-to-br from-[var(--primary-50)] to-white">
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 h-12 rounded-xl bg-[var(--bg-subtle)] text-[var(--fg-secondary)] text-sm font-semibold hover:bg-[var(--bg-muted)] transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white text-sm font-semibold shadow-lg shadow-[var(--primary-500)]/20 hover:shadow-xl hover:shadow-[var(--primary-500)]/30 transition-all duration-200"
                >
                  Confirmer
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}