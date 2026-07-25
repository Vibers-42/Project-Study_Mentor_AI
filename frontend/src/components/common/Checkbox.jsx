import React, { useId } from 'react';
import { cn } from '../../utils/cn';

/**
 * Reusable Checkbox component with accessible label and custom styling.
 */
const Checkbox = React.forwardRef(({
  label,
  description,
  error,
  className = '',
  containerClassName = '',
  id,
  disabled = false,
  ...props
}, ref) => {
  const defaultId = useId();
  const checkboxId = id || defaultId;
  const errorId = `${checkboxId}-error`;

  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      <label
        htmlFor={checkboxId}
        className={cn(
          'inline-flex items-start gap-2.5 cursor-pointer select-none group',
          disabled && 'cursor-not-allowed opacity-60'
        )}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'w-4 h-4 rounded border transition-all duration-150 flex items-center justify-center bg-white dark:bg-slate-900',
              'border-slate-300 dark:border-slate-700 group-hover:border-indigo-500',
              'peer-checked:bg-indigo-600 peer-checked:border-indigo-600 dark:peer-checked:bg-indigo-500 dark:peer-checked:border-indigo-500',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500/30 peer-focus-visible:ring-offset-1',
              error && 'border-rose-500 dark:border-rose-400',
              className
            )}
          >
            <svg
              className="w-3 h-3 text-white stroke-current stroke-[2.5] fill-none opacity-0 peer-checked:opacity-100 transition-opacity duration-150"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {(label || description) && (
          <div className="flex flex-col text-sm">
            {label && (
              <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {description}
              </span>
            )}
          </div>
        )}
      </label>

      {error && (
        <p id={errorId} className="text-xs font-medium text-rose-500 dark:text-rose-400 pl-6">
          {error}
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
