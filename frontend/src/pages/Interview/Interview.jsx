import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/layout/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Select from '../../components/common/Select';
import TextArea from '../../components/common/TextArea';

import { generateQuestion, evaluateAnswer } from '../../services/ai.service';
import { saveSession } from '../../services/progress.service';
import { useAuth } from '../../contexts/AuthContext';

// Voice Analysis Features
import { VoiceRecorder } from '../../components/voice/VoiceRecorder';
import { SpeechRecognition } from '../../components/voice/SpeechRecognition';
import { AudioUploader } from '../../components/voice/AudioUploader';
import { MicrophonePermission } from '../../components/voice/MicrophonePermission';

/* ─── Role presets → what we actually send to the AI ──────────── */
const ROLE_PRESETS = {
  frontend: { label: 'React Frontend Developer', jobRole: 'React Frontend Developer', topic: 'React & Frontend Engineering' },
  backend:  { label: 'Java Spring Boot Backend', jobRole: 'Java Spring Boot Backend Developer', topic: 'Backend Engineering & APIs' },
  dsa:      { label: 'Data Structures & Algorithms', jobRole: 'Software Engineer', topic: 'Data Structures and Algorithms' },
};

const LEVEL_TO_DIFFICULTY = {
  entry:  'beginner',
  mid:    'intermediate',
  senior: 'advanced',
};

/* Question types cycled through, per chosen focus */
const FOCUS_TO_TYPES = {
  mixed:      ['conceptual', 'practical', 'scenario', 'behavioral', 'conceptual'],
  tech:       ['conceptual', 'practical', 'conceptual', 'scenario', 'practical'],
  behavioral: ['behavioral'],
};

const TOTAL_QUESTIONS = 5;

/* ─── Offline fallback questions (only used if the AI call fails) ─ */
const FALLBACK_QUESTIONS = {
  frontend: [
    'What is the purpose of the useEffect hook and how does its cleanup function work?',
    'How does the React reconciler determine which parts of the DOM to update?',
    'When would you use useMemo instead of memoizing a component with React.memo?',
    'Explain the difference between controlled and uncontrolled inputs in React forms.',
    'Describe a time you solved a difficult performance problem in a React project.',
  ],
  backend: [
    'How does Dependency Injection work in Spring Boot and what are its benefits?',
    'Explain the difference between optimistic and pessimistic locking in database transactions.',
    'How do you handle JWT authentication and token refresh in REST APIs?',
    'What is the difference between synchronous and asynchronous microservice communication?',
    'Describe how you troubleshoot high CPU usage in a Java backend service.',
  ],
  dsa: [
    "Explain how to detect a cycle in a singly linked list using Floyd's algorithm.",
    'What is the time complexity of QuickSort in the average and worst cases?',
    'How would you implement a Min-Heap using an array data structure?',
    'Explain the difference between Breadth-First Search (BFS) and Depth-First Search (DFS).',
    'How does dynamic programming reduce exponential time to polynomial time?',
  ],
};

const buildFallbackQuestion = (role, idx, difficulty, type) => ({
  question: FALLBACK_QUESTIONS[role]?.[idx] ?? FALLBACK_QUESTIONS.frontend[idx],
  topic: ROLE_PRESETS[role]?.topic ?? 'General',
  difficulty,
  type,
  hints: [],
  expected_concepts: [],
  time_limit_minutes: 5,
});

