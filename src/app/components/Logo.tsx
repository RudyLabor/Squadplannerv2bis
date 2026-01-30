/**
 * SQUAD PLANNER LOGO - WORLD-CLASS DESIGN
 * Concept: "Convergence Grid" - 4 elements aligning toward coordination
 * Represents: team alignment, planning precision, reliability
 *
 * Design principles:
 * - Works at 16px (favicon) to 128px (marketing)
 * - Readable in monochrome
 * - No gaming aesthetics
 * - Inspires trust, clarity, organization
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePerformanceDebug } from '@/app/hooks/usePerformanceMonitor';

interface LogoProps {
  variant?: 'full' | 'icon' | 'header' | 'sidebar';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  mono?: 'light' | 'dark';
  className?: string;
}

// Size configurations
const sizes = {
  xs: { icon: 16, text: 11, gap: 6 },
  sm: { icon: 24, text: 13, gap: 8 },
  md: { icon: 32, text: 15, gap: 10 },
  lg: { icon: 40, text: 18, gap: 12 },
  xl: { icon: 56, text: 24, gap: 14 },
};

/**
 * The Logomark - "Convergence Grid"
 * 4 rounded squares in a grid pattern with varying opacity
 * Suggests: squad members converging on a plan
 */
function LogoMark({
  size = 32,
  color = '#5e6dd2',
  className = '',
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* Grid of 4 rounded squares - suggesting coordination */}
      <rect x="4" y="4" width="11" height="11" rx="2.5" fill={color} opacity="1" />
      <rect x="17" y="4" width="11" height="11" rx="2.5" fill={color} opacity="0.65" />
      <rect x="4" y="17" width="11" height="11" rx="2.5" fill={color} opacity="0.65" />
      <rect x="17" y="17" width="11" height="11" rx="2.5" fill={color} opacity="0.35" />
    </svg>
  );
}

/**
 * Compact logo for app icons and favicons
 * Background container with SP initials
 */
function LogoCompact({
  size = 32,
  color = '#5e6dd2',
  className = '',
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
    >
      <span
        className="font-bold text-white"
        style={{ fontSize: size * 0.35, letterSpacing: '-0.02em' }}
      >
        SP
      </span>
    </div>
  );
}

/**
 * Main Logo Component
 */
export function Logo({
  variant = 'full',
  size = 'md',
  animated = false,
  mono,
  className = '',
}: LogoProps) {
  const navigate = useNavigate();
  const { handleSecretTap, isMonitoring } = usePerformanceDebug();

  const s = sizes[size];

  // Color based on mono variant
  const iconColor = mono === 'light' ? '#ffffff' : mono === 'dark' ? '#1f2023' : '#5e6dd2';
  const textColor = mono === 'light' ? '#ffffff' : mono === 'dark' ? '#1f2023' : '#f7f8f8';
  const subtextColor = mono === 'light' ? 'rgba(255,255,255,0.6)' : mono === 'dark' ? 'rgba(31,32,35,0.6)' : '#8b8d90';

  // ============================================
  // SIDEBAR VARIANT - For desktop navigation
  // ============================================
  if (variant === 'sidebar') {
    return (
      <motion.button
        onClick={() => {
          handleSecretTap();
          navigate('/home');
        }}
        className={`flex items-center gap-3 ${className}`}
        whileHover={animated ? { scale: 1.01 } : undefined}
        transition={{ duration: 0.15 }}
      >
        <LogoMark size={s.icon} color={iconColor} />
        <span
          className="font-semibold"
          style={{
            fontSize: s.text,
            color: textColor,
            letterSpacing: '-0.01em',
          }}
        >
          Squad Planner
        </span>
        {isMonitoring && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
        )}
      </motion.button>
    );
  }

  // ============================================
  // HEADER VARIANT - Compact for mobile header
  // ============================================
  if (variant === 'header') {
    return (
      <motion.button
        onClick={() => {
          handleSecretTap();
          navigate('/home');
        }}
        className={`flex items-center gap-2.5 ${className}`}
        whileHover={animated ? { scale: 1.02 } : undefined}
        transition={{ duration: 0.15 }}
      >
        <LogoMark size={s.icon} color={iconColor} />
        <div className="flex items-baseline gap-1">
          <span
            className="font-semibold"
            style={{ fontSize: s.text, color: textColor }}
          >
            Squad
          </span>
          <span
            className="font-medium"
            style={{ fontSize: s.text * 0.85, color: subtextColor }}
          >
            Planner
          </span>
        </div>
        {isMonitoring && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse ml-1" />
        )}
      </motion.button>
    );
  }

  // ============================================
  // ICON VARIANT - Logomark only
  // ============================================
  if (variant === 'icon') {
    return (
      <motion.button
        onClick={() => navigate('/home')}
        className={`inline-flex items-center justify-center cursor-pointer ${className}`}
        whileHover={animated ? { scale: 1.05 } : undefined}
        transition={{ duration: 0.15 }}
      >
        <LogoMark size={s.icon} color={iconColor} />
      </motion.button>
    );
  }

  // ============================================
  // FULL VARIANT - For splash, marketing
  // ============================================
  return (
    <motion.button
      onClick={() => navigate('/home')}
      className={`flex flex-col items-center cursor-pointer ${className}`}
      whileHover={animated ? { scale: 1.02 } : undefined}
      transition={{ duration: 0.15 }}
    >
      <LogoMark size={s.icon * 1.5} color={iconColor} className="mb-4" />
      <span
        className="font-semibold"
        style={{
          fontSize: s.text * 1.3,
          color: textColor,
          letterSpacing: '-0.02em',
        }}
      >
        Squad Planner
      </span>
      <span
        className="font-medium mt-1"
        style={{ fontSize: s.text * 0.75, color: subtextColor }}
      >
        Coordination fiable
      </span>
    </motion.button>
  );
}

/**
 * Animated loader with logo
 */
export function LogoLoader({ size = 24 }: { size?: number }) {
  return (
    <motion.div
      className="flex items-center justify-center"
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <LogoMark size={size} color="#5e6dd2" />
    </motion.div>
  );
}

/**
 * Export logomark for direct use
 */
export { LogoMark, LogoCompact };
