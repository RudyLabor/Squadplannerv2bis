/**
 * SQUAD PLANNER DESIGN SYSTEM - TOKENS
 * Standard: Linear / Stripe / Apple
 * Version: 1.0
 *
 * Ces tokens sont la source de vérité pour tout le design.
 * Ne JAMAIS utiliser de valeurs Tailwind brutes (p-4, text-blue-500, etc.)
 * Toujours utiliser les tokens sémantiques.
 */

// ============================================
// SPACING SYSTEM - Base 4px grid
// ============================================
export const spacing = {
  0: '0px',
  px: '1px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
} as const;

// Semantic spacing aliases
export const space = {
  // Component internal spacing
  'component-padding-xs': spacing[2],   // 8px
  'component-padding-sm': spacing[3],   // 12px
  'component-padding-md': spacing[4],   // 16px
  'component-padding-lg': spacing[5],   // 20px
  'component-padding-xl': spacing[6],   // 24px

  // Gap between elements
  'gap-xs': spacing[1],     // 4px
  'gap-sm': spacing[2],     // 8px
  'gap-md': spacing[3],     // 12px
  'gap-lg': spacing[4],     // 16px
  'gap-xl': spacing[6],     // 24px

  // Section spacing
  'section-sm': spacing[6],   // 24px
  'section-md': spacing[8],   // 32px
  'section-lg': spacing[12],  // 48px
  'section-xl': spacing[16],  // 64px

  // Page margins
  'page-margin': spacing[4],  // 16px mobile
  'page-margin-desktop': spacing[6], // 24px desktop
} as const;

// ============================================
// TYPOGRAPHY SYSTEM
// ============================================
export const fontFamily = {
  sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  mono: '"JetBrains Mono", "SF Mono", Monaco, Consolas, monospace',
} as const;

export const fontSize = {
  '2xs': ['10px', { lineHeight: '14px', letterSpacing: '0.02em' }],
  'xs': ['12px', { lineHeight: '16px', letterSpacing: '0.01em' }],
  'sm': ['14px', { lineHeight: '20px', letterSpacing: '0' }],
  'base': ['15px', { lineHeight: '22px', letterSpacing: '-0.01em' }],
  'md': ['16px', { lineHeight: '24px', letterSpacing: '-0.01em' }],
  'lg': ['18px', { lineHeight: '26px', letterSpacing: '-0.015em' }],
  'xl': ['20px', { lineHeight: '28px', letterSpacing: '-0.02em' }],
  '2xl': ['24px', { lineHeight: '32px', letterSpacing: '-0.02em' }],
  '3xl': ['30px', { lineHeight: '38px', letterSpacing: '-0.025em' }],
  '4xl': ['36px', { lineHeight: '44px', letterSpacing: '-0.03em' }],
  '5xl': ['48px', { lineHeight: '56px', letterSpacing: '-0.03em' }],
} as const;

export const fontWeight = {
  normal: '400',
  medium: '510',  // Linear uses 510, not 500
  semibold: '600',
  bold: '700',
} as const;

// Semantic typography
export const typography = {
  // Headings
  'heading-1': { fontSize: fontSize['4xl'], fontWeight: fontWeight.bold },
  'heading-2': { fontSize: fontSize['3xl'], fontWeight: fontWeight.bold },
  'heading-3': { fontSize: fontSize['2xl'], fontWeight: fontWeight.semibold },
  'heading-4': { fontSize: fontSize['xl'], fontWeight: fontWeight.semibold },
  'heading-5': { fontSize: fontSize['lg'], fontWeight: fontWeight.semibold },
  'heading-6': { fontSize: fontSize['md'], fontWeight: fontWeight.semibold },

  // Body
  'body-lg': { fontSize: fontSize['md'], fontWeight: fontWeight.normal },
  'body': { fontSize: fontSize['base'], fontWeight: fontWeight.normal },
  'body-sm': { fontSize: fontSize['sm'], fontWeight: fontWeight.normal },
  'body-xs': { fontSize: fontSize['xs'], fontWeight: fontWeight.normal },

  // Labels
  'label-lg': { fontSize: fontSize['sm'], fontWeight: fontWeight.medium },
  'label': { fontSize: fontSize['xs'], fontWeight: fontWeight.medium },
  'label-sm': { fontSize: fontSize['2xs'], fontWeight: fontWeight.medium },

  // Code
  'code': { fontSize: fontSize['sm'], fontWeight: fontWeight.normal, fontFamily: fontFamily.mono },
} as const;

