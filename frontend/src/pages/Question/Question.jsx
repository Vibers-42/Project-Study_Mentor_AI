import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '../../utils/cn';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';

/* ─── Constants ────────────────────────────────────────────────── */
const MOCK_USER = { name: 'Alex Rivera' };

const AI_AVATAR_INITIALS = 'AI';

const SUGGESTED_PROMPTS = [
  { label: '⚛️ Explain React Hooks', text: 'Explain React Hooks with examples. Cover useState, useEffect, and useRef.' },
  { label: '🔍 Binary Search', text: 'Explain Binary Search algorithm with step-by-step example and time complexity.' },
  { label: '🗄️ SQL Joins', text: 'Explain the different types of SQL Joins (INNER, LEFT, RIGHT, FULL) with examples.' },
  { label: '🧱 OOP Concepts', text: 'Explain the four pillars of Object-Oriented Programming with real-world examples.' },
  { label: '⏱️ Time Complexity', text: 'Explain Big-O notation and time complexity with common examples from O(1) to O(n²).' },
  { label: '🌳 Binary Trees', text: 'Explain Binary Trees, traversal techniques (in-order, pre-order, post-order) with examples.' },
  { label: '🔒 OS Deadlock', text: 'Explain what deadlock is in Operating Systems and the four necessary conditions for it.' },
  { label: '⚡ Async/Await', text: 'Explain async/await in JavaScript with examples and how it differs from Promises.' },
];

// TODO: Replace with real API response when backend is connected
const MOCK_CONVERSATION = [
  {
    id: 1,
    role: 'user',
    text: 'Can you explain what React Hooks are and why we use them?',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
  },
  {
    id: 2,
    role: 'ai',
    timestamp: new Date(Date.now() - 7 * 60 * 1000),
    text: `**React Hooks** are special functions introduced in React 16.8 that let you use state and lifecycle features in functional components — without writing class components.

**Why were they introduced?**
Before Hooks, state and side-effects were only possible in class components, leading to verbose, hard-to-reuse code. Hooks solve this by allowing logic sharing across components.

**Most commonly used Hooks:**

**1. \`useState\`** — Adds local state to a functional component.
\`\`\`js
const [count, setCount] = useState(0);
\`\`\`

**2. \`useEffect\`** — Runs side effects (API calls, subscriptions) after render.
\`\`\`js
useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);
\`\`\`

**3. \`useRef\`** — Holds a mutable reference that doesn't trigger re-renders.
\`\`\`js
const inputRef = useRef(null);
inputRef.current.focus();
\`\`\`

**Key Rules of Hooks:**
- Only call Hooks at the **top level** (not inside conditions or loops).
- Only call Hooks from **React functions** (not regular JS functions).

Hooks make your components cleaner, more reusable, and easier to test! 🚀`,
  },
  {
    id: 3,
    role: 'user',
    text: 'What is the difference between useEffect and useLayoutEffect?',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: 4,
    role: 'ai',
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
    text: `Great follow-up! Both \`useEffect\` and \`useLayoutEffect\` handle side effects, but they fire at different times in React's rendering cycle.

**\`useEffect\`** — Fires **asynchronously after** the browser paints the screen.
- ✅ Use for: API calls, subscriptions, logging, timers.
- Doesn't block the browser paint, so the user sees the UI first.

**\`useLayoutEffect\`** — Fires **synchronously before** the browser paints.
- ✅ Use for: DOM measurements, manually modifying the DOM before the user sees it.
- Can cause visual flickering if misused since it blocks painting.

**Rule of Thumb:** Start with \`useEffect\`. Only switch to \`useLayoutEffect\` if you're measuring DOM nodes or seeing flicker caused by state updates that depend on layout.

| | \`useEffect\` | \`useLayoutEffect\` |
|---|---|---|
| Timing | After paint | Before paint |
| Blocks paint? | No | Yes |
| Common use | Data fetching | DOM measurements |`,
  },
];

/* ─── Helper: Format timestamp ────────────────────────────────── */
const formatTime = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(date);
};

