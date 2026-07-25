import React from 'react';
import { cn } from '../../utils/cn';
import Spinner from './Spinner';

/**
 * Reusable Button component supporting variants, sizes, icons, and loading states.
 */
const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  as: Component = 'button',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none select-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-sm shadow-indigo-500/20 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-400',
    secondary: 'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 focus:ring-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:focus:ring-slate-500',
    outline: 'border border-slate-300 hover:bg-slate-50 active:bg-slate-100 text-slate-700 focus:ring-indigo-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:focus:ring-indigo-400',
    danger: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-sm shadow-rose-500/20 focus:ring-rose-500 dark:bg-rose-500 dark:hover:bg-rose-600 dark:focus:ring-rose-400',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 focus:ring-slate-400 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:focus:ring-slate-500',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-10',
    lg: 'text-base px-5 py-2.5 gap-2.5 h-12',
  };

  const spinnerColors = {
    primary: 'text-white',
    secondary: 'text-slate-700 dark:text-slate-200',
    outline: 'text-indigo-600 dark:text-indigo-400',
    danger: 'text-white',
    ghost: 'text-slate-600 dark:text-slate-300',
  };

  return (
    <Component
      ref={ref}
      type={Component === 'button' ? type : undefined}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size={size === 'lg' ? 'md' : 'sm'} color={spinnerColors[variant]} />
          <span>{children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0 items-center">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="inline-flex shrink-0 items-center">{rightIcon}</span>}
        </>
      )}
    </Component>
  );
});

Button.displayName = 'Button';

export default Button;
