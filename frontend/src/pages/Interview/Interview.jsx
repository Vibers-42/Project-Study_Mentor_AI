import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQuestion, evaluateAnswer, adaptiveNextQuestion } from '../../services/ai.service';
import { saveSession } from '../../services/progress.service';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ScoreRing from '../../components/common/ScoreRing';
import { AILoader } from '../../components/common/LoadingSpinner';

const STEP = { CONFIG: 'config', QUESTION: 'question', ANSWER: 'answer', EVAL: 'eval', DONE: 'done' };

const JOB_ROLES = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist',
  'Machine Learning Engineer', 'DevOps Engineer', 'Product Manager', 'UX Designer', 'Mobile Developer',
];

const ROUND_TYPES = [
  { value: 'technical', label: '⚙️ Technical Round', desc: 'Data structures, algorithms, system design' },
  { value: 'behavioral', label: '🤝 Behavioral Round', desc: 'Soft skills, teamwork, leadership' },
  { value: 'scenario', label: '🎭 Scenario Round', desc: 'Real-world problem solving' },
];

const Interview = () => {
  const [step, setStep] = useState(STEP.CONFIG);
  const [config, setConfig] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentEval, setCurrentEval] = useState(null);
  const [history, setHistory] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [questionNum, setQuestionNum] = useState(1);
  const [answer, setAnswer] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const totalCount = 7; // Interview sessions: 7 questions

  const startInterview = async (cfg) => {
    setConfig(cfg);
    setStep(STEP.QUESTION);
    setAiLoading(true);
    try {
      const q = await generateQuestion({
        job_role: cfg.job_role,
        question_type: cfg.round_type === 'behavioral' ? 'behavioral' : cfg.round_type === 'scenario' ? 'scenario' : 'practical',
        difficulty: cfg.level || 'intermediate',
        previous_questions: [],
      });
      setCurrentQuestion(q);
    } catch (err) {
      toast.error(err.message);
      setStep(STEP.CONFIG);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) { toast.error('Please write your answer first.'); return; }
    setStep(STEP.EVAL);
    setAiLoading(true);
    try {
      const ev = await evaluateAnswer({
        question: currentQuestion?.question_text || currentQuestion?.question,
        user_answer: answer,
        expected_concepts: currentQuestion?.expected_concepts || [],
        topic: config.job_role,
        difficulty: config.level,
      });
      setCurrentEval(ev);
      setHistory(prev => [...prev, {
        question: currentQuestion?.question_text || currentQuestion?.question,
        answer,
        score: ev?.score ?? 0,
        topic: config.job_role,
        type: config.round_type,
      }]);
      setAnswer('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const nextQuestion = async () => {
    if (questionNum >= totalCount) {
      try {
        await saveSession({
          job_role: config.job_role,
          session_history: history,
          overall_score: history.length > 0 ? parseFloat((history.reduce((a, h) => a + h.score, 0) / history.length).toFixed(1)) : 0,
          questions_count: history.length,
        });
      } catch { /* silent */ }
      setStep(STEP.DONE);
      return;
    }
    setCurrentQuestion(null);
    setStep(STEP.QUESTION);
    setAiLoading(true);
    setQuestionNum(n => n + 1);
    try {
      const q = await adaptiveNextQuestion({
        job_role: config.job_role,
        session_history: history,
        current_difficulty: config.level,
      });
      setCurrentQuestion(q);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const restartInterview = () => {
    setStep(STEP.CONFIG);
    setConfig({});
    setCurrentQuestion(null);
    setCurrentEval(null);
    setHistory([]);
    setQuestionNum(1);
    setAnswer('');
  };

  if (step === STEP.CONFIG) {
    return (
      <div className="animate-scale-in" style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontSize: '52px', marginBottom: '12px' }}>🎤</div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Interview Simulator</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Experience a realistic mock interview powered by Claude AI
          </p>
        </div>

        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Target Job Role
              </label>
              <select
                id="interview-role"
                defaultValue=""
                style={{
                  width: '100%', height: '44px',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
                  fontSize: '14px', padding: '0 14px', outline: 'none',
                }}
                onChange={e => setConfig(c => ({ ...c, job_role: e.target.value }))}
              >
                <option value="" disabled style={{ background: '#1a1a35' }}>Select a role...</option>
                {JOB_ROLES.map(r => <option key={r} value={r} style={{ background: '#1a1a35' }}>{r}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Interview Round
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {ROUND_TYPES.map(rt => (
                  <label
                    key={rt.value}
                    htmlFor={`round-${rt.value}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${config.round_type === rt.value ? 'var(--border-accent)' : 'var(--border)'}`,
                      background: config.round_type === rt.value ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <input
                      type="radio"
                      id={`round-${rt.value}`}
                      name="round_type"
                      value={rt.value}
                      style={{ accentColor: 'var(--accent)' }}
                      onChange={() => setConfig(c => ({ ...c, round_type: rt.value }))}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{rt.label}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{rt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Experience Level
              </label>
              <select
                id="interview-level"
                defaultValue="intermediate"
                style={{
                  width: '100%', height: '44px',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
                  fontSize: '14px', padding: '0 14px', outline: 'none',
                }}
                onChange={e => setConfig(c => ({ ...c, level: e.target.value }))}
              >
                <option value="beginner" style={{ background: '#1a1a35' }}>Junior (0–2 years)</option>
                <option value="intermediate" style={{ background: '#1a1a35' }}>Mid-level (2–5 years)</option>
                <option value="advanced" style={{ background: '#1a1a35' }}>Senior (5+ years)</option>
              </select>
            </div>

            <Button
              id="interview-start"
              size="lg"
              fullWidth
              disabled={!config.job_role || !config.round_type}
              onClick={() => startInterview({ ...config, level: config.level || 'intermediate' })}
            >
              Begin Interview →
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === STEP.QUESTION) {
    if (aiLoading) return <AILoader message="Preparing your interview question..." />;
    return (
      <div className="animate-scale-in" style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ color: 'var(--accent-light)', fontWeight: 600 }}>🎤 {config.job_role} Interview</span>
            <span>Question {questionNum} / {totalCount}</span>
          </div>
          <div style={{ height: 4, borderRadius: 99, background: 'var(--bg-elevated)' }}>
            <div style={{ height: '100%', width: `${(questionNum / totalCount) * 100}%`, background: 'var(--gradient-accent)', borderRadius: 99, transition: 'width 0.5s' }} />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '32px', marginBottom: '20px' }}>
          <p style={{ fontSize: '18px', lineHeight: 1.8, fontWeight: 500 }}>
            {currentQuestion?.question_text || currentQuestion?.question}
          </p>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>
            Your Response
          </label>
          <textarea
            id="interview-answer-input"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            rows={8}
            placeholder="Provide a detailed, structured answer. Use STAR format for behavioral questions (Situation, Task, Action, Result)..."
            style={{
              width: '100%', padding: '14px',
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
              fontSize: '14px', fontFamily: 'var(--font-sans)', resize: 'vertical',
              outline: 'none', lineHeight: 1.6, boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
            <Button id="interview-submit" onClick={handleSubmitAnswer} disabled={!answer.trim()}>
              Submit Answer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === STEP.EVAL) {
    if (aiLoading) return <AILoader message="Analyzing your response..." />;
    const score = currentEval?.score ?? 0;
    const strengths = currentEval?.strengths || [];
    const weaknesses = currentEval?.weaknesses || currentEval?.areas_for_improvement || [];
    const betterAnswer = currentEval?.better_answer || currentEval?.model_answer || '';

    return (
      <div className="animate-scale-in" style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '24px' }}>Interview Feedback</h2>
        <div className="glass-card" style={{ padding: '32px', marginBottom: '20px' }}>
          <ScoreRing score={score} size={140} />
          <p style={{ color: 'var(--text-secondary)', marginTop: '14px', fontSize: '14px' }}>{currentEval?.summary || ''}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px', textAlign: 'left' }}>
          <div className="glass-card" style={{ padding: '18px', background: 'var(--success-dim)', border: '1px solid var(--success)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--success)', marginBottom: '10px' }}>✅ Strengths</h3>
            {strengths.map((s, i) => <p key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>• {s}</p>)}
          </div>
          <div className="glass-card" style={{ padding: '18px', background: 'var(--warning-dim)', border: '1px solid var(--warning)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--warning)', marginBottom: '10px' }}>⚠️ Improve</h3>
            {weaknesses.map((w, i) => <p key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>• {w}</p>)}
          </div>
        </div>
        {betterAnswer && (
          <div className="glass-card" style={{ padding: '20px', marginBottom: '24px', textAlign: 'left', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-light)', marginBottom: '10px' }}>💡 Strong Answer</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{betterAnswer}</p>
          </div>
        )}
        <Button id="interview-next" onClick={nextQuestion} size="lg">
          {questionNum >= totalCount ? 'Finish Interview →' : 'Next Question →'}
        </Button>
      </div>
    );
  }

  if (step === STEP.DONE) {
    const avg = history.length > 0 ? history.reduce((a, h) => a + h.score, 0) / history.length : 0;
    return (
      <div className="animate-scale-in" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '60px', marginBottom: '16px' }}>🏆</div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '10px' }}>Interview Complete!</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          You completed a <strong style={{ color: 'var(--text-primary)' }}>{config.job_role}</strong> interview
        </p>
        <div style={{ marginBottom: '32px' }}>
          <ScoreRing score={parseFloat(avg.toFixed(1))} size={160} label="Overall Score" />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button id="interview-results" onClick={() => navigate('/results', { state: { history, config: { ...config, topic: config.job_role }, avgScore: avg } })} size="lg">
            View Full Results
          </Button>
          <Button id="interview-restart" variant="secondary" onClick={restartInterview} size="lg">
            New Interview
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default Interview;
