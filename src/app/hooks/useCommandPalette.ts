import { useState, useEffect, useCallback } from 'react';
import { useKeyboardShortcut } from './useKeyboardShortcut';

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  // Cmd+K or Ctrl+K to open
  useKeyboardShortcut(['Meta+k', 'Control+k'], (e) => {
    e.preventDefault();
    toggle();
  });

  // Escape to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, close]);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
