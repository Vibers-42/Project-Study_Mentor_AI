import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/cn';

/**
 * Accessible Theme Toggle button for switching between Light and Dark modes.
 */
const ThemeToggle = ({ className = '', size = 'md', ...props }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-2.5',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'relative inline-flex items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 select-none active:scale-95',
        'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-slate-200',
        sizeClasses[size] || sizeClasses.md,
        className
      )}
      {...props}
    >
      {/* Sun Icon for Dark Mode (click to turn light) */}
      <svg
        className={cn(
          'transition-transform duration-300 fill-current',
          iconSizes[size] || iconSizes.md,
          isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0 absolute'
        )}
        viewBox="0 0 24 24"
      >
        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
      </svg>

      {/* Moon Icon for Light Mode (click to turn dark) */}
      <svg
        className={cn(
          'transition-transform duration-300 fill-current',
          iconSizes[size] || iconSizes.md,
          !isDark ? 'rotate-0 scale-100' : '-rotate-90 scale-0 absolute'
        )}
        viewBox="0 0 24 24"
      >
        <path d="M12.3 2c.43 0 .77.37.7 0.8-.3 1.8.2 3.7 1.5 5 1.3 1.3 3.2 1.8 5 1.5.43-.07.8.27.8.7 0 5-4 9.1-9 9.1-5 0-9.1-4-9.1-9 0-4.6 3.5-8.4 8.1-9z" />
      </svg>
    </button>
  );
};

export default ThemeToggle;
