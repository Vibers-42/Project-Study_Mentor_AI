import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Card from '../../components/layout/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { downloadInterviewReport } from '../../services/pdfService';
import { generateFeedback } from '../../services/ai.service';
import { useAuth } from '../../contexts/AuthContext';

/* ─── Helpers ─────────────────────────────────────────────────── */

const fmtDuration = (secs) => {
  if (!secs && secs !== 0) return 'N/A';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  if (m === 0) return `${s}s`;
  return s === 0 ? `${m} min` : `${m} min ${s}s`;
};

const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'N/A';

/** Collapse duplicate strings while preserving order */
const dedupe = (arr) => [...new Set(arr.filter(Boolean).map((s) => String(s).trim()))];

/* ─── Circular Progress Gauge ─────────────────────────────────── */
const Gauge = ({ value, size = 120 }) => {
  const radius = size * 0.4;
  const strokeWidth = size * 0.08;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-slate-100 dark:stroke-slate-800"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-indigo-600 dark:stroke-indigo-500 transition-all duration-1000 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-50">{value}%</span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
          Overall
        </span>
      </div>
    </div>
  );
};

/* ─── Question Row ────────────────────────────────────────────── */
const QuestionRow = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ev = item.evaluation ?? {};
  const pct = typeof ev.percentage === 'number' ? ev.percentage : null;

  return (
    <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 transition-all duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex-1 min-w-0 flex items-start gap-3">
          <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
            {item.num}
          </span>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate pr-4">
            {item.question}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Badge
            variant={pct === null ? 'default' : pct >= 85 ? 'success' : pct >= 60 ? 'primary' : 'warning'}
            className="text-xs font-bold"
          >
            {pct === null ? (ev.skipped ? 'Skipped' : 'Not scored') : `Score: ${pct}%`}
          </Badge>
          <span className="text-slate-400 dark:text-slate-600">
            <svg
              className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-5 sm:px-5 space-y-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 pt-4 text-sm">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Answer</h4>
            <p className="text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200/60 dark:border-slate-800/60 leading-relaxed">
              {item.answer ? `"${item.answer}"` : 'No answer was provided.'}
            </p>
            {item.voiceMeta && (
              <p className="text-xs text-slate-400 pt-1">
                🎙️ {item.voiceMeta.kind === 'upload'
                  ? `Audio file attached: ${item.voiceMeta.name}`
                  : `Voice recording attached (${Math.round((item.voiceMeta.duration ?? 0) / 1000)}s)`}
              </p>
            )}
          </div>

          {ev.feedback_summary && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                AI Evaluation &amp; Feedback
              </h4>
              <div className="bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 p-3.5 rounded-lg text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5">
                <span className="text-indigo-500 text-lg mt-0.5 shrink-0">💡</span>
                <div className="space-y-2">
                  <p>{ev.feedback_summary}</p>
                  {ev.accuracy_assessment && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      <strong>Accuracy:</strong> {ev.accuracy_assessment}
                    </p>
                  )}
                  {ev.completeness_assessment && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      <strong>Completeness:</strong> {ev.completeness_assessment}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {ev.missing_concepts?.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Concepts You Missed</h4>
              <div className="flex flex-wrap gap-1.5">
                {ev.missing_concepts.map((c, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 text-xs font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {ev.better_answer && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recommended Answer</h4>
              <p className="text-slate-700 dark:text-slate-300 bg-emerald-500/5 border border-emerald-500/10 p-3.5 rounded-lg leading-relaxed">
                {ev.better_answer}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── Empty state (page opened without a completed session) ───── */
const NoSession = () => (
  <div className="max-w-lg mx-auto py-16 text-center space-y-5 animate-fade-in">
    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center text-3xl mx-auto">
      📊
    </div>
    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">No results to show yet</h1>
    <p className="text-sm text-slate-500 dark:text-slate-400">
      Finish a mock interview and your scored report will appear here automatically.
    </p>
    <div className="flex items-center justify-center gap-3 pt-2">
      <Link to="/interview">
        <Button variant="primary" size="md">Start an Interview</Button>
      </Link>
      <Link to="/dashboard">
        <Button variant="outline" size="md">Back to Dashboard</Button>
      </Link>
    </div>
  </div>
);

/* ─── Results Main ────────────────────────────────────────────── */
const Results = () => {
  const location = useLocation();
  const session = location.state;
  const { user } = useAuth();

  const [downloading, setDownloading] = useState(false);
  const [coaching, setCoaching] = useState(null);
  const [coachingState, setCoachingState] = useState('idle'); // idle | loading | ready | failed

  const items = session?.items ?? [];

  /* Aggregate the per-answer AI evaluations into session-level lists */
  const strengths = dedupe(items.flatMap((i) => i.evaluation?.strengths ?? []));
  const weaknesses = dedupe(items.flatMap((i) => i.evaluation?.weaknesses ?? []));
  const missingConcepts = dedupe(items.flatMap((i) => i.evaluation?.missing_concepts ?? []));

  const scored = items.filter((i) => typeof i.evaluation?.percentage === 'number');
  const answered = items.filter((i) => i.answer?.trim());
  const bestItem = scored.length
    ? scored.reduce((a, b) => (b.evaluation.percentage > a.evaluation.percentage ? b : a))
    : null;
  const worstItem = scored.length
    ? scored.reduce((a, b) => (b.evaluation.percentage < a.evaluation.percentage ? b : a))
    : null;

  /* Ask the AI for a session-level coaching summary */
  // Use completedAt as a stable dependency key instead of the full session object
  // to prevent StrictMode from double-firing this expensive AI call.
  const sessionKey = session?.completedAt;
  useEffect(() => {
    if (!session || items.length === 0 || !sessionKey) return;
    let cancelled = false;

    setCoachingState('loading');
    generateFeedback({
      topic: session.topic,
      job_role: session.jobRole,
      // session.overallScore is 0-100 (percentage); backend expects 0-10 scale
      overall_score: Number((session.overallScore / 10).toFixed(1)),
      weaknesses: weaknesses.slice(0, 8),
      session_history: items.map((i) => ({
        question: i.question,
        score: i.evaluation?.score ?? null,
        topic: i.topic,
        type: i.type,
      })),
    })
      .then((data) => {
        if (cancelled) return;
        setCoaching(data);
        setCoachingState('ready');
      })
      .catch(() => {
        if (!cancelled) setCoachingState('failed');
      });

    return () => {
      cancelled = true;
    };
    // Runs once per session — keyed on completedAt timestamp
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey]);

  if (!session || items.length === 0) return <NoSession />;

  const handleDownload = () => {
    setDownloading(true);
    const candidateName =
      [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
      user?.firstName ||
      user?.email ||
      'Candidate';

    const res = downloadInterviewReport(
      {
        candidateName,
        date: fmtDate(session.completedAt),
        interviewDuration: session.durationSeconds,
        questionsAnswered: answered.length,
        totalQuestions: session.totalQuestions,
        textResponses: Object.fromEntries(items.map((i, idx) => [idx, i.answer])),
        score: session.overallScore,
        feedback:
          coaching?.overall_assessment ||
          items.map((i) => i.evaluation?.feedback_summary).filter(Boolean).join(' '),
        suggestions:
          coaching?.areas_for_improvement?.length
            ? coaching.areas_for_improvement
            : weaknesses.slice(0, 5),
        startTime: session.completedAt,
        endTime: session.completedAt,
      },
      `Interview_Report_${session.roleLabel.replace(/\s+/g, '_')}.pdf`
    );

    setDownloading(false);
    if (!res?.success) {
      alert('Failed to generate PDF report: ' + (res?.error ?? 'unknown error'));
    }
  };

  return (
    <div className="space-y-8">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Interview Results</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Feedback and analytical breakdown for{' '}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {session.roleLabel}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            loading={downloading}
            leftIcon={
              !downloading && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )
            }
          >
            {downloading ? 'Downloading...' : 'Download Report'}
          </Button>

          <Link to="/interview">
            <Button variant="outline" size="sm">Retry Interview</Button>
          </Link>

          <Link to="/dashboard">
            <Button variant="primary" size="sm">Back to Dashboard</Button>
          </Link>
        </div>
      </div>

      {/* ── SCORE + SESSION FACTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-4 p-6 flex flex-col items-center justify-center text-center border-slate-200/80 dark:border-slate-800">
          <Gauge value={session.overallScore} size={150} />
          <div className="mt-4">
            <Badge
              variant={session.overallScore >= 70 ? 'success' : session.overallScore >= 50 ? 'primary' : 'warning'}
              className="font-bold text-xs uppercase tracking-wider mb-2"
            >
              {coaching?.performance_level ?? (session.overallScore >= 70 ? 'Strong' : 'Keep Practising')}
            </Badge>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
              {fmtDate(session.completedAt)} · {fmtDuration(session.durationSeconds)}
            </p>
          </div>
        </Card>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              name: 'Questions Answered',
              value: `${answered.length}/${session.totalQuestions}`,
              description:
                answered.length === session.totalQuestions
                  ? 'You completed every question in the session.'
                  : `${session.totalQuestions - answered.length} question(s) were skipped.`,
              accent: 'text-indigo-600 dark:text-indigo-400',
              bg: 'bg-indigo-50 dark:bg-indigo-950/40',
            },
            {
              name: 'Strongest Answer',
              value: bestItem ? `${bestItem.evaluation.percentage}%` : '—',
              description: bestItem ? `Q${bestItem.num} · ${bestItem.topic}` : 'No scored answers.',
              accent: 'text-emerald-600 dark:text-emerald-400',
              bg: 'bg-emerald-50 dark:bg-emerald-950/40',
            },
            {
              name: 'Weakest Answer',
              value: worstItem ? `${worstItem.evaluation.percentage}%` : '—',
              description: worstItem ? `Q${worstItem.num} · ${worstItem.topic}` : 'No scored answers.',
              accent: 'text-amber-600 dark:text-amber-400',
              bg: 'bg-amber-50 dark:bg-amber-950/40',
            },
          ].map((metric) => (
            <Card
              key={metric.name}
              className="p-5 flex flex-col justify-between border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-shadow"
            >
              <div>
                <div className={`inline-flex px-2.5 py-1 rounded-lg mb-3 ${metric.bg}`}>
                  <span className={`text-xl font-extrabold ${metric.accent}`}>{metric.value}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">{metric.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                  {metric.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── AI COACH SUMMARY ── */}
      {coachingState === 'loading' && (
        <Card className="p-5 border-slate-200/80 dark:border-slate-800 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <span className="animate-pulse text-lg">🤖</span>
          Generating your personalised coaching summary…
        </Card>
      )}

      {coachingState === 'ready' && coaching?.overall_assessment && (
        <Card className="border-slate-200/80 dark:border-slate-800">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <span className="text-indigo-500">🤖</span>
            <h2>AI Coach Summary</h2>
          </div>
          <div className="p-5 space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <p className="whitespace-pre-line">{coaching.overall_assessment}</p>

            {coaching.motivational_message && (
              <p className="p-3.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 italic">
                {coaching.motivational_message}
              </p>
            )}

            {coaching.next_session_focus && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <strong className="text-slate-700 dark:text-slate-300">Focus next session on:</strong>{' '}
                {coaching.next_session_focus}
              </p>
            )}
          </div>
        </Card>
      )}

      {/* ── STRENGTHS & WEAKNESSES ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200/80 dark:border-slate-800">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
            <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2>Top Strengths</h2>
          </div>
          <ul className="p-5 space-y-3.5">
            {(coaching?.strengths?.length ? coaching.strengths : strengths).slice(0, 6).map((str, i) => (
              <li key={i} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300 text-sm">
                <span className="text-emerald-500 text-base leading-none shrink-0 mt-0.5">✓</span>
                <span className="leading-relaxed">{str}</span>
              </li>
            ))}
            {strengths.length === 0 && !coaching?.strengths?.length && (
              <li className="text-sm text-slate-400">No strengths were identified in this session.</li>
            )}
          </ul>
        </Card>

        <Card className="border-slate-200/80 dark:border-slate-800">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold">
            <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2>Areas to Improve</h2>
          </div>
          <ul className="p-5 space-y-3.5">
            {(coaching?.areas_for_improvement?.length ? coaching.areas_for_improvement : weaknesses)
              .slice(0, 6)
              .map((weak, i) => (
                <li key={i} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300 text-sm">
                  <span className="text-rose-500 text-base leading-none shrink-0 mt-0.5">⚠</span>
                  <span className="leading-relaxed">{weak}</span>
                </li>
              ))}
            {weaknesses.length === 0 && !coaching?.areas_for_improvement?.length && (
              <li className="text-sm text-slate-400">Nothing flagged — strong session.</li>
            )}
          </ul>
        </Card>
      </div>

      {/* ── STUDY PLAN ── */}
      {coaching?.study_plan && (
        <Card className="border-slate-200/80 dark:border-slate-800">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <svg className="w-5 h-5 stroke-current stroke-2 fill-none text-indigo-500" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h2>Your Study Plan</h2>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm">
            {[
              ['Today', coaching.study_plan.immediate],
              ['This Week', coaching.study_plan.short_term],
              ['This Month', coaching.study_plan.long_term],
            ].map(([label, tasks]) => (
              <div key={label} className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {label}
                </h3>
                <ul className="space-y-2">
                  {(tasks ?? []).map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <span className="text-slate-300 dark:text-slate-600 mt-0.5">•</span>
                      <span className="leading-relaxed">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── CONCEPTS TO REVISIT ── */}
      {missingConcepts.length > 0 && (
        <Card className="border-slate-200/80 dark:border-slate-800">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200">
            <h2>Concepts to Revisit</h2>
          </div>
          <div className="p-5 flex flex-wrap gap-2">
            {missingConcepts.map((c, i) => (
              <span
                key={i}
                className="px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 text-xs font-medium"
              >
                {c}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* ── QUESTION-BY-QUESTION ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Question-by-Question Review
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">
            Click rows to expand details
          </span>
        </div>
        <div className="space-y-3">
          {items.map((item) => (
            <QuestionRow key={item.num} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Results;
