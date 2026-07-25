import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Standard PageContainer component to enforce consistent page layouts and headers.
 */
const PageContainer = ({
  children,
  title,
  subtitle,
  actions,
  breadcrumbs,
  maxWidth = 'max-w-7xl',
  className = '',
  headerClassName = '',
  ...props
}) => {
  return (
    <div
      className={cn(
        'w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6',
        maxWidth,
        className
      )}
      {...props}
    >
      {/* Breadcrumbs slot */}
      {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}

      {/* Page Header */}
      {(title || subtitle || actions) && (
        <div
          className={cn(
            'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800',
            headerClassName
          )}
        >
          <div className="space-y-1">
            {title && (
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Page Content */}
      <main className="w-full">{children}</main>
    </div>
  );
};

export default PageContainer;
