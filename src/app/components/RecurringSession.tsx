import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Repeat, Calendar, Clock, Pause, Play, Trash2, Settings } from 'lucide-react';

type RecurrencePattern = 'daily' | 'weekly' | 'biweekly' | 'monthly';

interface RecurringSessionConfig {
  id: string;
  title: string;
  pattern: RecurrencePattern;
  dayOfWeek?: number; // 0-6 (Dimanche-Samedi)
  time: string; // HH:mm
  isActive: boolean;
  nextOccurrence?: Date;
}

interface RecurringSessionProps {
  config: RecurringSessionConfig;
  onToggle?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const patternLabels: Record<RecurrencePattern, string> = {
  daily: 'Tous les jours',
  weekly: 'Toutes les semaines',
  biweekly: 'Toutes les 2 semaines',
  monthly: 'Tous les mois'
};

const dayLabels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const dayLabelsFull = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export function RecurringSession({
  config,
  onToggle,
  onEdit,
  onDelete,
  className = ''
}: RecurringSessionProps) {
  const [showActions, setShowActions] = useState(false);

  const getPatternDescription = () => {
    if (config.pattern === 'weekly' && config.dayOfWeek !== undefined) {
      return `Tous les ${dayLabelsFull[config.dayOfWeek].toLowerCase()}s à ${config.time}`;
    }
    return `${patternLabels[config.pattern]} à ${config.time}`;
  };

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
    >
      {/* Carte principale */}
      <div className={`
        relative overflow-hidden p-5 rounded-xl border-2 transition-all
        ${config.isActive 
          ? 'border-[var(--primary-500)]/30 bg-[var(--primary-500)]/5' 
          : 'border-white/10 bg-white/5 opacity-60'
        }
      `}>
        {/* Badge récurrent */}
        <div className="absolute top-3 right-3">
          <motion.div
            className={`
              px-2.5 py-1 rounded-full flex items-center gap-1.5
              ${config.isActive 
                ? 'bg-[var(--primary-500)]/20 border border-[var(--primary-500)]/30' 
                : 'bg-white/5 border border-white/10'
              }
            `}
            animate={config.isActive ? {
              scale: [1, 1.05, 1],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Repeat className={`w-3.5 h-3.5 ${config.isActive ? 'text-[var(--primary-500)]' : 'text-[var(--fg-tertiary)]'}`} />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${config.isActive ? 'text-[var(--primary-500)]' : 'text-[var(--fg-tertiary)]'}`}>
              Récurrent
            </span>
          </motion.div>
        </div>

        {/* Contenu */}
        <div className="pr-24">
          {/* Titre */}
          <h3 className="text-lg font-bold text-[var(--fg-primary)] mb-2">
            {config.title}
          </h3>

          {/* Pattern */}
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-[var(--fg-tertiary)]" />
            <span className="text-sm text-[var(--fg-secondary)]">
              {getPatternDescription()}
            </span>
          </div>

          {/* Prochaine occurrence */}
          {config.nextOccurrence && config.isActive && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <Clock className="w-4 h-4 text-[var(--primary-500)]" />
              <div className="flex-1">
                <p className="text-xs text-[var(--fg-tertiary)]">
                  Prochaine session
                </p>
                <p className="text-sm font-bold text-[var(--fg-primary)]">
                  {config.nextOccurrence.toLocaleDateString('fr-FR', { 
                    weekday: 'short', 
                    day: 'numeric', 
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Status inactif */}
          {!config.isActive && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--warning-500)]/10 border border-[var(--warning-500)]/30">
              <Pause className="w-4 h-4 text-[var(--warning-500)]" />
              <span className="text-sm font-medium text-[var(--warning-500)]">
                En pause
              </span>
            </div>
          )}
        </div>

        {/* Actions (apparaissent au hover) */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              className="absolute bottom-3 right-3 flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Toggle */}
              <motion.button
                onClick={() => onToggle?.(config.id)}
                className={`
                  p-2 rounded-lg backdrop-blur-sm border
                  ${config.isActive 
                    ? 'bg-[var(--warning-500)]/10 border-[var(--warning-500)]/30 hover:bg-[var(--warning-500)]/20' 
                    : 'bg-[var(--success-500)]/10 border-[var(--success-500)]/30 hover:bg-[var(--success-500)]/20'
                  }
                `}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={config.isActive ? 'Mettre en pause' : 'Activer'}
              >
                {config.isActive ? (
                  <Pause className="w-4 h-4 text-[var(--warning-500)]" />
                ) : (
                  <Play className="w-4 h-4 text-[var(--success-500)]" />
                )}
              </motion.button>

              {/* Edit */}
              <motion.button
                onClick={() => onEdit?.(config.id)}
                className="p-2 rounded-lg backdrop-blur-sm bg-[var(--primary-500)]/10 border border-[var(--primary-500)]/30 hover:bg-[var(--primary-500)]/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Modifier"
              >
                <Settings className="w-4 h-4 text-[var(--primary-500)]" />
              </motion.button>

              {/* Delete */}
              <motion.button
                onClick={() => onDelete?.(config.id)}
                className="p-2 rounded-lg backdrop-blur-sm bg-[var(--error-500)]/10 border border-[var(--error-500)]/30 hover:bg-[var(--error-500)]/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4 text-[var(--error-500)]" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Composant pour créer une nouvelle session récurrente
export function RecurringSessionCreator({
  onSave,
  onCancel,
  className = ''
}: {
  onSave: (config: Omit<RecurringSessionConfig, 'id' | 'isActive'>) => void;
  onCancel: () => void;
  className?: string;
}) {
  const [title, setTitle] = useState('');
  const [pattern, setPattern] = useState<RecurrencePattern>('weekly');
  const [dayOfWeek, setDayOfWeek] = useState(3); // Mercredi par défaut
  const [time, setTime] = useState('21:00');

  const handleSave = () => {
    onSave({
      title,
      pattern,
      dayOfWeek: pattern === 'weekly' ? dayOfWeek : undefined,
      time
    });
  };

  return (
    <motion.div
      className={`p-6 rounded-2xl glass-3 border border-white/10 ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-[var(--primary-500)]/10">
          <Repeat className="w-6 h-6 text-[var(--primary-500)]" />
        </div>
        <div>
          <h3 className="text-xl font-black text-[var(--fg-primary)]">
            Session Récurrente
          </h3>
          <p className="text-sm text-[var(--fg-tertiary)]">
            Planifie automatiquement tes sessions
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Titre */}
        <div>
          <label className="block text-sm font-bold text-[var(--fg-secondary)] mb-2">
            Nom de la session
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Ranked Squad, Scrims hebdo..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--fg-primary)] placeholder:text-[var(--fg-quaternary)] focus:border-[var(--primary-500)] focus:outline-none transition-colors"
          />
        </div>

