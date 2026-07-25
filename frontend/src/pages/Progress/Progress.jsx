import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/layout/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { getStats, getSessions } from '../../services/progress.service';
import { getMyRank } from '../../services/leaderboard.service';

/* ═══════════════════════════════════════════════════════════════
   DERIVATIONS — everything below is computed from the user's real
   session rows (/progress) and aggregates (/progress/stats).
   ═══════════════════════════════════════════════════════════════ */

/** Backend stores scores on a 0–10 scale; the UI shows 0–100. */
const toPercent = (score) => Math.round((Number(score) || 0) * 10);

const GRADIENTS = [
  'from-indigo-500 to-indigo-600',
  'from-amber-500 to-amber-600',
  'from-cyan-500 to-cyan-600',
  'from-violet-500 to-violet-600',
  'from-emerald-500 to-emerald-600',
  'from-rose-500 to-rose-600',
  'from-teal-500 to-teal-600',
];

/** Badge catalogue — ids must match BADGE_RULES in backend xp.service.js */
const BADGE_CATALOG = [
  { id: 'first_session', title: 'First Steps', description: 'Completed your first session', icon: '🎯' },
  { id: 'streak_3', title: 'On a Roll', description: '3-day learning streak', icon: '🔥' },
  { id: 'streak_7', title: 'Week Warrior', description: '7-day learning streak', icon: '📅' },
  { id: 'perfect_score', title: 'Perfect Score', description: 'Scored 10/10 on a question', icon: '⭐' },
  { id: 'high_achiever', title: 'High Achiever', description: 'Averaged 80%+ overall', icon: '🏆' },
  { id: 'dedicated', title: 'Dedicated Learner', description: 'Completed 10 sessions', icon: '💯' },
  { id: 'expert', title: 'Expert', description: 'Completed 50 sessions', icon: '🌟' },
];

/** Midnight timestamp for a date — used for day-level grouping. */
const dayKey = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
};

/** Sessions per weekday for the last 7 days (oldest → today). */
const buildWeekly = (sessions) => {
  const out = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = dayKey(d);
    const onDay = sessions.filter((s) => dayKey(s.created_at) === key);
    out.push({
      label: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3),
      questions: onDay.reduce((sum, s) => sum + (s.questions_count || 0), 0),
      minutes: onDay.reduce((sum, s) => sum + (s.duration_minutes || 0), 0),
      isToday: i === 0,
    });
  }
  return out;
};

/** Questions & sessions per month for the last 6 months. */
const buildMonthly = (sessions) => {
  const out = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    const inMonth = sessions.filter((s) => {
      const c = new Date(s.created_at);
      return c.getFullYear() === d.getFullYear() && c.getMonth() === d.getMonth();
    });
    out.push({
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      questions: inMonth.reduce((sum, s) => sum + (s.questions_count || 0), 0),
      interviews: inMonth.length,
      isLatest: i === 0,
    });
  }
  return out;
};

