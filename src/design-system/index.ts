/**
 * SQUAD PLANNER DESIGN SYSTEM
 * Standard: Linear / Stripe / Apple
 *
 * This is the main entry point for the design system.
 * Import components from here, not from individual files.
 *
 * @example
 * import { Button, Card, Badge, Input, Skeleton } from '@/design-system';
 */

// ============================================
// COMPONENTS
// ============================================
export { Button, IconButton } from './components/Button';
export { Card, CardHeader, CardContent, CardFooter } from './components/Card';
export { Badge, StatusBadge } from './components/Badge';
export { Input, Textarea } from './components/Input';
export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonListItem,
  SkeletonStat,
  SkeletonPage,
} from './components/Skeleton';
export { Divider, OrangeDivider } from './components/Divider';

// ============================================
// TOKENS
// ============================================
export {
  spacing,
  space,
  fontFamily,
  fontSize,
  fontWeight,
  typography,
  colors,
  semanticColors,
  darkColors,
  shadows,
  darkShadows,
  borderRadius,
  transitions,
  springs,
  zIndex,
  breakpoints,
  iconSizes,
} from './tokens';

// ============================================
// THEME
// ============================================
export { ThemeProvider, useTheme, ThemeToggle } from './ThemeProvider';

// ============================================
// RE-EXPORT UTILITIES
// ============================================
export { cn } from '@/lib/utils';
