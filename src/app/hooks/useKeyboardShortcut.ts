import { useEffect } from 'react';

interface ShortcutOptions {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
}

export function useKeyboardShortcut(
  options: ShortcutOptions,
  callback: () => void,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, ctrl = false, shift = false, alt = false, meta = false } = options;

      // Safety checks to prevent undefined errors
      if (!key || !event.key) return;

      const ctrlMatch = ctrl ? event.ctrlKey : !event.ctrlKey;
      const shiftMatch = shift ? event.shiftKey : !event.shiftKey;
      const altMatch = alt ? event.altKey : !event.altKey;
      const metaMatch = meta ? event.metaKey : !event.metaKey;

      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        (ctrl || meta ? (event.ctrlKey || event.metaKey) : ctrlMatch) &&
        shiftMatch &&
        altMatch
      ) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, callback, enabled]);
}