// ============================================
// COLOR SYSTEM - Light Mode
// ============================================
export const colors = {
  // Grayscale - Neutral palette
  gray: {
    0: '#FFFFFF',
    25: '#FCFCFD',
    50: '#F9FAFB',
    100: '#F2F4F7',
    200: '#EAECF0',
    300: '#D0D5DD',
    400: '#98A2B3',
    500: '#667085',
    600: '#475467',
    700: '#344054',
    800: '#1D2939',
    900: '#101828',
    950: '#0C111D',
  },

  // Primary - Indigo (Linear-inspired)
  primary: {
    25: '#F5F8FF',
    50: '#EEF4FF',
    100: '#E0EAFF',
    200: '#C7D7FE',
    300: '#A4BCFD',
    400: '#8098F9',
    500: '#6172F3',
    600: '#444CE7',
    700: '#3538CD',
    800: '#2D31A6',
    900: '#2D3282',
    950: '#1F235B',
  },

  // Success - Green
  success: {
    25: '#F6FEF9',
    50: '#ECFDF3',
    100: '#D1FADF',
    200: '#A6F4C5',
    300: '#6CE9A6',
    400: '#32D583',
    500: '#12B76A',
    600: '#039855',
    700: '#027A48',
    800: '#05603A',
    900: '#054F31',
  },

  // Warning - Amber
  warning: {
    25: '#FFFCF5',
    50: '#FFFAEB',
    100: '#FEF0C7',
    200: '#FEDF89',
    300: '#FEC84B',
    400: '#FDB022',
    500: '#F79009',
    600: '#DC6803',
    700: '#B54708',
    800: '#93370D',
    900: '#7A2E0E',
  },

  // Error - Red
  error: {
    25: '#FFFBFA',
    50: '#FEF3F2',
    100: '#FEE4E2',
    200: '#FECDCA',
    300: '#FDA29B',
    400: '#F97066',
    500: '#F04438',
    600: '#D92D20',
    700: '#B42318',
    800: '#912018',
    900: '#7A271A',
  },

  // Accent colors for gaming
  purple: {
    500: '#7C3AED',
    600: '#6D28D9',
  },
  pink: {
    500: '#EC4899',
    600: '#DB2777',
  },
  cyan: {
    500: '#06B6D4',
    600: '#0891B2',
  },
} as const;

// Semantic color aliases
export const semanticColors = {
  // Backgrounds
  'bg-primary': colors.gray[0],
  'bg-secondary': colors.gray[50],
  'bg-tertiary': colors.gray[100],
  'bg-inverse': colors.gray[900],
  'bg-brand': colors.primary[600],
  'bg-brand-subtle': colors.primary[50],
  'bg-success': colors.success[50],
  'bg-warning': colors.warning[50],
  'bg-error': colors.error[50],

  // Text
  'text-primary': colors.gray[900],
  'text-secondary': colors.gray[600],
  'text-tertiary': colors.gray[500],
  'text-placeholder': colors.gray[400],
  'text-inverse': colors.gray[0],
  'text-brand': colors.primary[600],
  'text-success': colors.success[600],
  'text-warning': colors.warning[600],
  'text-error': colors.error[600],

  // Borders
  'border-primary': colors.gray[200],
  'border-secondary': colors.gray[100],
  'border-focus': colors.primary[500],
  'border-error': colors.error[500],

  // Interactive states
  'interactive-default': colors.gray[0],
  'interactive-hover': colors.gray[50],
  'interactive-active': colors.gray[100],
  'interactive-disabled': colors.gray[100],
} as const;

