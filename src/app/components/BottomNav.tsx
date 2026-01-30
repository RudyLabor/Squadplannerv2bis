/**
 * BOTTOM NAV - LINEAR DESIGN SYSTEM
 * Mobile navigation - Invisible when understood, accessible when needed
 * Comfortable tap zones, clear active states
 */

import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, User } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { usePrefetch } from '@/app/hooks/usePrefetch';

interface BottomNavProps {
  onCommandOpen?: () => void;
  isMobile?: boolean;
}

export function BottomNav({ onCommandOpen }: BottomNavProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { prefetch, cancelPrefetch } = usePrefetch();

  // Extract active tab from pathname
  const activeTab = location.pathname.split('/')[1] || 'home';

  const tabs = [
    { id: 'home', labelKey: 'nav.home', icon: Home },
    { id: 'squads', labelKey: 'nav.squads', icon: Users },
    { id: 'sessions', labelKey: 'nav.sessions', icon: Calendar },
    { id: 'profile', labelKey: 'nav.profile', icon: User }
  ];

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 pb-safe z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Background blur layer */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#08090a] via-[#08090a]/95 to-transparent pointer-events-none" />

      {/* Navigation dock */}
      <div className="relative flex justify-center px-4 pb-4">
        <nav className="w-full max-w-md bg-[#101012]/98 backdrop-blur-xl rounded-2xl border border-[#27282b] shadow-lg shadow-black/30">
          <div className="flex items-center justify-around p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => navigate(`/${tab.id}`)}
                  onMouseEnter={() => prefetch(`/${tab.id}`)}
                  onMouseLeave={cancelPrefetch}
                  onFocus={() => prefetch(`/${tab.id}`)}
                  className="relative flex flex-col items-center justify-center gap-1.5 py-3 px-5 rounded-xl flex-1 min-h-[60px]"
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                >
                  {/* Active background - Subtle */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-1 rounded-xl bg-[#1f2023]"
                      transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                    />
                  )}

                  {/* Icon */}
                  <Icon
                    className={`w-[22px] h-[22px] relative z-10 transition-colors duration-150 ${
                      isActive
                        ? 'text-[#f7f8f8]'
                        : 'text-[#5e6063]'
                    }`}
                    strokeWidth={isActive ? 1.75 : 1.5}
                  />

                  {/* Label - Readable size */}
                  <span
                    className={`text-[11px] font-medium relative z-10 transition-colors duration-150 ${
                      isActive ? 'text-[#f7f8f8]' : 'text-[#5e6063]'
                    }`}
                  >
                    {t(tab.labelKey)}
                  </span>

                  {/* Active dot indicator */}
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute bottom-1.5 w-1 h-1 rounded-full bg-[#5e6dd2]"
                      transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </nav>
      </div>
    </motion.div>
  );
}
