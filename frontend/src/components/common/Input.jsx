import React, { useId } from 'react';
import { cn } from '../../utils/cn';

/**
 * Reusable Input component with label, error, helper text, and icon support.
 * Compatible with React Hook Form.
 */
const Input = React.forwardRef(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  containerClassName = '',
  id,
  type = 'text',
  disabled = false,
  required = false,
  ...props
}, ref) => {
  const defaultId = useId();
  const inputId = id || defaultId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={cn(
            'w-full h-10 px-3.5 text-sm rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error
              ? 'border-rose-400 dark:border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 dark:focus:border-indigo-400',
            disabled && 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 cursor-not-allowed border-slate-200 dark:border-slate-800',
            className
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 flex items-center text-slate-400 dark:text-slate-500">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p id={errorId} className="text-xs font-medium text-rose-500 dark:text-rose-400 flex items-center gap-1">
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

Input.displayName = 'Input';

export default Input;
