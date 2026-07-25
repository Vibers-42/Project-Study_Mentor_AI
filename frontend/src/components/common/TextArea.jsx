import React, { useId } from 'react';
import { cn } from '../../utils/cn';

/**
 * Reusable TextArea component with label, error, helper text, and resize options.
 * Compatible with React Hook Form.
 */
const TextArea = React.forwardRef(({
  label,
  error,
  helperText,
  rows = 4,
  resize = 'vertical',
  className = '',
  containerClassName = '',
  id,
  disabled = false,
  required = false,
  ...props
}, ref) => {
  const defaultId = useId();
  const textareaId = id || defaultId;
  const helperId = `${textareaId}-helper`;
  const errorId = `${textareaId}-error`;

  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', containerClassName)}>
      {label && (
        <label
          htmlFor={textareaId}
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? errorId : helperText ? helperId : undefined
        }
        className={cn(
          'w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          resizeClasses[resize] || resizeClasses.vertical,
          error
            ? 'border-rose-400 dark:border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
            : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 dark:focus:border-indigo-400',
          disabled && 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 cursor-not-allowed border-slate-200 dark:border-slate-800',
          className
        )}
        {...props}
      />

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

TextArea.displayName = 'TextArea';

export default TextArea;
