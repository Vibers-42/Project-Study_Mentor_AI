import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/layout/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { downloadInterviewReport } from '../../services/pdfService';

/* ─── Mock Results Data ───────────────────────────────────────── */
const MOCK_RESULTS = {
  role: 'React Frontend Developer',
  date: 'July 25, 2026',
  duration: '18 minutes',
  totalQuestions: 5,
  overallScore: 82,
  metrics: [
    {
      name: 'Technical Score',
      value: 85,
      description: 'Solid knowledge of state management, Hooks, and virtual DOM reconciliation.',
      color: 'from-indigo-500 to-indigo-600',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      name: 'Communication Score',
      value: 78,
      description: 'Answers were clear but could be more structured. Tends to overexplain simple terms.',
      color: 'from-violet-500 to-violet-600',
      textColor: 'text-violet-600 dark:text-violet-400',
      bgColor: 'bg-violet-50 dark:bg-violet-950/40',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      name: 'Confidence Score',
      value: 84,
      description: 'Maintained steady pacing with minimal filler words. Strong presentation and tone.',
      color: 'from-emerald-500 to-emerald-600',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ],
  strengths: [
    'Excellent explanation of React reconciliation and rendering phases.',
    'Comfortable with clean code principles and structural design.',
    'Effective articulation of synchronous vs asynchronous state updates.',
    'Good pacing, speaking at a highly professional ~130 WPM.',
  ],
  weaknesses: [
    'Struggled slightly when asked about specific use cases of useMemo optimization.',
    'Communication style could benefit from using the STAR method for behavioral parts.',
    'Missed highlighting browser paint cycles when comparing React rendering workflows.',
  ],
  suggestions: [
    'Practice mock questions on frontend performance tuning and lazy loading strategies.',
    'Structure answers using: Situation, Task, Action, Result (STAR method).',
    'Review browser layout/paint lifecycle and how React schedules updates (Fiber scheduler).',
  ],
  questions: [
    {
      num: 1,
      q: 'What is the purpose of useEffect hook and how does the cleanup function work?',
      score: 90,
      userAns: 'useEffect is used to run side-effects. The cleanup function is returned inside useEffect. It runs before the component unmounts and before the effect runs again, so we can clean up event listeners or fetch requests.',
      feedback: 'Excellent answer. You correctly identified side-effects and the timing of cleanup triggers. To make it perfect, you could mention dependency array comparisons.',
      sampleAns: 'useEffect manages side effects like API calls or subscriptions. The optional returned function acts as a cleanup mechanism. React runs it before applying the effect again or unmounting, ensuring resources like EventListeners, timers, or abort controllers are released.',
    },
    {
      num: 2,
      q: 'How does React reconciler determine which parts of the DOM to update?',
      score: 85,
      userAns: 'It uses a diffing algorithm on the Virtual DOM. It compares the new virtual DOM tree with the old virtual DOM tree. If elements have the same key and type, it updates them. Otherwise it replaces them.',
      feedback: 'Very good detail on Virtual DOM diffing. You correctly highlighted elements keys and types. Mentioning Fiber reconciler scheduling priorities would add great depth.',
      sampleAns: 'React uses a reconciliation algorithm (Fiber since v16) to diff two Virtual DOM trees. It assumes heuristics: 1) Two elements of different types produce different trees, and 2) Keys allow stable, consistent identity tracking across updates, preventing redundant re-creation.',
    },
    {
      num: 3,
      q: 'When would you use useMemo instead of memoizing a component with React.memo?',
      score: 72,
      userAns: 'useMemo is for memoizing values, like calculations. React.memo is for components to prevent them from re-rendering if props do not change.',
      feedback: 'Correct distinction. However, you should emphasize that useMemo avoids executing expensive computation, whereas React.memo avoids component render execution. Explain prop reference stability (like callbacks) to connect both.',
      sampleAns: 'React.memo is a Higher-Order Component that skips rendering a component if props remain shallow-equal. useMemo is a Hook that memoizes the output of an expensive computation. You would use useMemo to cache a computed value, or to maintain reference stability for objects/arrays passed as props to memoized children.',
    },
    {
      num: 4,
      q: 'Explain the difference between controlled and uncontrolled inputs in React forms.',
      score: 88,
      userAns: 'Controlled inputs get their values from React state, and changes are handled by callbacks like onChange. Uncontrolled inputs rely on the DOM itself using refs to access their values.',
      feedback: 'Precise and accurate description. You clearly pointed out state handling vs refs. Providing a brief code example or talking about validation workflows would improve the structure.',
      sampleAns: 'A controlled input has its value bound to state (value={state}), serving as the single source of truth, updated via onChange. An uncontrolled input maintains internal state in the DOM, accessed via a ref (inputRef.current.value) when needed. Controlled is preferred for instant feedback and validation.',
    },
    {
      num: 5,
      q: 'Describe a time you solved a difficult performance problem in a React project.',
      score: 75,
      userAns: 'We had a list rendering thousands of elements and causing delay. I virtualized the list using react-window so only visible items are rendered, making it scroll smoothly.',
      feedback: 'Good implementation example. However, structure the answer using the STAR format: Explain what caused the slow performance, options analyzed, and show quantitative results (e.g. framerate increase).',
      sampleAns: 'State the situation (e.g., list lagging on mobile), target issue (re-renders of invisible cards), action taken (analyzed DevTools Profiler, implemented list virtualization via react-window, optimized prop comparison), and outcome (FPS stabilized from 18 to 60 FPS, reducing memory footprint by 70%).',
    },
  ],
};

/* ─── Circular Progress Gauge ─────────────────────────────────── */
const Gauge = ({ value, size = 120 }) => {
  const radius = size * 0.4;
  const strokeWidth = size * 0.08;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-slate-100 dark:stroke-slate-800"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress track */}
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
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Overall</span>
      </div>
    </div>
  );
};

