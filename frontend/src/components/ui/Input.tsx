import { forwardRef, type InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className, id, ...props }, ref) => {
  const inputId = id ?? props.name;
  return (
    <label className="flex flex-col gap-1.5" htmlFor={inputId}>
      {label && <span className="text-xs font-medium text-ink-secondary">{label}</span>}
      <input
        ref={ref}
        id={inputId}
        className={clsx(
          'rounded-lg border border-base-600 bg-base-900 px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted outline-none transition-all',
          'focus:border-accent focus:ring-2 focus:ring-accent/25',
          error && 'border-expense focus:border-expense focus:ring-expense/25',
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-expense">{error}</span>}
    </label>
  );
});
Input.displayName = 'Input';
