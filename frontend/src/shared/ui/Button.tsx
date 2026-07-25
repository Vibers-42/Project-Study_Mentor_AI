import React, { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
}

const VARIANTS: Record<string, React.CSSProperties> = {
  primary: {
    background: 'var(--gradient-accent, linear-gradient(135deg, #7c3aed, #4f46e5))',
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 14px rgba(124,58,237,0.3)',
  },
  secondary: {
    background: 'var(--bg-elevated, #262626)',
    color: 'var(--text-primary, #f5f5f5)',
    border: '1px solid var(--border, #404040)',
    boxShadow: 'none',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary, #a3a3a3)',
    border: '1px solid var(--border, rgba(255,255,255,0.1))',
    boxShadow: 'none',
  },
  danger: {
    background: 'var(--danger-dim, rgba(239,68,68,0.2))',
    color: 'var(--danger, #ef4444)',
    border: '1px solid rgba(239,68,68,0.4)',
    boxShadow: 'none',
  },
  success: {
    background: 'var(--success-dim, rgba(16,185,129,0.2))',
    color: 'var(--success, #10b981)',
    border: '1px solid rgba(16,185,129,0.4)',
    boxShadow: 'none',
  },
};

const SIZES: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '6px 14px', fontSize: '13px', borderRadius: 'var(--radius-sm, 6px)', minHeight: '32px' },
  md: { padding: '10px 22px', fontSize: '14px', borderRadius: 'var(--radius-md, 8px)', minHeight: '42px' },
  lg: { padding: '13px 28px', fontSize: '16px', borderRadius: 'var(--radius-md, 8px)', minHeight: '52px' },
};

const Spinner: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size} height={size}
    viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5"
    style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}
  >
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconRight,
  fullWidth = false,
  onClick,
  className = '',
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
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 ${fullWidth ? 'w-full' : ''} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98] hover:translate-y-[-1px]'} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: 600,
        fontFamily: 'var(--font-sans, system-ui)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s',
        width: fullWidth ? '100%' : 'auto',
        outline: 'none',
        whiteSpace: 'nowrap',
        ...v,
        ...s,
        ...extraStyle,
      }}
      {...props}
    >
      {loading ? <Spinner size={16} /> : icon && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>}
      {children}
      {!loading && iconRight && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{iconRight}</span>}
    </button>
  );
};

export default Button;
