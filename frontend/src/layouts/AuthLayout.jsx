import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const FEATURE_ITEMS = [
  { icon: '⚡', title: 'Adaptive AI Questions', desc: 'Difficulty adjusts in real-time to your performance' },
  { icon: '🎯', title: 'Instant Feedback', desc: 'Claude evaluates every answer with detailed insights' },
  { icon: '🗺️', title: 'Learning Roadmaps', desc: 'Personalized paths to your dream role' },
];

const AuthLayout = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: 'var(--bg-base)',
    }}>
      {/* ─── Left panel: Branding ─── */}
      <div
        style={{
          display: 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 56px',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #0f0524 0%, #1a0a3d 40%, #0d1a3a 100%)',
        }}
        className="lg-flex"
      >
        {/* Background glow blobs */}
        <div style={{
          position: 'absolute', top: '10%', left: '10%',
          width: 300, height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '5%',
          width: 200, height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px' }}>
            <div style={{
              width: 44, height: 44,
              borderRadius: 12,
              background: 'var(--gradient-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 24px rgba(124,58,237,0.6)',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', color: '#fff' }}>
              AI Study Mentor
            </span>
          </Link>

          <h1 style={{ fontSize: '38px', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '16px' }}>
            Unlock your
            <span style={{
              display: 'block',
              background: 'linear-gradient(90deg, #a78bfa, #67e8f9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              learning potential
            </span>
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '48px' }}>
            Personalized AI coaching powered by Claude. Practice interviews, get instant feedback, and build your skills faster.
          </p>

          {/* Feature mini-cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {FEATURE_ITEMS.map((item, i) => (
              <div
                key={i}
                className="animate-fade-in-up glass"
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  animationDelay: `${i * 0.1}s`,
                  animationFillMode: 'both',
                }}
              >
                <span style={{ fontSize: '22px' }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, color: '#fff', fontSize: '14px' }}>{item.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '2px' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Right panel: Auth Form ─── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 32px',
        gridColumn: '1 / -1',  /* full width on small, overridden by grid on large */
      }}
      className="auth-right"
      >
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Mobile logo */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <Link to="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px',
              color: 'var(--text-primary)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'var(--gradient-accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              AI Study Mentor
            </Link>
          </div>
          <Outlet />
        </div>
      </div>

      {/* Responsive style hack — Tailwind v4 doesn't need this but inline styles do */}
      <style>{`
        @media (min-width: 1024px) {
          .lg-flex { display: flex !important; }
          .auth-right { grid-column: 2 / 3 !important; }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
