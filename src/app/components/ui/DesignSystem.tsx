/**
 * 🎨 SQUAD PLANNER - DESIGN SYSTEM COMPONENTS
 * Composants alignés pixel-perfect sur les maquettes Figma
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

// ============================================
// COULEURS DE RÉFÉRENCE (pour documentation)
// ============================================
import { COLORS as TOKENS_COLORS } from '@/theme/design-tokens';

// ============================================
// COULEURS DE RÉFÉRENCE (pour documentation)
// ============================================
export const COLORS = {
  bgBase: TOKENS_COLORS.background.base,
  bgCard: TOKENS_COLORS.background.elevated,
  primary: TOKENS_COLORS.primary.DEFAULT,
  primaryDark: TOKENS_COLORS.primary[600],
  success: TOKENS_COLORS.success.DEFAULT,
  warning: TOKENS_COLORS.warning.DEFAULT,
  purple: TOKENS_COLORS.purple.DEFAULT,
  teal: TOKENS_COLORS.secondary.DEFAULT,
  textPrimary: TOKENS_COLORS.text.primary,
  textSecondary: TOKENS_COLORS.text.secondary,
  border: 'rgba(120, 113, 108, 0.15)', // Using transparent stone for blend
};

// ============================================
// PAGE HEADER - Titre de page
// ============================================
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

// ============================================
// STAT CARD - Card de statistique simple
// ============================================
interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  iconColor?: string;
}

export function StatCard({ icon: Icon, value, label, iconColor = 'text-gray-400' }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
      <Icon className={`w-5 h-5 mx-auto mb-2 ${iconColor}`} />
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

// ============================================
// STATS ROW - Grille de 3 stats
// ============================================
interface StatsRowProps {
  children: React.ReactNode;
}

export function StatsRow({ children }: StatsRowProps) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {children}
    </div>
  );
}

// ============================================
// ACTION BUTTON - Bouton d'action principal
// ============================================
interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  icon?: LucideIcon;
  className?: string;
  disabled?: boolean;
}

export function ActionButton({ 
  children, 
  onClick, 
  variant = 'primary',
  icon: Icon,
  className = '',
  disabled = false
}: ActionButtonProps) {
  const baseStyles = "flex items-center justify-center gap-2 h-12 font-medium rounded-full transition-colors";
  
  const variants = {
    primary: "bg-amber-500 hover:bg-amber-600 text-white",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}

// ============================================
// SECTION HEADER - Titre de section
// ============================================
interface SectionHeaderProps {
  title: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      {action}
    </div>
  );
}

// ============================================
// FEATURE CARD - Card de fonctionnalité avec couleur
// ============================================
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  color: 'amber' | 'purple' | 'teal' | 'green' | 'white';
  onClick?: () => void;
  badge?: string;
}

export function FeatureCard({ icon: Icon, title, subtitle, color, onClick, badge }: FeatureCardProps) {
  const colorStyles = {
    amber: 'bg-gradient-to-br from-amber-400 to-amber-500 text-white',
    purple: 'bg-gradient-to-br from-violet-500 to-purple-600 text-white',
    teal: 'bg-gradient-to-br from-teal-400 to-teal-500 text-white',
    green: 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white',
    white: 'bg-white text-gray-900 border border-gray-100 shadow-sm'
  };

  const iconBgStyles = {
    amber: 'bg-amber-300/30',
    purple: 'bg-violet-400/30',
    teal: 'bg-teal-300/30',
    green: 'bg-emerald-300/30',
    white: 'bg-gray-100'
  };

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl p-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${colorStyles[color]}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${iconBgStyles[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-sm">{title}</span>
        {badge && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/20">
            {badge}
          </span>
        )}
      </div>
      <p className={`text-xs mt-0.5 ${color === 'white' ? 'text-gray-500' : 'opacity-80'}`}>
        {subtitle}
      </p>
    </button>
  );
}

// ============================================
// SQUAD CARD - Card de squad (grille)
// ============================================
interface SquadCardProps {
  name: string;
  game: string;
  gameImage: string;
  members: number;
  reliability: number;
  nextSession?: string;
  sessionsCount?: number;
  onClick?: () => void;
}

export function SquadCard({ 
  name, 
  game, 
  gameImage, 
  members, 
  reliability, 
  nextSession,
  sessionsCount = 0,
  onClick 
}: SquadCardProps) {
  const reliabilityColor = reliability >= 90 ? 'text-emerald-500' : reliability >= 70 ? 'text-amber-500' : 'text-red-500';

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl p-4 text-left shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      {/* Image et badge sessions */}
      <div className="relative mb-3">
        <img 
          src={gameImage} 
          alt={game}
          className="w-full h-24 object-cover rounded-xl"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=200&fit=crop';
          }}
        />
        {sessionsCount > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-emerald-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            {sessionsCount}
          </div>
        )}
      </div>

      {/* Nom et jeu */}
      <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
      <p className="text-xs text-gray-500 mb-3">{game}</p>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-gray-500">
          <span>Membres</span>
          <span className="font-medium text-gray-900">{members}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <span>Fiabilité</span>
          <span className={`font-medium ${reliabilityColor}`}>{reliability}%</span>
        </div>
      </div>

      {/* Prochaine session */}
      {nextSession && (
        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          {nextSession}
        </div>
      )}
    </button>
  );
}