/* ─── Helper: Parse markdown-like formatting ──────────────────── */
const parseMarkdown = (text) => {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let codeBlock = null;
  let codeLines = [];
  let tableLines = [];
  let inTable = false;
  let key = 0;

  const flushTable = () => {
    if (tableLines.length < 2) {
      tableLines.forEach((l) => elements.push(<p key={key++} className="text-sm leading-relaxed">{l}</p>));
      tableLines = [];
      return;
    }
    const headers = tableLines[0].split('|').map((c) => c.trim()).filter(Boolean);
    const rows = tableLines.slice(2).map((row) =>
      row.split('|').map((c) => c.trim()).filter(Boolean)
    );
    elements.push(
      <div key={key++} className="overflow-x-auto my-3 rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="text-xs w-full">
          <thead className="bg-slate-100 dark:bg-slate-800">
            <tr>{headers.map((h, i) => <th key={i} className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-t border-slate-100 dark:border-slate-800">
                {row.map((cell, ci) => <td key={ci} className="px-3 py-2 text-slate-600 dark:text-slate-400">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableLines = [];
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block
    if (line.startsWith('```')) {
      if (codeBlock === null) {
        codeBlock = line.slice(3).trim() || 'code';
        codeLines = [];
      } else {
        elements.push(
          <div key={key++} className="my-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">{codeBlock}</span>
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            </div>
            <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
              <code>{codeLines.join('\n')}</code>
            </pre>
          </div>
        );
        codeBlock = null;
        codeLines = [];
      }
      continue;
    }
    if (codeBlock !== null) { codeLines.push(line); continue; }

    // Table detection
    if (line.startsWith('|')) {
      if (!inTable) inTable = true;
      tableLines.push(line);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Empty line
    if (!line.trim()) {
      elements.push(<div key={key++} className="h-2" />);
      continue;
    }

    // Headings
    if (line.startsWith('### ')) { elements.push(<h3 key={key++} className="text-sm font-bold mt-3 mb-1 text-slate-900 dark:text-slate-100">{parseLine(line.slice(4))}</h3>); continue; }
    if (line.startsWith('## ')) { elements.push(<h2 key={key++} className="text-base font-bold mt-3 mb-1 text-slate-900 dark:text-slate-100">{parseLine(line.slice(3))}</h2>); continue; }
    if (line.startsWith('# ')) { elements.push(<h1 key={key++} className="text-lg font-bold mt-3 mb-1 text-slate-900 dark:text-slate-100">{parseLine(line.slice(2))}</h1>); continue; }

    // List items
    if (line.match(/^[-*•] /)) { elements.push(<li key={key++} className="text-sm leading-relaxed ml-4 list-disc list-inside marker:text-indigo-500">{parseLine(line.slice(2))}</li>); continue; }
    if (line.match(/^\d+\. /)) { elements.push(<li key={key++} className="text-sm leading-relaxed ml-4 list-decimal list-inside marker:text-indigo-500">{parseLine(line.replace(/^\d+\. /, ''))}</li>); continue; }

    // Normal paragraph
    elements.push(<p key={key++} className="text-sm leading-relaxed">{parseLine(line)}</p>);
  }

  if (inTable) flushTable();

  return elements;
};

// Inline markdown: bold, inline code, emoji-safe
const parseLine = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-slate-900 dark:text-slate-100">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono text-xs">{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

/* ─── AI Thinking Indicator ───────────────────────────────────── */
const ThinkingIndicator = () => (
  <div className="flex items-start gap-3 px-4 py-2">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md">
      AI
    </div>
    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
      <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">AI is thinking</span>
      <span className="flex gap-1 items-end pb-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.9s' }}
          />
        ))}
      </span>
    </div>
  </div>
);

/* ─── Empty State ─────────────────────────────────────────────── */
const EmptyState = ({ onPromptClick }) => (
  <div className="flex flex-col items-center justify-center h-full py-12 px-6 text-center">
    <div className="relative mb-6">
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
        </svg>
      </div>
      <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
    </div>

    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Ask Anything, Learn Everything</h2>
    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-8">
      Your AI study companion is ready. Ask about DSA, React, DBMS, OS, aptitude — anything academic!
    </p>

    <div className="flex flex-wrap justify-center gap-2 max-w-lg">
      {SUGGESTED_PROMPTS.slice(0, 4).map((p) => (
        <button
          key={p.label}
          onClick={() => onPromptClick(p.text)}
          className="px-4 py-2 rounded-full text-sm font-medium bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-all hover:scale-105 active:scale-95"
        >
          {p.label}
        </button>
      ))}
    </div>
  </div>
);

/* ─── Chat Message ────────────────────────────────────────────── */
const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3 px-4 py-2 group', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar */}
      {isUser ? (
        <Avatar name={MOCK_USER.name} size="sm" className="shrink-0 mt-1 shadow-sm" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1 shadow-md">
          AI
        </div>
      )}

      {/* Bubble */}
      <div className={cn('flex flex-col gap-1 max-w-[80%] sm:max-w-[70%]', isUser ? 'items-end' : 'items-start')}>
        {/* Sender label */}
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 px-1">
          {isUser ? MOCK_USER.name : 'Study Mentor AI'}
        </span>

        {/* Message content */}
        <div
          className={cn(
            'px-4 py-3 rounded-2xl shadow-sm leading-relaxed',
            isUser
              ? 'bg-indigo-600 text-white rounded-tr-sm'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm'
          )}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed">{message.text}</p>
          ) : (
            <div className="prose-sm prose-slate dark:prose-invert space-y-1">
              {parseMarkdown(message.text)}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-slate-400 dark:text-slate-600 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

/* ─── Main Page Component ─────────────────────────────────────── */
const Question = () => {
  const [messages, setMessages] = useState(MOCK_CONVERSATION);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(false);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Auto-resize textarea
  const handleTextareaChange = (e) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
  };

  const handleSend = useCallback(() => {
    const trimmed = inputText.trim();
    if (!trimmed || isThinking) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    // Simulate AI response delay (replace with real API call when backend is ready)
    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        timestamp: new Date(),
        text: `That's a great question! Here's a detailed explanation:\n\n**"${trimmed}"**\n\nThis is a placeholder response simulating the AI engine. When the backend is connected, this will be replaced with a real AI-powered answer from the Study Mentor AI engine.\n\nKey points to understand:\n- Concept breakdown will appear here\n- Examples will be provided\n- Related topics will be suggested\n\nStay tuned — the backend integration is coming soon! 🚀`,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 2000);
  }, [inputText, isThinking]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePromptClick = (text) => {
    setInputText(text);
    textareaRef.current?.focus();
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setShowEmptyState(true);
    setInputText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">

      {/* ── TOP HEADER ──────────────────────────────────────── */}
      <div className="shrink-0 px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-md shrink-0">
            AI
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
              Ask AI
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Ask any academic question and get AI-powered explanations.
            </p>
          </div>
          <Badge variant="success" size="sm" className="hidden sm:inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
            Online
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {!isEmpty && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              leftIcon={
                <svg className="w-4 h-4 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              }
            >
              <span className="hidden sm:inline">Clear Chat</span>
            </Button>
          )}
          <div className="text-xs text-slate-400 dark:text-slate-500 hidden md:block">
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* ── CHAT AREA ───────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 scroll-smooth">
        {isEmpty ? (
          <EmptyState onPromptClick={handlePromptClick} />
        ) : (
          <div className="py-4 space-y-1 max-w-4xl mx-auto">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isThinking && <ThinkingIndicator />}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* ── BOTTOM INPUT SECTION ─────────────────────────────── */}
      <div className="shrink-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto space-y-3">

          {/* Suggested prompt chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {SUGGESTED_PROMPTS.map((p) => (
              <button
                key={p.label}
                onClick={() => handlePromptClick(p.text)}
                className="flex-none px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/60 text-slate-600 hover:text-indigo-700 dark:text-slate-400 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input box */}
          <div className="relative flex flex-col bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl shadow-sm focus-within:border-indigo-500 dark:focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about DSA, React, DBMS, OS... (Enter to send, Shift+Enter for new line)"
              rows={1}
              className="w-full px-4 pt-3.5 pb-2 text-sm bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none focus:outline-none leading-relaxed"
              style={{ minHeight: '52px', maxHeight: '160px' }}
              disabled={isThinking}
            />

            {/* Bottom toolbar */}
            <div className="flex items-center justify-between px-3 pb-2.5 pt-1 gap-2">
              {/* Upload buttons (UI only) */}
              <div className="flex items-center gap-1">
                {/* Hidden file inputs */}
                <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" aria-label="Upload PDF" />
                <input ref={imageInputRef} type="file" accept="image/*" className="hidden" aria-label="Upload Image" />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload PDF (coming soon)"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/60 transition-all"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                  </svg>
                  <span className="hidden sm:inline">PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  title="Upload Image (coming soon)"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/60 transition-all"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <span className="hidden sm:inline">Image</span>
                </button>

                <span className="text-slate-200 dark:text-slate-700 mx-1 select-none">|</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-600 hidden sm:inline">
                  Shift+Enter for new line
                </span>
              </div>

              {/* Send button */}
              <Button
                onClick={handleSend}
                disabled={!inputText.trim() || isThinking}
                loading={isThinking}
                size="sm"
                className="shrink-0 rounded-xl"
                leftIcon={
                  !isThinking && (
                    <svg className="w-4 h-4 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  )
                }
              >
                {isThinking ? 'Thinking...' : 'Send'}
              </Button>
            </div>
          </div>

          <p className="text-[11px] text-center text-slate-400 dark:text-slate-600">
            Study Mentor AI can make mistakes. Always verify important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Question;
