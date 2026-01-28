/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors (Aligned with design-tokens.ts)
        primary: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B', // DEFAULT
          DEFAULT: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        secondary: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6', // DEFAULT
          DEFAULT: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        // Semantic Colors
        success: {
          50: '#ECFDF5',
          500: '#10B981',
          700: '#047857',
        },
        warning: {
          50: '#FFF7ED',
          500: '#F97316',
          700: '#C2410C',
        },
        destructive: {
          50: '#FFF1F2',
          500: '#F43F5E',
          700: '#BE123C',
        },
        purple: {
          50: '#F5F3FF',
          500: '#8B5CF6',
          700: '#6D28D9',
        },
        // Backgrounds
        bg: {
          base: '#F5F3F0',
          elevated: '#FDFCFB',
          subtle: '#EAE7E3',
        },
        // Foreground / Text
        fg: {
          primary: 'rgba(28, 25, 23, 0.95)',
          secondary: 'rgba(28, 25, 23, 0.70)',
          tertiary: 'rgba(28, 25, 23, 0.50)',
          disabled: 'rgba(28, 25, 23, 0.25)',
          inverse: '#FFFFFF',
        },
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        xs: '6px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '28px',
        full: '9999px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(28, 25, 23, 0.05)',
        sm: '0 1px 2px rgba(28, 25, 23, 0.05)',
        md: '0 4px 8px rgba(28, 25, 23, 0.08), 0 2px 4px rgba(28, 25, 23, 0.04)',
        lg: '0 8px 16px rgba(28, 25, 23, 0.10), 0 4px 8px rgba(28, 25, 23, 0.06)',
        xl: '0 16px 32px rgba(28, 25, 23, 0.12), 0 8px 16px rgba(28, 25, 23, 0.08)',
        '2xl': '0 24px 48px rgba(28, 25, 23, 0.15), 0 12px 24px rgba(28, 25, 23, 0.10)',
        'glow-primary': '0 8px 16px rgba(245, 158, 11, 0.15), 0 4px 8px rgba(245, 158, 11, 0.10)',
        'glow-success': '0 8px 16px rgba(16, 185, 129, 0.15), 0 4px 8px rgba(16, 185, 129, 0.10)',
      }
    },
  },
  plugins: [],
};
