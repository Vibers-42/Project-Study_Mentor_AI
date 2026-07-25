import React from 'react';

const Card = ({
  children,
  header,
  footer,
  variant = 'default',
  hover = false,
  glow = false,
  style: extraStyle = {},
  className = '',
  ...props
}) => {
  const variants = {
    default: { background: 'var(--bg-card)', border: '1px solid var(--border)' },
    elevated: { background: 'var(--bg-elevated)', border: '1px solid var(--border)' },
    accent: { background: 'var(--accent-dim)', border: '1px solid var(--border-accent)' },
    success: { background: 'var(--success-dim)', border: '1px solid var(--success)' },
    danger:  { background: 'var(--danger-dim)',  border: '1px solid var(--danger)' },
    warning: { background: 'var(--warning-dim)', border: '1px solid var(--warning)' },
  };
  const v = variants[variant] || variants.default;

  return (
    <div
      className={`glass-card ${hover ? 'hover-lift' : ''} ${className}`}
      style={{
        ...v,
        borderRadius: 'var(--radius-lg)',
        backdropFilter: 'blur(20px)',
        boxShadow: glow ? 'var(--shadow-accent)' : 'var(--shadow-md)',
        overflow: 'hidden',
        ...extraStyle,
      }}
      {...props}
    >
      {header && (
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border)',
          fontWeight: 600,
          fontSize: '15px',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {header}
        </div>
      )}
      <div style={{ padding: '24px' }}>
        {children}
      </div>
      {footer && (
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid var(--border)',
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
