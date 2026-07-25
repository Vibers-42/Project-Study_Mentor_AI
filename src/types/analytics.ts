export interface TopicPerformance {
  topic: string;
  accuracy: number;
  questionsAnswered: number;
  averageTimePerQuestion: number;
}

export interface WeeklyProgress {
  day: string;
  score: number;
  questions: number;
}

export interface InterviewHistory {
  id: string;
  date: string;
  topic: string;
  score: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface AnalyticsData {
  overallAccuracy: number;
  averageScore: number;
  interviewsTaken: number;
  weakTopics: TopicPerformance[];
  strongTopics: TopicPerformance[];
  weeklyProgress: WeeklyProgress[];
  interviewHistory: InterviewHistory[];
  difficultyDistribution: { difficulty: string; percentage: number }[];
}
