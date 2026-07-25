import React, { useId } from 'react';
import { cn } from '../../utils/cn';

/**
 * Reusable RadioButton component with custom styling and accessible markup.
 */
const RadioButton = React.forwardRef(({
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
  const radioId = id || defaultId;

  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      <label
        htmlFor={radioId}
        className={cn(
          'inline-flex items-start gap-2.5 cursor-pointer select-none group',
          disabled && 'cursor-not-allowed opacity-60'
        )}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            ref={ref}
            type="radio"
            id={radioId}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'w-4 h-4 rounded-full border transition-all duration-150 flex items-center justify-center bg-white dark:bg-slate-900',
              'border-slate-300 dark:border-slate-700 group-hover:border-indigo-500',
              'peer-checked:border-indigo-600 dark:peer-checked:border-indigo-400',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500/30 peer-focus-visible:ring-offset-1',
              error && 'border-rose-500 dark:border-rose-400',
              className
            )}
          >
            <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 scale-0 peer-checked:scale-100 transition-transform duration-150" />
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
        <p className="text-xs font-medium text-rose-500 dark:text-rose-400 pl-6">
          {error}
        </p>
      )}
    </div>
  );
});

RadioButton.displayName = 'RadioButton';

export default RadioButton;
