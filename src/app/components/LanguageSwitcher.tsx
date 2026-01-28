import { motion } from 'framer-motion';
import { Languages, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/i18n/useTranslation';

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'fr' as const, label: 'Français', flag: '🇫🇷' },
    { code: 'en' as const, label: 'English', flag: '🇬🇧' },
  ];

  const currentLanguage = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2 px-3 py-2 rounded-xl
          glass-2 hover:glass-3
          text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]
          transition-all duration-150
          border border-[var(--border-medium)]
        "
        whileTap={{ scale: 0.96 }}
      >
        <Languages className="w-4 h-4" />
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="text-sm font-medium hidden sm:inline">
          {currentLanguage.code.toUpperCase()}
        </span>
      </motion.button>

      {/* Dropdown Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ duration: 0.15, ease: [0.4, 0.0, 0.2, 1] }}
          className="
            absolute top-full right-0 mt-2
            min-w-[180px]
            backdrop-blur-xl bg-[var(--bg-elevated)]/95
            border border-[var(--border-medium)]
            rounded-xl
            shadow-2xl
            overflow-hidden
            z-[var(--z-dropdown)]
          "
        >
          <div className="p-1">
            {languages.map((lang) => {
              const isActive = lang.code === language;

              return (
                <motion.button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between gap-3
                    px-3 py-2.5 rounded-lg
                    text-left
                    transition-all duration-150
                    ${isActive 
                      ? 'bg-[var(--primary-500)]/10 text-[var(--primary-500)]' 
                      : 'text-[var(--fg-secondary)] hover:bg-[var(--glass-2)] hover:text-[var(--fg-primary)]'
                    }
                  `}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{lang.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {lang.label}
                      </span>
                      <span className="text-xs text-[var(--fg-tertiary)]">
                        {lang.code.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.15, ease: [0.4, 0.0, 0.2, 1] }}
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}