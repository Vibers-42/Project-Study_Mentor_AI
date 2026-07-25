import React, { ReactNode } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  variant?: 'default' | 'elevated' | 'accent' | 'success' | 'danger' | 'warning';
  hover?: boolean;
  glow?: boolean;
  style?: React.CSSProperties;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  variant = 'default',
  hover = false,
  glow = false,
  style: extraStyle = {},
  className = '',
  noPadding = false,
  ...props
}) => {
  const variants: Record<string, React.CSSProperties> = {
    default: { background: 'var(--bg-card, rgba(20,20,22,0.6))', border: '1px solid var(--border, rgba(255,255,255,0.08))' },
    elevated: { background: 'var(--bg-elevated, rgba(30,30,35,0.7))', border: '1px solid var(--border, rgba(255,255,255,0.08))' },
    accent: { background: 'var(--accent-dim, rgba(124,58,237,0.15))', border: '1px solid var(--border-accent, rgba(124,58,237,0.3))' },
    success: { background: 'var(--success-dim, rgba(16,185,129,0.15))', border: '1px solid var(--success, #10b981)' },
    danger:  { background: 'var(--danger-dim, rgba(239,68,68,0.15))',  border: '1px solid var(--danger, #ef4444)' },
    warning: { background: 'var(--warning-dim, rgba(245,158,11,0.15))', border: '1px solid var(--warning, #f59e0b)' },
  };
  const v = variants[variant] || variants.default;

  return (
    <div
      className={`glass-card bg-neutral-900/90 border border-neutral-800/80 rounded-2xl min-w-0 relative transition-all shadow-lg shadow-black/20 ${hover ? 'hover-lift hover:scale-[1.01]' : ''} ${className}`}
      style={{
        ...v,
        borderRadius: 'var(--radius-lg, 16px)',
        backdropFilter: 'blur(20px)',
        boxShadow: glow ? 'var(--shadow-accent, 0 8px 32px rgba(124,58,237,0.3))' : undefined,
        overflow: 'hidden',
        ...extraStyle,
      }}
      {...props}
    >
      {header && (
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border, rgba(255,255,255,0.08))',
          fontWeight: 600,
          fontSize: '15px',
          color: 'var(--text-primary, #fff)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {header}
        </div>
      )}
      <div className={!noPadding ? 'p-6' : ''} style={!noPadding ? { padding: '24px' } : undefined}>
        {children}
      </div>
      {footer && (
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid var(--border, rgba(255,255,255,0.08))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '10px',
        }}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
