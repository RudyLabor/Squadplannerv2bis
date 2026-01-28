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
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { Logo } from '@/app/components/Logo';

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

  const mainNavItems = [
    { id: 'home', label: t('nav.home'), icon: Home },
    { id: 'squads', label: t('nav.squads'), icon: Users },
    { id: 'sessions', label: t('nav.sessions'), icon: Calendar },
    { id: 'profile', label: t('nav.profile'), icon: User },
  ];

  const secondaryNavItems = [
    { id: 'achievements', label: 'Succès', icon: Trophy },
    { id: 'leaderboard', label: 'Classement', icon: TrendingUp },
    { id: 'integrations', label: 'Intégrations', icon: Zap },
  ];

  return (
    <div className="fixed left-0 top-0 bottom-0 w-72 flex flex-col z-40 bg-[var(--bg-primary)] border-r border-[var(--border-subtle)]">
      {/* Content */}
      <div className="flex flex-col h-full">
        {/* Logo Header - Cliquable */}
        <div className="p-6 pb-4 border-b border-[var(--border-subtle)]">
          <Logo variant="header" />
        </div>

        {/* User Profile Card */}
        <div className="p-4">
          <button
            onClick={() => navigate('/profile')}
            className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 border-[0.5px] border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] flex items-center justify-center shadow-md">
              <span className="text-lg font-bold text-white">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div className="flex-1 min-w-0 text-left">
              <h3 className="font-semibold text-[var(--fg-primary)] truncate text-sm">
                {userName}
              </h3>
              {isPremium && (
                <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-teal-500)] text-white font-bold mt-1">
                  Premium
                </span>
              )}
            </div>

            <ChevronRight className="w-4 h-4 text-[var(--fg-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-6">
          {/* Principal */}
          <div>
            <h3 className="text-xs font-semibold text-[var(--fg-tertiary)] mb-3 px-2 uppercase tracking-wider">
              Principal
            </h3>
            <div className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(`/${item.id}`)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                      transition-all duration-200 relative
                      ${isActive 
                        ? 'bg-[var(--primary-50)] text-[var(--primary-600)] font-semibold' 
                        : 'text-[var(--fg-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg-primary)]'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
                    <span className="text-sm">{item.label}</span>
                    
                    {isActive && (
                      <motion.div
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--primary-500)]"
                        layoutId="activeIndicator"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explorer */}
          <div>
            <h3 className="text-xs font-semibold text-[var(--fg-tertiary)] mb-3 px-2 uppercase tracking-wider">
              Explorer
            </h3>
            <div className="space-y-1">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(`/${item.id}`)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                      transition-all duration-200
                      ${isActive 
                        ? 'bg-[var(--accent-teal-50)] text-[var(--accent-teal-600)] font-semibold' 
                        : 'text-[var(--fg-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg-primary)]'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 space-y-2 border-t border-[var(--border-subtle)]">
          <button
            onClick={() => navigate('/preferences')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--fg-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg-primary)] transition-all duration-200"
          >
            <Settings className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-sm font-medium">Paramètres</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  );
}