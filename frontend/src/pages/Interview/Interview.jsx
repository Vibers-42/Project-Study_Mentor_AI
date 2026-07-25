import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/layout/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Select from '../../components/common/Select';
import TextArea from '../../components/common/TextArea';

/* ─── Mock Question Datasets by Role ─────────────────────────── */
const MOCK_QUESTIONS = {
  frontend: [
    { id: 1, title: 'What is the purpose of useEffect hook and how does the cleanup function work?' },
    { id: 2, title: 'How does React reconciler determine which parts of the DOM to update?' },
    { id: 3, title: 'When would you use useMemo instead of memoizing a component with React.memo?' },
    { id: 4, title: 'Explain the difference between controlled and uncontrolled inputs in React forms.' },
    { id: 5, title: 'Describe a time you solved a difficult performance problem in a React project.' },
  ],
  backend: [
    { id: 1, title: 'How does Dependency Injection work in Spring Boot and what are its benefits?' },
    { id: 2, title: 'Explain the difference between optimistic and pessimistic locking in database transactions.' },
    { id: 3, title: 'How do you handle JWT authentication and token refresh in REST APIs?' },
    { id: 4, title: 'What is the difference between synchronous and asynchronous microservice communication?' },
    { id: 5, title: 'Describe how you troubleshoot high CPU usage in a Java backend service.' },
  ],
  dsa: [
    { id: 1, title: 'Explain how to detect a cycle in a singly linked list using Floyd’s algorithm.' },
    { id: 2, title: 'What is the time complexity of QuickSort in the average and worst cases?' },
    { id: 3, title: 'How would you implement a Min-Heap using an array data structure?' },
    { id: 4, title: 'Explain the difference between Breadth-First Search (BFS) and Depth-First Search (DFS).' },
    { id: 5, title: 'How does dynamic programming reduce exponential time to polynomial time?' },
  ],
};

const Interview = () => {
  const navigate = useNavigate();

  // Mode: 'setup' | 'active' | 'evaluating'
  const [mode, setMode] = useState('setup');

  // Setup options
  const [role, setRole] = useState('frontend');
  const [level, setLevel] = useState('mid');
  const [type, setType] = useState('mixed');

  // Active Interview state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState([]);

  // Timer effect during active interview
  useEffect(() => {
    let interval = null;
    if (mode === 'active') {
      interval = setInterval(() => setTimerSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [mode]);

  const questions = MOCK_QUESTIONS[role] || MOCK_QUESTIONS.frontend;
  const currentQuestion = questions[currentIdx];

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setMode('active');
    setCurrentIdx(0);
    setTimerSeconds(0);
    setAnswers([]);
    setUserAnswer('');
  };

  const handleRecordToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording && !userAnswer) {
      setUserAnswer('I would explain this by first analyzing the core requirements...');
    }
  };

  const handleNextQuestion = () => {
    if (!userAnswer.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setAnswers((prev) => [...prev, { q: currentQuestion.title, ans: userAnswer }]);

      if (currentIdx + 1 < questions.length) {
        setCurrentIdx((idx) => idx + 1);
        setUserAnswer('');
        setIsRecording(false);
      } else {
        // Completed all questions
        setMode('evaluating');
        setTimeout(() => {
          navigate('/results');
        }, 2000);
      }
    }, 800);
  };

  /* ═══════════════════════════════════════════════════════════════
     SETUP MODE RENDER
     ═══════════════════════════════════════════════════════════════ */
  if (mode === 'setup') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            AI Mock Interview Simulator
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure your session and practice realistic technical interviews with real-time AI scoring.
          </p>
        </div>

        {/* Configuration Card */}
        <Card className="p-6 space-y-6 border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
            <span className="text-2xl">🤖</span>
            <div className="text-sm">
              <p className="font-bold text-indigo-900 dark:text-indigo-200">AI Interviewer Persona Active</p>
              <p className="text-indigo-700/80 dark:text-indigo-300/80 text-xs">
                Your answers will be evaluated on technical depth, communication clarity, and problem-solving.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Select
              label="Select Target Role / Domain"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="frontend">React Frontend Developer</option>
              <option value="backend">Java Spring Boot Backend</option>
              <option value="dsa">Data Structures & Algorithms</option>
            </Select>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Experience Level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="entry">Entry Level (0-2 yrs)</option>
                <option value="mid">Mid-Level (2-5 yrs)</option>
                <option value="senior">Senior (5+ yrs)</option>
              </Select>

              <Select
                label="Question Focus"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="mixed">Mixed (Technical + Behavioral)</option>
                <option value="tech">Pure Technical Deep Dive</option>
                <option value="behavioral">STAR Behavioral Scenarios</option>
              </Select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Session length: <strong className="text-slate-800 dark:text-slate-200">5 Questions (~15 min)</strong>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleStart}
              className="shadow-md hover:scale-[1.01] transition-transform"
              rightIcon={
                <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              }
            >
              Start Interview Now
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     EVALUATING INTERVIEW RENDER
     ═══════════════════════════════════════════════════════════════ */
  if (mode === 'evaluating') {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 animate-scale-up">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl mx-auto shadow-md animate-pulse">
          🤖
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          Generating Interview Results...
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Analyzing your responses for technical accuracy, structure, and communication pacing.
        </p>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     ACTIVE INTERVIEW MODE RENDER
     ═══════════════════════════════════════════════════════════════ */
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Top Bar: Progress & Timer */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <Badge variant="primary" size="md" className="font-bold">
            Question {currentIdx + 1} of {questions.length}
          </Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400 capitalize hidden sm:inline">
            Role: <strong className="text-slate-800 dark:text-slate-200">{role}</strong>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
          <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
            <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h45m4 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTimer(timerSeconds)}
          </span>
          <button
            onClick={() => setMode('setup')}
            className="text-xs font-sans text-rose-500 hover:text-rose-600 font-medium transition-colors"
          >
            End Interview
          </button>
        </div>
      </div>

      {/* Question Card */}
      <Card className="p-6 border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <span>Technical Assessment Question</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">● Live Evaluator Listening</span>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
          "{currentQuestion.title}"
        </h2>
      </Card>

      {/* Answer Input Card */}
      <Card className="p-6 border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Your Response
          </label>
          <button
            type="button"
            onClick={handleRecordToggle}
            className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
            {isRecording ? 'Recording (Click to stop)' : 'Simulate Mic Input'}
          </button>
        </div>

        <TextArea
          rows={6}
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type or speak your answer here. Include relevant technical terms, code architecture, or real-world examples..."
          className="text-sm leading-relaxed"
        />

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {userAnswer.trim().split(/\s+/).filter(Boolean).length} words
          </span>

          <Button
            variant="primary"
            size="md"
            loading={isSubmitting}
            disabled={!userAnswer.trim() || isSubmitting}
            onClick={handleNextQuestion}
          >
            {currentIdx + 1 === questions.length ? 'Submit & View Results' : 'Next Question →'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Interview;
