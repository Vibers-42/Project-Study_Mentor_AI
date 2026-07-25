import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Spinner / Loader component for async actions and loading states.
 */
const Spinner = ({
  size = 'md',
  className = '',
  color = 'text-indigo-600 dark:text-indigo-400',
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]',
        sizeClasses[size] || sizeClasses.md,
        color,
        className
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
