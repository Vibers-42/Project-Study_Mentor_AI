import React, { useId } from 'react';
import { cn } from '../../utils/cn';

/**
 * Accessible Toggle Switch component for boolean settings and options.
 */
const ToggleSwitch = React.forwardRef(({
  label,
  description,
  checked = false,
  onChange,
  size = 'md',
  disabled = false,
  className = '',
  containerClassName = '',
  id,
  ...props
}, ref) => {
  const defaultId = useId();
  const switchId = id || defaultId;

  const trackSizes = {
    sm: 'w-8 h-4',
    md: 'w-11 h-6',
    lg: 'w-14 h-7',
  };

  const knobSizes = {
    sm: 'w-3 h-3 translate-x-0.5 peer-checked:translate-x-4.5',
    md: 'w-5 h-5 translate-x-0.5 peer-checked:translate-x-5.5',
    lg: 'w-6 h-6 translate-x-0.5 peer-checked:translate-x-7.5',
  };

  return (
    <div className={cn('flex items-center justify-between gap-4', containerClassName)}>
      {(label || description) && (
        <div className="flex flex-col text-sm">
          {label && (
            <label
              htmlFor={switchId}
              className={cn(
                'font-medium text-slate-700 dark:text-slate-300 cursor-pointer',
                disabled && 'cursor-not-allowed opacity-60'
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {description}
            </span>
          )}
        </div>
      )}

      <label
        htmlFor={switchId}
        className={cn(
          'relative inline-flex items-center cursor-pointer shrink-0 select-none',
          disabled && 'cursor-not-allowed opacity-60'
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          id={switchId}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          aria-checked={checked}
          className="peer sr-only"
          {...props}
        />
        <div
          className={cn(
            'rounded-full transition-colors duration-200 bg-slate-200 dark:bg-slate-700',
            'peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500/30 peer-focus-visible:ring-offset-2',
            trackSizes[size] || trackSizes.md,
            className
          )}
        />
        <div
          className={cn(
            'absolute rounded-full bg-white shadow-md transition-transform duration-200 pointer-events-none',
            knobSizes[size] || knobSizes.md
          )}
        />
      </label>
    </div>
  );
});

ToggleSwitch.displayName = 'ToggleSwitch';

export default ToggleSwitch;
