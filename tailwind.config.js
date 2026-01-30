/** @type {import('tailwindcss').Config} */

/**
 * SQUAD PLANNER - LINEAR DESIGN SYSTEM
 * Inspired by Linear.app - Dark, Premium, Precise
 */

module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    // ============================================
    // BASE SPACING - 4px grid (compact like Linear)
    // ============================================
    spacing: {
      '0': '0px',
      'px': '1px',
      '0.5': '2px',
      '1': '4px',
      '1.5': '6px',
      '2': '8px',
      '2.5': '10px',
      '3': '12px',
      '4': '16px',
      '5': '20px',
      '6': '24px',
      '7': '28px',
      '8': '32px',
      '9': '36px',
      '10': '40px',
      '12': '48px',
      '14': '56px',
      '16': '64px',
      '20': '80px',
      '24': '96px',
      '32': '128px',
    },

    // ============================================
    // TYPOGRAPHY - Linear compact style
    // ============================================
    fontFamily: {
      sans: ['Inter', 'Inter Variable', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'monospace'],
    },

    fontSize: {
      '2xs': ['10px', { lineHeight: '14px', letterSpacing: '0.01em' }],
      'xs': ['11px', { lineHeight: '16px', letterSpacing: '0' }],
      'sm': ['13px', { lineHeight: '18px', letterSpacing: '-0.01em' }],
      'base': ['14px', { lineHeight: '20px', letterSpacing: '-0.01em' }],
      'md': ['15px', { lineHeight: '22px', letterSpacing: '-0.01em' }],
      'lg': ['16px', { lineHeight: '24px', letterSpacing: '-0.015em' }],
      'xl': ['18px', { lineHeight: '26px', letterSpacing: '-0.02em' }],
      '2xl': ['22px', { lineHeight: '28px', letterSpacing: '-0.02em' }],
      '3xl': ['28px', { lineHeight: '34px', letterSpacing: '-0.025em' }],
      '4xl': ['32px', { lineHeight: '40px', letterSpacing: '-0.03em' }],
    },

    fontWeight: {
      normal: '400',
      medium: '510',  // Linear uses 510, not 500
      semibold: '600',
      bold: '700',
    },

    // ============================================
    // BORDER RADIUS - Linear compact (6-12px)
    // ============================================
    borderRadius: {
      'none': '0px',
      'xs': '4px',
      'sm': '6px',
      'md': '8px',
      'lg': '10px',
      'xl': '12px',
      '2xl': '16px',
      'full': '9999px',
    },

    extend: {
      // ============================================
      // COLORS - Linear Dark System
      // ============================================
      colors: {
        // Background colors - Linear palette
        bg: {
          base: '#08090a',
          elevated: '#101012',
          surface: '#18191b',
          hover: '#1f2023',
          active: '#27282b',
        },

        // Foreground/Text colors - Linear palette
        fg: {
          primary: '#f7f8f8',
          secondary: '#b4b5b7',
          tertiary: '#8b8d90',
          quaternary: '#5e6063',
          disabled: '#3a3b3d',
        },

        // Primary - Linear Blue
        primary: {
          50: '#eef1ff',
          100: '#dde4ff',
          200: '#c3ccff',
          300: '#a0acff',
          400: '#8090f8',
          500: '#5e6dd2',  // Linear accent blue
          600: '#4f5cb8',
          700: '#424d9e',
          800: '#363f84',
          900: '#2c336b',
          DEFAULT: '#5e6dd2',
        },

        // Accent - Linear Purple
        accent: {
          50: '#f5f3ff',
          100: '#ebe5ff',
          200: '#d9ceff',
          300: '#c4b0ff',
          400: '#a98afa',
          500: '#9872e8',
          600: '#8359d4',
          700: '#6e44b8',
          DEFAULT: '#9872e8',
        },

        // Success - Linear Green
        success: {
          50: '#edfcf4',
          100: '#d4f7e3',
          200: '#acefcc',
          300: '#76e2ae',
          400: '#4caf81',  // Linear green
          500: '#2e9a6a',
          600: '#1f7d54',
          700: '#1a6445',
          DEFAULT: '#4caf81',
        },

        // Warning - Linear Yellow
        warning: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#f2c94c',  // Linear yellow
          500: '#e2b93b',
          600: '#ca9a2b',
          700: '#a37b1e',
          DEFAULT: '#f2c94c',
        },

        // Error/Danger - Linear Red
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#e5534b',  // Linear red
          600: '#d13d35',
          700: '#b72d26',
          DEFAULT: '#e5534b',
        },

        // Semantic surface colors (CSS variables)
        surface: {
          primary: 'var(--surface-primary)',
          secondary: 'var(--surface-secondary)',
          tertiary: 'var(--surface-tertiary)',
          elevated: 'var(--surface-elevated)',
          overlay: 'var(--surface-overlay)',
        },

        // Semantic text colors
        content: {
          primary: 'var(--content-primary)',
          secondary: 'var(--content-secondary)',
          tertiary: 'var(--content-tertiary)',
          quaternary: 'var(--content-quaternary)',
          inverse: 'var(--content-inverse)',
        },

        // Border colors - Linear style
        border: {
          subtle: 'rgba(255, 255, 255, 0.05)',
          medium: 'rgba(255, 255, 255, 0.08)',
          strong: 'rgba(255, 255, 255, 0.12)',
          focus: 'rgba(94, 109, 210, 0.5)',  // primary color
        },
      },

      // ============================================
      // BACKGROUND IMAGE - Radial gradients
      // ============================================
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'gradient-radial-top': 'radial-gradient(ellipse at top, var(--tw-gradient-stops))',
        'dot-grid': 'radial-gradient(circle at center, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
        'line-grid': 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
      },

      // ============================================
      // SHADOWS - Linear minimal (subtle, dark)
      // ============================================
      boxShadow: {
        'none': 'none',
        'xs': '0 1px 2px rgba(0, 0, 0, 0.4)',
        'sm': '0 2px 4px rgba(0, 0, 0, 0.3)',
        'md': '0 4px 8px rgba(0, 0, 0, 0.35)',
        'lg': '0 8px 16px rgba(0, 0, 0, 0.4)',
        'xl': '0 16px 32px rgba(0, 0, 0, 0.45)',
        'glow': '0 0 15px rgba(94, 109, 210, 0.15)',
        'glow-accent': '0 0 15px rgba(152, 114, 232, 0.15)',
        'glow-success': '0 0 15px rgba(76, 175, 129, 0.15)',
        'focus': '0 0 0 2px #08090a, 0 0 0 4px #5e6dd2',
      },

      // ============================================
      // TRANSITIONS - Linear fast
      // ============================================
      transitionDuration: {
        'instant': '50ms',
        'fast': '120ms',
        'normal': '150ms',
        'slow': '200ms',
      },

      transitionTimingFunction: {
        'linear-ease': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        'out': 'cubic-bezier(0, 0, 0.2, 1)',
        'in': 'cubic-bezier(0.4, 0, 1, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      // ============================================
      // Z-INDEX
      // ============================================
      zIndex: {
        'hide': '-1',
        'base': '0',
        'dropdown': '100',
        'sticky': '200',
        'fixed': '300',
        'modal-backdrop': '400',
        'modal': '500',
        'popover': '600',
        'tooltip': '700',
        'toast': '800',
      },

      // ============================================
      // ANIMATIONS - Linear fast & precise
      // ============================================
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(6px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-6px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(94, 109, 210, 0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(94, 109, 210, 0.4)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 150ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        'fade-out': 'fade-out 150ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        'slide-up': 'slide-up 150ms cubic-bezier(0, 0, 0.2, 1)',
        'slide-down': 'slide-down 150ms cubic-bezier(0, 0, 0.2, 1)',
        'scale-in': 'scale-in 120ms cubic-bezier(0, 0, 0.2, 1)',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'glow': 'glow-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
