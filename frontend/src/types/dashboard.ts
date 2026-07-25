export interface Goal {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  unit: string;
  deadline: string;
  category: 'study' | 'interview' | 'streak' | 'xp';
}

export interface CalendarDay {
  date: string;
  questionsAnswered: number;
  minutesStudied: number;
  intensity: 0 | 1 | 2 | 3 | 4; // 0=none, 4=max
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  iconName: string;
  href: string;
  color: string;
}

export interface MonthlyStats {
  month: string;
  score: number;
  interviews: number;
  questionsAnswered: number;
  studyHours: number;
}

export interface StudySession {
  id: string;
  date: string;
  topic: string;
  duration: number; // minutes
  questionsAnswered: number;
  accuracy: number;
}

export interface PerformanceTimelineEntry {
  date: string;
  score: number;
  event: string;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'stat' | 'chart' | 'list' | 'progress';
}

export interface DashboardData {
  goals: Goal[];
  calendar: CalendarDay[];
  quickActions: QuickAction[];
  monthlyStats: MonthlyStats[];
  studySessions: StudySession[];
  performanceTimeline: PerformanceTimelineEntry[];
  totalStudyHours: number;
  completionRate: number;
  learningVelocity: number; // questions per day
}