const Interview = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // 'setup' | 'loading' | 'active' | 'evaluating'
  const [mode, setMode] = useState('setup');

  // Setup options
  const [role, setRole] = useState('frontend');
  const [level, setLevel] = useState('mid');
  const [focus, setFocus] = useState('mixed');

  // Answer Mode: 'text' | 'speech' | 'recorder' | 'upload'
  const [answerMode, setAnswerMode] = useState('text');

  // Active interview state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [askedQuestions, setAskedQuestions] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [voiceMeta, setVoiceMeta] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState([]);
  const [notice, setNotice] = useState(null);

  const lastTranscriptRef = useRef('');
  // The speech panel stays mounted across tabs, so it can still emit while the
  // user is on another tab. Track the active tab to avoid clobbering typing.
  const answerModeRef = useRef(answerMode);
  useEffect(() => {
    answerModeRef.current = answerMode;
  }, [answerMode]);

  const preset = ROLE_PRESETS[role];
  const difficulty = LEVEL_TO_DIFFICULTY[level];

  /* Timer runs only while a question is on screen */
  useEffect(() => {
    if (mode !== 'active') return undefined;
    const interval = setInterval(() => setTimerSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [mode]);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const questionTypeFor = useCallback(
    (idx) => {
      const types = FOCUS_TO_TYPES[focus] ?? FOCUS_TO_TYPES.mixed;
      return types[idx % types.length];
    },
    [focus]
  );

  /* ── Fetch a question from the AI backend, with graceful fallback ── */
  const fetchQuestion = useCallback(
    async (idx, previous) => {
      const type = questionTypeFor(idx);
      try {
        const q = await generateQuestion({
          topic: preset.topic,
          job_role: preset.jobRole,
          difficulty,
          question_type: type,
          previous_questions: previous,
        });
        if (!q?.question) throw new Error('Empty question returned');
        return { data: q, fallback: false };
      } catch (err) {
        // api.js unwraps the backend message onto err.message
        return {
          data: buildFallbackQuestion(role, idx, difficulty, type),
          fallback: true,
          detail: err?.message || 'Unknown error',
        };
      }
    },
    [preset, difficulty, questionTypeFor, role]
  );

  const resetAnswerInputs = () => {
    setUserAnswer('');
    setVoiceMeta(null);
    lastTranscriptRef.current = '';
  };

  const handleStart = async () => {
    setMode('loading');
    setNotice(null);
    setCurrentIdx(0);
    setTimerSeconds(0);
    setResults([]);
    setAskedQuestions([]);
    resetAnswerInputs();

    const { data, fallback, detail } = await fetchQuestion(0, []);
    if (fallback) {
      setNotice(
        `Could not reach the AI service (${detail}). Running with offline practice questions — scores will be estimated.`
      );
    }
    setCurrentQuestion(data);
    setAskedQuestions([data.question]);
    setMode('active');
  };

  const handleEndEarly = () => {
    setMode('setup');
    setCurrentQuestion(null);
    setResults([]);
    setAskedQuestions([]);
    resetAnswerInputs();
    setNotice(null);
  };

  const handleNextQuestion = async () => {
    if (!currentQuestion) return;
    setIsSubmitting(true);

    const answerText = userAnswer.trim();
    let evaluation;

    if (!answerText) {
      // Skipped — record a zero rather than sending an empty answer to the AI
      evaluation = {
        score: 0,
        grade: 'F',
        percentage: 0,
        strengths: [],
        weaknesses: ['No answer was provided for this question.'],
        missing_concepts: currentQuestion.expected_concepts ?? [],
        feedback_summary: 'This question was skipped.',
        better_answer: '',
        skipped: true,
      };
    } else {
      try {
        evaluation = await evaluateAnswer({
          question: currentQuestion.question,
          user_answer: answerText,
          expected_concepts: currentQuestion.expected_concepts ?? [],
          topic: currentQuestion.topic ?? preset.topic,
          difficulty: currentQuestion.difficulty ?? difficulty,
        });
      } catch (err) {
        const detail = err?.message || 'Unknown error';
        setNotice(`Answer evaluation failed (${detail}). Recorded without a score.`);
        evaluation = {
          score: null,
          grade: null,
          percentage: null,
          strengths: [],
          weaknesses: [],
          missing_concepts: [],
          feedback_summary: 'This answer could not be evaluated automatically.',
          better_answer: '',
          unevaluated: true,
        };
      }
    }

    const record = {
      num: currentIdx + 1,
      question: currentQuestion.question,
      topic: currentQuestion.topic ?? preset.topic,
      type: currentQuestion.type ?? questionTypeFor(currentIdx),
      difficulty: currentQuestion.difficulty ?? difficulty,
      answer: answerText,
      answerMode,
      voiceMeta,
      evaluation,
    };

    const nextResults = [...results, record];
    setResults(nextResults);

    const nextIdx = currentIdx + 1;

    if (nextIdx < TOTAL_QUESTIONS) {
      const { data, fallback, detail } = await fetchQuestion(nextIdx, askedQuestions);
      if (fallback) {
        setNotice(
          `Could not reach the AI service (${detail}). Continuing with an offline question.`
        );
      }
      setCurrentQuestion(data);
      setAskedQuestions((prev) => [...prev, data.question]);
      setCurrentIdx(nextIdx);
      resetAnswerInputs();
      setIsSubmitting(false);
      return;
    }

    /* ── Session complete ── */
    setIsSubmitting(false);
    setMode('evaluating');

    const scored = nextResults.filter((r) => typeof r.evaluation?.percentage === 'number');
    const overallScore = scored.length
      ? Math.round(scored.reduce((sum, r) => sum + r.evaluation.percentage, 0) / scored.length)
      : 0;

    const payload = {
      roleLabel: preset.label,
      jobRole: preset.jobRole,
      topic: preset.topic,
      difficulty,
      focus,
      completedAt: new Date().toISOString(),
      durationSeconds: timerSeconds,
      totalQuestions: TOTAL_QUESTIONS,
      overallScore,
      items: nextResults,
    };

    // Persist to the user's progress history (best-effort — never blocks results).
    // Backend contract: overall_score is 0-10, duration is in minutes.
    if (isAuthenticated) {
      try {
        await saveSession(
          {
            topic: preset.topic,
            job_role: preset.jobRole,
            overall_score: Number((overallScore / 10).toFixed(1)),
            duration_minutes: Math.round(timerSeconds / 60),
            session_history: nextResults.map((r) => ({
              question: r.question,
              answer: r.answer,
              topic: r.topic,
              type: r.type,
              score: r.evaluation?.score ?? null,
            })),
          },
          { skipAuthRedirect: true }
        );
      } catch {
        // Saving is non-critical; the report is still shown.
      }
    }

    navigate('/results', { state: payload });
  };

  /* Speech transcript → answer text (only while the speech tab is active) */
  const handleTranscriptChange = useCallback((transcript) => {
    if (answerModeRef.current !== 'speech') return;
    if (transcript && transcript !== lastTranscriptRef.current) {
      lastTranscriptRef.current = transcript;
      setUserAnswer(transcript);
    }
  }, []);

  const handleRecordingComplete = useCallback((rec) => {
    setVoiceMeta({ kind: 'recording', ...rec });
  }, []);

  const handleAudioUploaded = useCallback((file) => {
    setVoiceMeta({ kind: 'upload', name: file.name, size: file.size, duration: file.duration });
  }, []);

  const NoticeBanner = () =>
    notice ? (
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-200 text-xs leading-relaxed">
        <span className="shrink-0 text-sm">⚠</span>
        <span>{notice}</span>
      </div>
    ) : null;

  /* ═══════════════ SETUP MODE ═══════════════ */
  if (mode === 'setup') {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>🎙️</span> AI Mock Interview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Questions are generated live by AI for your role and level, and every answer is
            scored with detailed feedback.
          </p>
        </div>

        <NoticeBanner />

        <MicrophonePermission />

        <Card className="p-6 space-y-6 border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
            <span className="text-2xl">🤖</span>
            <div className="text-sm">
              <p className="font-bold text-indigo-900 dark:text-indigo-200">AI Interviewer Ready</p>
              <p className="text-indigo-700/80 dark:text-indigo-300/80 text-xs">
                Answer by typing or speaking. Each response is evaluated for accuracy,
                completeness, and depth.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Select
              label="Select Target Role / Domain"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {Object.entries(ROLE_PRESETS).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
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
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
              >
                <option value="mixed">Mixed (Technical + Behavioral)</option>
                <option value="tech">Pure Technical Deep Dive</option>
                <option value="behavioral">STAR Behavioral Scenarios</option>
              </Select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Session length:{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {TOTAL_QUESTIONS} Questions
              </strong>
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

  /* ═══════════════ LOADING FIRST QUESTION ═══════════════ */
  if (mode === 'loading') {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 animate-scale-up">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl mx-auto shadow-md animate-pulse">
          🤖
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          Preparing your interview…
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Generating a {LEVEL_TO_DIFFICULTY[level]} question for {preset.label}.
        </p>
      </div>
    );
  }

  /* ═══════════════ FINAL EVALUATION ═══════════════ */
  if (mode === 'evaluating') {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 animate-scale-up">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl mx-auto shadow-md animate-pulse">
          📊
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          Building your report…
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Compiling scores, strengths, and improvement areas from all {TOTAL_QUESTIONS} answers.
        </p>
      </div>
    );
  }

  /* ═══════════════ ACTIVE INTERVIEW ═══════════════ */
  const wordCount = userAnswer.trim().split(/\s+/).filter(Boolean).length;
  const isLast = currentIdx + 1 === TOTAL_QUESTIONS;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Progress & Timer */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <Badge variant="primary" size="md" className="font-bold">
            Question {currentIdx + 1} of {TOTAL_QUESTIONS}
          </Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            <strong className="text-slate-800 dark:text-slate-200">{preset.label}</strong>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
          <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
            <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTimer(timerSeconds)}
          </span>
          <button
            onClick={handleEndEarly}
            className="text-xs font-sans text-rose-500 hover:text-rose-600 font-medium transition-colors"
          >
            End Interview
          </button>
        </div>
      </div>

      <NoticeBanner />

      {/* Question */}
      <Card className="p-6 border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <span className="capitalize">
            {currentQuestion?.type ?? 'Technical'} · {currentQuestion?.difficulty ?? difficulty}
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">● AI Generated</span>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
          {currentQuestion?.question}
        </h2>

        {currentQuestion?.topic && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Topic: <strong className="text-slate-700 dark:text-slate-300">{currentQuestion.topic}</strong>
          </p>
        )}

        {currentQuestion?.hints?.length > 0 && (
          <details className="text-xs text-slate-500 dark:text-slate-400">
            <summary className="cursor-pointer font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Need a hint?
            </summary>
            <ul className="mt-2 space-y-1 pl-4 list-disc">
              {currentQuestion.hints.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </details>
        )}
      </Card>

      {/* Answer panel */}
      <Card className="p-6 border-slate-200/80 dark:border-slate-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Answer Input Method:
          </span>
          <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
            {[
              ['text', '✍️ Text Input'],
              ['speech', '🎤 Live Speech'],
              ['recorder', '🎙️ Voice Recorder'],
              ['upload', '📁 Upload Audio'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setAnswerMode(key)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  answerMode === key
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* All four panels stay mounted and are hidden with CSS rather than
            unmounted — switching tabs must not discard a live transcript, a
            finished recording, or an uploaded file. `key={currentIdx}` still
            resets them when we move on to the next question. */}
        <div className={answerMode === 'text' ? 'space-y-4' : 'hidden'}>
          <TextArea
            rows={6}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your technical answer here. Include concept breakdowns, code examples, or design decisions..."
            className="text-sm leading-relaxed"
          />
        </div>

        <div className={answerMode === 'speech' ? 'space-y-4' : 'hidden'}>
          <SpeechRecognition key={`sr-${currentIdx}`} onTranscriptChange={handleTranscriptChange} />
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Answer to be submitted (editable)
            </label>
            <TextArea
              rows={4}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Your speech appears here automatically — edit before submitting if needed."
              className="text-sm leading-relaxed"
            />
          </div>
        </div>

        <div className={answerMode === 'recorder' ? 'space-y-4' : 'hidden'}>
          <VoiceRecorder key={`vr-${currentIdx}`} onRecordingComplete={handleRecordingComplete} />
          {voiceMeta?.kind === 'recording' && (
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              ✓ Recording attached ({Math.round(voiceMeta.duration / 1000)}s)
            </p>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Written answer (required for scoring)
            </label>
            <TextArea
              rows={4}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Audio is attached to your report, but the AI scores the written text — summarise your answer here."
              className="text-sm leading-relaxed"
            />
          </div>
        </div>

        <div className={answerMode === 'upload' ? 'space-y-4' : 'hidden'}>
          <AudioUploader
            key={`au-${currentIdx}`}
            onUploadSuccess={handleAudioUploaded}
            onRemove={() => setVoiceMeta(null)}
          />
          {voiceMeta?.kind === 'upload' && (
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              ✓ "{voiceMeta.name}" attached to this answer
            </p>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Written answer (required for scoring)
            </label>
            <TextArea
              rows={4}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Summarise your answer in text so it can be evaluated."
              className="text-sm leading-relaxed"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
            {!userAnswer.trim() && ' · submitting empty counts as skipped'}
          </span>

          <Button
            variant="primary"
            size="md"
            loading={isSubmitting}
            disabled={isSubmitting}
            onClick={handleNextQuestion}
          >
            {isSubmitting
              ? 'Evaluating…'
              : isLast
                ? 'Submit & Generate Report'
                : 'Next Question →'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Interview;
