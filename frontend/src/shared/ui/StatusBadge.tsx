import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'violet';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border)]',
  success: 'bg-[var(--success-dim)] text-[var(--success)] border-emerald-500/20',
  warning: 'bg-[var(--warning-dim)] text-[var(--warning)] border-amber-500/20',
  danger: 'bg-[var(--danger-dim)] text-[var(--danger)] border-red-500/20',
  info: 'bg-[var(--info-dim)] text-[var(--info)] border-sky-500/20',
  violet: 'bg-[var(--accent-dim)] text-[var(--text-accent)] border-[var(--border-accent)]',
};

export const StatusBadge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  dot = false,
  className = '',
}) => {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border ${variantClasses[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full bg-current`} />}
      {label}
    </span>
  );
};

export { StatusBadge as Badge };
