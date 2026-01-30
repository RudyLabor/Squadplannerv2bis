/**
 * THEME PROVIDER - Elite Design System
 * Standard: Linear / Stripe / Apple
 *
 * Manages dark/light mode with system preference detection
 * and localStorage persistence.
 *
 * Usage:
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 *
 * const { theme, setTheme, toggleTheme } = useTheme();
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';

// ============================================
// TYPES
// ============================================
type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// ============================================
// CONTEXT
// ============================================
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'squadplanner-theme';

// ============================================
// PROVIDER
// ============================================
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored;
      }
    }
    return defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Get system preference
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  // Resolve the actual theme
  useEffect(() => {
    const resolved = theme === 'system' ? getSystemTheme() : theme;
    setResolvedTheme(resolved);

    // Apply to document
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        resolved === 'dark' ? '#0a0a0a' : '#f5f3f0'
      );
    }
  }, [theme, getSystemTheme]);

  // Listen for system preference changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      setResolvedTheme(getSystemTheme());
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, getSystemTheme]);

  // Set theme with persistence
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
  }, []);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// ============================================
// THEME TOGGLE BUTTON COMPONENT
// ============================================
import { Sun, Moon, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeToggleProps {
  showSystemOption?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ThemeToggle({ showSystemOption = false, size = 'md', className = '' }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  if (showSystemOption) {
    // Three-way toggle: Light / System / Dark
    return (
      <div className={`flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-subtle)] ${className}`}>
        {(['light', 'system', 'dark'] as Theme[]).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`
              p-2 rounded-lg transition-all duration-fast
              ${theme === t
                ? 'bg-[var(--bg-elevated)] shadow-sm text-[var(--fg-primary)]'
                : 'text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)]'
              }
            `}
            aria-label={`Set ${t} theme`}
          >
            {t === 'light' && <Sun className={iconSizes[size]} />}
            {t === 'system' && <Monitor className={iconSizes[size]} />}
            {t === 'dark' && <Moon className={iconSizes[size]} />}
          </button>
        ))}
      </div>
    );
  }

  // Simple toggle button
  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]} rounded-xl
        bg-[var(--bg-subtle)] hover:bg-[var(--bg-elevated)]
        flex items-center justify-center
        transition-colors duration-fast
        ${className}
      `}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={resolvedTheme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {resolvedTheme === 'light' ? (
            <Moon className={`${iconSizes[size]} text-[var(--fg-secondary)]`} />
          ) : (
            <Sun className={`${iconSizes[size]} text-[var(--fg-secondary)]`} />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}

export default ThemeProvider;