// ============================================
// DARK MODE COLORS - LINEAR DESIGN SYSTEM
// ============================================

// Linear-inspired dark mode palette
export const linearDark = {
  // Backgrounds - Layered depth system
  bg: {
    base: '#08090a',        // Darkest - page background
    elevated: '#101012',    // Cards, surfaces
    surface: '#18191b',     // Raised elements
    hover: '#1f2023',       // Hover state
    active: '#27282b',      // Active/pressed state
    overlay: 'rgba(0, 0, 0, 0.6)', // Modal overlays
  },

  // Foreground/Text - Opacity-based hierarchy
  fg: {
    primary: '#f7f8f8',     // 100% - Main text
    secondary: '#c9cace',   // ~80% - Secondary text
    tertiary: '#8b8d90',    // ~55% - Muted text
    quaternary: '#5e6063',  // ~35% - Very muted
    disabled: '#3a3b3f',    // ~20% - Disabled state
  },

  // Borders - Subtle white overlays
  border: {
    subtle: 'rgba(255, 255, 255, 0.05)',
    default: 'rgba(255, 255, 255, 0.08)',
    strong: 'rgba(255, 255, 255, 0.12)',
    focus: 'rgba(94, 109, 210, 0.5)',
  },

  // Primary accent - Linear indigo
  primary: {
    default: '#5e6dd2',
    hover: '#6a79db',
    active: '#4f5cb8',
    muted: 'rgba(94, 109, 210, 0.15)',
    subtle: 'rgba(94, 109, 210, 0.08)',
  },

  // Status colors
  success: {
    default: '#4ade80',
    muted: 'rgba(74, 222, 128, 0.15)',
    text: '#4ade80',
  },
  warning: {
    default: '#f5a623',
    muted: 'rgba(245, 166, 35, 0.15)',
    text: '#f5a623',
  },
  error: {
    default: '#f87171',
    muted: 'rgba(248, 113, 113, 0.15)',
    text: '#f87171',
  },
  info: {
    default: '#60a5fa',
    muted: 'rgba(96, 165, 250, 0.15)',
    text: '#60a5fa',
  },

  // Accent colors for categorization
  accent: {
    purple: '#a78bfa',
    pink: '#f472b6',
    cyan: '#22d3ee',
    orange: '#fb923c',
    lime: '#a3e635',
  },
} as const;

// Legacy dark colors (keeping for backward compatibility)
export const darkColors = {
  // Backgrounds
  'bg-primary': linearDark.bg.base,
  'bg-secondary': linearDark.bg.elevated,
  'bg-tertiary': linearDark.bg.surface,
  'bg-inverse': colors.gray[0],
  'bg-brand': linearDark.primary.default,
  'bg-brand-subtle': linearDark.primary.muted,

  // Text
  'text-primary': linearDark.fg.primary,
  'text-secondary': linearDark.fg.secondary,
  'text-tertiary': linearDark.fg.tertiary,
  'text-placeholder': linearDark.fg.quaternary,
  'text-inverse': colors.gray[900],

  // Borders
  'border-primary': linearDark.border.default,
  'border-secondary': linearDark.border.subtle,

  // Interactive states
  'interactive-default': linearDark.bg.elevated,
  'interactive-hover': linearDark.bg.hover,
  'interactive-active': linearDark.bg.active,
} as const;

// ============================================
// SHADOWS - Elevation system
// ============================================
export const shadows = {
  'none': 'none',
  'xs': '0px 1px 2px rgba(16, 24, 40, 0.05)',
  'sm': '0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)',
  'md': '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
  'lg': '0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)',
  'xl': '0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)',
  '2xl': '0px 24px 48px -12px rgba(16, 24, 40, 0.18)',
  '3xl': '0px 32px 64px -12px rgba(16, 24, 40, 0.14)',

  // Focus rings
  'focus-ring': '0px 0px 0px 4px rgba(97, 114, 243, 0.24)',
  'focus-ring-error': '0px 0px 0px 4px rgba(240, 68, 56, 0.24)',
} as const;

