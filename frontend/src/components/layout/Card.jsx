import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Reusable Card container component.
 */
const Card = ({
  children,
  title,
  subtitle,
  headerActions,
  footer,
  noPadding = false,
  hoverable = false,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-xl border bg-white text-slate-900 shadow-sm transition-all duration-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100',
        hoverable && 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer',
        className
      )}
      {...props}
    >
      {(title || subtitle || headerActions) && (
        <div
          className={cn(
            'flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80',
            headerClassName
          )}
        >
          <div>
            {title && <h3 className="font-semibold text-lg leading-6 text-slate-900 dark:text-slate-100">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </div>
      )}

      <div className={cn(!noPadding && 'p-6', bodyClassName)}>
        {children}
      </div>

      {footer && (
        <div
          className={cn(
            'px-6 py-3.5 bg-slate-50/70 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800/80 rounded-b-xl flex items-center justify-between',
            footerClassName
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
