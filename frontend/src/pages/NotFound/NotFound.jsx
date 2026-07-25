import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--gradient-hero)',
    textAlign: 'center',
    padding: '40px 24px',
  }}>
    <div
      className="animate-float"
      style={{ fontSize: '100px', marginBottom: '24px', lineHeight: 1 }}
    >
      🌌
    </div>
    <h1
      className="animate-fade-in-up"
      style={{ fontSize: '80px', fontWeight: 900, fontFamily: 'var(--font-display)', lineHeight: 1, marginBottom: '8px' }}
    >
      <span className="gradient-text">404</span>
    </h1>
    <h2 className="animate-fade-in-up delay-100" style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>
      Page not found
    </h2>
    <p className="animate-fade-in-up delay-200" style={{ color: 'var(--text-secondary)', maxWidth: 360, lineHeight: 1.6, marginBottom: '32px' }}>
      The page you're looking for doesn't exist or has been moved. Let's get you back on track.
    </p>
    <div className="animate-fade-in-up delay-300" style={{ display: 'flex', gap: '12px' }}>
      <Link
        to="/"
        id="not-found-home"
        style={{
          padding: '12px 28px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--gradient-accent)',
          color: '#fff',
          fontWeight: 600,
          fontSize: '15px',
          boxShadow: 'var(--shadow-accent)',
          transition: 'transform 0.2s',
          display: 'inline-block',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        Go Home
      </Link>
      <Link
        to="/dashboard"
        id="not-found-dashboard"
        style={{
          padding: '12px 28px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          color: 'var(--text-secondary)',
          fontWeight: 600,
          fontSize: '15px',
          transition: 'color 0.2s',
          display: 'inline-block',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
      >
        Dashboard
      </Link>
    </div>
  </div>
);

export default NotFound;
