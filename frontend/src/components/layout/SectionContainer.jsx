import React from 'react';
import { cn } from '../../utils/cn';

/**
 * SectionContainer component for grouping content into semantic sections within a page.
 */
const SectionContainer = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
  headerClassName = '',
  divider = true,
  ...props
}) => {
  return (
    <section
      className={cn('space-y-4', className)}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div
          className={cn(
            'flex items-center justify-between gap-4 pb-2',
            divider && 'border-b border-slate-100 dark:border-slate-800/80',
            headerClassName
          )}
        >
          <div>
            {title && (
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex items-center gap-2 shrink-0">
              {actions}
            </div>
          )}
        </div>
      )}

      <div>{children}</div>
    </section>
  );
};

export default SectionContainer;
