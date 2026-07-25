import { DashboardData } from '../types/dashboard';

export const mockDashboardData: DashboardData = {
  goals: [
    { id: 'g1', title: 'Complete 50 Interviews', description: 'Reach 50 total interviews', current: 24, target: 50, unit: 'interviews', deadline: '2026-08-31', category: 'interview' },
    { id: 'g2', title: 'Study 100 Hours', description: 'Accumulate 100 hours of study', current: 67, target: 100, unit: 'hours', deadline: '2026-09-15', category: 'study' },
    { id: 'g3', title: '30-Day Streak', description: 'Maintain a 30-day study streak', current: 12, target: 30, unit: 'days', deadline: '2026-08-25', category: 'streak' },
    { id: 'g4', title: 'Earn 15,000 XP', description: 'Reach 15,000 total XP', current: 9450, target: 15000, unit: 'XP', deadline: '2026-09-01', category: 'xp' },
  ],
  calendar: (() => {
    const days: DashboardData['calendar'] = [];
    const now = new Date(2026, 6, 25);
    for (let i = 89; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const q = (i * 7 + 3) % 20;
      const m = q * 3 + (i % 10);
      const intensity = q === 0 ? 0 : q <= 3 ? 1 : q <= 8 ? 2 : q <= 14 ? 3 : 4;
      days.push({
        date: d.toISOString().split('T')[0],
        questionsAnswered: q,
        minutesStudied: m,
        intensity: intensity as 0 | 1 | 2 | 3 | 4,
      });
    }
    return days;
  })(),
  quickActions: [
    { id: 'qa1', label: 'Dashboard Overview', description: 'Review your current learning pulse', iconName: 'FaBullseye', href: '/dashboard', color: 'violet' },
    { id: 'qa2', label: 'Review Weak Areas', description: 'Focus on topics that need improvement', iconName: 'FaExclamationTriangle', href: '/analytics', color: 'amber' },
    { id: 'qa3', label: 'View Leaderboard', description: 'See where you rank globally', iconName: 'FaTrophy', href: '/leaderboard', color: 'emerald' },
    { id: 'qa4', label: 'View Profile', description: 'Review achievements and level progress', iconName: 'FaBullseye', href: '/profile', color: 'blue' },
  ],
  monthlyStats: [
    { month: 'Jan', score: 62, interviews: 3, questionsAnswered: 45, studyHours: 8 },
    { month: 'Feb', score: 65, interviews: 4, questionsAnswered: 60, studyHours: 10 },
    { month: 'Mar', score: 68, interviews: 5, questionsAnswered: 75, studyHours: 12 },
    { month: 'Apr', score: 72, interviews: 4, questionsAnswered: 55, studyHours: 9 },
    { month: 'May', score: 75, interviews: 6, questionsAnswered: 90, studyHours: 15 },
    { month: 'Jun', score: 78, interviews: 5, questionsAnswered: 80, studyHours: 14 },
    { month: 'Jul', score: 82, interviews: 7, questionsAnswered: 105, studyHours: 18 },
  ],
  studySessions: [
    { id: 's1', date: '2026-07-25', topic: 'React Hooks', duration: 45, questionsAnswered: 12, accuracy: 92 },
    { id: 's2', date: '2026-07-24', topic: 'System Design', duration: 60, questionsAnswered: 8, accuracy: 62 },
    { id: 's3', date: '2026-07-23', topic: 'JavaScript ES6+', duration: 30, questionsAnswered: 15, accuracy: 88 },
    { id: 's4', date: '2026-07-22', topic: 'TypeScript Generics', duration: 40, questionsAnswered: 10, accuracy: 75 },
    { id: 's5', date: '2026-07-21', topic: 'Node.js', duration: 55, questionsAnswered: 14, accuracy: 80 },
    { id: 's6', date: '2026-07-20', topic: 'CSS Grid & Flexbox', duration: 25, questionsAnswered: 8, accuracy: 95 },
  ],
  performanceTimeline: [
    { date: '2026-07-01', score: 65, event: 'Started React module' },
    { date: '2026-07-05', score: 68, event: 'Completed JS fundamentals' },
    { date: '2026-07-10', score: 72, event: 'First 90%+ interview' },
    { date: '2026-07-15', score: 78, event: 'Unlocked "Consistent" badge' },
    { date: '2026-07-20', score: 75, event: 'Attempted System Design' },
    { date: '2026-07-25', score: 82, event: 'New personal best' },
  ],
  totalStudyHours: 67,
  completionRate: 85,
  learningVelocity: 14.2,
};
