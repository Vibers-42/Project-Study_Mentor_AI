import React from 'react';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: '⚡',
    title: 'Adaptive Questions',
    desc: 'Our AI adjusts difficulty in real-time based on your answers. No more too-easy or too-hard sessions.',
    color: '#a78bfa',
  },
  {
    icon: '🧠',
    title: 'Claude-Powered Evaluation',
    desc: 'Get instant, detailed feedback on every answer — strengths, weaknesses, and exactly what a perfect answer looks like.',
    color: '#67e8f9',
  },
  {
    icon: '🗺️',
    title: 'Personalized Roadmaps',
    desc: 'Tell us your target role. Get a step-by-step learning plan built just for you, with curated resources.',
    color: '#86efac',
  },
  {
    icon: '🎤',
    title: 'Interview Simulation',
    desc: 'Full mock interview sessions with behavioral, technical, and scenario-based questions for any role.',
    color: '#fcd34d',
  },
  {
    icon: '📈',
    title: 'Progress Tracking',
    desc: 'See how your scores improve across sessions. Spot weak areas and tackle them with focused practice.',
    color: '#f9a8d4',
  },
  {
    icon: '📚',
    title: 'Curated Resources',
    desc: 'AI recommends the best articles, docs, and tutorials based on exactly where you are struggling.',
    color: '#fdba74',
  },
];

const STATS = [
  { value: '10K+', label: 'Practice Questions' },
  { value: '95%', label: 'Satisfaction Rate' },
  { value: '50+', label: 'Job Roles Covered' },
  { value: '2×', label: 'Faster Prep Time' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Create your profile', desc: 'Tell us your current skill level and your target role.' },
  { step: '02', title: 'Start a session', desc: 'Choose study mode or full interview simulation.' },
  { step: '03', title: 'Answer & get feedback', desc: 'Claude evaluates every answer with actionable insights.' },
  { step: '04', title: 'Track & improve', desc: 'Watch your scores rise session over session.' },
];

const Landing = () => {
  return (
    <div style={{ color: 'var(--text-primary)' }}>
      {/* ─── Hero ─── */}
      <section style={{
        minHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 32px',
        background: 'var(--gradient-hero)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background blobs */}
        <div style={{
          position: 'absolute', top: '15%', left: '5%',
          width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'float 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '5%',
          width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'float 10s ease-in-out 2s infinite reverse',
        }} />

        {/* Badge */}
        <div className="animate-fade-in-up" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--accent-dim)',
          border: '1px solid var(--border-accent)',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--accent-light)',
          marginBottom: '28px',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'pulseGlow 2s ease infinite' }} />
          Powered by Claude AI · Adaptive Learning
        </div>

        {/* Heading */}
        <h1
          className="animate-fade-in-up delay-100"
          style={{ fontSize: 'clamp(38px, 6vw, 72px)', fontWeight: 900, lineHeight: 1.1, maxWidth: 900, marginBottom: '24px' }}
        >
          Your Personal
          <span className="gradient-text-animated" style={{ display: 'block' }}>
            AI Study Coach
          </span>
          for Any Role
        </h1>

        <p
          className="animate-fade-in-up delay-200"
          style={{
            fontSize: 'clamp(16px, 2.2vw, 20px)',
            color: 'var(--text-secondary)',
            maxWidth: 600,
            lineHeight: 1.7,
            marginBottom: '44px',
          }}
        >
          Practice adaptive interview questions, get instant AI feedback on every answer, and build a personalized learning roadmap — all powered by Claude.
        </p>

        {/* CTAs */}
        <div className="animate-fade-in-up delay-300" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link
            to="/register"
            id="hero-cta-register"
            style={{
              padding: '14px 32px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-accent)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '16px',
              boxShadow: '0 4px 24px rgba(124,58,237,0.5)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 36px rgba(124,58,237,0.65)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(124,58,237,0.5)';
            }}
          >
            Start for Free
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link
            to="/login"
            id="hero-cta-login"
            style={{
              padding: '14px 32px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-glass)',
              backdropFilter: 'blur(12px)',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '16px',
              border: '1px solid var(--border)',
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--bg-elevated)';
              e.currentTarget.style.borderColor = 'var(--border-accent)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--bg-glass)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            Log In
          </Link>
        </div>

        {/* Stats strip */}
        <div
          className="animate-fade-in-up delay-400"
          style={{
            display: 'flex',
            gap: '48px',
            marginTop: '72px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ─── */}
      <section style={{
        padding: '100px 32px',
        background: 'var(--bg-surface)',
        maxWidth: '100%',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: '14px' }}>
              Everything you need to{' '}
              <span className="gradient-text">ace any interview</span>
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto' }}>
              One platform, all the tools. From adaptive practice to AI feedback to curated resources.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="glass-card hover-lift animate-fade-in-up"
                style={{ padding: '28px', animationDelay: `${i * 0.07}s`, animationFillMode: 'both' }}
              >
                <div style={{
                  width: 48, height: 48,
                  borderRadius: 14,
                  background: `${f.color}18`,
                  border: `1px solid ${f.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px',
                  marginBottom: '16px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section style={{ padding: '100px 32px', background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: '14px' }}>
            How it works
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '60px' }}>
            Get started in minutes. No setup required.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            {HOW_IT_WORKS.map((item, i) => (
              <div
                key={i}
                className="glass-card"
                style={{
                  padding: '24px 28px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '28px',
                  fontWeight: 900,
                  background: 'var(--gradient-accent)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1,
                  flexShrink: 0,
                }}>
                  {item.step}
                </span>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '16px' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section style={{
        padding: '90px 32px',
        background: 'linear-gradient(135deg, #1a0a3d 0%, #0d1829 100%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>
            Ready to supercharge your learning?
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', marginBottom: '36px', maxWidth: 480, margin: '0 auto 36px' }}>
            Join thousands of learners who prepare smarter with AI.
          </p>
          <Link
            to="/register"
            id="bottom-cta-register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 40px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-accent)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '16px',
              boxShadow: '0 4px 28px rgba(124,58,237,0.6)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 40px rgba(124,58,237,0.75)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 28px rgba(124,58,237,0.6)';
            }}
          >
            Get Started Free
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