/** Streak facts derived from the distinct days the user was active. */
const buildStreakData = (sessions, currentStreak) => {
  const days = [...new Set(sessions.map((s) => dayKey(s.created_at)))].sort((a, b) => a - b);

  let longest = 0;
  let run = 0;
  for (let i = 0; i < days.length; i++) {
    run = i > 0 && days[i] - days[i - 1] === 86400000 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  const weekAgo = dayKey(new Date()) - 6 * 86400000;
  return {
    currentStreak: currentStreak ?? 0,
    longestStreak: Math.max(longest, currentStreak ?? 0),
    totalDays: days.length,
    thisWeek: days.filter((d) => d >= weekAgo).length,
  };
};

/** Per-question score bands, read from each session's stored session_data. */
const buildAnswerBreakdown = (sessions) => {
  const scores = sessions
    .flatMap((s) => (Array.isArray(s.session_data) ? s.session_data : []))
    .map((q) => Number(q?.score))
    .filter((n) => Number.isFinite(n));

  const strong = scores.filter((s) => s >= 8).length;
  const fair = scores.filter((s) => s >= 5 && s < 8).length;
  const weak = scores.filter((s) => s < 5).length;
  const total = scores.length;

  return {
    total,
    strong,
    fair,
    weak,
    accuracy: total ? Math.round((scores.reduce((a, b) => a + b, 0) / total) * 10) : 0,
    bands: [
      { level: 'Strong (8–10)', solved: strong, total, color: 'from-emerald-500 to-emerald-600' },
      { level: 'Fair (5–7)', solved: fair, total, color: 'from-amber-500 to-amber-600' },
      { level: 'Needs work (0–4)', solved: weak, total, color: 'from-rose-500 to-rose-600' },
    ],
  };
};

/** Average score and volume per topic. */
const buildTopicProgress = (sessions) => {
  const byTopic = new Map();
  sessions.forEach((s) => {
    const key = s.topic || 'General';
    const e = byTopic.get(key) || { total: 0, count: 0, questions: 0 };
    e.total += toPercent(s.overall_score);
    e.count += 1;
    e.questions += s.questions_count || 0;
    byTopic.set(key, e);
  });
  return [...byTopic.entries()]
    .map(([topic, e], i) => ({
      topic,
      progress: Math.round(e.total / e.count),
      questionsAnswered: e.questions,
      color: GRADIENTS[i % GRADIENTS.length],
      icon: '📘',
    }))
    .sort((a, b) => b.progress - a.progress);
};

/** Calendar cells for the current month, marking days with activity. */
const buildCalendar = (sessions) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const active = new Set(
    sessions
      .filter((s) => {
        const c = new Date(s.created_at);
        return c.getFullYear() === year && c.getMonth() === month;
      })
      .map((s) => new Date(s.created_at).getDate())
  );

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const cells = Array.from({ length: firstDay }, () => null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, active: active.has(d), today: d === now.getDate() });
  }
  return { cells, activeCount: active.size, daysSoFar: now.getDate(), label: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) };
};