// ============================================
// LIST ITEM - Élément de liste avec icône
// ============================================
interface ListItemProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
}

export function ListItem({ icon: Icon, title, subtitle, onClick, trailing }: ListItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
    >
      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 text-sm">{title}</div>
        {subtitle && (
          <div className="text-xs text-gray-500 truncate">{subtitle}</div>
        )}
      </div>
      {trailing || (
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </button>
  );
}

// ============================================
// BADGE - Badge coloré
// ============================================
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'purple' | 'pro';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    purple: 'bg-violet-100 text-violet-700',
    pro: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}

// ============================================
// INPUT - Input style maquette
// ============================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
}

export function Input({ icon: Icon, className = '', ...props }: InputProps) {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <input
        {...props}
        className={`w-full h-12 px-4 ${Icon ? 'pl-11' : ''} bg-white rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors ${className}`}
      />
    </div>
  );
}

// ============================================
// SEARCH BAR - Barre de recherche avec bouton
// ============================================
interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onAction?: () => void;
  actionIcon?: LucideIcon;
}

export function SearchBar({ 
  placeholder = 'Rechercher...', 
  value, 
  onChange, 
  onAction,
  actionIcon: ActionIcon 
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex-1 relative">
        <svg 
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full h-12 pl-11 pr-4 bg-white rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
        />
      </div>
      {onAction && ActionIcon && (
        <button
          onClick={onAction}
          className="w-12 h-12 flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white rounded-full transition-colors"
        >
          <ActionIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// ============================================
// EMPTY STATE - État vide
// ============================================
interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 max-w-xs mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}

// ============================================
// AVATAR - Avatar utilisateur avec niveau
// ============================================
interface AvatarProps {
  src?: string;
  name: string;
  level?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Avatar({ src, name, level, size = 'md' }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl'
  };

  const badgeSizes = {
    sm: 'w-4 h-4 text-[8px] -bottom-0.5 -right-0.5',
    md: 'w-5 h-5 text-[10px] -bottom-0.5 -right-0.5',
    lg: 'w-6 h-6 text-xs -bottom-1 -right-1',
    xl: 'w-7 h-7 text-xs -bottom-1 -right-1'
  };

  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="relative inline-block">
      {src ? (
        <img 
          src={src} 
          alt={name}
          className={`${sizes[size]} rounded-full object-cover ring-2 ring-white`}
        />
      ) : (
        <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center font-semibold ring-2 ring-white`}>
          {initials}
        </div>
      )}
      {level !== undefined && (
        <div className={`absolute ${badgeSizes[size]} rounded-full bg-amber-500 text-white flex items-center justify-center font-bold ring-2 ring-white`}>
          {level}
        </div>
      )}
    </div>
  );
}

// ============================================
// TOGGLE - Interrupteur
// ============================================
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="flex items-center cursor-pointer">
      {label && <span className="text-sm text-gray-700 mr-3">{label}</span>}
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={`w-11 h-6 rounded-full transition-colors ${checked ? 'bg-amber-500' : 'bg-gray-200'}`}>
          <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
        </div>
      </div>
    </label>
  );
}

export default {
  PageHeader,
  StatCard,
  StatsRow,
  ActionButton,
  SectionHeader,
  FeatureCard,
  SquadCard,
  ListItem,
  Badge,
  Input,
  SearchBar,
  EmptyState,
  Avatar,
  Toggle,
};
