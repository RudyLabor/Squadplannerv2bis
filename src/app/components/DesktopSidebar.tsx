/**
 * DESKTOP SIDEBAR - LINEAR DESIGN SYSTEM
 * Ultra subtle, minimal - exactly like Linear.app
 * Clear hierarchy: Primary > Secondary > Tertiary
 */

import { motion } from 'framer-motion';
import {
  Home,
  Users,
  Calendar,
  User,
  Settings,
  Trophy,
  TrendingUp,
  Zap,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { Logo } from './Logo';
import { usePrefetch } from '@/app/hooks/usePrefetch';

interface DesktopSidebarProps {
  activeTab: string;
  onLogout: () => void;
  userName: string;
  isPremium: boolean;
}

export function DesktopSidebar({
  activeTab,
  onLogout,
  userName,
  isPremium
}: DesktopSidebarProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { prefetch, cancelPrefetch } = usePrefetch();

  // Primary navigation - Core app functions
  const mainNavItems = [
    { id: 'home', label: t('nav.home'), icon: Home },
    { id: 'squads', label: t('nav.squads'), icon: Users },
    { id: 'sessions', label: t('nav.sessions'), icon: Calendar },
    { id: 'profile', label: t('nav.profile'), icon: User },
  ];

  // Secondary navigation - Explorer features
  const secondaryNavItems = [
    { id: 'achievements', label: 'Succès', icon: Trophy },
    { id: 'leaderboard', label: 'Classement', icon: TrendingUp },
    { id: 'integrations', label: 'Intégrations', icon: Zap },
  ];

  return (
    <div className="fixed left-0 top-0 bottom-0 w-[260px] flex flex-col z-40 bg-[#08090a] border-r border-[#1f2023]">
      {/* ============================================ */}
      {/* LOGO HEADER */}
      {/* ============================================ */}
      <div className="h-16 px-5 flex items-center border-b border-[#1f2023]/50">
        <Logo variant="sidebar" size="md" animated />
      </div>

      {/* ============================================ */}
      {/* USER PROFILE - Compact */}
      {/* ============================================ */}
      <div className="px-3 pt-4 pb-2">
        <button
          onClick={() => navigate('/profile')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#18191b] transition-colors duration-150 group"
        >
          <div className="w-9 h-9 rounded-lg bg-[#1f2023] group-hover:bg-[#27282b] flex items-center justify-center text-[#8b8d90] group-hover:text-[#8b8d90] text-[13px] font-medium transition-colors duration-150">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <span className="text-[14px] text-[#8b8d90] group-hover:text-[#f7f8f8] transition-colors duration-150 truncate block">
              {userName}
            </span>
          </div>
          {isPremium && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#5e6dd2]/15 text-[#8b93ff] font-medium">
              Pro
            </span>
          )}
        </button>
      </div>

      {/* ============================================ */}
      {/* PRIMARY NAVIGATION */}
      {/* ============================================ */}
      <nav className="flex-1 overflow-y-auto px-3 pt-2">
        <div className="space-y-0.5">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => navigate(`/${item.id}`)}
                onMouseEnter={() => prefetch(`/${item.id}`)}
                onMouseLeave={cancelPrefetch}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl
                  transition-all duration-150 relative
                  ${isActive
                    ? 'bg-[#18191b] text-[#f7f8f8]'
                    : 'text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[#18191b]'
                  }
                `}
              >
                {/* Active indicator - Subtle left bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#5e6dd2]"
                    transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                )}

                <Icon
                  className={`w-[18px] h-[18px] transition-colors duration-150 ${
                    isActive ? 'text-[#f7f8f8]' : 'text-[#5e6063]'
                  }`}
                  strokeWidth={1.5}
                />
                <span className="text-[14px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* ============================================ */}
        {/* SECONDARY NAVIGATION - Explorer */}
        {/* ============================================ */}
        <div className="mt-8">
          <div className="px-3 mb-2">
            <span className="text-[11px] font-medium text-[#3a3b40] uppercase tracking-wider">
              Explorer
            </span>
          </div>

          <div className="space-y-0.5">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => navigate(`/${item.id}`)}
                  onMouseEnter={() => prefetch(`/${item.id}`)}
                  onMouseLeave={cancelPrefetch}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                    transition-all duration-150 relative
                    ${isActive
                      ? 'bg-[#18191b] text-[#f7f8f8]'
                      : 'text-[#5e6063] hover:text-[#8b8d90] hover:bg-[#18191b]'
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav2"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-[#5e6dd2]/70"
                      transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                    />
                  )}

                  <Icon
                    className={`w-[18px] h-[18px] transition-colors duration-150 ${
                      isActive ? 'text-[#8b8d90]' : 'text-[#3a3b40]'
                    }`}
                    strokeWidth={1.5}
                  />
                  <span className="text-[13px]">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ============================================ */}
      {/* TERTIARY - Settings & Logout */}
      {/* ============================================ */}
      <div className="px-3 py-4 border-t border-[#1f2023]/50">
        <div className="space-y-0.5">
          <button
            onClick={() => navigate('/preferences')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#5e6063] hover:text-[#8b8d90] hover:bg-[#18191b] transition-all duration-150"
          >
            <Settings className="w-[18px] h-[18px] text-[#3a3b40]" strokeWidth={1.5} />
            <span className="text-[13px]">Paramètres</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#5e6063] hover:text-[#f87171] hover:bg-[#f87171]/5 transition-all duration-150"
          >
            <LogOut className="w-[18px] h-[18px] text-[#3a3b40]" strokeWidth={1.5} />
            <span className="text-[13px]">Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  );
}
