import React, { useState } from 'react';
import { cn } from '../../utils/cn';

/**
 * Helper to compute initials from a full name (e.g. "John Doe" => "JD").
 */
const getInitials = (name = '') => {
  if (!name) return 'U';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Reusable Avatar component for user profiles with image, initials fallback, and status indicators.
 */
const Avatar = ({
  src,
  alt = '',
  name = '',
  size = 'md',
  status,
  className = '',
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5 ring-1',
    sm: 'w-2 h-2 ring-1.5',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3 h-3 ring-2',
    xl: 'w-4 h-4 ring-2',
  };

  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-slate-400',
    busy: 'bg-rose-500',
    away: 'bg-amber-500',
  };

  const initials = getInitials(name || alt);

  return (
    <div className="relative inline-block shrink-0 select-none">
      <div
        className={cn(
          'relative rounded-full flex items-center justify-center overflow-hidden font-semibold border border-slate-200 dark:border-slate-700 bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 shadow-xs',
          sizes[size] || sizes.md,
          className
        )}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {status && statusColors[status] && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-white dark:ring-slate-900',
            statusColors[status],
            statusSizes[size] || statusSizes.md
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};

export default Avatar;
