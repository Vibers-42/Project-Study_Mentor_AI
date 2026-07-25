import React from 'react';

interface LoadingSpinnerProps {
  size?: number | 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 40, color = 'var(--accent, #7c3aed)', text }) => {
  let numSize = 40;
  if (size === 'sm') numSize = 20;
  else if (size === 'md') numSize = 32;
  else if (size === 'lg') numSize = 48;
  else if (typeof size === 'number') numSize = size;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      padding: text ? '16px' : '0',
    }}>
      <svg
        width={numSize} height={numSize}
        viewBox="0 0 40 40"
        style={{ animation: 'spin 0.9s linear infinite' }}
      >
        <circle
          cx="20" cy="20" r="16"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="4"
        />
        <circle
          cx="20" cy="20" r="16"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="80 20"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      {text && <p style={{ color: 'var(--text-muted, #a3a3a3)', fontSize: '14px', margin: 0 }}>{text}</p>}
    </div>
  );
};

export const PageLoader: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '16px',
  }}>
    <LoadingSpinner size={52} />
    <p style={{ color: 'var(--text-muted, #a3a3a3)', fontSize: '14px' }}>{message}</p>
  </div>
);

export const AILoader: React.FC<{ message?: string }> = ({ message = 'AI is thinking...' }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    padding: '48px 24px',
  }}>
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {[0, 1, 2, 3, 4].map(i => (
        <div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: `hsl(${255 + i * 10}, 70%, 65%)`,
            animation: `fadeInUp 0.8s ease ${i * 0.12}s infinite alternate`,
          }}
        />
      ))}
    </div>
    <div style={{ textAlign: 'center' }}>
      <p style={{ color: 'var(--text-accent, #c4b5fd)', fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>
        {message}
      </p>
      <p style={{ color: 'var(--text-muted, #a3a3a3)', fontSize: '13px' }}>
        AI is crafting a personalized response for you
      </p>
    </div>
  </div>
);

export const SkeletonCard: React.FC<{ height?: number }> = ({ height = 80 }) => (
  <div
    className="skeleton bg-neutral-800/60 animate-pulse"
    style={{
      height,
      borderRadius: 'var(--radius-md, 8px)',
      width: '100%',
    }}
  />
);

export default LoadingSpinner;
