import React, { useState, useEffect } from 'react';
import { getStats, getSessions } from '../../services/progress.service';
import { useToast } from '../../contexts/ToastContext';
import ScoreRing from '../../components/common/ScoreRing';
import { SkeletonCard } from '../../components/common/LoadingSpinner';

const Progress = () => {
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const [s, sess] = await Promise.all([getStats(), getSessions()]);
        setStats(s);
        setSessions(Array.isArray(sess) ? sess : []);
      } catch (err) {
        toast.error('Could not load progress data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const avgScore = stats?.average_score ?? 0;
  const totalSessions = stats?.total_sessions ?? 0;
  const totalQuestions = stats?.total_questions ?? 0;
  const streak = stats?.streak ?? 0;

  return (
    <div className="page-enter">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>Your Progress</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Track your learning journey over time</p>
      </div>

      {/* Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '14px',
        marginBottom: '32px',
      }}>
        {[
          { icon: '🎯', label: 'Total Sessions', value: totalSessions, color: '#7c3aed' },
          { icon: '❓', label: 'Questions Done', value: totalQuestions, color: '#06b6d4' },
          { icon: '🔥', label: 'Day Streak', value: `${streak}d`, color: '#f59e0b' },
          { icon: '⭐', label: 'Avg Score', value: Number(avgScore).toFixed(1), color: '#10b981' },
        ].map((s, i) => (
          <div key={i} className="glass-card" style={{ padding: '20px' }}>
            {loading ? <SkeletonCard height={50} /> : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: 40, height: 40,
                  borderRadius: 10,
                  background: `${s.color}18`, border: `1px solid ${s.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', flexShrink: 0,
                }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 900, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>{s.label}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Overall score ring */}
      {!loading && totalSessions > 0 && (
        <div className="glass-card" style={{ padding: '32px', marginBottom: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '24px', textAlign: 'center' }}>
            Overall Performance Score
          </h2>
          <ScoreRing score={parseFloat(Number(avgScore).toFixed(1))} size={160} />
          <p style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center' }}>
            Based on {totalSessions} session{totalSessions !== 1 ? 's' : ''} and {totalQuestions} questions
          </p>
        </div>
      )}

      {/* Session history */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '14px' }}>
          Session History
        </h2>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[1,2,3].map(i => <SkeletonCard key={i} height={72} />)}
          </div>
        ) : sessions.length === 0 ? (
          <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '14px' }}>📊</div>
            <h3 style={{ fontWeight: 700, marginBottom: '8px', color: 'var(--text-secondary)' }}>No sessions recorded yet</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Complete a study or interview session to see your progress here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sessions.map((s, i) => {
              const score = parseFloat(s.overall_score) || 0;
              return (
                <div key={i} className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Mini score ring */}
                  <ScoreRing score={score} size={52} strokeWidth={6} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '3px' }}>
                      {s.topic || s.job_role || 'Study Session'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span>📋 {s.questions_count || 0} questions</span>
                      {s.duration_minutes > 0 && <span>⏱️ {s.duration_minutes} min</span>}
                      <span>📅 {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 12px', borderRadius: 'var(--radius-full)',
                    background: score >= 7 ? 'var(--success-dim)' : score >= 5 ? 'var(--warning-dim)' : 'var(--danger-dim)',
                    color: score >= 7 ? 'var(--success)' : score >= 5 ? 'var(--warning)' : 'var(--danger)',
                    fontSize: '12px', fontWeight: 700, flexShrink: 0,
                  }}>
                    {score.toFixed(1)}/10
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
