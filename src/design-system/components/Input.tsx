/**
 * INPUT COMPONENT - LINEAR DESIGN SYSTEM
 * Inspired by Linear.app - Compact, Dark, Precise
 * Uses hardcoded hex colors for consistency
 */

import { forwardRef, InputHTMLAttributes, ReactNode, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================
type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  icon?: ReactNode;
  iconRight?: ReactNode;
  error?: string;
  hint?: string;
  label?: string;
}

// ============================================
// LINEAR STYLES
// ============================================
const baseStyles = `
  w-full
  bg-[#18191b]
  border border-[#27282b]
  rounded-lg
  text-[#f7f8f8]
  placeholder:text-[#5e6063]
  transition-all duration-100
  focus:outline-none focus:border-[#5e6dd2] focus:ring-2 focus:ring-[#5e6dd2]/20
  disabled:bg-[#1f2023] disabled:text-[#5e6063] disabled:cursor-not-allowed
`;

const sizeStyles: Record<InputSize, string> = {
  sm: 'h-7 px-2.5 text-[12px]',
  md: 'h-8 px-3 text-[13px]',
  lg: 'h-9 px-3.5 text-[13px]',
};

const errorStyles = `
  border-[#e5534b]
  focus:border-[#e5534b] focus:ring-[#e5534b]/20
`;

const iconPaddingStyles: Record<InputSize, { left: string; right: string }> = {
  sm: { left: 'pl-7', right: 'pr-7' },
  md: { left: 'pl-8', right: 'pr-8' },
  lg: { left: 'pl-9', right: 'pr-9' },
};

const iconSizeStyles: Record<InputSize, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-4 h-4',
};

const iconPositionStyles: Record<InputSize, { left: string; right: string }> = {
  sm: { left: 'left-2', right: 'right-2' },
  md: { left: 'left-2.5', right: 'right-2.5' },
  lg: { left: 'left-3', right: 'right-3' },
};

// ============================================
// COMPONENT
// ============================================
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      icon,
      iconRight,
      error,
      hint,
      label,
      className,
      type,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[12px] font-medium text-[#8b8d90] mb-1.5"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {/* Left Icon */}
          {icon && (
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 text-[#8b8d90]',
                iconPositionStyles[size].left
              )}
            >
              <span className={iconSizeStyles[size]}>{icon}</span>
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            type={isPassword && showPassword ? 'text' : type}
            className={cn(
              baseStyles,
              sizeStyles[size],
              error && errorStyles,
              icon && iconPaddingStyles[size].left,
              (iconRight || isPassword) && iconPaddingStyles[size].right,
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />

          {/* Right Icon / Password Toggle */}
          {(iconRight || isPassword) && (
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2',
                iconPositionStyles[size].right
              )}
            >
              {isPassword ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#8b8d90] hover:text-[#f7f8f8] transition-colors duration-100"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className={iconSizeStyles[size]} />
                  ) : (
                    <Eye className={iconSizeStyles[size]} />
                  )}
                </button>
              ) : (
                <span className={cn(iconSizeStyles[size], 'text-[#8b8d90]')}>
                  {iconRight}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-[11px] text-[#e5534b]"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Hint Text */}
        {hint && !error && (
          <p
            id={`${inputId}-hint`}
            className="mt-1.5 text-[11px] text-[#8b8d90]"
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ============================================
// TEXTAREA VARIANT
// ============================================
interface TextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  hint?: string;
  label?: string;
  rows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, hint, label, rows = 4, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[12px] font-medium text-[#8b8d90] mb-1.5"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={cn(
            baseStyles,
            'py-2.5 px-3 text-[13px] resize-none rounded-lg',
            error && errorStyles,
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />

        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-[11px] text-[#e5534b]"
            role="alert"
          >
            {error}
          </p>
        )}

        {hint && !error && (
          <p
            id={`${inputId}-hint`}
            className="mt-1.5 text-[11px] text-[#8b8d90]"
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Input;
