import { AnalyticsData } from '../types';

export const getAnalyticsData = async (): Promise<AnalyticsData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    overallAccuracy: 76,
    averageScore: 82,
    interviewsTaken: 14,
    weakTopics: [
      { topic: 'System Design', accuracy: 54, questionsAnswered: 24, averageTimePerQuestion: 120 },
      { topic: 'Dynamic Programming', accuracy: 62, questionsAnswered: 35, averageTimePerQuestion: 180 },
    ],
    strongTopics: [
      { topic: 'React', accuracy: 92, questionsAnswered: 45, averageTimePerQuestion: 45 },
      { topic: 'JavaScript', accuracy: 88, questionsAnswered: 60, averageTimePerQuestion: 40 },
    ],
    weeklyProgress: [
      { day: 'Mon', score: 70, questions: 12 },
      { day: 'Tue', score: 75, questions: 15 },
      { day: 'Wed', score: 82, questions: 20 },
      { day: 'Thu', score: 78, questions: 10 },
      { day: 'Fri', score: 85, questions: 25 },
      { day: 'Sat', score: 88, questions: 30 },
      { day: 'Sun', score: 90, questions: 18 },
    ],
    interviewHistory: [
      { id: '1', date: '2026-07-24', topic: 'Frontend Eng', score: 92, difficulty: 'Advanced' },
      { id: '2', date: '2026-07-22', topic: 'System Design', score: 65, difficulty: 'Intermediate' },
      { id: '3', date: '2026-07-19', topic: 'Algorithms', score: 78, difficulty: 'Advanced' },
      { id: '4', date: '2026-07-15', topic: 'JavaScript', score: 85, difficulty: 'Intermediate' },
    ],
    difficultyDistribution: [
      { difficulty: 'Beginner', percentage: 10 },
      { difficulty: 'Intermediate', percentage: 60 },
      { difficulty: 'Advanced', percentage: 30 },
    ]
  };
};

export const getPerformanceHistory = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { date: 'Jul 1', score: 65 },
    { date: 'Jul 5', score: 68 },
    { date: 'Jul 10', score: 72 },
    { date: 'Jul 15', score: 78 },
    { date: 'Jul 20', score: 75 },
    { date: 'Jul 25', score: 82 },
  ];
};
