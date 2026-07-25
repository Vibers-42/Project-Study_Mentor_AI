import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { generateQuestion, evaluateAnswer, adaptiveNextQuestion } from '../../services/ai.service';
import { saveSession } from '../../services/progress.service';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ScoreRing from '../../components/common/ScoreRing';
import { AILoader } from '../../components/common/LoadingSpinner';

// ─── STEP CONSTANTS ──────────────────────────────────────────────
const STEP = { CONFIG: 'config', QUESTION: 'question', ANSWER: 'answer', EVAL: 'eval', DONE: 'done' };

const DIFFICULTY_OPTIONS = ['beginner', 'intermediate', 'advanced'];
const TYPE_OPTIONS = ['conceptual', 'practical', 'scenario', 'behavioral'];
const TOPIC_SUGGESTIONS = ['React', 'Node.js', 'System Design', 'Python', 'Machine Learning', 'SQL', 'TypeScript', 'Docker', 'AWS', 'Algorithms'];

// ─── CONFIG STEP ────────────────────────────────────────────────
const ConfigStep = ({ onStart }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: { difficulty: 'intermediate', question_type: 'conceptual', count: 5 },
  });

  return (
    <div className="animate-scale-in" style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📚</div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>Configure Your Session</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Tell us what you want to practice today</p>
      </div>

      <form onSubmit={handleSubmit(onStart)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Topic / Subject
          </label>
          <Input
            id="session-topic"
            placeholder="e.g. React Hooks, System Design, Machine Learning..."
            error={errors.topic?.message}
            {...register('topic', { required: 'Topic is required' })}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
            {TOPIC_SUGGESTIONS.map(t => (
              <span key={t} style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onClick={() => setValue('topic', t, { shouldValidate: true })}
              onMouseEnter={e => { e.target.style.borderColor = 'var(--border-accent)'; e.target.style.color = 'var(--accent-light)'; }}
              onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-secondary)'; }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Difficulty
            </label>
            <select
              id="session-difficulty"
              style={{
                width: '100%', height: '44px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                padding: '0 14px',
                outline: 'none',
              }}
              {...register('difficulty')}
            >
              {DIFFICULTY_OPTIONS.map(d => <option key={d} value={d} style={{ background: '#1a1a35' }}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Question Type
            </label>
            <select
              id="session-type"
              style={{
                width: '100%', height: '44px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                padding: '0 14px',
                outline: 'none',
              }}
              {...register('question_type')}
            >
              {TYPE_OPTIONS.map(t => <option key={t} value={t} style={{ background: '#1a1a35' }}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Number of questions: <span style={{ color: 'var(--accent-light)', fontWeight: 700 }}>5</span>
          </label>
          <input
            type="range" min="3" max="15" defaultValue="5"
            id="session-count"
            style={{ width: '100%', accentColor: 'var(--accent)' }}
            {...register('count', { valueAsNumber: true })}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>3 (Quick)</span><span>15 (Deep dive)</span>
          </div>
        </div>

        <Button id="session-start" type="submit" size="lg" fullWidth style={{ marginTop: '8px' }}>
          Start Session →
        </Button>
      </form>
    </div>
  );
};

// ─── QUESTION STEP ───────────────────────────────────────────────
const QuestionStep = ({ question, questionNum, totalCount, onAnswer, loading }) => {
  const [showHints, setShowHints] = useState(false);
  const hints = question?.hints || [];

  if (loading) return <AILoader message="Generating your question..." />;

  return (
    <div className="animate-scale-in" style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Progress bar */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
          <span>Question {questionNum}</span>
          <span>{questionNum} / {totalCount}</span>
        </div>
        <div style={{ height: 4, borderRadius: 99, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${(questionNum / totalCount) * 100}%`,
            background: 'var(--gradient-accent)',
            borderRadius: 99,
            transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* Question card */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span style={{
            padding: '4px 12px', borderRadius: 'var(--radius-full)',
            background: 'var(--accent-dim)', border: '1px solid var(--border-accent)',
            fontSize: '12px', fontWeight: 600, color: 'var(--accent-light)',
          }}>
            {question?.question_type || 'conceptual'}
          </span>
          <span style={{
            padding: '4px 12px', borderRadius: 'var(--radius-full)',
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)',
          }}>
            {question?.difficulty || 'intermediate'}
          </span>
        </div>
        <p style={{ fontSize: '18px', lineHeight: 1.7, fontWeight: 500, color: 'var(--text-primary)' }}>
          {question?.question_text || question?.question || 'Loading question...'}
        </p>
      </div>

      {/* Hints */}
      {hints.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <button
            id="toggle-hints"
            onClick={() => setShowHints(p => !p)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: '13px', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {showHints ? 'Hide hints' : 'Show hints'}
          </button>
          {showHints && (
            <div className="animate-fade-in" style={{
              marginTop: '10px', padding: '16px',
              background: 'var(--info-dim)', border: '1px solid var(--info)',
              borderRadius: 'var(--radius-md)',
            }}>
              {hints.map((h, i) => (
                <div key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: i < hints.length - 1 ? '6px' : 0 }}>
                  💡 {h}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <AnswerInput question={question} onAnswer={onAnswer} />
    </div>
  );
};

// ─── ANSWER INPUT ────────────────────────────────────────────────
const AnswerInput = ({ question, onAnswer }) => {
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    if (!answer.trim()) { toast.error('Please write an answer before submitting'); return; }
    setSubmitting(true);
    await onAnswer(answer.trim());
    setSubmitting(false);
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>
        Your Answer
      </label>
      <textarea
        id="session-answer-input"
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        placeholder="Type your answer here. Be as detailed as you can — Claude will evaluate every aspect of your response..."
        rows={7}
        style={{
          width: '100%',
          padding: '14px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-primary)',
          fontSize: '14px',
          fontFamily: 'var(--font-sans)',
          resize: 'vertical',
          outline: 'none',
          lineHeight: 1.6,
          transition: 'border-color 0.2s',
          boxSizing: 'border-box',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{answer.length} characters</span>
        <Button
          id="session-submit-answer"
          onClick={handleSubmit}
          loading={submitting}
          disabled={!answer.trim()}
        >
          Submit Answer
        </Button>
      </div>
    </div>
  );
};

// ─── EVALUATION STEP ────────────────────────────────────────────
const EvalStep = ({ evaluation, question, isLast, onNext, onFinish, loading }) => {
  if (loading) return <AILoader message="Claude is evaluating your answer..." />;

  const score = evaluation?.score ?? 0;
  const strengths = evaluation?.strengths || [];
  const weaknesses = evaluation?.weaknesses || evaluation?.areas_for_improvement || [];
  const betterAnswer = evaluation?.better_answer || evaluation?.model_answer || '';

  return (
    <div className="animate-scale-in" style={{ maxWidth: 720, margin: '0 auto' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '24px', textAlign: 'center' }}>
        Answer Evaluation
      </h2>

      {/* Score + summary */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: '20px', textAlign: 'center' }}>
        <ScoreRing score={score} size={140} />
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>
            {score >= 8 ? '🌟 Excellent!' : score >= 6 ? '👍 Good work!' : score >= 4 ? '📖 Keep practicing' : '💪 Room to grow'}
          </div>
          {evaluation?.summary && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
              {evaluation.summary}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        {/* Strengths */}
        <div className="glass-card" style={{ padding: '20px', background: 'var(--success-dim)', border: '1px solid var(--success)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--success)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ✅ Strengths
          </h3>
          {strengths.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {strengths.map((s, i) => (
                <li key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '6px' }}>
                  <span style={{ color: 'var(--success)', flexShrink: 0 }}>•</span> {s}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Keep practicing to build strengths!</p>
          )}
        </div>

        {/* Weaknesses */}
        <div className="glass-card" style={{ padding: '20px', background: 'var(--warning-dim)', border: '1px solid var(--warning)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--warning)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ⚠️ Areas to Improve
          </h3>
          {weaknesses.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {weaknesses.map((w, i) => (
                <li key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '6px' }}>
                  <span style={{ color: 'var(--warning)', flexShrink: 0 }}>•</span> {w}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Great — no major gaps!</p>
          )}
        </div>
      </div>

      {/* Better Answer */}
      {betterAnswer && (
        <div className="glass-card" style={{ padding: '20px', marginBottom: '24px', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-light)', marginBottom: '10px' }}>
            💡 Model Answer
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{betterAnswer}</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        {isLast ? (
          <Button id="session-finish" onClick={onFinish} size="lg">
            Finish & See Results →
          </Button>
        ) : (
          <Button id="session-next" onClick={onNext} size="lg">
            Next Question →
          </Button>
        )}
      </div>
    </div>
  );
};

// ─── DONE STEP ──────────────────────────────────────────────────
const DoneStep = ({ history, config, onRestart }) => {
  const navigate = useNavigate();
  const avgScore = history.length > 0 ? history.reduce((a, h) => a + (h.score ?? 0), 0) / history.length : 0;

  return (
    <div className="animate-scale-in" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ fontSize: '60px', marginBottom: '16px' }}>🎉</div>
      <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '10px' }}>Session Complete!</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        You answered {history.length} questions on <strong style={{ color: 'var(--text-primary)' }}>{config.topic}</strong>
      </p>
      <div style={{ marginBottom: '32px' }}>
        <ScoreRing score={parseFloat(avgScore.toFixed(1))} size={160} label="Average Score" />
      </div>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button id="session-view-results" onClick={() => navigate('/results', { state: { history, config, avgScore } })} size="lg">
          View Full Results
        </Button>
        <Button id="session-restart" variant="secondary" onClick={onRestart} size="lg">
          New Session
        </Button>
      </div>
    </div>
  );
};

// ─── MAIN SESSION PAGE ───────────────────────────────────────────
const Session = () => {
  const [step, setStep] = useState(STEP.CONFIG);
  const [config, setConfig] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentEval, setCurrentEval] = useState(null);
  const [history, setHistory] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [questionNum, setQuestionNum] = useState(1);
  const toast = useToast();
  const navigate = useNavigate();

  const totalCount = config?.count || 5;

  const handleStart = async (data) => {
    const cfg = { ...data, count: Number(data.count) || 5 };
    setConfig(cfg);
    setStep(STEP.QUESTION);
    setAiLoading(true);
    try {
      const q = await generateQuestion({
        topic: cfg.topic,
        difficulty: cfg.difficulty,
        question_type: cfg.question_type,
        previous_questions: [],
      });
      setCurrentQuestion(q);
    } catch (err) {
      toast.error('Failed to generate question: ' + err.message);
      setStep(STEP.CONFIG);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAnswer = async (answer) => {
    setCurrentEval(null);
    setStep(STEP.EVAL);
    setAiLoading(true);
    try {
      const ev = await evaluateAnswer({
        question: currentQuestion?.question_text || currentQuestion?.question,
        user_answer: answer,
        expected_concepts: currentQuestion?.expected_concepts || [],
        topic: config.topic,
        difficulty: config.difficulty,
      });
      setCurrentEval(ev);
      setHistory(prev => [...prev, {
        question: currentQuestion?.question_text || currentQuestion?.question,
        answer,
        score: ev?.score ?? 0,
        topic: config.topic,
        type: config.question_type,
        weaknesses: ev?.weaknesses || [],
        strengths: ev?.strengths || []
      }]);
    } catch (err) {
      toast.error('Evaluation failed: ' + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleNext = async () => {
    if (questionNum >= totalCount) {
      await handleFinish();
      return;
    }
    setCurrentQuestion(null);
    setStep(STEP.QUESTION);
    setAiLoading(true);
    setQuestionNum(n => n + 1);
    try {
      const q = await adaptiveNextQuestion({
        topic: config.topic,
        job_role: config.job_role,
        session_history: history,
        current_difficulty: config.difficulty,
      });
      setCurrentQuestion(q);
    } catch (err) {
      toast.error('Failed to get next question: ' + err.message);
      setStep(STEP.CONFIG);
    } finally {
      setAiLoading(false);
    }
  };

  const handleFinish = async () => {
    try {
      await saveSession({
        topic: config.topic,
        job_role: config.job_role,
        session_history: history,
        overall_score: history.length > 0
          ? parseFloat((history.reduce((a, h) => a + h.score, 0) / history.length).toFixed(1))
          : 0,
        questions_count: history.length,
      });
    } catch { /* Supabase not yet configured — silently ignore */ }
    setStep(STEP.DONE);
  };

  const handleRestart = () => {
    setStep(STEP.CONFIG);
    setConfig(null);
    setCurrentQuestion(null);
    setCurrentEval(null);
    setHistory([]);
    setQuestionNum(1);
    setAiLoading(false);
  };

  return (
    <div style={{ padding: '20px 0' }}>
      {step === STEP.CONFIG && <ConfigStep onStart={handleStart} />}
      {step === STEP.QUESTION && (
        <QuestionStep
          question={currentQuestion}
          questionNum={questionNum}
          totalCount={totalCount}
          onAnswer={handleAnswer}
          loading={aiLoading}
        />
      )}
      {step === STEP.EVAL && (
        <EvalStep
          evaluation={currentEval}
          question={currentQuestion}
          isLast={questionNum >= totalCount}
          onNext={handleNext}
          onFinish={handleFinish}
          loading={aiLoading}
        />
      )}
      {step === STEP.DONE && (
        <DoneStep history={history} config={config} onRestart={handleRestart} />
      )}
    </div>
  );
};

export default Session;
