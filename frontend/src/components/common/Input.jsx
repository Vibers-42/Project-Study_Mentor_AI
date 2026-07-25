import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  hint,
  icon,
  iconRight,
  type = 'text',
  id,
  style: extraStyle = {},
  ...props
}, ref) => {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: error ? 'var(--danger)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {label}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <span style={{
            position: 'absolute',
            left: '12px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
          }}>
            {icon}
          </span>
        )}

        {type === 'textarea' ? (
          <textarea
            ref={ref}
            id={inputId}
            style={{
              width: '100%',
              padding: icon ? '12px 14px 12px 40px' : '12px 14px',
              background: 'var(--bg-elevated)',
              border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontFamily: 'var(--font-sans)',
              resize: 'vertical',
              minHeight: '120px',
              outline: 'none',
              transition: 'border-color 0.2s',
              ...extraStyle,
            }}
            onFocus={e => { e.target.style.borderColor = error ? 'var(--danger)' : 'var(--accent)'; }}
            onBlur={e => { e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)'; }}
            {...props}
          />
        ) : (
          <input
            ref={ref}
            id={inputId}
            type={type}
            style={{
              width: '100%',
              height: '44px',
              padding: `0 ${iconRight ? '40px' : '14px'} 0 ${icon ? '40px' : '14px'}`,
              background: 'var(--bg-elevated)',
              border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
              transition: 'border-color 0.2s',
              ...extraStyle,
            }}
            onFocus={e => { e.target.style.borderColor = error ? 'var(--danger)' : 'var(--accent)'; }}
            onBlur={e => { e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)'; }}
            {...props}
          />
        )}

        {iconRight && (
          <span style={{
            position: 'absolute',
            right: '12px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
          }}>
            {iconRight}
          </span>
        )}
      </div>

      {error && (
        <span style={{ fontSize: '12px', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {error}
        </span>
      )}
      {hint && !error && (
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{hint}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
