import { ArrowLeft, Calendar, Clock, Plus, X, Gamepad2, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { GamePicker } from '@/app/components/GamePicker';
import { DatePicker } from '@/app/components/DatePicker';
import { TimePicker } from '@/app/components/TimePicker';
import { useTranslation } from '@/i18n/useTranslation';
import { games, Game } from '@/data/games';
import { sessionsAPI, squadsAPI } from '@/utils/api';

interface ProposeSessionScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  data?: {
    squadId?: string;
  };
}

interface Slot {
  id: string;
  date: string;
  time: string;
  duration: string;
}

export function ProposeSessionScreen({ onNavigate, showToast, data }: ProposeSessionScreenProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showGamePicker, setShowGamePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [playersNeeded, setPlayersNeeded] = useState('5');
  const [multiSlot, setMultiSlot] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([
    { id: '1', date: '', time: '', duration: '2' }
  ]);

  const addSlot = () => {
    if (slots.length >= 5) {
      showToast('Maximum 5 créneaux', 'error');
      return;
    }
    setSlots([...slots, { 
      id: Date.now().toString(), 
      date: '', 
      time: '', 
      duration: '2' 
    }]);
  };

  const removeSlot = (id: string) => {
    if (slots.length === 1) {
      showToast('Au moins 1 créneau requis', 'error');
      return;
    }
    setSlots(slots.filter(s => s.id !== id));
  };

  const updateSlot = (id: string, field: keyof Slot, value: string) => {
    setSlots(slots.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleOpenDatePicker = (slotId: string) => {
    setActiveSlotId(slotId);
    setShowDatePicker(true);
  };

  const handleOpenTimePicker = (slotId: string) => {
    setActiveSlotId(slotId);
    setShowTimePicker(true);
  };

  const handleSelectDate = (date: string) => {
    if (activeSlotId) {
      updateSlot(activeSlotId, 'date', date);
    }
  };

  const handleSelectTime = (time: string) => {
    if (activeSlotId) {
      updateSlot(activeSlotId, 'time', time);
    }
  };

  const handlePropose = async () => {
    if (!title) {
      showToast('Veuillez entrer un titre', 'error');
      return;
    }

    const invalidSlot = slots.find(s => !s.date || !s.time);
    if (invalidSlot) {
      showToast('Veuillez remplir tous les créneaux', 'error');
      return;
    }

    if (!data?.squadId) {
      showToast('Squad ID manquant', 'error');
      return;
    }

    try {
      await sessionsAPI.create(data.squadId, {
        title,
        game: selectedGame?.name || '',
        playersNeeded: parseInt(playersNeeded),
        comment,
        slots: slots.map(slot => ({
          date: slot.date,
          time: slot.time,
          duration: parseInt(slot.duration),
        })),
        multiSlot,
      });

      showToast(multiSlot 
        ? `Session proposée avec ${slots.length} créneaux au vote !` 
        : 'Session proposée avec succès !', 
        'success'
      );
      setTimeout(() => onNavigate('sessions'), 500);
    } catch (error: any) {
      console.error('Create session error:', error);
      showToast(error.message || 'Erreur lors de la création de la session', 'error');
    }
  };

  const isValid = title && slots.every(s => s.date && s.time);

  useEffect(() => {
    if (data?.squadId) {
      squadsAPI.getById(data.squadId).then(response => {
        if (response.squad) {
          const game = games.find(g => g.name === response.squad.game);
          if (game) {
            setSelectedGame(game);
          }
        }
      }).catch(error => {
        console.error('Failed to load squad:', error);
      });
    }
  }, [data?.squadId]);

  // Get min date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen pb-32 pt-safe bg-[var(--bg-base)]">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => onNavigate('sessions')}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Proposer une session
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] mt-1">
              Organise ta prochaine partie
            </p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="mb-8 bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm">
          <div className="flex gap-2">
            <button
              onClick={() => setMultiSlot(false)}
              className={`flex-1 h-11 rounded-xl font-semibold text-sm transition-all duration-200 ${
                !multiSlot
                  ? 'bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white shadow-lg shadow-[var(--primary-500)]/20'
                  : 'bg-[var(--bg-base)] text-[var(--fg-secondary)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              Session unique
            </button>
            <button
              onClick={() => setMultiSlot(true)}
              className={`flex-1 h-11 rounded-xl font-semibold text-sm transition-all duration-200 ${
                multiSlot
                  ? 'bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white shadow-lg shadow-[var(--primary-500)]/20'
                  : 'bg-[var(--bg-base)] text-[var(--fg-secondary)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              Proposer plusieurs créneaux
            </button>
          </div>
          {multiSlot && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-xs text-[var(--fg-tertiary)] font-medium mt-3"
            >
              💡 La squad votera sur chaque créneau. Le plus populaire sera confirmé.
            </motion.p>
          )}
        </div>

        {/* Form */}
        <div className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="text-sm text-[var(--fg-secondary)] mb-3 block font-semibold">
              Titre de la session
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Ranked Valorant"
              className="h-14 bg-white border-[0.5px] border-[var(--border-medium)] rounded-2xl shadow-sm focus:border-[var(--primary-500)] text-base"
            />
          </div>

          {/* Game Picker */}
          <div>
            <label className="text-sm text-[var(--fg-secondary)] mb-3 block font-semibold">
              Jeu
            </label>
            {selectedGame ? (
              <button
                onClick={() => setShowGamePicker(true)}
                className="w-full bg-white rounded-2xl p-4 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={selectedGame.image} alt={selectedGame.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-semibold text-[var(--fg-primary)]">
                    {selectedGame.name}
                  </div>
                  <div className="text-xs text-[var(--fg-tertiary)]">
                    {selectedGame.players}
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] text-xs font-semibold text-[var(--fg-secondary)]">
                  Modifier
                </div>
              </button>
            ) : (
              <button
                onClick={() => setShowGamePicker(true)}
                className="w-full h-20 rounded-2xl border-2 border-dashed border-[var(--border-medium)] hover:border-[var(--primary-500)] bg-white hover:bg-[var(--primary-50)] transition-all flex flex-col items-center justify-center gap-2 group"
              >
                <Gamepad2 className="w-8 h-8 text-[var(--fg-tertiary)] group-hover:text-[var(--primary-500)] transition-colors" strokeWidth={1.5} />
                <span className="text-sm font-semibold text-[var(--fg-tertiary)] group-hover:text-[var(--primary-500)] transition-colors">
                  Choisir un jeu
                </span>
              </button>
            )}
          </div>

          {/* Players Needed */}
          <div>
            <label className="text-sm text-[var(--fg-secondary)] mb-3 block font-semibold">
              Joueurs requis
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[2, 3, 4, 5, 6].map(n => (
                <button
                  key={n}
                  onClick={() => setPlayersNeeded(String(n))}
                  className={`h-14 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    playersNeeded === String(n)
                      ? 'bg-gradient-to-br from-[var(--secondary-500)] to-[var(--secondary-600)] text-white shadow-md shadow-[var(--secondary-500)]/20'
                      : 'bg-white border-[0.5px] border-[var(--border-medium)] text-[var(--fg-secondary)] hover:border-[var(--secondary-300)] hover:bg-[var(--secondary-50)]'
                  }`}
                >
                  <Users className="w-4 h-4 mx-auto mb-1" strokeWidth={2} />
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Slots */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm text-[var(--fg-secondary)] font-semibold">
                {multiSlot ? `Créneaux proposés (${slots.length}/5)` : 'Date et heure'}
              </label>
              {multiSlot && slots.length < 5 && (
                <button
                  onClick={addSlot}
                  className="flex items-center gap-1.5 text-sm text-[var(--primary-500)] hover:text-[var(--primary-600)] font-semibold transition-colors"
                >
                  <Plus className="w-4 h-4" strokeWidth={2} />
                  Ajouter un créneau
                </button>
              )}
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {slots.map((slot, index) => (
                  <motion.div
                    key={slot.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white rounded-2xl p-5 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
                  >
                    {multiSlot && (
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-[var(--fg-primary)]">
                          Créneau {index + 1}
                        </span>
                        {slots.length > 1 && (
                          <button
                            onClick={() => removeSlot(slot.id)}
                            className="w-8 h-8 rounded-full bg-[var(--error-50)] flex items-center justify-center hover:bg-[var(--error-100)] transition-colors"
                          >
                            <X className="w-4 h-4 text-[var(--error-600)]" strokeWidth={2} />
                          </button>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {/* Date */}
                      <div>
                        <label className="text-xs text-[var(--fg-tertiary)] mb-2 block font-semibold uppercase tracking-wider">
                          Date
                        </label>
                        <button
                          onClick={() => handleOpenDatePicker(slot.id)}
                          className="w-full h-12 px-4 bg-[var(--bg-subtle)] border-[0.5px] border-[var(--border-medium)] hover:border-[var(--primary-500)] rounded-xl text-sm text-[var(--fg-primary)] focus:border-[var(--primary-500)] transition-all flex items-center gap-2"
                        >
                          <Calendar className="w-4 h-4 text-[var(--fg-tertiary)]" strokeWidth={2} />
                          <span className="flex-1 text-left">
                            {slot.date ? new Date(slot.date + 'T00:00:00').toLocaleDateString('fr-FR', { 
                              day: '2-digit',
                              month: 'short'
                            }) : 'Choisir'}
                          </span>
                        </button>
                      </div>

                      {/* Time */}
                      <div>
                        <label className="text-xs text-[var(--fg-tertiary)] mb-2 block font-semibold uppercase tracking-wider">
                          Heure
                        </label>
                        <button
                          onClick={() => handleOpenTimePicker(slot.id)}
                          className="w-full h-12 px-4 bg-[var(--bg-subtle)] border-[0.5px] border-[var(--border-medium)] hover:border-[var(--secondary-500)] rounded-xl text-sm text-[var(--fg-primary)] focus:border-[var(--secondary-500)] transition-all flex items-center gap-2"
                        >
                          <Clock className="w-4 h-4 text-[var(--fg-tertiary)]" strokeWidth={2} />
                          <span className="flex-1 text-left">
                            {slot.time || 'Choisir'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="text-xs text-[var(--fg-tertiary)] mb-2 block font-semibold uppercase tracking-wider">
                        Durée
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {['1', '2', '3', '4'].map((duration) => (
                          <button
                            key={duration}
                            onClick={() => updateSlot(slot.id, 'duration', duration)}
                            className={`h-10 rounded-lg text-xs font-semibold transition-all duration-200 ${
                              slot.duration === duration
                                ? 'bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white shadow-md'
                                : 'bg-[var(--bg-subtle)] text-[var(--fg-secondary)] hover:bg-[var(--bg-muted)]'
                            }`}
                          >
                            {duration}h
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="text-sm text-[var(--fg-secondary)] mb-3 block font-semibold">
              Commentaire (optionnel)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Stratégie, rôles, objectifs..."
              className="w-full h-24 px-4 py-3 bg-white border-[0.5px] border-[var(--border-medium)] rounded-2xl text-sm text-[var(--fg-primary)] focus:border-[var(--primary-500)] focus:ring-2 focus:ring-[var(--primary-500)]/20 transition-all resize-none shadow-sm"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="mt-8">
          <Button
            variant="primary"
            onClick={handlePropose}
            disabled={!isValid}
            className="w-full h-14 text-base font-semibold bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] text-white rounded-xl shadow-lg shadow-[var(--primary-500)]/20 hover:shadow-xl hover:shadow-[var(--primary-500)]/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {multiSlot ? 'Proposer au vote' : 'Créer la session'}
          </Button>
        </div>
      </div>

      {/* Modals */}
      <GamePicker
        isOpen={showGamePicker}
        onClose={() => setShowGamePicker(false)}
        onSelect={setSelectedGame}
        selectedGame={selectedGame}
      />

      <DatePicker
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={handleSelectDate}
        selectedDate={activeSlotId ? slots.find(s => s.id === activeSlotId)?.date : undefined}
        minDate={today}
      />

      <TimePicker
        isOpen={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onSelect={handleSelectTime}
        selectedTime={activeSlotId ? slots.find(s => s.id === activeSlotId)?.time : undefined}
      />
    </div>
  );
}
