import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getStats, getSessions } from '../../services/progress.service';
import Button from '../../components/common/Button';
import { SkeletonCard } from '../../components/common/LoadingSpinner';

const SESSION_MODES = [
  {
    id: 'session',
    icon: '📚',
    title: 'Study Session',
    desc: 'Practice questions on any topic with adaptive difficulty',
    color: 'var(--accent)',
    href: '/session',
  },
  {
    id: 'interview',
    icon: '🎤',
    title: 'Interview Mode',
    desc: 'Full mock interview for any job role',
    color: '#10b981',
    href: '/interview',
  },
  {
    id: 'progress',
    icon: '📈',
    title: 'View Progress',
    desc: "Track your performance and see how you've improved",
    color: '#f59e0b',
    href: '/progress',
  },
];

const StatCard = ({ value, label, icon, color, loading }) => (
  <div className="glass-card hover-lift" style={{ padding: '22px 24px' }}>
    {loading ? (
      <SkeletonCard height={60} />
    ) : (
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: 46, height: 46,
          borderRadius: 'var(--radius-md)',
          background: `${color}18`,
          border: `1px solid ${color}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '22px',
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: '26px', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1 }}>
            {value ?? '—'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{label}</div>
        </div>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, sess] = await Promise.all([getStats(), getSessions()]);
        setStats(s);
        setSessions(Array.isArray(sess) ? sess.slice(0, 4) : []);
      } catch {
        // If Supabase not configured yet, show empty state
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';

  return (
    <div className="page-enter">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, marginBottom: '6px' }}>
          {greeting()}, {firstName} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Ready to level up your skills today?
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <StatCard icon="🎯" label="Total Sessions"  value={stats?.total_sessions}   color="#7c3aed" loading={loading} />
        <StatCard icon="⭐" label="Average Score"   value={stats?.average_score != null ? `${Number(stats.average_score).toFixed(1)}/10` : null} color="#10b981" loading={loading} />
        <StatCard icon="🔥" label="Current Streak"  value={stats?.streak != null ? `${stats.streak}d` : null} color="#f59e0b" loading={loading} />
        <StatCard icon="❓" label="Questions Done"  value={stats?.total_questions}  color="#06b6d4" loading={loading} />
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '14px', color: 'var(--text-secondary)' }}>
          Start a new session
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}>
          {SESSION_MODES.map(mode => (
            <div
              key={mode.id}
              id={`mode-card-${mode.id}`}
              className="glass-card hover-lift"
              onClick={() => navigate(mode.href)}
              style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div style={{
                width: 48, height: 48,
                borderRadius: 14,
                background: `${mode.color}18`,
                border: `1px solid ${mode.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px',
              }}>
                {mode.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>{mode.title}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5 }}>{mode.desc}</div>
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px', color: mode.color, fontWeight: 600, fontSize: '13px' }}>
                Start now
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-secondary)' }}>Recent Sessions</h2>
          <Link to="/progress" style={{ fontSize: '13px', color: 'var(--accent-light)', fontWeight: 600 }}>View all →</Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[1, 2].map(i => <SkeletonCard key={i} height={64} />)}
          </div>
        ) : sessions.length === 0 ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌱</div>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '16px' }}>
              No sessions yet. Start your first session now!
            </p>
            <Button onClick={() => navigate('/session')} size="sm">Start Learning</Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sessions.map((s, i) => (
              <div key={i} className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: 42, height: 42,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--accent-dim)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '15px', color: 'var(--accent-light)', flexShrink: 0,
                }}>
                  {s.overall_score != null ? Number(s.overall_score).toFixed(1) : '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{s.topic || s.job_role || 'General Session'}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.questions_count || 0} questions · {new Date(s.created_at).toLocaleDateString()}</div>
                </div>
                <div style={{
                  padding: '4px 10px', borderRadius: 'var(--radius-full)',
                  fontSize: '12px', fontWeight: 600,
                  background: (s.overall_score >= 7) ? 'var(--success-dim)' : (s.overall_score >= 5) ? 'var(--warning-dim)' : 'var(--danger-dim)',
                  color: (s.overall_score >= 7) ? 'var(--success)' : (s.overall_score >= 5) ? 'var(--warning)' : 'var(--danger)',
                }}>
                  {s.overall_score >= 7 ? 'Good' : s.overall_score >= 5 ? 'Fair' : 'Needs Work'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