// Dark mode shadows - Linear style
export const darkShadows = {
  'xs': '0px 1px 2px rgba(0, 0, 0, 0.4)',
  'sm': '0px 2px 4px rgba(0, 0, 0, 0.5)',
  'md': '0px 4px 12px rgba(0, 0, 0, 0.5)',
  'lg': '0px 8px 24px rgba(0, 0, 0, 0.5)',
  'xl': '0px 16px 40px rgba(0, 0, 0, 0.5)',
  '2xl': '0px 24px 48px rgba(0, 0, 0, 0.6)',

  // Card shadows
  'card': '0px 2px 8px rgba(0, 0, 0, 0.3)',
  'card-hover': '0px 8px 24px rgba(0, 0, 0, 0.4)',

  // Button shadows (primary)
  'button-primary': '0px 4px 12px rgba(94, 109, 210, 0.25)',
  'button-primary-hover': '0px 8px 20px rgba(94, 109, 210, 0.35)',

  // Focus rings
  'focus-ring': '0px 0px 0px 3px rgba(94, 109, 210, 0.25)',
  'focus-ring-error': '0px 0px 0px 3px rgba(248, 113, 113, 0.25)',
} as const;

// ============================================
// BORDER RADIUS
// ============================================
export const borderRadius = {
  'none': '0px',
  'xs': '4px',
  'sm': '6px',
  'md': '8px',
  'lg': '12px',
  'xl': '16px',
  '2xl': '20px',
  '3xl': '24px',
  'full': '9999px',
} as const;

// ============================================
// ANIMATIONS & TRANSITIONS
// ============================================
export const transitions = {
  // Durations
  'duration-instant': '50ms',
  'duration-fast': '100ms',
  'duration-normal': '150ms',
  'duration-slow': '200ms',
  'duration-slower': '300ms',

  // Easings
  'ease-default': 'cubic-bezier(0.4, 0, 0.2, 1)',
  'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
  'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
  'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  'ease-bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  'ease-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
} as const;

// Framer Motion spring configs
export const springs = {
  'snappy': { type: 'spring', stiffness: 400, damping: 30 },
  'gentle': { type: 'spring', stiffness: 200, damping: 20 },
  'bouncy': { type: 'spring', stiffness: 300, damping: 15 },
  'smooth': { type: 'spring', stiffness: 100, damping: 20 },
} as const;

// ============================================
// Z-INDEX SCALE
// ============================================
export const zIndex = {
  'hide': -1,
  'base': 0,
  'dropdown': 10,
  'sticky': 20,
  'overlay': 30,
  'modal': 40,
  'popover': 50,
  'toast': 60,
  'tooltip': 70,
} as const;

// ============================================
// BREAKPOINTS
// ============================================
export const breakpoints = {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
} as const;

// ============================================
// ICON SIZES
// ============================================
export const iconSizes = {
  'xs': '12px',
  'sm': '16px',
  'md': '20px',
  'lg': '24px',
  'xl': '32px',
  '2xl': '40px',
} as const;

// ============================================
// FRAMER MOTION VARIANTS - Linear-style animations
// ============================================
export const motionVariants = {
  // Container with stagger children
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.02,
      },
    },
  },

  // Item fade up
  item: {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  },

  // Card hover
  cardHover: {
    rest: { y: 0, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)' },
    hover: {
      y: -2,
      boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.4)',
      transition: { duration: 0.2, ease: 'easeOut' },
    },
  },

  // Button press
  buttonTap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },

  // Fade in
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
  },

  // Scale fade
  scaleFade: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] },
    },
  },

  // Slide up
  slideUp: {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
    },
  },
} as const;

