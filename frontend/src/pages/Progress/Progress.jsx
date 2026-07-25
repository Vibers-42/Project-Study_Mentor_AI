import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/layout/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

/* ═══════════════════════════════════════════════════════════════
   MOCK DATA — Replace with API calls when backend is ready
   ═══════════════════════════════════════════════════════════════ */

const WEEKLY_PROGRESS = {
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  questions: [12, 18, 8, 22, 15, 25, 10],
  hours: [1.5, 2.2, 1.0, 2.8, 1.8, 3.0, 1.2],
  maxQuestions: 30,
};

const MONTHLY_PROGRESS = [
  { month: 'Feb', questions: 68, interviews: 4 },
  { month: 'Mar', questions: 95, interviews: 6 },
  { month: 'Apr', questions: 120, interviews: 8 },
  { month: 'May', questions: 142, interviews: 10 },
  { month: 'Jun', questions: 185, interviews: 14 },
  { month: 'Jul', questions: 248, interviews: 18 },
];

const STREAK_DATA = {
  currentStreak: 21,
  longestStreak: 34,
  totalDays: 142,
  thisWeek: 7,
};

const QUESTIONS_DATA = {
  total: 248,
  correct: 209,
  incorrect: 39,
  accuracy: 84.3,
  byDifficulty: [
    { level: 'Easy', solved: 98, total: 105, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
    { level: 'Medium', solved: 82, total: 110, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/40' },
    { level: 'Hard', solved: 29, total: 55, color: 'from-rose-500 to-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/40' },
  ],
};

const INTERVIEW_HISTORY = [
  { id: 1, role: 'React Frontend Developer', date: 'Jul 25, 2026', score: 82, grade: 'A-', status: 'Completed' },
  { id: 2, role: 'Java Spring Boot Backend', date: 'Jul 22, 2026', score: 79, grade: 'B+', status: 'Completed' },
  { id: 3, role: 'Operating Systems Core', date: 'Jul 20, 2026', score: 85, grade: 'A-', status: 'Completed' },
  { id: 4, role: 'SQL & Database Design', date: 'Jul 18, 2026', score: 68, grade: 'C+', status: 'Completed' },
  { id: 5, role: 'DSA — Arrays & Sorting', date: 'Jul 15, 2026', score: 73, grade: 'B', status: 'Completed' },
  { id: 6, role: 'Node.js REST APIs', date: 'Jul 12, 2026', score: 88, grade: 'A', status: 'Completed' },
];

const TOPIC_PROGRESS = [
  { topic: 'React & Frontend', progress: 78, questionsAnswered: 62, color: 'from-indigo-500 to-indigo-600', icon: '⚛️' },
  { topic: 'Data Structures & Algorithms', progress: 45, questionsAnswered: 48, color: 'from-amber-500 to-amber-600', icon: '🌳' },
  { topic: 'Operating Systems', progress: 62, questionsAnswered: 38, color: 'from-cyan-500 to-cyan-600', icon: '💻' },
  { topic: 'Database & SQL', progress: 55, questionsAnswered: 32, color: 'from-violet-500 to-violet-600', icon: '🗄️' },
  { topic: 'Java & OOP', progress: 70, questionsAnswered: 44, color: 'from-emerald-500 to-emerald-600', icon: '☕' },
  { topic: 'System Design', progress: 30, questionsAnswered: 18, color: 'from-rose-500 to-rose-600', icon: '🏗️' },
  { topic: 'Aptitude & Reasoning', progress: 85, questionsAnswered: 56, color: 'from-teal-500 to-teal-600', icon: '🧠' },
];

const ACHIEVEMENTS = [
  { id: 1, title: 'First Question', description: 'Asked your first question', icon: '🎯', unlocked: true, date: 'Mar 5' },
  { id: 2, title: '7-Day Streak', description: 'Studied 7 days in a row', icon: '🔥', unlocked: true, date: 'Mar 12' },
  { id: 3, title: 'Century Club', description: 'Solved 100 questions', icon: '💯', unlocked: true, date: 'May 1' },
  { id: 4, title: 'Interview Ace', description: 'Scored 85%+ on a mock interview', icon: '🏆', unlocked: true, date: 'Jun 8' },
  { id: 5, title: 'Night Owl', description: 'Studied past midnight', icon: '🦉', unlocked: true, date: 'Jun 15' },
  { id: 6, title: 'Perfect Score', description: 'Score 100% on any interview', icon: '⭐', unlocked: false, date: null },
  { id: 7, title: 'Month Master', description: '30-day learning streak', icon: '📅', unlocked: false, date: null },
  { id: 8, title: 'All-Rounder', description: 'Complete all 7 topic tracks', icon: '🌟', unlocked: false, date: null },
];

// Generate calendar data for July 2026
const generateCalendar = () => {
  const activeDays = new Set([1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]);
  const days = [];
  const firstDay = new Date(2026, 6, 1).getDay(); // 0=Sun
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= 31; d++) {
    days.push({ day: d, active: activeDays.has(d), today: d === 25 });
  }
  return days;
};
const CALENDAR_DAYS = generateCalendar();

const RECENT_ACTIVITY = [
  { id: 1, type: 'question', text: 'Solved "Explain React Fiber reconciliation"', time: '10 min ago', icon: '💬' },
  { id: 2, type: 'interview', text: 'Completed React Frontend Developer mock interview', time: '2 hours ago', icon: '🎤' },
  { id: 3, type: 'achievement', text: 'Unlocked "Night Owl" achievement', time: 'Yesterday', icon: '🏅' },
  { id: 4, type: 'streak', text: 'Learning streak extended to 21 days!', time: 'Yesterday', icon: '🔥' },
  { id: 5, type: 'question', text: 'Solved "OS deadlock conditions and prevention"', time: '2 days ago', icon: '💬' },
  { id: 6, type: 'progress', text: 'Aptitude & Reasoning progress reached 85%', time: '3 days ago', icon: '📈' },
];

/* ═══════════════════════════════════════════════════════════════
   REUSABLE MINI-COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/** Section heading with optional right-side element */
const SectionHeading = ({ title, badge, right }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h2>
      {badge && <Badge variant="primary" size="sm">{badge}</Badge>}
    </div>
    {right}
  </div>
);

/** Small stat card used in the overview row */
const MiniStat = ({ icon, label, value, sub, color }) => (
  <Card className="p-4 border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 leading-tight">{value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
    {sub && <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2">{sub}</p>}
  </Card>
);

/** Horizontal bar chart row */
const BarRow = ({ label, value, max, color, suffix = '' }) => {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
        <span className="font-bold text-slate-900 dark:text-slate-100">{value}{suffix}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN PROGRESS PAGE
   ═══════════════════════════════════════════════════════════════ */

const Progress = () => {
  const [selectedTab, setSelectedTab] = useState('weekly');

  return (
    <div className="space-y-8">

      {/* ── PAGE HEADER ────────────────────────────────────── */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Learning Progress</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track your learning journey, streaks, and performance analytics.
        </p>
      </div>

      {/* ── OVERVIEW STATS ROW ─────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniStat icon="📝" label="Questions Solved" value={QUESTIONS_DATA.total} sub={`↑ ${WEEKLY_PROGRESS.questions.reduce((a, b) => a + b, 0)} this week`} color="bg-indigo-50 dark:bg-indigo-950/50" />
        <MiniStat icon="🎯" label="Accuracy Rate" value={`${QUESTIONS_DATA.accuracy}%`} sub="↑ 4.2% this month" color="bg-emerald-50 dark:bg-emerald-950/50" />
        <MiniStat icon="🔥" label="Current Streak" value={`${STREAK_DATA.currentStreak} Days`} sub="Personal best: 34 days" color="bg-amber-50 dark:bg-amber-950/50" />
        <MiniStat icon="🎤" label="Mock Interviews" value={INTERVIEW_HISTORY.length} sub="Avg score: 79.2%" color="bg-violet-50 dark:bg-violet-950/50" />
      </div>

      {/* ── WEEKLY / MONTHLY PROGRESS ──────────────────────── */}
      <Card className="border-slate-200/80 dark:border-slate-800">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 dark:text-slate-100">Activity Overview</h2>
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 gap-0.5">
            {['weekly', 'monthly'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${
                  selectedTab === tab
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          {selectedTab === 'weekly' ? (
            /* ── WEEKLY BAR CHART ──────────────────────── */
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Questions solved per day this week</p>
              <div className="flex items-end justify-between gap-2 h-40">
                {WEEKLY_PROGRESS.days.map((day, i) => {
                  const pct = (WEEKLY_PROGRESS.questions[i] / WEEKLY_PROGRESS.maxQuestions) * 100;
                  const isToday = i === new Date().getDay() - 1;
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-900 dark:text-slate-100">
                        {WEEKLY_PROGRESS.questions[i]}
                      </span>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-md rounded-b-sm overflow-hidden relative" style={{ height: '120px' }}>
                        <div
                          className={`absolute bottom-0 w-full rounded-t-md transition-all duration-700 ease-out ${
                            isToday
                              ? 'bg-gradient-to-t from-indigo-600 to-indigo-400'
                              : 'bg-gradient-to-t from-indigo-500/60 to-indigo-400/40'
                          }`}
                          style={{ height: `${pct}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-semibold ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {day}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <span>Total: <strong className="text-slate-900 dark:text-slate-100">{WEEKLY_PROGRESS.questions.reduce((a, b) => a + b, 0)} questions</strong></span>
                <span>Study time: <strong className="text-slate-900 dark:text-slate-100">{WEEKLY_PROGRESS.hours.reduce((a, b) => a + b, 0).toFixed(1)} hours</strong></span>
              </div>
            </div>
          ) : (
            /* ── MONTHLY TREND ─────────────────────────── */
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Questions & interviews over the last 6 months</p>
              <div className="space-y-4">
                {MONTHLY_PROGRESS.map((m, i) => {
                  const isLatest = i === MONTHLY_PROGRESS.length - 1;
                  return (
                    <div key={m.month} className="flex items-center gap-4">
                      <span className={`text-xs font-bold w-8 ${isLatest ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {m.month}
                      </span>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${isLatest ? 'from-indigo-500 to-indigo-600' : 'from-indigo-400/50 to-indigo-500/50'} transition-all duration-700`}
                            style={{ width: `${(m.questions / 260) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 w-10 text-right">{m.questions}</span>
                      </div>
                      <Badge variant={isLatest ? 'primary' : 'secondary'} size="sm" className="text-[10px] w-20 justify-center">
                        {m.interviews} interviews
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* ── LEARNING STREAK & STUDY CALENDAR ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Streak Stats */}
        <Card className="border-slate-200/80 dark:border-slate-800">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔥</span>
              <h2 className="font-bold text-slate-900 dark:text-slate-100">Learning Streak</h2>
            </div>
          </div>
          <div className="p-5">
            {/* Current streak highlight */}
            <div className="text-center mb-6 py-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl border border-amber-100 dark:border-amber-900/30">
              <p className="text-5xl font-extrabold text-amber-600 dark:text-amber-400">{STREAK_DATA.currentStreak}</p>
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mt-1">Day Streak 🔥</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {STREAK_DATA.longestStreak - STREAK_DATA.currentStreak} more days to beat your record!
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Longest', value: `${STREAK_DATA.longestStreak} days` },
                { label: 'Total Active', value: `${STREAK_DATA.totalDays} days` },
                { label: 'This Week', value: `${STREAK_DATA.thisWeek}/7 days` },
              ].map((s) => (
                <div key={s.label} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{s.value}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Study Calendar */}
        <Card className="border-slate-200/80 dark:border-slate-800">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">📅</span>
              <h2 className="font-bold text-slate-900 dark:text-slate-100">Study Calendar</h2>
            </div>
            <Badge variant="secondary" size="sm">July 2026</Badge>
          </div>
          <div className="p-5">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className="text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 py-1">
                  {d}
                </div>
              ))}
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {CALENDAR_DAYS.map((cell, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-semibold transition-all ${
                    cell === null
                      ? ''
                      : cell.today
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30 ring-2 ring-indigo-400/30'
                        : cell.active
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                          : 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {cell?.day}
                </div>
              ))}
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-200 dark:bg-emerald-800" /> Active</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-indigo-500" /> Today</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-slate-100 dark:bg-slate-800" /> Missed</span>
              <span className="ml-auto font-semibold text-emerald-600 dark:text-emerald-400">23/25 active days</span>
            </div>
          </div>
        </Card>
      </div>

      {/* ── QUESTIONS SOLVED BREAKDOWN ──────────────────────── */}
      <Card className="border-slate-200/80 dark:border-slate-800">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h2 className="font-bold text-slate-900 dark:text-slate-100">Questions Breakdown</h2>
          </div>
          <Badge variant="primary" size="sm">{QUESTIONS_DATA.total} total</Badge>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Accuracy ring */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="56" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="10" fill="none" />
                  <circle
                    cx="70" cy="70" r="56"
                    className="stroke-emerald-500 dark:stroke-emerald-400"
                    strokeWidth="10" fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - QUESTIONS_DATA.accuracy / 100)}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">{QUESTIONS_DATA.accuracy}%</span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Accuracy</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> {QUESTIONS_DATA.correct} correct
                </span>
                <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> {QUESTIONS_DATA.incorrect} incorrect
                </span>
              </div>
            </div>

            {/* Right: By difficulty */}
            <div className="space-y-4">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">By Difficulty</p>
              {QUESTIONS_DATA.byDifficulty.map((d) => (
                <div key={d.level} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{d.level}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{d.solved}/{d.total} solved</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${d.color} transition-all duration-700`}
                      style={{ width: `${(d.solved / d.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* ── TOPIC PROGRESS ─────────────────────────────────── */}
      <Card className="border-slate-200/80 dark:border-slate-800">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <h2 className="font-bold text-slate-900 dark:text-slate-100">Topic Progress</h2>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">{TOPIC_PROGRESS.length} tracks</span>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOPIC_PROGRESS.map((t) => (
            <div key={t.topic} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
              <span className="text-2xl shrink-0">{t.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{t.topic}</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 ml-2 shrink-0">{t.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${t.color} transition-all duration-700`}
                    style={{ width: `${t.progress}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{t.questionsAnswered} questions answered</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── INTERVIEW HISTORY & ACHIEVEMENTS ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Interview History (wider) */}
        <Card className="lg:col-span-3 border-slate-200/80 dark:border-slate-800">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎤</span>
              <h2 className="font-bold text-slate-900 dark:text-slate-100">Interview History</h2>
            </div>
            <Link to="/results">
              <Button variant="ghost" size="sm" className="text-xs">View All →</Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-center">Score</th>
                  <th className="px-5 py-3 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {INTERVIEW_HISTORY.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-slate-200">{row.role}</td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs">{row.date}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`font-bold ${row.score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : row.score >= 70 ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {row.score}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Badge
                        variant={row.score >= 80 ? 'success' : row.score >= 70 ? 'primary' : 'warning'}
                        size="sm"
                        className="text-[10px] font-bold"
                      >
                        {row.grade}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Achievements (narrower) */}
        <Card className="lg:col-span-2 border-slate-200/80 dark:border-slate-800">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <h2 className="font-bold text-slate-900 dark:text-slate-100">Achievements</h2>
            </div>
            <Badge variant="success" size="sm">{ACHIEVEMENTS.filter(a => a.unlocked).length}/{ACHIEVEMENTS.length}</Badge>
          </div>
          <div className="p-5 grid grid-cols-2 gap-3">
            {ACHIEVEMENTS.map((a) => (
              <div
                key={a.id}
                className={`p-3 rounded-xl text-center transition-all border ${
                  a.unlocked
                    ? 'bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700 hover:shadow-md'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 opacity-50 grayscale'
                }`}
              >
                <span className="text-2xl block">{a.icon}</span>
                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1.5 leading-tight">{a.title}</p>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">{a.description}</p>
                {a.unlocked && a.date && (
                  <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">{a.date}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── RECENT ACTIVITY ────────────────────────────────── */}
      <Card className="border-slate-200/80 dark:border-slate-800">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <h2 className="font-bold text-slate-900 dark:text-slate-100">Recent Activity</h2>
          </div>
          <Badge variant="secondary" size="sm">{RECENT_ACTIVITY.length} items</Badge>
        </div>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {RECENT_ACTIVITY.map((item) => (
            <li key={item.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <span className="text-lg shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800 dark:text-slate-200 truncate">{item.text}</p>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 whitespace-nowrap">{item.time}</span>
            </li>
          ))}
        </ul>
      </Card>

    </div>
  );
};

export default Progress;
