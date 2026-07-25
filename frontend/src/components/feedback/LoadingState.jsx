import React from 'react';
import { cn } from '../../utils/cn';
import Spinner from '../common/Spinner';

/**
 * Reusable Loading State component supporting inline section loaders and fullScreen overlay loaders.
 */
const LoadingState = ({
  message = 'Loading data...',
  size = 'lg',
  fullScreen = false,
  className = '',
  ...props
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 text-center">
      <Spinner size={size} color="text-indigo-600 dark:text-indigo-400" />
      {message && (
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-xs">
        {content}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 min-h-[200px]',
        className
      )}
      {...props}
    >
      {content}
    </div>
  );
};

export default LoadingState;
