/**
 * DESKTOP HEADER - LINEAR DESIGN SYSTEM
 * Minimal, functional, precise
 */

import { Bell, Search, Command } from 'lucide-react';

interface DesktopHeaderProps {
  onCommandOpen: () => void;
}

export function DesktopHeader({ onCommandOpen }: DesktopHeaderProps) {
  return (
    <div className="fixed top-0 left-[260px] right-0 h-14 z-30 bg-[#08090a]/90 backdrop-blur-md border-b border-[#27282b]">
      <div className="h-full px-6 flex items-center justify-end">

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Command Palette Trigger - Linear style */}
          <button
            onClick={onCommandOpen}
            className="flex items-center gap-2 h-8 px-3 rounded-lg bg-[#18191b] hover:bg-[#1f2023] border border-[#27282b] hover:border-[#363739] transition-all duration-100"
          >
            <Search className="w-3.5 h-3.5 text-[#8b8d90]" strokeWidth={1.5} />
            <span className="text-[13px] text-[#8b8d90]">Rechercher...</span>
            <div className="flex items-center gap-0.5 ml-2 px-1.5 py-0.5 rounded bg-[#27282b] text-[11px] text-[#8b8d90] font-mono">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </button>

          {/* Notifications */}
          <button
            className="relative w-8 h-8 rounded-lg flex items-center justify-center text-[#8b8d90] hover:text-[#f7f8f8] hover:bg-[#1f2023] transition-all duration-100"
          >
            <Bell className="w-4 h-4" strokeWidth={1.5} />

            {/* Notification dot */}
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#5e6dd2]" />
          </button>
        </div>
      </div>
    </div>
  );
}
