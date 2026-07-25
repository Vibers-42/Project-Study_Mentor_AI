import React from 'react';
import { cn } from '../../utils/cn';
import Button from '../common/Button';

/**
 * Reusable Empty State view component when no data or content is available.
 */
const EmptyState = ({
  icon,
  title = 'No data found',
  description = 'There are no items to display at this time.',
  actionLabel,
  onAction,
  actionButtonProps,
  className = '',
  ...props
}) => {
  const defaultIcon = (
    <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mb-4">
      <svg className="w-8 h-8 stroke-current stroke-[1.5] fill-none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    </div>
  );

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30',
        className
      )}
      {...props}
    >
      {icon !== undefined ? icon : defaultIcon}

      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="md" {...actionButtonProps}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
