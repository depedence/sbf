import { forwardRef, type SelectHTMLAttributes } from 'react';
import clsx from 'clsx';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, id, children, ...props }, ref) => {
    const selectId = id ?? props.name;
    return (
      <label className="flex flex-col gap-1.5" htmlFor={selectId}>
        {label && <span className="text-xs font-medium text-ink-secondary">{label}</span>}
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            'rounded-lg border border-base-600 bg-base-900 px-3 py-2 text-sm text-ink-primary outline-none transition-all',
            'focus:border-accent focus:ring-2 focus:ring-accent/25',
            error && 'border-expense focus:border-expense focus:ring-expense/25',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        {error && <span className="text-xs text-expense">{error}</span>}
      </label>
    );
  },
);
Select.displayName = 'Select';
