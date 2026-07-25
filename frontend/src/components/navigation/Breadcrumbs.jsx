import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

/**
 * Accessible Breadcrumbs navigation component.
 */
const Breadcrumbs = ({
  items = [],
  separator,
  className = '',
  ...props
}) => {
  if (!items || items.length === 0) return null;

  const defaultSeparator = (
    <svg className="w-4 h-4 text-slate-400 dark:text-slate-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-xs sm:text-sm', className)} {...props}>
      <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5 sm:gap-2">
              {index > 0 && (
                <span aria-hidden="true">
                  {separator || defaultSeparator}
                </span>
              )}

              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={cn(
                    'font-medium text-slate-900 dark:text-slate-100 truncate max-w-[200px]',
                    !isLast && 'text-slate-500 dark:text-slate-400'
                  )}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 font-medium transition-colors truncate max-w-[150px]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
