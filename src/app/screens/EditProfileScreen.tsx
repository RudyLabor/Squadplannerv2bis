/**
 * EDIT PROFILE SCREEN - LINEAR DESIGN SYSTEM
 * Premium, Dark, Minimal - Profile editing
 */

import { ArrowLeft, Camera, Save, Mail, User, AtSign, MapPin, Calendar, Trophy, Trash2, AlertCircle, Shield, Gamepad2, Check, ChevronDown } from 'lucide-react';
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

// Linear-style animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.02 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }
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
      showToast('Profil mis à jour', 'success');
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
    showToast('Photo sélectionnée', 'info');
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
    <div className="min-h-screen pb-24 md:pb-8 bg-[#08090a]">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="px-4 md:px-6 py-6 max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header - Linear style */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-2">
            <motion.button
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.06)] transition-all"
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-[20px] md:text-[22px] font-semibold text-[#f7f8f8]">
                Modifier le profil
              </h1>
            </div>
            <motion.button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`h-10 px-4 flex items-center gap-2 rounded-xl text-[13px] font-semibold transition-all ${
                hasChanges && !isSaving
                  ? 'bg-[#5e6dd2] text-white hover:bg-[#6a79db]'
                  : 'bg-[rgba(255,255,255,0.04)] text-[#5e6063] cursor-not-allowed'
              }`}
              whileHover={hasChanges && !isSaving ? { y: -1 } : {}}
              whileTap={hasChanges && !isSaving ? { scale: 0.98 } : {}}
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" strokeWidth={1.5} />
              )}
              {isSaving ? 'Envoi...' : 'Sauver'}
            </motion.button>
          </motion.div>

          {/* Avatar Section */}
          <motion.div variants={itemVariants}>
            <div className="p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
              <label className="flex items-center gap-2 text-[11px] font-medium text-[#5e6063] mb-4 uppercase tracking-wider">
                <Camera className="w-3.5 h-3.5 text-[#8b93ff]" strokeWidth={1.5} />
                Photo de profil
              </label>
              <div className="flex items-center gap-5">
                <div className="relative">
                  <motion.div
                    className="w-20 h-20 rounded-xl overflow-hidden ring-2 ring-[rgba(94,109,210,0.2)]"
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
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-lg bg-[#5e6dd2] text-white flex items-center justify-center shadow-lg shadow-[#5e6dd2]/20"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Camera className="w-4 h-4" strokeWidth={2} />
                  </motion.button>
                </div>
                <div>
                  <p className="text-[13px] text-[#f7f8f8] font-medium mb-1">Photo publique</p>
                  <p className="text-[12px] text-[#5e6063]">JPG, PNG ou GIF. Max 5MB.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Basic Info */}
          <motion.div variants={itemVariants}>
            <div className="p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
              <label className="flex items-center gap-2 text-[11px] font-medium text-[#5e6063] mb-4 uppercase tracking-wider">
                <User className="w-3.5 h-3.5 text-[#5e6dd2]" strokeWidth={1.5} />
                Informations de base
              </label>
              <div className="space-y-4">
                {/* Display Name */}
                <div>
                  <label className="text-[12px] text-[#8b8d90] mb-1.5 block">Nom d'affichage</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5e6063]" strokeWidth={1.5} />
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => handleChange('displayName', e.target.value)}
                      placeholder="Votre nom"
                      className="w-full h-12 pl-11 pr-4 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl text-[14px] text-[#f7f8f8] placeholder:text-[#5e6063] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] focus:border-[rgba(94,109,210,0.5)] focus:ring-2 focus:ring-[rgba(94,109,210,0.15)] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="text-[12px] text-[#8b8d90] mb-1.5 block">Nom d'utilisateur</label>
                  <div className="relative">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5e6063]" strokeWidth={1.5} />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleChange('username', e.target.value)}
                      placeholder="username"
                      className="w-full h-12 pl-11 pr-4 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl text-[14px] text-[#f7f8f8] placeholder:text-[#5e6063] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] focus:border-[rgba(94,109,210,0.5)] focus:ring-2 focus:ring-[rgba(94,109,210,0.15)] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-[12px] text-[#8b8d90] mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5e6063]" strokeWidth={1.5} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="votre@email.com"
                      className="w-full h-12 pl-11 pr-4 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl text-[14px] text-[#f7f8f8] placeholder:text-[#5e6063] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] focus:border-[rgba(94,109,210,0.5)] focus:ring-2 focus:ring-[rgba(94,109,210,0.15)] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[12px] text-[#8b8d90]">Bio</label>
                    <span className={`text-[11px] ${(formData.bio?.length || 0) > 180 ? 'text-[#f5a623]' : 'text-[#5e6063]'}`}>
                      {formData.bio?.length || 0}/200
                    </span>
                  </div>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleChange('bio', e.target.value.slice(0, 200))}
                    placeholder="Parlez de vous..."
                    rows={3}
                    className="w-full p-4 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl text-[14px] text-[#f7f8f8] placeholder:text-[#5e6063] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] focus:border-[rgba(94,109,210,0.5)] focus:ring-2 focus:ring-[rgba(94,109,210,0.15)] focus:outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Personal Info */}
          <motion.div variants={itemVariants}>
            <div className="p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
              <label className="flex items-center gap-2 text-[11px] font-medium text-[#5e6063] mb-4 uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5 text-[#4ade80]" strokeWidth={1.5} />
                Informations personnelles
              </label>
              <div className="space-y-4">
                {/* Location */}
                <div>
                  <label className="text-[12px] text-[#8b8d90] mb-1.5 block">Localisation</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5e6063]" strokeWidth={1.5} />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      placeholder="Ville, Pays"
                      className="w-full h-12 pl-11 pr-4 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl text-[14px] text-[#f7f8f8] placeholder:text-[#5e6063] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] focus:border-[rgba(94,109,210,0.5)] focus:ring-2 focus:ring-[rgba(94,109,210,0.15)] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Birthday */}
                <div>
                  <label className="text-[12px] text-[#8b8d90] mb-1.5 block">Date de naissance</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5e6063]" strokeWidth={1.5} />
                    <input
                      type="date"
                      value={formData.birthday}
                      onChange={(e) => handleChange('birthday', e.target.value)}
                      className="w-full h-12 pl-11 pr-4 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl text-[14px] text-[#f7f8f8] placeholder:text-[#5e6063] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] focus:border-[rgba(94,109,210,0.5)] focus:ring-2 focus:ring-[rgba(94,109,210,0.15)] focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Gaming Preferences */}
          <motion.div variants={itemVariants}>
            <div className="p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
              <label className="flex items-center gap-2 text-[11px] font-medium text-[#5e6063] mb-4 uppercase tracking-wider">
                <Gamepad2 className="w-3.5 h-3.5 text-[#f5a623]" strokeWidth={1.5} />
                Préférences de jeu
              </label>
              <div className="space-y-4">
                {/* Favorite Game */}
                <div>
                  <label className="text-[12px] text-[#8b8d90] mb-1.5 block">Jeu favori</label>
                  <div className="relative">
                    <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5e6063]" strokeWidth={1.5} />
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5e6063]" strokeWidth={1.5} />
                    <select
                      value={formData.favoriteGame}
                      onChange={(e) => handleChange('favoriteGame', e.target.value)}
                      className="w-full h-12 pl-11 pr-10 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl text-[14px] text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] focus:border-[rgba(94,109,210,0.5)] focus:ring-2 focus:ring-[rgba(94,109,210,0.15)] focus:outline-none transition-all appearance-none cursor-pointer"
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

                {/* Play Style */}
                <div>
                  <label className="text-[12px] text-[#8b8d90] mb-1.5 block">Style de jeu</label>
                  <div className="relative">
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5e6063]" strokeWidth={1.5} />
                    <select
                      value={formData.playStyle}
                      onChange={(e) => handleChange('playStyle', e.target.value)}
                      className="w-full h-12 px-4 pr-10 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl text-[14px] text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] focus:border-[rgba(94,109,210,0.5)] focus:ring-2 focus:ring-[rgba(94,109,210,0.15)] focus:outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="Aggressive">Agressif</option>
                      <option value="Defensive">Défensif</option>
                      <option value="Balanced">Équilibré</option>
                      <option value="Support">Support</option>
                      <option value="Strategic">Stratégique</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div variants={itemVariants}>
            <div className="p-5 rounded-xl bg-[rgba(248,113,113,0.05)] border border-[rgba(248,113,113,0.15)]">
              <label className="flex items-center gap-2 text-[11px] font-medium text-[#f87171] mb-3 uppercase tracking-wider">
                <AlertCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                Zone dangereuse
              </label>
              <p className="text-[13px] text-[#8b8d90] mb-4">
                La suppression de votre compte est irréversible. Toutes vos données seront perdues.
              </p>
              <motion.button
                onClick={handleDeleteAccount}
                className="h-10 px-4 flex items-center gap-2 rounded-xl bg-[rgba(248,113,113,0.1)] border border-[rgba(248,113,113,0.2)] text-[#f87171] text-[13px] font-medium hover:bg-[rgba(248,113,113,0.15)] transition-all"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                Supprimer le compte
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Unsaved changes indicator */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 bg-[rgba(255,255,255,0.06)] backdrop-blur-sm rounded-xl px-5 py-3 border border-[rgba(255,255,255,0.1)] z-50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="text-[13px] text-[#f7f8f8] font-medium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#f5a623] animate-pulse" />
              Modifications non sauvegardées
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EditProfileScreen;
