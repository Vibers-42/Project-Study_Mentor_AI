import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateFeedback, recommendResources } from '../../services/ai.service';
import { useToast } from '../../contexts/ToastContext';
import ScoreRing from '../../components/common/ScoreRing';
import Button from '../../components/common/Button';
import { AILoader, SkeletonCard } from '../../components/common/LoadingSpinner';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const { history = [], config = {}, avgScore = 0 } = location.state || {};

  const [feedback, setFeedback] = useState(null);
  const [resources, setResources] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!history.length && !config.topic) {
      // No session data — redirect
      navigate('/dashboard');
      return;
    }
    loadFeedback();
    loadResources();
  }, []);

  const loadFeedback = async () => {
    setFeedbackLoading(true);
    try {
      const allWeaknesses = history.flatMap(h => h.weaknesses || []);
      const fb = await generateFeedback({
        topic: config.topic,
        job_role: config.job_role,
        session_history: history,
        overall_score: avgScore,
        weaknesses: [...new Set(allWeaknesses)].slice(0, 5),
      });
      setFeedback(fb);
    } catch (err) {
      toast.error('Could not load feedback: ' + err.message);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const loadResources = async () => {
    setResourcesLoading(true);
    try {
      const weakAreas = [...new Set(history.flatMap(h => h.weaknesses || []))].slice(0, 3);
      const res = await recommendResources({
        topic: config.topic,
        job_role: config.job_role,
        weak_areas: weakAreas,
        skill_level: config.difficulty || 'intermediate',
      });
      setResources(res);
    } catch (err) {
      toast.error('Could not load resources: ' + err.message);
    } finally {
      setResourcesLoading(false);
    }
  };

  const TABS = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'feedback',  label: '🧠 AI Feedback' },
    { id: 'resources', label: '📚 Resources' },
    { id: 'history',   label: '📋 History' },
  ];

  const TabBtn = ({ tab }) => (
    <button
      id={`results-tab-${tab.id}`}
      onClick={() => setActiveTab(tab.id)}
      style={{
        padding: '8px 18px',
        borderRadius: 'var(--radius-md)',
        border: activeTab === tab.id ? '1px solid var(--border-accent)' : '1px solid var(--border)',
        background: activeTab === tab.id ? 'var(--accent-dim)' : 'transparent',
        color: activeTab === tab.id ? 'var(--accent-light)' : 'var(--text-secondary)',
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {tab.label}
    </button>
  );

  return (
    <div className="page-enter" style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>Session Results</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {config.topic || config.job_role} · {history.length} questions
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button id="results-new-session" variant="secondary" size="sm" onClick={() => navigate('/session')}>
            New Session
          </Button>
          <Button id="results-dashboard" size="sm" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {TABS.map(t => <TabBtn key={t.id} tab={t} />)}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="animate-fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px', alignItems: 'start' }}>
            <div className="glass-card" style={{ padding: '28px', textAlign: 'center' }}>
              <ScoreRing score={parseFloat(avgScore.toFixed ? avgScore.toFixed(1) : avgScore)} size={140} label="Avg Score" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="glass-card" style={{ padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Questions answered</span>
                <span style={{ fontWeight: 700, fontSize: '18px' }}>{history.length}</span>
              </div>
              <div className="glass-card" style={{ padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Top score</span>
                <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--success)' }}>
                  {history.length ? Math.max(...history.map(h => h.score || 0)).toFixed(1) : '—'}
                </span>
              </div>
              <div className="glass-card" style={{ padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Lowest score</span>
                <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--danger)' }}>
                  {history.length ? Math.min(...history.map(h => h.score || 0)).toFixed(1) : '—'}
                </span>
              </div>
              <div className="glass-card" style={{ padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Performance</span>
                <span style={{
                  padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 600,
                  background: avgScore >= 7 ? 'var(--success-dim)' : avgScore >= 5 ? 'var(--warning-dim)' : 'var(--danger-dim)',
                  color: avgScore >= 7 ? 'var(--success)' : avgScore >= 5 ? 'var(--warning)' : 'var(--danger)',
                }}>
                  {avgScore >= 7 ? 'Excellent' : avgScore >= 5 ? 'Good' : 'Needs Work'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="animate-fade-in">
          {feedbackLoading ? (
            <AILoader message="Claude is generating comprehensive feedback..." />
          ) : feedback ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {feedback.overall_assessment && (
                <div className="glass-card" style={{ padding: '24px', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent-light)', marginBottom: '10px' }}>🧠 Overall Assessment</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{feedback.overall_assessment}</p>
                </div>
              )}
              {feedback.key_strengths?.length > 0 && (
                <div className="glass-card" style={{ padding: '24px', background: 'var(--success-dim)', border: '1px solid var(--success)' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--success)', marginBottom: '12px' }}>✅ Key Strengths</h3>
                  {feedback.key_strengths.map((s, i) => (
                    <p key={i} style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '6px' }}>• {s}</p>
                  ))}
                </div>
              )}
              {feedback.priority_improvements?.length > 0 && (
                <div className="glass-card" style={{ padding: '24px', background: 'var(--warning-dim)', border: '1px solid var(--warning)' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--warning)', marginBottom: '12px' }}>🎯 Priority Areas</h3>
                  {feedback.priority_improvements.map((p, i) => (
                    <p key={i} style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '6px' }}>• {p}</p>
                  ))}
                </div>
              )}
              {feedback.next_steps && (
                <div className="glass-card" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>🗺️ Next Steps</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {typeof feedback.next_steps === 'string' ? feedback.next_steps : JSON.stringify(feedback.next_steps)}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>No feedback available. Make sure the backend is connected.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="animate-fade-in">
          {resourcesLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1,2,3].map(i => <SkeletonCard key={i} height={80} />)}
            </div>
          ) : resources ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(resources.resources || resources).map?.((r, i) => (
                <div key={i} className="glass-card hover-lift" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <span style={{ fontSize: '24px', flexShrink: 0 }}>
                      {r.type === 'video' ? '🎬' : r.type === 'course' ? '🎓' : r.type === 'book' ? '📖' : '📄'}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{r.title || r.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{r.description || r.desc}</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {r.type && (
                          <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                            {r.type}
                          </span>
                        )}
                        {r.difficulty && (
                          <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', fontSize: '11px', color: 'var(--accent-light)', fontWeight: 600 }}>
                            {r.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                    {r.url && (
                      <a href={r.url} target="_blank" rel="noreferrer" style={{
                        padding: '8px 14px', borderRadius: 'var(--radius-md)',
                        background: 'var(--accent-dim)', border: '1px solid var(--border-accent)',
                        color: 'var(--accent-light)', fontSize: '13px', fontWeight: 600,
                        flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px',
                      }}>
                        Open
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>No resources available. Backend connection needed.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {history.map((item, i) => (
            <div key={i} className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 'var(--radius-md)',
                  background: item.score >= 7 ? 'var(--success-dim)' : item.score >= 5 ? 'var(--warning-dim)' : 'var(--danger-dim)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '15px',
                  color: item.score >= 7 ? 'var(--success)' : item.score >= 5 ? 'var(--warning)' : 'var(--danger)',
                  flexShrink: 0,
                }}>
                  {(item.score || 0).toFixed(1)}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px', lineHeight: 1.5 }}>{item.question}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.5 }}>
                    {item.answer?.slice(0, 180)}{item.answer?.length > 180 ? '...' : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Results;