        {/* Pattern */}
        <div>
          <label className="block text-sm font-bold text-[var(--fg-secondary)] mb-2">
            Fréquence
          </label>
          <select
            value={pattern}
            onChange={(e) => setPattern(e.target.value as RecurrencePattern)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--fg-primary)] focus:border-[var(--primary-500)] focus:outline-none transition-colors"
          >
            <option value="daily">Tous les jours</option>
            <option value="weekly">Toutes les semaines</option>
            <option value="biweekly">Toutes les 2 semaines</option>
            <option value="monthly">Tous les mois</option>
          </select>
        </div>

        {/* Jour de la semaine (si weekly) */}
        {pattern === 'weekly' && (
          <div>
            <label className="block text-sm font-bold text-[var(--fg-secondary)] mb-2">
              Jour de la semaine
            </label>
            <div className="grid grid-cols-7 gap-2">
              {dayLabels.map((day, index) => (
                <motion.button
                  key={day}
                  onClick={() => setDayOfWeek(index)}
                  className={`
                    py-3 rounded-lg font-bold text-sm transition-all
                    ${dayOfWeek === index 
                      ? 'bg-[var(--primary-500)] text-white' 
                      : 'bg-white/5 text-[var(--fg-tertiary)] hover:bg-white/10'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {day}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Heure */}
        <div>
          <label className="block text-sm font-bold text-[var(--fg-secondary)] mb-2">
            Heure
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--fg-primary)] focus:border-[var(--primary-500)] focus:outline-none transition-colors"
          />
        </div>

        {/* Preview */}
        <div className="p-4 rounded-xl bg-[var(--primary-500)]/5 border border-[var(--primary-500)]/20">
          <p className="text-xs text-[var(--fg-tertiary)] mb-1">
            Aperçu
          </p>
          <p className="text-sm font-bold text-[var(--primary-500)]">
            {pattern === 'weekly' && dayOfWeek !== undefined
              ? `Tous les ${dayLabelsFull[dayOfWeek].toLowerCase()}s à ${time}`
              : `${patternLabels[pattern]} à ${time}`
            }
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <motion.button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--fg-secondary)] font-bold hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Annuler
          </motion.button>
          <motion.button
            onClick={handleSave}
            disabled={!title}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[var(--primary-500)] to-[var(--secondary-500)] text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Créer
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
