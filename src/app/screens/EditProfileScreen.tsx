/**
 * EDIT PROFILE SCREEN - LINEAR DESIGN SYSTEM
 * Premium, Dark, Minimal - Profile editing
 * Fully redesigned with Linear.app aesthetics
 */

import { ArrowLeft, Camera, Save, Mail, User, AtSign, MapPin, Calendar, Trophy, Trash2, AlertCircle, Shield, Gamepad2, ChevronDown, Loader2 } from 'lucide-react';
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

// Linear-style animations - subtle and fast
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.01 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }
  }
};

// Reusable Input component with Linear styling
interface InputFieldProps {
  label: string;
  icon?: React.ReactNode;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  showCount?: boolean;
}

function InputField({ label, icon, type = 'text', value, onChange, placeholder, maxLength, showCount }: InputFieldProps) {
  const charCount = value?.length || 0;
  const isNearLimit = maxLength && charCount > maxLength * 0.9;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[13px] text-[#a2a3a5] font-medium">{label}</label>
        {showCount && maxLength && (
          <span className={`text-[11px] tabular-nums ${isNearLimit ? 'text-[#f5a623]' : 'text-[#5e6063]'}`}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>
      <div className="relative group">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5e6063] group-focus-within:text-[#8b93ff] transition-colors duration-150">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(maxLength ? e.target.value.slice(0, maxLength) : e.target.value)}
          placeholder={placeholder}
          className={`
            w-full h-11 ${icon ? 'pl-10' : 'pl-3.5'} pr-3.5
            bg-[rgba(255,255,255,0.04)]
            border border-[rgba(255,255,255,0.08)]
            rounded-xl
            text-[14px] text-[#f7f8f8]
            placeholder:text-[#5e6063]
            hover:bg-[rgba(255,255,255,0.06)]
            hover:border-[rgba(255,255,255,0.12)]
            focus:border-[rgba(94,109,210,0.5)]
            focus:ring-2 focus:ring-[rgba(94,109,210,0.15)]
            focus:outline-none
            transition-all duration-150
          `}
        />
      </div>
    </div>
  );
}

// Reusable Select component with Linear styling
interface SelectFieldProps {
  label: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

function SelectField({ label, icon, value, onChange, options }: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-[13px] text-[#a2a3a5] font-medium">{label}</label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5e6063] group-focus-within:text-[#8b93ff] transition-colors duration-150 pointer-events-none z-10">
            {icon}
          </div>
        )}
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5e6063] pointer-events-none" strokeWidth={1.5} />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full h-11 ${icon ? 'pl-10' : 'pl-3.5'} pr-10
            bg-[rgba(255,255,255,0.04)]
            border border-[rgba(255,255,255,0.08)]
            rounded-xl
            text-[14px] text-[#f7f8f8]
            hover:bg-[rgba(255,255,255,0.06)]
            hover:border-[rgba(255,255,255,0.12)]
            focus:border-[rgba(94,109,210,0.5)]
            focus:ring-2 focus:ring-[rgba(94,109,210,0.15)]
            focus:outline-none
            transition-all duration-150
            appearance-none cursor-pointer
          `}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-[#18191b] text-[#f7f8f8]">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// Section card component
interface SectionCardProps {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'danger';
}

function SectionCard({ icon, iconColor, title, children, variant = 'default' }: SectionCardProps) {
  const bgColor = variant === 'danger' ? 'bg-[rgba(248,113,113,0.04)]' : 'bg-[rgba(255,255,255,0.02)]';
  const borderColor = variant === 'danger' ? 'border-[rgba(248,113,113,0.1)]' : 'border-[rgba(255,255,255,0.04)]';
  const titleColor = variant === 'danger' ? 'text-[#f87171]' : 'text-[#5e6063]';

  return (
    <div className={`p-5 rounded-xl ${bgColor} border ${borderColor}`}>
      <div className={`flex items-center gap-2.5 text-[11px] font-semibold ${titleColor} mb-5 uppercase tracking-[0.5px]`}>
        <span className={iconColor}>{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}

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
        showToast('Telechargement de l\'avatar...', 'info');
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
      showToast('Profil mis a jour', 'success');
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
      showToast('L\'image ne doit pas depasser 5MB', 'error');
      return;
    }

    if (!file.type.startsWith('image/')) {
      showToast('Le fichier doit etre une image', 'error');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);
    setPendingAvatarFile(file);
    setHasChanges(true);
    showToast('Photo selectionnee', 'info');
  };

  const handleDeleteAccount = () => {
    impact();
    const confirmed = window.confirm(
      'Etes-vous sur de vouloir supprimer votre compte ? Cette action est irreversible.'
    );
    if (confirmed) {
      showToast('Compte supprime', 'error');
      onNavigate('login');
    }
  };

  // Game options
  const gameOptions = [
    { value: 'Valorant', label: 'Valorant' },
    { value: 'CS2', label: 'Counter-Strike 2' },
    { value: 'League of Legends', label: 'League of Legends' },
    { value: 'Apex Legends', label: 'Apex Legends' },
    { value: 'Overwatch 2', label: 'Overwatch 2' },
    { value: 'Fortnite', label: 'Fortnite' },
  ];

  // Play style options
  const playStyleOptions = [
    { value: 'Aggressive', label: 'Agressif' },
    { value: 'Defensive', label: 'Defensif' },
    { value: 'Balanced', label: 'Equilibre' },
    { value: 'Support', label: 'Support' },
    { value: 'Strategic', label: 'Strategique' },
  ];

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
          className="space-y-5"
        >
          {/* Header - Linear style */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
            <motion.button
              onClick={() => onNavigate('profile')}
              className="w-9 h-9 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] transition-all duration-150"
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </motion.button>

            <div className="flex-1">
              <h1 className="text-[18px] md:text-[20px] font-semibold text-[#f7f8f8] tracking-[-0.02em]">
                Modifier le profil
              </h1>
              <p className="text-[13px] text-[#5e6063] mt-0.5">
                Mettez a jour vos informations
              </p>
            </div>

            <motion.button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`
                h-9 px-4 flex items-center gap-2 rounded-lg text-[13px] font-medium transition-all duration-150
                ${hasChanges && !isSaving
                  ? 'bg-[#5e6dd2] text-white hover:bg-[#6a79db] shadow-[0_0_0_1px_rgba(94,109,210,0.5)]'
                  : 'bg-[rgba(255,255,255,0.03)] text-[#4a4b4d] border border-[rgba(255,255,255,0.04)] cursor-not-allowed'
                }
              `}
              whileHover={hasChanges && !isSaving ? { scale: 1.02 } : {}}
              whileTap={hasChanges && !isSaving ? { scale: 0.98 } : {}}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
              ) : (
                <Save className="w-4 h-4" strokeWidth={1.5} />
              )}
              {isSaving ? 'Envoi...' : 'Sauver'}
            </motion.button>
          </motion.div>

          {/* Avatar Section */}
          <motion.div variants={itemVariants}>
            <SectionCard
              icon={<Camera className="w-3.5 h-3.5" strokeWidth={1.5} />}
              iconColor="text-[#8b93ff]"
              title="Photo de profil"
            >
              <div className="flex items-center gap-5">
                <div className="relative">
                  <motion.div
                    className="w-[72px] h-[72px] rounded-xl overflow-hidden ring-2 ring-[rgba(94,109,210,0.15)] ring-offset-2 ring-offset-[#08090a]"
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
                    className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg bg-[#5e6dd2] text-white flex items-center justify-center shadow-lg shadow-[#5e6dd2]/25 hover:bg-[#6a79db] transition-colors duration-150"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Camera className="w-3.5 h-3.5" strokeWidth={2} />
                  </motion.button>
                </div>
                <div>
                  <p className="text-[14px] text-[#f7f8f8] font-medium">Photo publique</p>
                  <p className="text-[12px] text-[#5e6063] mt-0.5">JPG, PNG ou GIF. Max 5MB.</p>
                  <button
                    onClick={handleChangeAvatar}
                    className="text-[12px] text-[#5e6dd2] hover:text-[#8b93ff] font-medium mt-2 transition-colors duration-150"
                  >
                    Changer la photo
                  </button>
                </div>
              </div>
            </SectionCard>
          </motion.div>

          {/* Basic Info */}
          <motion.div variants={itemVariants}>
            <SectionCard
              icon={<User className="w-3.5 h-3.5" strokeWidth={1.5} />}
              iconColor="text-[#5e6dd2]"
              title="Informations de base"
            >
              <div className="space-y-4">
                <InputField
                  label="Nom d'affichage"
                  icon={<User className="w-4 h-4" strokeWidth={1.5} />}
                  value={formData.displayName}
                  onChange={(v) => handleChange('displayName', v)}
                  placeholder="Votre nom"
                />

                <InputField
                  label="Nom d'utilisateur"
                  icon={<AtSign className="w-4 h-4" strokeWidth={1.5} />}
                  value={formData.username}
                  onChange={(v) => handleChange('username', v)}
                  placeholder="username"
                />

                <InputField
                  label="Email"
                  icon={<Mail className="w-4 h-4" strokeWidth={1.5} />}
                  type="email"
                  value={formData.email}
                  onChange={(v) => handleChange('email', v)}
                  placeholder="votre@email.com"
                />

                {/* Bio textarea */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] text-[#a2a3a5] font-medium">Bio</label>
                    <span className={`text-[11px] tabular-nums ${(formData.bio?.length || 0) > 180 ? 'text-[#f5a623]' : 'text-[#5e6063]'}`}>
                      {formData.bio?.length || 0}/200
                    </span>
                  </div>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleChange('bio', e.target.value.slice(0, 200))}
                    placeholder="Parlez de vous..."
                    rows={3}
                    className="
                      w-full p-3.5
                      bg-[rgba(255,255,255,0.04)]
                      border border-[rgba(255,255,255,0.08)]
                      rounded-xl
                      text-[14px] text-[#f7f8f8]
                      placeholder:text-[#5e6063]
                      hover:bg-[rgba(255,255,255,0.06)]
                      hover:border-[rgba(255,255,255,0.12)]
                      focus:border-[rgba(94,109,210,0.5)]
                      focus:ring-2 focus:ring-[rgba(94,109,210,0.15)]
                      focus:outline-none
                      transition-all duration-150
                      resize-none
                    "
                  />
                </div>
              </div>
            </SectionCard>
          </motion.div>

          {/* Personal Info */}
          <motion.div variants={itemVariants}>
            <SectionCard
              icon={<Shield className="w-3.5 h-3.5" strokeWidth={1.5} />}
              iconColor="text-[#4ade80]"
              title="Informations personnelles"
            >
              <div className="space-y-4">
                <InputField
                  label="Localisation"
                  icon={<MapPin className="w-4 h-4" strokeWidth={1.5} />}
                  value={formData.location}
                  onChange={(v) => handleChange('location', v)}
                  placeholder="Ville, Pays"
                />

                <div className="space-y-2">
                  <label className="text-[13px] text-[#a2a3a5] font-medium">Date de naissance</label>
                  <div className="relative group">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5e6063] group-focus-within:text-[#8b93ff] transition-colors duration-150" strokeWidth={1.5} />
                    <input
                      type="date"
                      value={formData.birthday}
                      onChange={(e) => handleChange('birthday', e.target.value)}
                      className="
                        w-full h-11 pl-10 pr-3.5
                        bg-[rgba(255,255,255,0.04)]
                        border border-[rgba(255,255,255,0.08)]
                        rounded-xl
                        text-[14px] text-[#f7f8f8]
                        hover:bg-[rgba(255,255,255,0.06)]
                        hover:border-[rgba(255,255,255,0.12)]
                        focus:border-[rgba(94,109,210,0.5)]
                        focus:ring-2 focus:ring-[rgba(94,109,210,0.15)]
                        focus:outline-none
                        transition-all duration-150
                        [color-scheme:dark]
                      "
                    />
                  </div>
                </div>
              </div>
            </SectionCard>
          </motion.div>

          {/* Gaming Preferences */}
          <motion.div variants={itemVariants}>
            <SectionCard
              icon={<Gamepad2 className="w-3.5 h-3.5" strokeWidth={1.5} />}
              iconColor="text-[#f5a623]"
              title="Preferences de jeu"
            >
              <div className="space-y-4">
                <SelectField
                  label="Jeu favori"
                  icon={<Trophy className="w-4 h-4" strokeWidth={1.5} />}
                  value={formData.favoriteGame}
                  onChange={(v) => handleChange('favoriteGame', v)}
                  options={gameOptions}
                />

                <SelectField
                  label="Style de jeu"
                  value={formData.playStyle}
                  onChange={(v) => handleChange('playStyle', v)}
                  options={playStyleOptions}
                />
              </div>
            </SectionCard>
          </motion.div>

          {/* Danger Zone */}
          <motion.div variants={itemVariants}>
            <SectionCard
              icon={<AlertCircle className="w-3.5 h-3.5" strokeWidth={1.5} />}
              iconColor="text-[#f87171]"
              title="Zone dangereuse"
              variant="danger"
            >
              <p className="text-[13px] text-[#8b8d90] mb-4 leading-relaxed">
                La suppression de votre compte est irreversible. Toutes vos donnees seront definitivement perdues.
              </p>
              <motion.button
                onClick={handleDeleteAccount}
                className="h-9 px-4 flex items-center gap-2 rounded-lg bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.15)] text-[#f87171] text-[13px] font-medium hover:bg-[rgba(248,113,113,0.12)] hover:border-[rgba(248,113,113,0.25)] transition-all duration-150"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                Supprimer le compte
              </motion.button>
            </SectionCard>
          </motion.div>
        </motion.div>
      </div>

      {/* Unsaved changes indicator - Linear toast style */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 bg-[#18191b] backdrop-blur-xl rounded-lg px-4 py-2.5 border border-[rgba(255,255,255,0.08)] shadow-2xl shadow-black/50 z-50"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="text-[13px] text-[#f7f8f8] font-medium flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5a623] animate-pulse" />
              Modifications non sauvegardees
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EditProfileScreen;
