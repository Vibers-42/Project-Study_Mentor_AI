import { Badge, Achievement } from './achievement';
import { InterviewHistory } from './analytics';

export interface UserStatistics {
  interviewsCompleted: number;
  totalQuestionsAnswered: number;
  averageScore: number;
  bestTopic: string;
  weakTopic: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  level: number;
  currentXP: number;
  nextLevelXP: number;
  statistics: UserStatistics;
  recentBadges: Badge[];
  recentAchievements: Achievement[];
  recentInterviews: InterviewHistory[];
}
