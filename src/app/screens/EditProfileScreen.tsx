import { ArrowLeft, Camera, Save, Mail, User, AtSign, MapPin, Calendar, Trophy, Trash2, Sparkles, Shield, Gamepad2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useHaptic } from '@/app/hooks/useHaptic';
import { useUser } from '@/app/contexts/UserContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { uploadService } from '@/app/services/upload';

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
    <div className="min-h-screen pb-24 pt-safe bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl border-b border-white/50">
        <div className="px-4 h-16 flex items-center justify-between max-w-2xl mx-auto">
          <motion.button
            onClick={() => onNavigate('profile')}
            className="w-11 h-11 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
          </motion.button>

          <h1 className="text-lg font-bold text-gray-800">Modifier le profil</h1>

          <motion.button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={`h-11 px-5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              hasChanges && !isSaving
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={hasChanges && !isSaving ? { scale: 1.02 } : {}}
            whileTap={hasChanges && !isSaving ? { scale: 0.98 } : {}}
          >
            {isSaving ? (
              <motion.div
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <Save className="w-4 h-4" strokeWidth={2} />
            )}
            {isSaving ? 'Envoi...' : 'Sauver'}
          </motion.button>
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
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg"
          >
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-indigo-500" />
              Photo de profil
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <motion.div
                  className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-indigo-100 shadow-lg"
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
                  className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Camera className="w-5 h-5" strokeWidth={2} />
                </motion.button>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Photo de profil publique</p>
                <p className="text-xs text-gray-400">JPG, PNG ou GIF. Max 5MB.</p>
              </div>
            </div>
          </motion.div>

          {/* Basic Info */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg"
          >
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" />
              Informations de base
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Nom d'affichage
                </label>
                <input
                  value={formData.displayName}
                  onChange={(e) => handleChange('displayName', e.target.value)}
                  placeholder="Votre nom"
                  className="w-full h-12 px-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 text-gray-800 placeholder:text-gray-400 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    value={formData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    placeholder="username"
                    className="w-full h-12 pl-12 pr-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 text-gray-800 placeholder:text-gray-400 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full h-12 pl-12 pr-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 text-gray-800 placeholder:text-gray-400 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder="Parlez de vous..."
                  rows={3}
                  className="w-full p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 text-gray-800 placeholder:text-gray-400 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1.5">{formData.bio?.length || 0}/200 caractères</p>
              </div>
            </div>
          </motion.div>

          {/* Personal Info */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg"
          >
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-500" />
              Informations personnelles
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Localisation
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="Ville, Pays"
                    className="w-full h-12 pl-12 pr-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 text-gray-800 placeholder:text-gray-400 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Date de naissance
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => handleChange('birthday', e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Gaming Preferences */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg"
          >
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-indigo-500" />
              Préférences de jeu
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Jeu favori
                </label>
                <div className="relative">
                  <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={formData.favoriteGame}
                    onChange={(e) => handleChange('favoriteGame', e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 appearance-none"
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
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Style de jeu
                </label>
                <select
                  value={formData.playStyle}
                  onChange={(e) => handleChange('playStyle', e.target.value)}
                  className="w-full h-12 px-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 appearance-none"
                >
                  <option value="Aggressive">Agressif</option>
                  <option value="Defensive">Défensif</option>
                  <option value="Balanced">Équilibré</option>
                  <option value="Support">Support</option>
                  <option value="Strategic">Stratégique</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200/50 shadow-lg"
          >
            <h2 className="text-base font-bold text-red-700 mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5" strokeWidth={2} />
              Zone dangereuse
            </h2>
            <p className="text-sm text-red-600 mb-4">
              La suppression de votre compte est irréversible. Toutes vos données seront perdues.
            </p>
            <motion.button
              onClick={handleDeleteAccount}
              className="h-11 px-5 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Trash2 className="w-4 h-4" strokeWidth={2} />
              Supprimer le compte
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Unsaved changes indicator */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/50 shadow-xl z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Modifications non sauvegardées
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EditProfileScreen;
