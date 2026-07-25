import React from 'react';
import { cn } from '../../utils/cn';
import Button from '../common/Button';

/**
 * Reusable Error State view component for displaying inline or full-page error messages with a retry option.
 */
const ErrorState = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading content. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
  className = '',
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20',
        className
      )}
      {...props}
    >
      <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 shrink-0 shadow-xs">
        <svg className="w-8 h-8 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-rose-950 dark:text-rose-200 mb-1">
        {title}
      </h3>

      {message && (
        <p className="text-sm text-rose-700/80 dark:text-rose-300/80 max-w-md mb-6 leading-relaxed">
          {message}
        </p>
      )}

      {onRetry && (
        <Button onClick={onRetry} variant="danger" size="md">
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
