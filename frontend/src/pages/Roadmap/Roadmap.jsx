import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { generateRoadmap } from '../../services/ai.service';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/common/Button';
import { AILoader } from '../../components/common/LoadingSpinner';

const JOB_ROLES = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Data Scientist', 'Machine Learning Engineer', 'DevOps Engineer',
  'Product Manager', 'UX Designer', 'Mobile Developer', 'Cloud Engineer',
];

const TIMEFRAMES = ['1 month', '3 months', '6 months', '12 months'];

const PhaseCard = ({ phase, index }) => {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div
      className="glass-card"
      style={{
        overflow: 'hidden',
        border: expanded ? '1px solid var(--border-accent)' : '1px solid var(--border)',
        transition: 'border-color 0.2s',
      }}
    >
      {/* Phase header */}
      <button
        onClick={() => setExpanded(p => !p)}
        style={{
          width: '100%',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div style={{
          width: 36, height: 36,
          borderRadius: '50%',
          background: expanded ? 'var(--gradient-accent)' : 'var(--bg-elevated)',
          border: `2px solid ${expanded ? 'transparent' : 'var(--border)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800,
          fontSize: '14px',
          color: expanded ? '#fff' : 'var(--text-muted)',
          flexShrink: 0,
          transition: 'all 0.3s',
          boxShadow: expanded ? 'var(--shadow-accent)' : 'none',
        }}>
          {index + 1}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
            {phase.phase || phase.title || `Phase ${index + 1}`}
          </div>
          {phase.duration && (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              ⏱️ {phase.duration}
            </div>
          )}
        </div>
        <svg
          width="16" height="16"
          viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s', flexShrink: 0 }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Phase body */}
      {expanded && (
        <div className="animate-fade-in" style={{ padding: '0 24px 24px' }}>
          {phase.description && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>
              {phase.description}
            </p>
          )}

          {(phase.topics || phase.skills || phase.key_skills)?.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                Topics / Skills
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(phase.topics || phase.skills || phase.key_skills).map((t, i) => (
                  <span key={i} style={{
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--accent-dim)',
                    border: '1px solid var(--border-accent)',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--accent-light)',
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(phase.resources || phase.recommended_resources)?.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                Resources
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {(phase.resources || phase.recommended_resources).map((r, i) => (
                  <div key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '6px' }}>
                    <span style={{ color: 'var(--accent)', flexShrink: 0 }}>→</span>
                    {typeof r === 'string' ? r : r.title || r.name || JSON.stringify(r)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(phase.milestones || phase.goals)?.length > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                Milestones
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {(phase.milestones || phase.goals).map((m, i) => (
                  <div key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--success)', flexShrink: 0, marginTop: '1px' }}>✓</span>
                    {typeof m === 'string' ? m : m.milestone || m.goal || JSON.stringify(m)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Roadmap = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { current_level: 'beginner', timeframe: '3 months' },
  });

  const onGenerate = async (data) => {
    setLoading(true);
    setRoadmap(null);
    try {
      const result = await generateRoadmap({
        topic:         data.topic || undefined,
        job_role:      data.job_role || undefined,
        current_level: data.current_level,
        target_role:   data.target_role || undefined,
        timeframe:     data.timeframe,
      });
      setRoadmap(result);
    } catch (err) {
      toast.error('Failed to generate roadmap: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const phases = roadmap?.phases || roadmap?.roadmap || (Array.isArray(roadmap) ? roadmap : null);

  return (
    <div className="page-enter">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>Learning Roadmap</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Generate a personalized, phase-by-phase learning plan powered by Claude
        </p>
      </div>

      {/* Config card */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '24px' }}>
        <form onSubmit={handleSubmit(onGenerate)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Topic / Subject (optional)
              </label>
              <input
                id="roadmap-topic"
                placeholder="e.g. Machine Learning, React..."
                style={{
                  width: '100%', height: '44px', padding: '0 14px',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
                  fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                }}
                {...register('topic')}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Target Job Role
              </label>
              <select
                id="roadmap-role"
                style={{
                  width: '100%', height: '44px', padding: '0 14px',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
                  fontSize: '14px', outline: 'none',
                }}
                {...register('job_role')}
              >
                <option value="" style={{ background: '#1a1a35' }}>Any role...</option>
                {JOB_ROLES.map(r => <option key={r} value={r} style={{ background: '#1a1a35' }}>{r}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Current Level
              </label>
              <select
                id="roadmap-level"
                style={{
                  width: '100%', height: '44px', padding: '0 14px',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
                  fontSize: '14px', outline: 'none',
                }}
                {...register('current_level')}
              >
                <option value="beginner" style={{ background: '#1a1a35' }}>Beginner</option>
                <option value="intermediate" style={{ background: '#1a1a35' }}>Intermediate</option>
                <option value="advanced" style={{ background: '#1a1a35' }}>Advanced</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Timeframe
              </label>
              <select
                id="roadmap-timeframe"
                style={{
                  width: '100%', height: '44px', padding: '0 14px',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
                  fontSize: '14px', outline: 'none',
                }}
                {...register('timeframe')}
              >
                {TIMEFRAMES.map(t => <option key={t} value={t} style={{ background: '#1a1a35' }}>{t}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Button
                id="roadmap-generate"
                type="submit"
                loading={loading}
                fullWidth
                size="md"
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                }
              >
                Generate Roadmap
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Loading */}
      {loading && <AILoader message="Claude is crafting your personalized roadmap..." />}

      {/* Roadmap output */}
      {!loading && roadmap && (
        <div className="animate-fade-in-up">
          {/* Summary */}
          {(roadmap.overview || roadmap.summary || roadmap.description) && (
            <div className="glass-card" style={{
              padding: '24px', marginBottom: '20px',
              background: 'var(--accent-dim)', border: '1px solid var(--border-accent)',
            }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent-light)', marginBottom: '10px' }}>
                🗺️ Roadmap Overview
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {roadmap.overview || roadmap.summary || roadmap.description}
              </p>
              {roadmap.estimated_duration && (
                <div style={{ marginTop: '10px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
                  ⏱️ Estimated total: {roadmap.estimated_duration}
                </div>
              )}
            </div>
          )}

          {/* Phases accordion */}
          {phases?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Learning Phases
              </h2>
              {phases.map((phase, i) => (
                <PhaseCard key={i} phase={phase} index={i} />
              ))}
            </div>
          ) : (
            // Fallback: render raw JSON if phases aren't in expected shape
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Your Roadmap</h3>
              <pre style={{
                fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6,
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}>
                {JSON.stringify(roadmap, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && !roadmap && (
        <div className="glass-card" style={{ padding: '56px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>🗺️</div>
          <h3 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>No roadmap yet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: 360, margin: '0 auto' }}>
            Fill in your topic or target role above and click "Generate Roadmap" to get a personalized learning plan.
          </p>
        </div>
      )}
    </div>
  );
};

export default Roadmap;
