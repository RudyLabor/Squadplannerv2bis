import { memo, forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
}

const InputComponent = forwardRef<HTMLInputElement, InputProps>(
  ({ error, helperText, fullWidth, className = '', ...props }, ref) => {
    return (
      <div className={fullWidth ? 'w-full' : ''}>
        <input
          ref={ref}
          className={`
            bg-white
            px-4 py-3.5
            rounded-2xl
            text-sm font-medium
            text-[var(--fg-primary)]
            placeholder:text-[var(--fg-placeholder)]
            placeholder:font-normal
            border-[0.5px]
            ${error ? 'border-[var(--destructive-500)]' : 'border-[var(--border-medium)]'}
            shadow-[inset_0_1px_2px_rgba(28,25,23,0.04),0_1px_3px_rgba(28,25,23,0.05)]
            transition-all duration-200 ease-out
            focus:outline-none
            focus:border-[var(--primary-500)]
            focus:ring-2
            focus:ring-[var(--primary-500)]/20
            focus:shadow-[inset_0_1px_2px_rgba(245,158,11,0.08),0_0_0_3px_rgba(245,158,11,0.08)]
            hover:border-[var(--border-strong)]
            hover:shadow-[inset_0_1px_2px_rgba(28,25,23,0.06),0_1px_4px_rgba(28,25,23,0.08)]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${fullWidth ? 'w-full' : ''}
            ${className}
          `}
          {...props}
        />
        {helperText && (
          <p className={`
            text-xs
            mt-2 ml-1
            font-medium
            ${error ? 'text-[var(--destructive-500)]' : 'text-[var(--fg-tertiary)]'}
          `}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

InputComponent.displayName = 'Input';

export const Input = memo(InputComponent);