import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getStats, getSessions } from '../../services/progress.service';
import { Card, Badge, Avatar, Button } from '../../components';

const DAILY_TIPS = [
  'Consistency beats intensity — study 30 minutes every day.',
  'Explain concepts out loud to solidify understanding.',
  'Review yesterday\'s notes before starting something new.',
  'Break big problems into smaller sub-problems.',
];

const DAILY_TIP = DAILY_TIPS[new Date().getDay() % DAILY_TIPS.length];

/* Presentation only — values come from the API in buildStats() below. */
const STAT_META = [
  {
    id: 'questions',
    title: 'Questions Solved',
    icon: (
      <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 18h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
  },
  {
    id: 'interviews',
    title: 'Sessions Completed',
    icon: (
      <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    color: 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400',
  },
  {
    id: 'accuracy',
    title: 'Average Score',
    icon: (
      <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'streak',
    title: 'Learning Streak',
    icon: (
      <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.468 5.99 5.99 0 00-1.925 3.547 5.975 5.975 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
      </svg>
    ),
    color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
  },
];

const QUICK_ACTIONS = [
  {
    label: 'Ask AI',
    emoji: '🤖',
    description: 'Get instant step-by-step doubt resolution',
    href: '/question',
    color: 'bg-indigo-600 hover:bg-indigo-700',
  },
  {
    label: 'Start Mock Interview',
    emoji: '🎤',
    description: 'Practice with AI-scored mock sessions',
    href: '/interview',
    color: 'bg-violet-600 hover:bg-violet-700',
  },
  {
    label: 'View Progress',
    emoji: '📈',
    description: 'See your topic mastery and analytics',
    href: '/progress',
    color: 'bg-emerald-600 hover:bg-emerald-700',
  },
  {
    label: 'Previous Results',
    emoji: '📄',
    description: 'Review all past interview scores',
    href: '/results',
    color: 'bg-sky-600 hover:bg-sky-700',
  },
];

/* Starter suggestions, shown only until the user has session history of
   their own to recommend from. */
const STARTER_TOPICS = [
  { topic: 'React', emoji: '⚛️', difficulty: 'Intermediate', badgeVariant: 'primary' },
  { topic: 'Data Structures & Algorithms', emoji: '🌳', difficulty: 'Advanced', badgeVariant: 'danger' },
  { topic: 'Operating Systems', emoji: '💻', difficulty: 'Intermediate', badgeVariant: 'secondary' },
  { topic: 'DBMS', emoji: '🗄️', difficulty: 'Beginner', badgeVariant: 'success' },
];

const BAR_COLORS = ['bg-indigo-500', 'bg-violet-500', 'bg-amber-500', 'bg-emerald-500', 'bg-sky-500'];

/* ─── Helpers ────────────────────────────────────────────────── */

/** Backend stores overall_score on a 0–10 scale; the UI shows 0–100. */
const toPercent = (score) => Math.round((Number(score) || 0) * 10);

/** "2 hours ago" style relative time from an ISO date. */
const timeAgo = (iso) => {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
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

/** Letter grade from a 0–100 score. */
const toGrade = (pct) => {
  if (pct >= 90) return 'A';
  if (pct >= 85) return 'A−';
  if (pct >= 80) return 'B+';
  if (pct >= 70) return 'B';
  if (pct >= 65) return 'C+';
  if (pct >= 55) return 'C';
  return 'D';
};

/** Fill the four stat cards from the /progress/stats payload. */
const buildStats = (stats) => {
  const avgPct = toPercent(stats?.average_score);
  const values = {
    questions: {
      value: String(stats?.total_questions ?? 0),
      trend: `${stats?.total_study_minutes ?? 0} min studied`,
      positive: (stats?.total_questions ?? 0) > 0,
    },
    interviews: {
      value: String(stats?.total_sessions ?? 0),
      trend: stats?.topics_studied?.length
        ? `${stats.topics_studied.length} topic${stats.topics_studied.length === 1 ? '' : 's'}`
        : 'No sessions yet',
      positive: (stats?.total_sessions ?? 0) > 0,
    },
    accuracy: {
      value: `${avgPct}%`,
      trend: avgPct >= 70 ? 'On track' : avgPct > 0 ? 'Keep practising' : 'No scores yet',
      positive: avgPct >= 70,
    },
    streak: {
      value: `${stats?.streak ?? 0} Day${(stats?.streak ?? 0) === 1 ? '' : 's'}`,
      trend: (stats?.streak ?? 0) > 0 ? 'Keep it going!' : 'Start today',
      positive: (stats?.streak ?? 0) > 0,
    },
  };
  return STAT_META.map((meta) => ({ ...meta, ...values[meta.id] }));
};

/** Average score per topic, best first — drives the Learning Progress bars. */
const buildTopicProgress = (sessions) => {
  const byTopic = new Map();
  sessions.forEach((s) => {
    const key = s.topic || 'General';
    const entry = byTopic.get(key) || { total: 0, count: 0 };
    entry.total += toPercent(s.overall_score);
    entry.count += 1;
    byTopic.set(key, entry);
  });
  return [...byTopic.entries()]
    .map(([label, { total, count }], i) => ({
      label,
      pct: Math.round(total / count),
      color: BAR_COLORS[i % BAR_COLORS.length],
    }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);
};
const scoreColor = (score) => {
  if (score >= 90) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 75) return 'text-indigo-600 dark:text-indigo-400';
  if (score >= 60) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
};

const gradeVariant = (grade) => {
  if (grade.startsWith('A')) return 'success';
  if (grade.startsWith('B')) return 'primary';
  if (grade.startsWith('C')) return 'secondary';
  return 'danger';
};

/* ─── Dashboard Component ────────────────────────────────────── */
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
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
    };
    load();
  }, []);

  const statCards = buildStats(stats);
  const topicProgress = buildTopicProgress(sessions);
  const recentSessions = sessions.slice(0, 5);
  const hasHistory = sessions.length > 0;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';

  return (
    <div className="space-y-8">

      {/* ── 1. HERO / WELCOME SECTION ─────────────────────── */}
      <div className="relative rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-violet-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <p className="text-indigo-200 text-sm font-medium tracking-wide uppercase">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {firstName}! 👋
            </h1>
            <p className="text-indigo-100 text-sm sm:text-base">
              {stats?.streak > 0 ? (
                <>
                  Continue your learning journey — you're on a{' '}
                  <span className="font-bold text-amber-300">
                    {stats.streak}-day streak!
                  </span>
                </>
              ) : (
                'Continue your learning journey — complete a session today to start a streak.'
              )}
            </p>
          </div>

          <Avatar name={firstName} size="xl" status="online" className="shrink-0" />
        </div>

        {/* Daily Tip */}
        <div className="relative z-10 mt-5 flex items-start gap-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-4">
          <span className="text-xl shrink-0">💡</span>
          <div>
            <p className="text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-0.5">Daily Learning Tip</p>
            <p className="text-sm text-white/90">{DAILY_TIP}</p>
          </div>
        </div>
      </div>

      {/* ── 2. STATS CARDS ────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Your Statistics</h2>

        {loadError && (
          <div className="mb-4 flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-200 text-xs">
            <span className="shrink-0">⚠</span>
            <span>{loadError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card
              key={stat.id}
              className="p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border-slate-200/80 dark:border-slate-800"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${stat.color}`}>
                  {stat.icon}
                </div>
                <Badge
                  variant={stat.positive ? 'success' : 'danger'}
                  size="sm"
                  className="text-xs"
                >
                  {stat.positive ? '↑' : '↓'} {stat.trend}
                </Badge>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 mb-1">
                {loading ? '—' : stat.value}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.title}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── 3. QUICK ACTIONS ──────────────────────────────── */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              to={action.href}
              className={`group relative flex flex-col items-start gap-3 p-5 rounded-2xl text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${action.color}`}
            >
              <span className="text-3xl">{action.emoji}</span>
              <div>
                <div className="font-bold text-base">{action.label}</div>
                <div className="text-xs text-white/80 mt-0.5">{action.description}</div>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── 4. RECENT ACTIVITY + RECOMMENDED TOPICS (side-by-side) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-slate-200/80 dark:border-slate-800">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Recent Activity</h2>
            <Badge variant="secondary" size="sm">{recentSessions.length} items</Badge>
          </div>
          <ul className="divide-y divide-slate-50 dark:divide-slate-800">
            {recentSessions.map((item) => (
              <li key={item.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                <span className="text-xl mt-0.5 shrink-0">🎤</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate">
                    Completed {item.topic || 'practice'} session — scored {toPercent(item.overall_score)}%
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{timeAgo(item.created_at)}</p>
                </div>
              </li>
            ))}
            {!loading && recentSessions.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-slate-400">
                No activity yet.{' '}
                <Link to="/interview" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                  Start your first interview →
                </Link>
              </li>
            )}
          </ul>
        </Card>

        {/* Recommended Topics */}
        <Card className="border-slate-200/80 dark:border-slate-800">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {hasHistory ? 'Topics to Revisit' : 'Suggested Topics'}
            </h2>
            <Badge variant="primary" size="sm">{hasHistory ? 'Your weakest' : 'Starter set'}</Badge>
          </div>
          <ul className="divide-y divide-slate-50 dark:divide-slate-800">
            {(hasHistory
              ? [...topicProgress]
                  .sort((a, b) => a.pct - b.pct)
                  .slice(0, 4)
                  .map((t) => ({
                    topic: t.label,
                    emoji: '📌',
                    difficulty: `${t.pct}% average`,
                    badgeVariant: t.pct >= 70 ? 'success' : t.pct >= 50 ? 'primary' : 'danger',
                  }))
              : STARTER_TOPICS
            ).map((t) => (
              <li
                key={t.topic}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                <span className="text-2xl shrink-0">{t.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{t.topic}</p>
                  <Badge variant={t.badgeVariant} size="sm" className="mt-0.5">{t.difficulty}</Badge>
                </div>
                <Link to="/question">
                  <Button variant="outline" size="sm" className="shrink-0 text-xs">
                    Start
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* ── 5. LEARNING PROGRESS + INTERVIEW SCORES ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Progress Bars */}
        <Card className="border-slate-200/80 dark:border-slate-800">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Learning Progress</h2>
            <Link
              to="/progress"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="p-5 space-y-5">
            {!loading && topicProgress.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-6">
                Complete a session to see your topic mastery here.
              </p>
            )}
            {topicProgress.map((tp) => (
              <div key={tp.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{tp.label}</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{tp.pct}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${tp.color} rounded-full transition-all duration-700`}
                    style={{ width: `${tp.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Interview Scores */}
        <Card className="border-slate-200/80 dark:border-slate-800">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Recent Interview Scores</h2>
            <Link
              to="/results"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Interview</th>
                  <th className="text-center px-3 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Score</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {recentSessions.map((row) => {
                  const pct = toPercent(row.overall_score);
                  const grade = toGrade(pct);
                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                          {row.topic || 'Practice session'}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className={`font-bold ${scoreColor(pct)}`}>{pct}</span>
                          <Badge variant={gradeVariant(grade)} size="sm">{grade}</Badge>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                        {fmtDate(row.created_at)}
                      </td>
                    </tr>
                  );
                })}
                {!loading && recentSessions.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center text-sm text-slate-400">
                      No interview scores yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

    </div>
  );
};

export default Dashboard;
