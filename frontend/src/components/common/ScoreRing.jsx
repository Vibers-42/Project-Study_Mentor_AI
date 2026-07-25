import React, { useEffect, useState } from 'react';

const SCORE_COLORS = [
  { min: 0,  max: 4,  color: '#f43f5e' }, // danger
  { min: 4,  max: 6,  color: '#f59e0b' }, // warning
  { min: 6,  max: 8,  color: '#06b6d4' }, // info
  { min: 8,  max: 10, color: '#10b981' }, // success
];

const getColor = (score) => {
  for (const c of SCORE_COLORS) {
    if (score >= c.min && score <= c.max) return c.color;
  }
  return '#7c3aed';
};

const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const ScoreRing = ({ score = 0, max = 10, size = 140, strokeWidth = 8, label, showScore = true }) => {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(timeout);
  }, [score]);

  const pct = Math.min(Math.max(animated / max, 0), 1);
  const dashOffset = CIRCUMFERENCE * (1 - pct);
  const color = getColor(score);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          style={{ transform: 'rotate(-90deg)' }}
          className="score-ring"
        >
          {/* Background track */}
          <circle
            cx="50" cy="50" r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx="50" cy="50" r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{
              transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1), stroke 0.4s ease',
              filter: `drop-shadow(0 0 6px ${color}88)`,
            }}
          />
        </svg>
        {showScore && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{
              fontSize: size * 0.22,
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color,
              lineHeight: 1,
              filter: `drop-shadow(0 0 8px ${color}66)`,
            }}>
              {score.toFixed(1)}
            </span>
            <span style={{ fontSize: size * 0.1, color: 'var(--text-muted)', fontWeight: 500 }}>
              / {max}
            </span>
          </div>
        )}
      </div>
      {label && (
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
          {label}
        </span>
      )}
    </div>
  );
};

export default ScoreRing;
