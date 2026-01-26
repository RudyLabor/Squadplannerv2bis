import { motion } from 'motion/react';
import { Home, Users, Calendar, User } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCommandOpen: () => void;
  isMobile: boolean;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useTranslation();
  
  const tabs = [
    { id: 'home', labelKey: 'nav.home', icon: Home },
    { id: 'squads', labelKey: 'nav.squads', icon: Users },
    { id: 'sessions', labelKey: 'nav.sessions', icon: Calendar },
    { id: 'profile', labelKey: 'nav.profile', icon: User }
  ];

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 pb-safe z-[var(--z-sticky)]"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Premium glass dock */}
      <div className="flex justify-center px-4 pb-4">
        <nav className="w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-3xl p-2 border-[0.5px] border-[var(--border-medium)] shadow-2xl">
          <div className="flex items-center justify-around">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="relative flex flex-col items-center gap-1 py-3 px-5 rounded-2xl flex-1"
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Active background avec animation fluide */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-2xl bg-[var(--primary-50)]"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35
                      }}
                    />
                  )}

                  {/* Icon avec animation */}
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      y: isActive ? -2 : 0
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon
                      className={`w-6 h-6 relative z-10 transition-colors duration-200 ${
                        isActive 
                          ? 'text-[var(--primary-500)]' 
                          : 'text-[var(--fg-tertiary)]'
                      }`}
                      strokeWidth={isActive ? 2.5 : 1.5}
                    />
                  </motion.div>

                  {/* Label - seulement si actif */}
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs font-semibold text-[var(--primary-500)] relative z-10"
                    >
                      {t(tab.labelKey)}
                    </motion.span>
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
