import React from 'react';

export const LoadingSpinner = ({ size = 40, color = 'var(--accent)' }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  }}>
    <svg
      width={size} height={size}
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
  </div>
);

export const PageLoader = ({ message = 'Loading...' }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '16px',
  }}>
    <LoadingSpinner size={52} />
    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{message}</p>
  </div>
);

export const AILoader = ({ message = 'AI is thinking...' }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    padding: '48px 24px',
  }}>
    {/* Animated brain/dots */}
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
      <p style={{ color: 'var(--text-accent)', fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>
        {message}
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
        Claude is crafting a personalized response for you
      </p>
    </div>
  </div>
);

export const SkeletonCard = ({ height = 80 }) => (
  <div
    className="skeleton"
    style={{
      height,
      borderRadius: 'var(--radius-md)',
      width: '100%',
    }}
  />
);

export default LoadingSpinner;