// ============================================
// CSS CUSTOM PROPERTIES GENERATOR
// ============================================
export const generateCSSVariables = () => `
  /* Linear Dark Theme - Auto-generated */
  :root {
    /* Backgrounds */
    --bg-base: ${linearDark.bg.base};
    --bg-elevated: ${linearDark.bg.elevated};
    --bg-surface: ${linearDark.bg.surface};
    --bg-hover: ${linearDark.bg.hover};
    --bg-active: ${linearDark.bg.active};
    --bg-overlay: ${linearDark.bg.overlay};

    /* Foreground */
    --fg-primary: ${linearDark.fg.primary};
    --fg-secondary: ${linearDark.fg.secondary};
    --fg-tertiary: ${linearDark.fg.tertiary};
    --fg-quaternary: ${linearDark.fg.quaternary};
    --fg-disabled: ${linearDark.fg.disabled};

    /* Borders */
    --border-subtle: ${linearDark.border.subtle};
    --border-default: ${linearDark.border.default};
    --border-strong: ${linearDark.border.strong};
    --border-focus: ${linearDark.border.focus};

    /* Primary */
    --primary: ${linearDark.primary.default};
    --primary-hover: ${linearDark.primary.hover};
    --primary-active: ${linearDark.primary.active};
    --primary-muted: ${linearDark.primary.muted};
    --primary-subtle: ${linearDark.primary.subtle};

    /* Status */
    --success: ${linearDark.success.default};
    --success-muted: ${linearDark.success.muted};
    --warning: ${linearDark.warning.default};
    --warning-muted: ${linearDark.warning.muted};
    --error: ${linearDark.error.default};
    --error-muted: ${linearDark.error.muted};
    --info: ${linearDark.info.default};
    --info-muted: ${linearDark.info.muted};

    /* Shadows */
    --shadow-sm: ${darkShadows.sm};
    --shadow-md: ${darkShadows.md};
    --shadow-lg: ${darkShadows.lg};
    --shadow-card: ${darkShadows.card};
    --shadow-card-hover: ${darkShadows['card-hover']};
    --shadow-button: ${darkShadows['button-primary']};
    --shadow-focus: ${darkShadows['focus-ring']};

    /* Border Radius */
    --radius-sm: ${borderRadius.sm};
    --radius-md: ${borderRadius.md};
    --radius-lg: ${borderRadius.lg};
    --radius-xl: ${borderRadius.xl};

    /* Transitions */
    --transition-fast: ${transitions['duration-fast']} ${transitions['ease-default']};
    --transition-normal: ${transitions['duration-normal']} ${transitions['ease-default']};
    --transition-slow: ${transitions['duration-slow']} ${transitions['ease-default']};
  }
`;

// ============================================
// TAILWIND CLASS HELPERS
// ============================================
export const tw = {
  // Background classes
  bgBase: 'bg-[#08090a]',
  bgElevated: 'bg-[#101012]',
  bgSurface: 'bg-[#18191b]',
  bgHover: 'bg-[#1f2023]',
  bgActive: 'bg-[#27282b]',

  // Text classes
  textPrimary: 'text-[#f7f8f8]',
  textSecondary: 'text-[#c9cace]',
  textTertiary: 'text-[#8b8d90]',
  textQuaternary: 'text-[#5e6063]',

  // Border classes
  borderSubtle: 'border-[rgba(255,255,255,0.05)]',
  borderDefault: 'border-[rgba(255,255,255,0.08)]',
  borderStrong: 'border-[rgba(255,255,255,0.12)]',

  // Primary accent
  primary: 'text-[#5e6dd2]',
  bgPrimary: 'bg-[#5e6dd2]',
  bgPrimaryHover: 'hover:bg-[#6a79db]',

  // Status
  success: 'text-[#4ade80]',
  warning: 'text-[#f5a623]',
  error: 'text-[#f87171]',

  // Common patterns
  card: 'bg-[#101012] border border-[rgba(255,255,255,0.06)] rounded-xl',
  cardHover: 'hover:bg-[#18191b] hover:border-[rgba(255,255,255,0.12)]',
  input: 'bg-[#101012] border border-[rgba(255,255,255,0.08)] rounded-lg text-[#f7f8f8] placeholder:text-[#5e6063]',
  inputFocus: 'focus:border-[#5e6dd2] focus:ring-1 focus:ring-[rgba(94,109,210,0.25)]',
} as const;
