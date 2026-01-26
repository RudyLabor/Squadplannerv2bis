import { ArrowLeft, Users, Copy, Check, Gamepad2, Clock, Calendar } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { GamePicker } from '@/app/components/GamePicker';
import { useTranslation } from '@/i18n/useTranslation';
import { Game, categoryLabels } from '@/data/games';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { squadsAPI } from '@/utils/api';

interface CreateSquadScreenProps {
  onNavigate: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const timezones = [
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'America/New_York', label: 'New York (EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)' },
];

const preferredDays = [
  { value: 'monday', label: 'Lun', full: 'Lundi' },
  { value: 'tuesday', label: 'Mar', full: 'Mardi' },
  { value: 'wednesday', label: 'Mer', full: 'Mercredi' },
  { value: 'thursday', label: 'Jeu', full: 'Jeudi' },
  { value: 'friday', label: 'Ven', full: 'Vendredi' },
  { value: 'saturday', label: 'Sam', full: 'Samedi' },
  { value: 'sunday', label: 'Dim', full: 'Dimanche' },
];

export function CreateSquadScreen({ onNavigate, showToast }: CreateSquadScreenProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<'setup' | 'invite'>('setup');
  const [squadName, setSquadName] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showGamePicker, setShowGamePicker] = useState(false);
  const [timezone, setTimezone] = useState('Europe/Paris');
  const [sessionDuration, setSessionDuration] = useState('2');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [inviteLinkCopied, setInviteLinkCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createdSquadId, setCreatedSquadId] = useState<string | null>(null);

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleCreate = async () => {
    if (!squadName || !selectedGame) {
      showToast('Veuillez remplir tous les champs', 'error');
      return;
    }

    setIsCreating(true);

    try {
      const { squad } = await squadsAPI.create({
        name: squadName,
        game: selectedGame.name,
        avatar: selectedGame.image,
        description: `Squad ${selectedGame.name} • ${selectedDays.length > 0 ? selectedDays.map(d => preferredDays.find(pd => pd.value === d)?.full).join(', ') : 'Flexible'}`,
        timezone,
        sessionDuration: parseInt(sessionDuration),
        preferredDays: selectedDays,
      });

      setCreatedSquadId(squad.id);
      setStep('invite');
      showToast('Squad créée avec succès !', 'success');
    } catch (error: any) {
      console.error('Create squad error:', error);
      showToast(error.message || 'Erreur lors de la création de la squad', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyLink = async () => {
    const inviteLink = createdSquadId 
      ? `https://squadplanner.app/join/${createdSquadId}`
      : 'https://squadplanner.app/invite/abc123';
    
    await navigator.clipboard.writeText(inviteLink);
    setInviteLinkCopied(true);
    showToast('Lien copié !', 'success');
    setTimeout(() => setInviteLinkCopied(false), 2000);
  };

  if (step === 'invite') {
    return (
      <div className="min-h-screen pb-24 pt-safe bg-[var(--bg-base)]">
        <div className="px-4 py-8 max-w-2xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-10">
            <button
              onClick={() => onNavigate('squads')}
              className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
            </button>
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Inviter des joueurs
            </h1>
          </div>

          {/* Success Message */}
          <div className="bg-gradient-to-br from-[var(--primary-50)] to-white rounded-3xl p-8 mb-8 border-[0.5px] border-[var(--primary-200)] shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] flex items-center justify-center mb-5 shadow-lg shadow-[var(--primary-500)]/20">
              <Check className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-semibold text-[var(--fg-primary)] mb-3 tracking-tight">
              Squad créée !
            </h2>
            <p className="text-base text-[var(--fg-secondary)]">
              Partagez ce lien avec vos amis pour les inviter.
            </p>
          </div>

          {/* Invite Link */}
          <div className="bg-white rounded-3xl p-6 border-[0.5px] border-[var(--border-subtle)] shadow-md mb-6">
            <label className="text-sm font-semibold text-[var(--fg-secondary)] mb-3 block">
              Lien d'invitation
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={createdSquadId ? `https://squadplanner.app/join/${createdSquadId}` : 'https://squadplanner.app/invite/abc123'}
                readOnly
                className="flex-1 px-4 py-3 rounded-xl border-[0.5px] border-[var(--border-medium)] bg-[var(--bg-subtle)] text-sm text-[var(--fg-secondary)] font-mono"
              />
              <Button
                variant="primary"
                onClick={handleCopyLink}
                className="px-6 bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white rounded-xl shadow-lg shadow-[var(--primary-500)]/20"
              >
                {inviteLinkCopied ? (
                  <>
                    <Check className="w-4 h-4" strokeWidth={2} />
                    Copié
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" strokeWidth={2} />
                    Copier
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Squad Preview */}
          {selectedGame && (
            <div className="bg-white rounded-3xl overflow-hidden border-[0.5px] border-[var(--border-subtle)] shadow-md mb-6">
              <div className="aspect-video relative">
                <ImageWithFallback
                  src={selectedGame.image}
                  alt={selectedGame.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                    {squadName}
                  </h3>
                  <div className="flex items-center gap-3 text-white/90">
                    <span className="text-sm font-medium">{selectedGame.name}</span>
                    <span className="text-sm">•</span>
                    <span className="text-sm font-medium">{categoryLabels[selectedGame.category]}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              onClick={() => onNavigate('squads')}
              className="h-14 rounded-xl border-[0.5px] border-[var(--border-medium)] shadow-sm"
            >
              Voir mes squads
            </Button>
            <Button
              variant="primary"
              onClick={() => createdSquadId && onNavigate('squad-detail', { id: createdSquadId })}
              className="h-14 bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white rounded-xl shadow-lg shadow-[var(--primary-500)]/20"
            >
              Ouvrir la squad
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-safe bg-[var(--bg-base)]">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => onNavigate('home')}
            className="w-12 h-12 rounded-2xl bg-white border-[0.5px] border-[var(--border-medium)] flex items-center justify-center hover:border-[var(--border-strong)] shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--fg-primary)] tracking-tight">
              Créer une Squad
            </h1>
            <p className="text-sm text-[var(--fg-tertiary)] mt-1">
              Configure ta nouvelle équipe en 2 minutes
            </p>
          </div>
        </div>

        {/* Squad Name */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-[var(--fg-secondary)] mb-3 block">
            Nom de la Squad
          </label>
          <Input
            value={squadName}
            onChange={(e) => setSquadName(e.target.value)}
            placeholder="Les Légendes"
            className="h-14 rounded-xl border-[0.5px] border-[var(--border-medium)] focus:border-[var(--primary-500)] text-base"
            maxLength={30}
          />
          <p className="text-xs text-[var(--fg-tertiary)] mt-2">
            {squadName.length}/30 caractères
          </p>
        </div>

        {/* Game Selection - PREMIUM MODALE */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-[var(--fg-secondary)] mb-3 block">
            Jeu Principal
          </label>
          
          {selectedGame ? (
            <motion.button
              onClick={() => setShowGamePicker(true)}
              className="w-full bg-white rounded-2xl overflow-hidden border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all"
              whileHover={{ y: -2 }}
            >
              <div className="aspect-video relative">
                <ImageWithFallback
                  src={selectedGame.image}
                  alt={selectedGame.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {selectedGame.name}
                  </h3>
                  <p className="text-sm text-white/80">
                    {categoryLabels[selectedGame.category]} • {selectedGame.players}
                  </p>
                </div>
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-xl border border-white/30">
                  <span className="text-xs font-semibold text-white">Modifier</span>
                </div>
              </div>
            </motion.button>
          ) : (
            <button
              onClick={() => setShowGamePicker(true)}
              className="w-full h-32 rounded-2xl border-2 border-dashed border-[var(--border-medium)] hover:border-[var(--primary-500)] bg-white hover:bg-[var(--primary-50)] transition-all flex flex-col items-center justify-center gap-3 group"
            >
              <Gamepad2 className="w-10 h-10 text-[var(--fg-tertiary)] group-hover:text-[var(--primary-500)] transition-colors" strokeWidth={1.5} />
              <span className="text-sm font-semibold text-[var(--fg-tertiary)] group-hover:text-[var(--primary-500)] transition-colors">
                Choisir un jeu
              </span>
            </button>
          )}
        </div>

        {/* Preferred Days */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-[var(--fg-secondary)] mb-3 block">
            Jours de jeu préférés (optionnel)
          </label>
          <div className="grid grid-cols-7 gap-2">
            {preferredDays.map((day) => (
              <button
                key={day.value}
                onClick={() => toggleDay(day.value)}
                className={`aspect-square rounded-xl text-xs font-semibold transition-all duration-200 ${
                  selectedDays.includes(day.value)
                    ? 'bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white shadow-md shadow-[var(--primary-500)]/20'
                    : 'bg-white border-[0.5px] border-[var(--border-medium)] text-[var(--fg-secondary)] hover:border-[var(--primary-300)] hover:bg-[var(--primary-50)]'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
          {selectedDays.length > 0 && (
            <p className="text-xs text-[var(--fg-tertiary)] mt-2">
              {selectedDays.length} jour{selectedDays.length > 1 ? 's' : ''} sélectionné{selectedDays.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Timezone */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-[var(--fg-secondary)] mb-3 block">
            Fuseau horaire
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full h-14 px-4 rounded-xl border-[0.5px] border-[var(--border-medium)] focus:border-[var(--primary-500)] focus:outline-none text-base bg-white"
          >
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        {/* Session Duration */}
        <div className="mb-8">
          <label className="text-sm font-semibold text-[var(--fg-secondary)] mb-3 block">
            Durée typique des sessions
          </label>
          <div className="grid grid-cols-4 gap-2">
            {['1', '2', '3', '4'].map((duration) => (
              <button
                key={duration}
                onClick={() => setSessionDuration(duration)}
                className={`h-14 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  sessionDuration === duration
                    ? 'bg-gradient-to-br from-[var(--secondary-500)] to-[var(--secondary-600)] text-white shadow-md shadow-[var(--secondary-500)]/20'
                    : 'bg-white border-[0.5px] border-[var(--border-medium)] text-[var(--fg-secondary)] hover:border-[var(--secondary-300)] hover:bg-[var(--secondary-50)]'
                }`}
              >
                {duration}h
              </button>
            ))}
          </div>
        </div>

        {/* Create Button */}
        <Button
          variant="primary"
          onClick={handleCreate}
          disabled={!squadName || !selectedGame || isCreating}
          className="w-full h-14 text-base font-semibold bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] text-white rounded-xl shadow-lg shadow-[var(--primary-500)]/20 hover:shadow-xl hover:shadow-[var(--primary-500)]/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Création en cours...
            </>
          ) : (
            <>
              <Users className="w-5 h-5" strokeWidth={2} />
              Créer la Squad
            </>
          )}
        </Button>
      </div>

      {/* Game Picker Modal */}
      <GamePicker
        isOpen={showGamePicker}
        onClose={() => setShowGamePicker(false)}
        onSelect={setSelectedGame}
        selectedGame={selectedGame}
      />
    </div>
  );
}