/* ─── Question Row Component ──────────────────────────────────── */
const QuestionRow = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800';
    if (score >= 70) return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800';
    return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800';
  };

  return (
    <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 transition-all duration-200">
      {/* Header Summary Row */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex-1 min-w-0 flex items-start gap-3">
          <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
            {item.num}
          </span>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate pr-4">
            {item.q}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Badge
            variant={item.score >= 85 ? 'success' : item.score >= 70 ? 'primary' : 'warning'}
            className="text-xs font-bold"
          >
            Score: {item.score}%
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

      {/* Expanded Review Panel */}
      {isOpen && (
        <div className="px-4 pb-5 sm:px-5 space-y-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 pt-4 text-sm">
          {/* User's Answer */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">Your Answer</h4>
            <p className="text-slate-700 dark:text-slate-355 italic bg-white dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200/60 dark:border-slate-800/60 leading-relaxed">
              "{item.userAns}"
            </p>
          </div>

          {/* Feedback */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">AI Evaluation & Feedback</h4>
            <div className="bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 p-3.5 rounded-lg text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5">
              <span className="text-indigo-500 text-lg mt-0.5 shrink-0">💡</span>
              <p>{item.feedback}</p>
            </div>
          </div>

          {/* Model Answer */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">Recommended Answer</h4>
            <p className="text-slate-700 dark:text-slate-300 bg-emerald-500/5 dark:bg-emerald-500/[0.02] border border-emerald-500/10 dark:border-emerald-500/5 p-3.5 rounded-lg leading-relaxed">
              {item.sampleAns}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Results Main Component ──────────────────────────────────── */
const Results = () => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      const res = downloadInterviewReport(
        {
          candidateName: 'Alex Rivera',
          date: MOCK_RESULTS.date,
          interviewDuration: 1080,
          questionsAnswered: MOCK_RESULTS.totalQuestions,
          totalQuestions: MOCK_RESULTS.totalQuestions,
          score: MOCK_RESULTS.overallScore,
          feedback: MOCK_RESULTS.metrics[0].description,
          suggestions: MOCK_RESULTS.suggestions,
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
        },
        `Study_Mentor_AI_Report_${MOCK_RESULTS.role.replace(/\s+/g, '_')}.pdf`
      );
      setDownloading(false);
      if (!res.success) {
        alert('Failed to generate PDF report: ' + res.error);
      }
    }, 500);
  };

  return (
    <div className="space-y-8">
      {/* ── TOP HEADER SECTION ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Interview Results
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Feedback and analytical breakdown for <span className="font-semibold text-indigo-600 dark:text-indigo-400">{MOCK_RESULTS.role}</span>
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
            <Button
              variant="outline"
              size="sm"
              leftIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18" />
                </svg>
              }
            >
              Retry Interview
            </Button>
          </Link>

          <Link to="/dashboard">
            <Button variant="primary" size="sm">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* ── OVERALL SCORE & BREAKDOWN GRID ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Overall Score Circle Card */}
        <Card className="lg:col-span-4 p-6 flex flex-col items-center justify-center text-center border-slate-200/80 dark:border-slate-800">
          <Gauge value={MOCK_RESULTS.overallScore} size={150} />
          <div className="mt-4">
            <Badge variant="success" className="font-bold text-xs uppercase tracking-wider mb-2">
              Passed Review
            </Badge>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
              Reviewed on {MOCK_RESULTS.date} ({MOCK_RESULTS.duration})
            </p>
          </div>
        </Card>

        {/* Metric Breakdown Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MOCK_RESULTS.metrics.map((metric) => (
            <Card
              key={metric.name}
              className="p-5 flex flex-col justify-between border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${metric.textColor} ${metric.bgColor}`}>
                    {metric.icon}
                  </div>
                  <span className={`text-xl font-extrabold ${metric.textColor}`}>
                    {metric.value}%
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">
                  {metric.name}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                  {metric.description}
                </p>
              </div>

              {/* Mini progress bar */}
              <div className="mt-4">
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${metric.color}`}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── STRENGTHS & WEAKNESSES GRID ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="border-slate-200/80 dark:border-slate-800">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
            <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2>Top Strengths</h2>
          </div>
          <ul className="p-5 space-y-3.5">
            {MOCK_RESULTS.strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300 text-sm">
                <span className="text-emerald-500 text-base leading-none shrink-0 mt-0.5">✓</span>
                <span className="leading-relaxed">{str}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Weaknesses */}
        <Card className="border-slate-200/80 dark:border-slate-800">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold">
            <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2>Areas to Improve</h2>
          </div>
          <ul className="p-5 space-y-3.5">
            {MOCK_RESULTS.weaknesses.map((weak, i) => (
              <li key={i} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300 text-sm">
                <span className="text-rose-500 text-base leading-none shrink-0 mt-0.5">⚠</span>
                <span className="leading-relaxed">{weak}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* ── IMPROVEMENT PLAN ─────────────────────────────── */}
      <Card className="border-slate-200/80 dark:border-slate-800">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 font-bold text-slate-850 dark:text-slate-150">
          <svg className="w-5 h-5 stroke-current stroke-2 fill-none text-indigo-500" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h2>Customized Improvement Suggestions</h2>
        </div>
        <ul className="p-5 space-y-3.5">
          {MOCK_RESULTS.suggestions.map((sug, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm">
              <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="leading-relaxed pt-0.5">{sug}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* ── QUESTION-BY-QUESTION REVIEW ─────────────────── */}
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
          {MOCK_RESULTS.questions.map((q) => (
            <QuestionRow key={q.num} item={q} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Results;
