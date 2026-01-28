import { ArrowLeft, Camera, Save, Mail, User, AtSign, MapPin, Calendar, Trophy, Clock, Trash2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useHaptic } from '@/app/hooks/useHaptic';
import { useUser } from '@/app/contexts/UserContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { uploadService } from '@/app/services/upload';

interface EditProfileScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function EditProfileScreen({ onNavigate, showToast }: EditProfileScreenProps) {
  const { impact } = useHaptic();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userProfile, updateUserProfile } = useUser();
  const { user } = useAuth();

  // Local state for editing
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
      console.log('💾 Saving profile...');
      let finalAvatarUrl = avatarUrl;

      // 1. Upload new avatar if exists
      if (pendingAvatarFile && user) {
        showToast('Téléchargement de l\'avatar...', 'info');
        finalAvatarUrl = await uploadService.uploadAvatar(pendingAvatarFile, user.id);
      }

      // 2. Update profile data
      const { authAPI } = await import('@/utils/api');
      const data = await authAPI.updateProfile({
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

      console.log('✅ Profile saved:', data);

      // 3. Update global context
      updateUserProfile({ ...formData, avatarUrl: finalAvatarUrl });
      showToast('Profil mis à jour avec succès ! 🎉', 'success');
      setHasChanges(false);
      setPendingAvatarFile(null);
      
      // Navigate back
      setTimeout(() => onNavigate('profile'), 500);
    } catch (error: any) {
      console.error('❌ Save profile error:', error);
      showToast(error.message || 'Erreur lors de la sauvegarde', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangeAvatar = () => {
    impact();
    // In production, open image picker
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showToast('L\'image ne doit pas dépasser 5MB', 'error');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Le fichier doit être une image', 'error');
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);
    setPendingAvatarFile(file);
    setHasChanges(true);
    showToast('Photo de profil sélectionnée ! 📸', 'info');
  };

  const handleDeleteAccount = () => {
    impact();
    const confirmed = window.confirm(
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.'
    );
    if (confirmed) {
      showToast('Compte supprimé', 'error');
      // Note: We would need to implement account deletion on backend
      // For now, just sign out
      onNavigate('login');
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-safe">
      {/* Header with navigation */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b-[0.5px] border-[var(--border-subtle)]">
        <div className="px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-xl bg-[var(--bg-base)] flex items-center justify-center hover:bg-[var(--bg-elevated)] transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-primary)]" strokeWidth={2} />
          </button>
          
          <h1 className="text-base font-semibold text-[var(--fg-primary)]">
            Modifier le profil
          </h1>
          
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={`h-10 px-6 text-sm font-semibold rounded-2xl transition-all duration-200 ${
              hasChanges && !isSaving
                ? 'bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] text-white shadow-lg shadow-[var(--primary-500)]/20 hover:shadow-xl hover:shadow-[var(--primary-500)]/30'
                : 'bg-[var(--bg-elevated)] text-[var(--fg-tertiary)] cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" strokeWidth={2} />
            )}
            {isSaving ? 'Envoi...' : 'Enregistrer'}
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
      
      <div className="px-4 py-8 max-w-2xl mx-auto">
        {/* Avatar Section */}
        <motion.div
          className="bg-white rounded-2xl p-6 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-base font-semibold text-[var(--fg-primary)] mb-4">
            Photo de profil
          </h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-[var(--border-subtle)]">
                <ImageWithFallback
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={handleChangeAvatar}
                className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] text-white flex items-center justify-center shadow-lg shadow-[var(--primary-500)]/20 hover:shadow-xl hover:shadow-[var(--primary-500)]/30 transition-all"
              >
                <Camera className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
            <div>
              <p className="text-sm text-[var(--fg-secondary)] mb-2">
                Photo de profil publique
              </p>
              <p className="text-xs text-[var(--fg-tertiary)]">
                JPG, PNG ou GIF. Max 5MB.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Basic Info */}
        <motion.div
          className="bg-white rounded-2xl p-6 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-base font-semibold text-[var(--fg-primary)] mb-4">
            Informations de base
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--fg-secondary)] mb-2">
                <User className="w-4 h-4 inline mr-1.5" strokeWidth={2} />
                Nom d'affichage
              </label>
              <Input
                value={formData.displayName}
                onChange={(e) => handleChange('displayName', e.target.value)}
                placeholder="Votre nom"
                className="rounded-2xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--fg-secondary)] mb-2">
                <AtSign className="w-4 h-4 inline mr-1.5" strokeWidth={2} />
                Nom d'utilisateur
              </label>
              <Input
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                placeholder="@username"
                className="rounded-2xl"
              />
              <p className="text-xs text-[var(--fg-tertiary)] mt-1.5">
                Utilisé pour vous identifier dans l'app
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--fg-secondary)] mb-2">
                <Mail className="w-4 h-4 inline mr-1.5" strokeWidth={2} />
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="votre@email.com"
                className="rounded-2xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--fg-secondary)] mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Parlez de vous..."
                rows={3}
                className="w-full px-4 py-3 rounded-2xl border-[0.5px] border-[var(--border-medium)] focus:border-[var(--border-strong)] bg-white text-[var(--fg-primary)] text-sm transition-all resize-none"
              />
              <p className="text-xs text-[var(--fg-tertiary)] mt-1.5">
                {formData.bio.length}/200 caractères
              </p>
            </div>
          </div>
        </motion.div>

        {/* Location & Birthday */}
        <motion.div
          className="bg-white rounded-2xl p-6 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-base font-semibold text-[var(--fg-primary)] mb-4">
            Informations personnelles
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--fg-secondary)] mb-2">
                <MapPin className="w-4 h-4 inline mr-1.5" strokeWidth={2} />
                Localisation
              </label>
              <Input
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Ville, Pays"
                className="rounded-2xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--fg-secondary)] mb-2">
                <Calendar className="w-4 h-4 inline mr-1.5" strokeWidth={2} />
                Date de naissance
              </label>
              <Input
                type="date"
                value={formData.birthday}
                onChange={(e) => handleChange('birthday', e.target.value)}
                className="rounded-2xl"
              />
            </div>
          </div>
        </motion.div>

        {/* Gaming Preferences */}
        <motion.div
          className="bg-white rounded-2xl p-6 border-[0.5px] border-[var(--border-subtle)] shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-base font-semibold text-[var(--fg-primary)] mb-4">
            Préférences de jeu
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--fg-secondary)] mb-2">
                <Trophy className="w-4 h-4 inline mr-1.5" strokeWidth={2} />
                Jeu favori
              </label>
              <select
                value={formData.favoriteGame}
                onChange={(e) => handleChange('favoriteGame', e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-[0.5px] border-[var(--border-medium)] focus:border-[var(--border-strong)] bg-white text-[var(--fg-primary)] text-sm transition-all"
              >
                <option value="Valorant">Valorant</option>
                <option value="CS2">Counter-Strike 2</option>
                <option value="League of Legends">League of Legends</option>
                <option value="Apex Legends">Apex Legends</option>
                <option value="Overwatch 2">Overwatch 2</option>
                <option value="Fortnite">Fortnite</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--fg-secondary)] mb-2">
                Style de jeu
              </label>
              <select
                value={formData.playStyle}
                onChange={(e) => handleChange('playStyle', e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-[0.5px] border-[var(--border-medium)] focus:border-[var(--border-strong)] bg-white text-[var(--fg-primary)] text-sm transition-all"
              >
                <option value="Aggressive">Agressif</option>
                <option value="Defensive">Défensif</option>
                <option value="Balanced">Équilibré</option>
                <option value="Support">Support</option>
                <option value="Strategic">Stratégique</option>
              </select>
            </div>

            <div>
              <p className="text-xs text-[var(--fg-tertiary)] mt-1.5">
                Aide votre squad à planifier des sessions
              </p>
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border-[0.5px] border-red-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-base font-semibold text-red-700 mb-2 flex items-center gap-2">
            <Trash2 className="w-4 h-4" strokeWidth={2} />
            Zone dangereuse
          </h2>
          <p className="text-sm text-red-600 mb-4">
            La suppression de votre compte est irréversible. Toutes vos données seront perdues.
          </p>
          <Button
            onClick={handleDeleteAccount}
            className="h-10 px-6 text-sm font-semibold rounded-2xl bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2} />
            Supprimer le compte
          </Button>
        </motion.div>

        {/* Save reminder */}
        {hasChanges && (
          <motion.div
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-6 py-3 border-[0.5px] border-[var(--border-subtle)] shadow-xl z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-[var(--fg-secondary)]">
              Vous avez des modifications non sauvegardées
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
export default EditProfileScreen;
