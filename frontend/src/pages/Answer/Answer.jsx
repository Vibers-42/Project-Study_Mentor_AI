import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/layout/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const MOCK_QUESTION_DETAIL = {
  id: 'q-101',
  title: 'Explain React Fiber architecture and how concurrent rendering works.',
  topic: 'React & Frontend Frameworks',
  difficulty: 'Hard',
  author: 'Study Mentor AI Engine v4.2',
  date: 'July 25, 2026',
  stats: {
    views: '1,420',
    likes: 382,
    saves: 145,
  },
  overview: `React Fiber is a complete rewrite of React's core reconciliation algorithm introduced in React 16. It enables concurrent rendering by breaking rendering work into incremental units called "fibers".`,
  sections: [
    {
      title: '1. What Problem Does Fiber Solve?',
      content: `Before Fiber, React used a recursive tree-traversal algorithm (the Stack Reconciler). Once rendering started, it couldn't be interrupted. For large component trees, this synchronous work blocked the main browser thread, leading to dropped frames, laggy input response, and stuttering animations.`,
    },
    {
      title: '2. Core Principles of Fiber',
      content: `A "fiber" represents a unit of work with its own call stack frame. Fiber enables React to:
- Pause work and come back to it later.
- Assign priority to different types of work (e.g. user input vs background data fetch).
- Reuse previously completed work or abort work if it's no longer needed.`,
    },
    {
      title: '3. The Two Phases of Fiber',
      content: `1. **Render / Reconciliation Phase (Asynchronous & Interruptible):**
   React traverses the fiber tree and computes changes. It builds a work-in-progress tree without mutating the DOM.

2. **Commit Phase (Synchronous & Uninterruptible):**
   React applies all computed changes to the actual DOM in a single rapid batch to prevent partial visual updates.`,
    },
  ],
  codeSnippet: `// Example: Concurrent Priority Rendering in React 18
import { useState, useTransition } from 'react';

function SearchResults({ query }) {
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState('');

  const handleChange = (e) => {
    // High priority update: Keep input snappy
    setFilter(e.target.value);

    // Low priority transition: Can be interrupted by user typing
    startTransition(() => {
      // Perform heavy filter calculation
    });
  };

  return <input value={filter} onChange={handleChange} />;
}`,
  relatedTopics: ['React Hooks', 'Virtual DOM Diffing', 'useTransition & useDeferredValue', 'Browser Event Loop'],
};

const Answer = () => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
        >
          ← Back
        </button>
        <div className="flex items-center gap-2">
          <Link to="/question">
            <Button variant="primary" size="sm">
              Ask AI New Question
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="p-6 sm:p-8 space-y-6 border-slate-200/80 dark:border-slate-800">
        {/* Topic Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="sm">{MOCK_QUESTION_DETAIL.topic}</Badge>
            <Badge variant="warning" size="sm">{MOCK_QUESTION_DETAIL.difficulty}</Badge>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Published {MOCK_QUESTION_DETAIL.date}
          </span>
        </div>

        {/* Question Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 leading-tight">
          {MOCK_QUESTION_DETAIL.title}
        </h1>

        {/* Overview Banner */}
        <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-sm text-indigo-950 dark:text-indigo-200 leading-relaxed">
          {MOCK_QUESTION_DETAIL.overview}
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6 text-slate-800 dark:text-slate-200 leading-relaxed">
          {MOCK_QUESTION_DETAIL.sections.map((sec, i) => (
            <div key={i} className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {sec.title}
              </h2>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {sec.content}
              </p>
            </div>
          ))}
        </div>

        {/* Code Snippet Card */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Code Example & Usage
          </h3>
          <div className="bg-slate-900 text-slate-100 p-4 sm:p-5 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
            <pre>{MOCK_QUESTION_DETAIL.codeSnippet}</pre>
          </div>
        </div>

        {/* Related Topics */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Related Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {MOCK_QUESTION_DETAIL.relatedTopics.map((topic) => (
              <Badge key={topic} variant="secondary" size="sm">
                #{topic}
              </Badge>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                liked
                  ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              ❤️ {MOCK_QUESTION_DETAIL.stats.likes + (liked ? 1 : 0)}
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                saved
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              🔖 {saved ? 'Saved to Bookmarks' : 'Bookmark'}
            </button>
          </div>

          <span className="text-slate-400 dark:text-slate-500">
            👁 {MOCK_QUESTION_DETAIL.stats.views} views
          </span>
        </div>
      </Card>
    </div>
  );
};

export default Answer;
