import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge, Avatar, Button } from '../../components';

/* ─── Mock Data ──────────────────────────────────────────────── */
const STUDENT_NAME = 'Alex';

const DAILY_TIPS = [
  'Consistency beats intensity — study 30 minutes every day.',
  'Explain concepts out loud to solidify understanding.',
  'Review yesterday\'s notes before starting something new.',
  'Break big problems into smaller sub-problems.',
];

const DAILY_TIP = DAILY_TIPS[new Date().getDay() % DAILY_TIPS.length];

const STATS = [
  {
    id: 'questions',
    title: 'Questions Solved',
    value: '248',
    trend: '+12 this week',
    positive: true,
    icon: (
      <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 18h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
  },
  {
    id: 'interviews',
    title: 'Mock Interviews',
    value: '34',
    trend: '+3 this week',
    positive: true,
    icon: (
      <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    color: 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400',
  },
  {
    id: 'accuracy',
    title: 'Accuracy',
    value: '84%',
    trend: '+4% this month',
    positive: true,
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
    value: '21 Days',
    trend: 'Personal best!',
    positive: true,
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

const RECENT_ACTIVITY = [
  { id: 1, action: 'Asked: "How does React reconciliation work?"', type: 'question', time: '10 min ago', icon: '🤖' },
  { id: 2, action: 'Completed Java Backend Mock Interview', type: 'interview', time: '2 hours ago', icon: '🎤' },
  { id: 3, action: 'Accuracy improved to 84% in DSA', type: 'progress', time: 'Yesterday', icon: '📈' },
  { id: 4, action: 'Asked: "Explain OS deadlock conditions"', type: 'question', time: 'Yesterday', icon: '🤖' },
  { id: 5, action: 'Completed React Fundamentals Interview', type: 'interview', time: '2 days ago', icon: '🎤' },
];

const RECOMMENDED_TOPICS = [
  { topic: 'React', emoji: '⚛️', difficulty: 'Intermediate', badgeVariant: 'primary' },
  { topic: 'Data Structures & Algorithms', emoji: '🌳', difficulty: 'Advanced', badgeVariant: 'danger' },
  { topic: 'Operating Systems', emoji: '💻', difficulty: 'Intermediate', badgeVariant: 'secondary' },
  { topic: 'DBMS', emoji: '🗄️', difficulty: 'Beginner', badgeVariant: 'success' },
];

const PROGRESS_TOPICS = [
  { label: 'React', pct: 78, color: 'bg-indigo-500' },
  { label: 'Java', pct: 62, color: 'bg-violet-500' },
  { label: 'Data Structures & Algorithms', pct: 45, color: 'bg-amber-500' },
  { label: 'Aptitude', pct: 85, color: 'bg-emerald-500' },
];

const INTERVIEW_SCORES = [
  { interview: 'React Advanced Concepts', score: 92, grade: 'A', date: 'Jul 24, 2026' },
  { interview: 'Java Spring Boot Backend', score: 79, grade: 'B+', date: 'Jul 22, 2026' },
  { interview: 'Operating Systems Core', score: 85, grade: 'A−', date: 'Jul 20, 2026' },
  { interview: 'SQL & Database Design', score: 68, grade: 'C+', date: 'Jul 18, 2026' },
  { interview: 'DSA — Arrays & Sorting', score: 73, grade: 'B', date: 'Jul 15, 2026' },
];

/* ─── Helpers ────────────────────────────────────────────────── */
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

  useEffect(() => {
    const load = async () => {
      try {
        const [s, sess] = await Promise.all([getStats(), getSessions()]);
        setStats(s);
        setSessions(Array.isArray(sess) ? sess.slice(0, 4) : []);
      } catch {
        // If Supabase not configured yet, show empty state
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
              Welcome back, {STUDENT_NAME}! 👋
            </h1>
            <p className="text-indigo-100 text-sm sm:text-base">
              Continue your learning journey — you're on a <span className="font-bold text-amber-300">21-day streak!</span>
            </p>
          </div>

          <Avatar name={STUDENT_NAME} size="xl" status="online" className="shrink-0" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {STATS.map((stat) => (
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
                {stat.value}
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
            <Badge variant="secondary" size="sm">{RECENT_ACTIVITY.length} items</Badge>
          </div>
          <ul className="divide-y divide-slate-50 dark:divide-slate-800">
            {RECENT_ACTIVITY.map((item) => (
              <li key={item.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                <span className="text-xl mt-0.5 shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate">{item.action}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Recommended Topics */}
        <Card className="border-slate-200/80 dark:border-slate-800">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Recommended Topics</h2>
            <Badge variant="primary" size="sm">Personalised</Badge>
          </div>
          <ul className="divide-y divide-slate-50 dark:divide-slate-800">
            {RECOMMENDED_TOPICS.map((t) => (
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
            {PROGRESS_TOPICS.map((tp) => (
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
                {INTERVIEW_SCORES.map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[180px]">{row.interview}</div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className={`font-bold ${scoreColor(row.score)}`}>{row.score}</span>
                        <Badge variant={gradeVariant(row.grade)} size="sm">{row.grade}</Badge>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

    </div>
  );
};

export default Dashboard;
