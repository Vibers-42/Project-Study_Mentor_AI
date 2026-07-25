import React, { useId } from 'react';
import { cn } from '../../utils/cn';

/**
 * Reusable Select dropdown component with custom chevron icon and RHF compatibility.
 */
const Select = React.forwardRef(({
  label,
  error,
  helperText,
  options = [],
  placeholder,
  className = '',
  containerClassName = '',
  id,
  disabled = false,
  required = false,
  children,
  ...props
}, ref) => {
  const defaultId = useId();
  const selectId = id || defaultId;
  const helperId = `${selectId}-helper`;
  const errorId = `${selectId}-error`;

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', containerClassName)}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={cn(
            'w-full h-10 pl-3.5 pr-10 text-sm rounded-lg border appearance-none bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-offset-0 cursor-pointer',
            error
              ? 'border-rose-400 dark:border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 dark:focus:border-indigo-400',
            disabled && 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 cursor-not-allowed border-slate-200 dark:border-slate-800',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled selected hidden>
              {placeholder}
            </option>
          )}

          {children || (
            options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
              >
                {opt.label}
              </option>
            ))
          )}
        </select>

        {/* Chevron icon */}
        <div className="absolute right-3 pointer-events-none text-slate-400 dark:text-slate-500">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>

      {error ? (
        <p id={errorId} className="text-xs font-medium text-rose-500 dark:text-rose-400">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
