import { MonthlyStats } from '../types/dashboard';

export const mockMonthlyTrend: MonthlyStats[] = [
  { month: 'Jan', score: 62, interviews: 3, questionsAnswered: 45, studyHours: 8 },
  { month: 'Feb', score: 65, interviews: 4, questionsAnswered: 60, studyHours: 10 },
  { month: 'Mar', score: 68, interviews: 5, questionsAnswered: 75, studyHours: 12 },
  { month: 'Apr', score: 72, interviews: 4, questionsAnswered: 55, studyHours: 9 },
  { month: 'May', score: 75, interviews: 6, questionsAnswered: 90, studyHours: 15 },
  { month: 'Jun', score: 78, interviews: 5, questionsAnswered: 80, studyHours: 14 },
  { month: 'Jul', score: 82, interviews: 7, questionsAnswered: 105, studyHours: 18 },
  { month: 'Aug', score: 79, interviews: 3, questionsAnswered: 50, studyHours: 10 },
  { month: 'Sep', score: 84, interviews: 8, questionsAnswered: 120, studyHours: 20 },
  { month: 'Oct', score: 86, interviews: 6, questionsAnswered: 95, studyHours: 16 },
  { month: 'Nov', score: 88, interviews: 7, questionsAnswered: 110, studyHours: 19 },
  { month: 'Dec', score: 90, interviews: 9, questionsAnswered: 140, studyHours: 22 },
];

export const mockMonthlyComparison = {
  thisMonth: { score: 82, interviews: 7, questionsAnswered: 105, studyHours: 18 },
  lastMonth: { score: 78, interviews: 5, questionsAnswered: 80, studyHours: 14 },
};
