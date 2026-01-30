import { ArrowLeft, Camera, Save, Mail, User, AtSign, MapPin, Calendar, Trophy, Trash2, Sparkles, Shield, Gamepad2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useHaptic } from '@/app/hooks/useHaptic';
import { useUser } from '@/app/contexts/UserContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { uploadService } from '@/app/services/upload';
import { Button, Card, IconButton, Input, Textarea } from '@/design-system';

interface EditProfileScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export function EditProfileScreen({ onNavigate, showToast }: EditProfileScreenProps) {
  const { impact } = useHaptic();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userProfile, updateUserProfile } = useUser();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    displayName: userProfile.displayName,
    username: userProfile.username,
    email: userProfile.email,
    bio: userProfile.bio,
    location: userProfile.location,
    birthday: userProfile.birthday,
    favoriteGame: userProfile.favoriteGame,
    playStyle: userProfile.playStyle,
  });

  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatarUrl);
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setHasChanges(true);
  };

  const handleSave = async () => {
    impact();
    setIsSaving(true);

    try {
      let finalAvatarUrl = avatarUrl;

      if (pendingAvatarFile && user) {
        showToast('Téléchargement de l\'avatar...', 'info');
        finalAvatarUrl = await uploadService.uploadAvatar(pendingAvatarFile, user.id);
      }

      const { authAPI } = await import('@/utils/api');
      await authAPI.updateProfile({
        display_name: formData.displayName,
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        location: formData.location,
        birthday: formData.birthday,
        favorite_game: formData.favoriteGame,
        play_style: formData.playStyle,
        avatar_url: finalAvatarUrl,
      });

      updateUserProfile({ ...formData, avatarUrl: finalAvatarUrl });
      showToast('Profil mis à jour avec succès !', 'success');
      setHasChanges(false);
      setPendingAvatarFile(null);

      setTimeout(() => onNavigate('profile'), 500);
    } catch (error: any) {
      console.error('Save profile error:', error);
      showToast(error.message || 'Erreur lors de la sauvegarde', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangeAvatar = () => {
    impact();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('L\'image ne doit pas dépasser 5MB', 'error');
      return;
    }

    if (!file.type.startsWith('image/')) {
      showToast('Le fichier doit être une image', 'error');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);
    setPendingAvatarFile(file);
    setHasChanges(true);
    showToast('Photo de profil sélectionnée !', 'info');
  };

  const handleDeleteAccount = () => {
    impact();
    const confirmed = window.confirm(
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.'
    );
    if (confirmed) {
      showToast('Compte supprimé', 'error');
      onNavigate('login');
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-[var(--color-primary-50)] via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[var(--color-primary-400)]/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-20 bg-[var(--bg-elevated)]/70 backdrop-blur-xl border-b border-[var(--border-subtle)]">
        <div className="px-4 h-16 flex items-center justify-between max-w-2xl mx-auto">
          <IconButton
            aria-label="Retour"
            icon={<ArrowLeft className="w-5 h-5" strokeWidth={2} />}
            variant="secondary"
            onClick={() => onNavigate('profile')}
          />

          <h1 className="text-lg font-bold text-[var(--fg-primary)] tracking-tight">Modifier le profil</h1>

          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            loading={isSaving}
            icon={!isSaving ? <Save className="w-4 h-4" strokeWidth={2} /> : undefined}
            size="sm"
          >
            {isSaving ? 'Envoi...' : 'Sauver'}
          </Button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="relative z-10 px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Avatar Section */}
          <motion.div variants={itemVariants}>
            <Card variant="elevated" padding="lg" className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm border-[var(--border-subtle)]">
              <h2 className="text-base font-bold text-[var(--fg-primary)] mb-4 flex items-center gap-2 tracking-tight">
                <Camera className="w-5 h-5 text-[var(--color-primary-500)]" />
                Photo de profil
              </h2>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <motion.div
                    className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-[var(--color-primary-100)] shadow-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    <ImageWithFallback
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <motion.button
                    onClick={handleChangeAvatar}
                    className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary-500)] to-purple-500 text-white flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Camera className="w-5 h-5" strokeWidth={2} />
                  </motion.button>
                </div>
                <div>
                  <p className="text-sm text-[var(--fg-secondary)] font-medium mb-1">Photo de profil publique</p>
                  <p className="text-xs text-[var(--fg-tertiary)]">JPG, PNG ou GIF. Max 5MB.</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Basic Info */}
          <motion.div variants={itemVariants}>
            <Card variant="elevated" padding="lg" className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm border-[var(--border-subtle)]">
              <h2 className="text-base font-bold text-[var(--fg-primary)] mb-4 flex items-center gap-2 tracking-tight">
                <User className="w-5 h-5 text-[var(--color-primary-500)]" />
                Informations de base
              </h2>
              <div className="space-y-4">
                <Input
                  label="Nom d'affichage"
                  value={formData.displayName}
                  onChange={(e) => handleChange('displayName', e.target.value)}
                  placeholder="Votre nom"
                  icon={<User className="w-5 h-5" />}
                  size="lg"
                />

                <Input
                  label="Nom d'utilisateur"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  placeholder="username"
                  icon={<AtSign className="w-5 h-5" />}
                  size="lg"
                />

                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="votre@email.com"
                  icon={<Mail className="w-5 h-5" />}
                  size="lg"
                />

                <div>
                  <Textarea
                    label="Bio"
                    value={formData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    placeholder="Parlez de vous..."
                    rows={3}
                  />
                  <p className="text-xs text-[var(--fg-tertiary)] mt-1.5">{formData.bio?.length || 0}/200 caractères</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Personal Info */}
          <motion.div variants={itemVariants}>
            <Card variant="elevated" padding="lg" className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm border-[var(--border-subtle)]">
              <h2 className="text-base font-bold text-[var(--fg-primary)] mb-4 flex items-center gap-2 tracking-tight">
                <Shield className="w-5 h-5 text-[var(--color-primary-500)]" />
                Informations personnelles
              </h2>
              <div className="space-y-4">
                <Input
                  label="Localisation"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Ville, Pays"
                  icon={<MapPin className="w-5 h-5" />}
                  size="lg"
                />

                <Input
                  label="Date de naissance"
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => handleChange('birthday', e.target.value)}
                  icon={<Calendar className="w-5 h-5" />}
                  size="lg"
                />
              </div>
            </Card>
          </motion.div>

          {/* Gaming Preferences */}
          <motion.div variants={itemVariants}>
            <Card variant="elevated" padding="lg" className="bg-[var(--bg-elevated)]/80 backdrop-blur-sm border-[var(--border-subtle)]">
              <h2 className="text-base font-bold text-[var(--fg-primary)] mb-4 flex items-center gap-2 tracking-tight">
                <Gamepad2 className="w-5 h-5 text-[var(--color-primary-500)]" />
                Préférences de jeu
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--fg-secondary)] mb-2">
                    Jeu favori
                  </label>
                  <div className="relative">
                    <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--fg-tertiary)] z-10" />
                    <select
                      value={formData.favoriteGame}
                      onChange={(e) => handleChange('favoriteGame', e.target.value)}
                      className="w-full h-12 pl-12 pr-4 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)] text-[var(--fg-primary)] text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/30 appearance-none"
                    >
                      <option value="Valorant">Valorant</option>
                      <option value="CS2">Counter-Strike 2</option>
                      <option value="League of Legends">League of Legends</option>
                      <option value="Apex Legends">Apex Legends</option>
                      <option value="Overwatch 2">Overwatch 2</option>
                      <option value="Fortnite">Fortnite</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--fg-secondary)] mb-2">
                    Style de jeu
                  </label>
                  <select
                    value={formData.playStyle}
                    onChange={(e) => handleChange('playStyle', e.target.value)}
                    className="w-full h-12 px-4 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)] text-[var(--fg-primary)] text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/30 appearance-none"
                  >
                    <option value="Aggressive">Agressif</option>
                    <option value="Defensive">Défensif</option>
                    <option value="Balanced">Équilibré</option>
                    <option value="Support">Support</option>
                    <option value="Strategic">Stratégique</option>
                  </select>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Danger Zone */}
          <motion.div variants={itemVariants}>
            <Card variant="elevated" padding="lg" className="bg-gradient-to-br from-[var(--color-error-50)] to-orange-50 border-[var(--color-error-200)]/50">
              <h2 className="text-base font-bold text-[var(--color-error-700)] mb-2 flex items-center gap-2 tracking-tight">
                <Trash2 className="w-5 h-5" strokeWidth={2} />
                Zone dangereuse
              </h2>
              <p className="text-sm text-[var(--color-error-600)] mb-4">
                La suppression de votre compte est irréversible. Toutes vos données seront perdues.
              </p>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                icon={<Trash2 className="w-4 h-4" strokeWidth={2} />}
              >
                Supprimer le compte
              </Button>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Unsaved changes indicator */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[var(--bg-elevated)]/90 backdrop-blur-sm rounded-2xl px-6 py-3 border border-[var(--border-subtle)] shadow-xl z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <p className="text-sm text-[var(--fg-secondary)] font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--color-primary-500)]" />
              Modifications non sauvegardées
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EditProfileScreen;
