import React from 'react';

const VARIANTS = {
  primary: {
    background: 'var(--gradient-accent)',
    color: '#fff',
    border: 'none',
    boxShadow: 'var(--shadow-accent)',
  },
  secondary: {
    background: 'var(--bg-elevated)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border)',
    boxShadow: 'none',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
    boxShadow: 'none',
  },
  danger: {
    background: 'var(--danger-dim)',
    color: 'var(--danger)',
    border: '1px solid var(--danger)',
    boxShadow: 'none',
  },
  success: {
    background: 'var(--success-dim)',
    color: 'var(--success)',
    border: '1px solid var(--success)',
    boxShadow: 'none',
  },
};

const SIZES = {
  sm: { padding: '6px 14px', fontSize: '13px', borderRadius: 'var(--radius-sm)', height: '32px' },
  md: { padding: '10px 22px', fontSize: '14px', borderRadius: 'var(--radius-md)', height: '42px' },
  lg: { padding: '13px 28px', fontSize: '16px', borderRadius: 'var(--radius-md)', height: '52px' },
};

const Spinner = ({ size = 16 }) => (
  <svg
    width={size} height={size}
    viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5"
    style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}
  >
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconRight,
  fullWidth = false,
  onClick,
  type = 'button',
  style: extraStyle = {},
  ...props
}) => {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: 600,
        fontFamily: 'var(--font-sans)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s',
        width: fullWidth ? '100%' : 'auto',
        outline: 'none',
        whiteSpace: 'nowrap',
        ...v,
        ...s,
        ...extraStyle,
      }}
      onMouseEnter={e => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          if (variant === 'primary') {
            e.currentTarget.style.boxShadow = '0 6px 28px rgba(124,58,237,0.55)';
          }
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = v.boxShadow || 'none';
      }}
      {...props}
    >
      {loading ? <Spinner size={16} /> : icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
      {!loading && iconRight && <span style={{ display: 'flex', alignItems: 'center' }}>{iconRight}</span>}
    </button>
  );
};

export default Button;
