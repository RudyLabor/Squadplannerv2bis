import { motion } from 'motion/react';
import { Bell, Search, Command } from 'lucide-react';
import { LanguageSwitcher } from '@/app/components/LanguageSwitcher';

interface DesktopHeaderProps {
  onCommandOpen: () => void;
}

export function DesktopHeader({ onCommandOpen }: DesktopHeaderProps) {
  return (
    <div className="fixed top-0 left-72 right-0 h-16 z-30 bg-white/80 backdrop-blur-md border-b border-[var(--border-subtle)]">
      <div className="h-full px-8 flex items-center justify-between">
        {/* Page Title - Optional, can be dynamic later */}
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-[var(--fg-primary)] tracking-tight">
            Tableau de bord
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Command Palette Trigger */}
          <button
            onClick={onCommandOpen}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-secondary)] text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] transition-all duration-200 border border-[var(--border-subtle)]"
          >
            <Search className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-sm font-medium">Rechercher</span>
            <div className="flex items-center gap-0.5 ml-1 px-2 py-0.5 rounded-md bg-white text-xs text-[var(--fg-tertiary)] font-mono border border-[var(--border-subtle)]">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </button>

          {/* Notifications */}
          <button
            className="relative w-10 h-10 rounded-xl flex items-center justify-center text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-subtle)] transition-all duration-200"
          >
            <Bell className="w-5 h-5" strokeWidth={1.5} />
            
            {/* Notification badge */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--primary-500)] border-2 border-white"></span>
          </button>

          {/* Language Switcher */}
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