const timeAgo = (iso) => {
  if (!iso) return '';
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const toGrade = (pct) => {
  if (pct >= 90) return 'A';
  if (pct >= 85) return 'A-';
  if (pct >= 80) return 'B+';
  if (pct >= 70) return 'B';
  if (pct >= 65) return 'C+';
  if (pct >= 55) return 'C';
  return 'D';
};

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
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [rank, setRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, sess] = await Promise.all([getStats(), getSessions()]);
        setStats(s);
        setSessions(Array.isArray(sess) ? sess : []);
      } catch (err) {
        setLoadError(err?.message || 'Could not load your progress data.');
      } finally {
        setLoading(false);
      }
      // Rank/badges are a bonus — never let them block the page.
      try {
        setRank(await getMyRank({ skipAuthRedirect: true }));
      } catch {
        /* leaderboard row may not exist yet */
      }
    };
    load();
  }, []);

  const weekly = buildWeekly(sessions);
  const monthly = buildMonthly(sessions);
  const streakData = buildStreakData(sessions, stats?.streak);
  const answers = buildAnswerBreakdown(sessions);
  const topicProgress = buildTopicProgress(sessions);
  const calendar = buildCalendar(sessions);

  const maxWeekly = Math.max(1, ...weekly.map((d) => d.questions));
  const maxMonthly = Math.max(1, ...monthly.map((m) => m.questions));
  const weekQuestions = weekly.reduce((a, d) => a + d.questions, 0);
  const weekHours = weekly.reduce((a, d) => a + d.minutes, 0) / 60;

  const earnedBadges = new Set(rank?.badges || []);
  const avgPct = toPercent(stats?.average_score);
  const isEmpty = !loading && sessions.length === 0;

  return (
    <div className="space-y-8">

      {/* ── PAGE HEADER ────────────────────────────────────── */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Learning Progress</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your learning journey, streaks, and performance analytics.
          </p>
        </div>
        {rank?.level != null && (
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="sm">Level {rank.level}</Badge>
            <Badge variant="secondary" size="sm">{rank.xp ?? 0} XP</Badge>
            {rank.rank && <Badge variant="success" size="sm">Rank #{rank.rank}</Badge>}
          </div>
        )}
      </div>

      {loadError && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-200 text-xs">
          <span className="shrink-0">⚠</span>
          <span>{loadError}</span>
        </div>
      )}

      {isEmpty && (
        <Card className="p-10 text-center border-slate-200/80 dark:border-slate-800">
          <div className="text-4xl mb-3">📊</div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">No progress data yet</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">
            Complete a practice session or mock interview and your stats will appear here.
          </p>
          <Link to="/interview">
            <Button variant="primary" size="md">Start an Interview</Button>
          </Link>
        </Card>
      )}

      {/* ── OVERVIEW STATS ROW ─────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniStat
          icon="📝"
          label="Questions Answered"
          value={loading ? '—' : stats?.total_questions ?? 0}
          sub={`${weekQuestions} this week`}
          color="bg-indigo-50 dark:bg-indigo-950/50"
        />
        <MiniStat
          icon="🎯"
          label="Average Score"
          value={loading ? '—' : `${avgPct}%`}
          sub={avgPct >= 70 ? 'On track' : avgPct > 0 ? 'Keep practising' : 'No scores yet'}
          color="bg-emerald-50 dark:bg-emerald-950/50"
        />
        <MiniStat
          icon="🔥"
          label="Current Streak"
          value={loading ? '—' : `${streakData.currentStreak} Days`}
          sub={`Best: ${streakData.longestStreak} days`}
          color="bg-amber-50 dark:bg-amber-950/50"
        />
        <MiniStat
          icon="🎤"
          label="Sessions"
          value={loading ? '—' : stats?.total_sessions ?? 0}
          sub={`${stats?.total_study_minutes ?? 0} min studied`}
          color="bg-violet-50 dark:bg-violet-950/50"
        />
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
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Questions answered per day this week</p>
              <div className="flex items-end justify-between gap-2 h-40">
                {weekly.map((day, i) => {
                  const pct = (day.questions / maxWeekly) * 100;
                  const isToday = day.isToday;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-900 dark:text-slate-100">
                        {day.questions}
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
                        {day.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <span>Total: <strong className="text-slate-900 dark:text-slate-100">{weekQuestions} questions</strong></span>
                <span>Study time: <strong className="text-slate-900 dark:text-slate-100">{weekHours.toFixed(1)} hours</strong></span>
              </div>
            </div>
          ) : (
            /* ── MONTHLY TREND ─────────────────────────── */
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Questions &amp; sessions over the last 6 months</p>
              <div className="space-y-4">
                {monthly.map((m) => {
                  const isLatest = m.isLatest;
                  return (
                    <div key={m.month} className="flex items-center gap-4">
                      <span className={`text-xs font-bold w-8 ${isLatest ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {m.month}
                      </span>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${isLatest ? 'from-indigo-500 to-indigo-600' : 'from-indigo-400/50 to-indigo-500/50'} transition-all duration-700`}
                            style={{ width: `${(m.questions / maxMonthly) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 w-10 text-right">{m.questions}</span>
                      </div>
                      <Badge variant={isLatest ? 'primary' : 'secondary'} size="sm" className="text-[10px] w-20 justify-center">
                        {m.interviews} session{m.interviews === 1 ? '' : 's'}
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
              <p className="text-5xl font-extrabold text-amber-600 dark:text-amber-400">{streakData.currentStreak}</p>
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mt-1">Day Streak 🔥</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {streakData.currentStreak === 0
                  ? 'Complete a session today to start a streak.'
                  : streakData.longestStreak > streakData.currentStreak
                    ? `${streakData.longestStreak - streakData.currentStreak} more day(s) to beat your record!`
                    : "That's your personal best — keep it going!"}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Longest', value: `${streakData.longestStreak} days` },
                { label: 'Total Active', value: `${streakData.totalDays} days` },
                { label: 'This Week', value: `${streakData.thisWeek}/7 days` },
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
            <Badge variant="secondary" size="sm">{calendar.label}</Badge>
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
              {calendar.cells.map((cell, i) => (
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
              <span className="ml-auto font-semibold text-emerald-600 dark:text-emerald-400">
                {calendar.activeCount}/{calendar.daysSoFar} active days
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* ── QUESTIONS SOLVED BREAKDOWN ──────────────────────── */}
      <Card className="border-slate-200/80 dark:border-slate-800">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h2 className="font-bold text-slate-900 dark:text-slate-100">Answer Breakdown</h2>
          </div>
          <Badge variant="primary" size="sm">{answers.total} scored</Badge>
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
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - answers.accuracy / 100)}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">{answers.accuracy}%</span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Avg score</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> {answers.strong} strong
                </span>
                <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> {answers.weak} need work
                </span>
              </div>
            </div>

            {/* Right: By difficulty */}
            <div className="space-y-4">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">By Score Band</p>
              {answers.total === 0 && (
                <p className="text-sm text-slate-400">No scored answers yet.</p>
              )}
              {answers.total > 0 && answers.bands.map((d) => (
                <div key={d.level} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{d.level}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{d.solved}/{d.total} answers</span>
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
          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">{topicProgress.length} tracks</span>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {!loading && topicProgress.length === 0 && (
            <p className="text-sm text-slate-400 col-span-full text-center py-4">
              No topics yet — finish a session to build your track record.
            </p>
          )}
          {topicProgress.map((t) => (
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
                {sessions.slice(0, 8).map((row) => {
                  const score = toPercent(row.overall_score);
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                        {row.topic || 'Practice session'}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs">{fmtDate(row.created_at)}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`font-bold ${score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : score >= 70 ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400'}`}>
                          {score}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <Badge
                          variant={score >= 80 ? 'success' : score >= 70 ? 'primary' : 'warning'}
                          size="sm"
                          className="text-[10px] font-bold"
                        >
                          {toGrade(score)}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
                {!loading && sessions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-400">
                      No sessions recorded yet.
                    </td>
                  </tr>
                )}
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
            <Badge variant="success" size="sm">{earnedBadges.size}/{BADGE_CATALOG.length}</Badge>
          </div>
          <div className="p-5 grid grid-cols-2 gap-3">
            {BADGE_CATALOG.map((a) => {
              const unlocked = earnedBadges.has(a.id);
              return (
                <div
                  key={a.id}
                  className={`p-3 rounded-xl text-center transition-all border ${
                    unlocked
                      ? 'bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700 hover:shadow-md'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 opacity-50 grayscale'
                  }`}
                >
                  <span className="text-2xl block">{a.icon}</span>
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1.5 leading-tight">{a.title}</p>
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">{a.description}</p>
                  {unlocked && (
                    <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Unlocked</p>
                  )}
                </div>
              );
            })}
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
          <Badge variant="secondary" size="sm">{Math.min(sessions.length, 6)} items</Badge>
        </div>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {sessions.slice(0, 6).map((item) => (
            <li key={item.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <span className="text-lg shrink-0">🎤</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800 dark:text-slate-200 truncate">
                  Completed {item.topic || 'practice'} session — scored {toPercent(item.overall_score)}%
                  {item.questions_count ? ` across ${item.questions_count} questions` : ''}
                </p>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 whitespace-nowrap">
                {timeAgo(item.created_at)}
              </span>
            </li>
          ))}
          {!loading && sessions.length === 0 && (
            <li className="px-5 py-8 text-center text-sm text-slate-400">No activity yet.</li>
          )}
        </ul>
      </Card>

    </div>
  );
};

export default Progress;
