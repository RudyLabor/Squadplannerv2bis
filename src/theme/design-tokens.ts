// 🎨 SQUAD PLANNER - DESIGN TOKENS (Single Source of Truth)
// Based on "Warm Premium" aesthetic (Amber/Teal/Beige)

export const COLORS = {
  // Brand Colors
  primary: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    DEFAULT: '#F59E0B', // 500 - Main Brand Color
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
    DEFAULT: '#14B8A6', // 500 - Secondary Brand Color
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
  },

  // Base Backgrounds
  background: {
    base: '#F5F3F0',     // Warm Beige (Page BG)
    elevated: '#FDFCFB', // Off-white (Card BG)
    subtle: '#EAE7E3',   // Darker Beige (Secondary BG)
    overlay: 'rgba(253, 252, 251, 0.98)',
  },

  // Text / Foreground
  text: {
    primary: 'rgba(28, 25, 23, 0.95)',   // Stone 900
    secondary: 'rgba(28, 25, 23, 0.70)', // Stone 600
    tertiary: 'rgba(28, 25, 23, 0.50)',  // Stone 400
    disabled: 'rgba(28, 25, 23, 0.25)',  // Stone 200
    inverse: '#FFFFFF',
  },

  // Status Colors
  success: {
    DEFAULT: '#10B981',
    bg: '#ECFDF5',
    text: '#047857',
  },
  warning: {
    DEFAULT: '#F97316',
    bg: '#FFF7ED',
    text: '#C2410C',
  },
  error: {
    DEFAULT: '#F43F5E',
    bg: '#FFF1F2',
    text: '#BE123C',
  },
  info: {
    DEFAULT: '#3B82F6',
    bg: '#EFF6FF',
    text: '#1D4ED8',
  },
  purple: {
    DEFAULT: '#8B5CF6',
    bg: '#F5F3FF',
    text: '#6D28D9',
    gradient: 'from-violet-500 to-purple-600'
  }
} as const;

export const SPACING = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
} as const;

export const RADIUS = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
} as const;

export const SHADOWS = {
  sm: '0 1px 2px rgba(28, 25, 23, 0.05)',
  md: '0 4px 8px rgba(28, 25, 23, 0.08), 0 2px 4px rgba(28, 25, 23, 0.04)',
  lg: '0 8px 16px rgba(28, 25, 23, 0.10), 0 4px 8px rgba(28, 25, 23, 0.06)',
  colored: {
    primary: '0 8px 16px rgba(245, 158, 11, 0.15), 0 4px 8px rgba(245, 158, 11, 0.10)',
    success: '0 8px 16px rgba(16, 185, 129, 0.15), 0 4px 8px rgba(16, 185, 129, 0.10)',
  }
} as const;

export const TYPOGRAPHY = {
  fontFamily: {
    display: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  }
} as const;

const tokens = {
  colors: COLORS,
  spacing: SPACING,
  radius: RADIUS,
  shadows: SHADOWS,
  typography: TYPOGRAPHY,
};

export default tokens;
