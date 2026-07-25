/**
 * Adapter: Backend progress stats + user → UI DashboardData type.
 */
import {
  DashboardData, CalendarDay, QuickAction, MonthlyStats,
  StudySession, PerformanceTimelineEntry, Goal
} from '../../types';
import { BackendProgressStats, BackendUserPayload } from './progressAdapter';

// ── Static quick actions (UI config, not backend data) ──
const QUICK_ACTIONS: QuickAction[] = [
  { id: 'dashboard', label: 'Dashboard overview', description: 'Review your current learning pulse', iconName: 'FaBullseye', href: '/dashboard', color: 'violet' },
  { id: 'analytics', label: 'Review weak areas', description: 'Track trends and focus topics', iconName: 'FaExclamationTriangle', href: '/analytics', color: 'cyan' },
  { id: 'leaderboard', label: 'Leaderboard', description: 'See how you rank globally', iconName: 'FaTrophy', href: '/leaderboard', color: 'amber' },
  { id: 'profile', label: 'Learner profile', description: 'View achievements and progress', iconName: 'FaBullseye', href: '/profile', color: 'emerald' },
];

/** Normalize backend 0-10 score to 0-100. */
const toPercent = (score: number): number => Math.round(Math.min(score * 10, 100));

export const adaptDashboardData = (
  stats: BackendProgressStats,
  _user?: BackendUserPayload
): DashboardData => {
  // ── Calendar: deterministic from recent sessions ──
  const calendar: CalendarDay[] = (stats?.recent_sessions ?? []).map((s: any) => {
    const date = s.created_at
      ? new Date(s.created_at).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    const questions = s.questions_count ?? 0;
    const minutes = s.duration_minutes ?? 0;
    const intensity = questions > 15 ? 4 : questions > 10 ? 3 : questions > 5 ? 2 : questions > 0 ? 1 : 0;
    return { date, questionsAnswered: questions, minutesStudied: minutes, intensity } as CalendarDay;
  });

  // ── Monthly stats from score_trend ──
  const monthlyStats: MonthlyStats[] = [];
  const monthMap = new Map<string, { scores: number[]; count: number; questions: number; minutes: number }>();
  for (const item of (stats?.score_trend ?? [])) {
    const month = item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown';
    const existing = monthMap.get(month) ?? { scores: [], count: 0, questions: 0, minutes: 0 };
    existing.scores.push(item.score ?? 0);
    existing.count++;
    monthMap.set(month, existing);
  }
  for (const [month, data] of monthMap) {
    monthlyStats.push({
      month,
      score: toPercent(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
      interviews: data.count,
      questionsAnswered: Math.round((stats?.total_questions ?? 0) / Math.max(monthMap.size, 1)),
      studyHours: Math.round((stats?.total_study_minutes ?? 0) / 60 / Math.max(monthMap.size, 1)),
    });
  }

  // ── Study sessions ──
  const studySessions: StudySession[] = (stats?.recent_sessions ?? []).map((s: any, i: number) => ({
    id: s.id ?? `session-${i}`,
    date: s.created_at ? new Date(s.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    topic: s.topic ?? 'General',
    duration: s.duration_minutes ?? 15,
    questionsAnswered: s.questions_count ?? 0,
    accuracy: toPercent(s.overall_score ?? 0),
  }));

  // ── Performance timeline ──
  const performanceTimeline: PerformanceTimelineEntry[] = (stats?.score_trend ?? []).map(item => ({
    date: item.date ? new Date(item.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    score: toPercent(item.score ?? 0),
    event: item.topic ?? 'Study Session',
  }));

  // ── Goals (derived from user progress) ──
  const goals: Goal[] = [
    {
      id: 'weekly-sessions',
      title: 'Weekly Sessions',
      description: 'Complete 5 sessions this week',
      current: Math.min(stats?.total_sessions ?? 0, 5),
      target: 5,
      unit: 'sessions',
      deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      category: 'study',
    },
    {
      id: 'streak-goal',
      title: 'Build Streak',
      description: 'Maintain a 7-day streak',
      current: stats?.streak ?? 0,
      target: 7,
      unit: 'days',
      deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      category: 'streak',
    },
  ];

  const totalStudyHours = Math.round((stats?.total_study_minutes ?? 0) / 60);
  const completionRate = stats?.total_sessions > 0 ? toPercent(stats.average_score ?? 0) : 0;
  const daysActive = Math.max(stats?.streak ?? 1, 1);
  const learningVelocity = Math.round((stats?.total_questions ?? 0) / daysActive);

  return {
    goals,
    calendar,
    quickActions: QUICK_ACTIONS,
    monthlyStats,
    studySessions,
    performanceTimeline,
    totalStudyHours,
    completionRate,
    learningVelocity,
  };
};
