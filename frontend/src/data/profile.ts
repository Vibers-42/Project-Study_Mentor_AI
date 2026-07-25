import { UserProfile } from '../types';
import { mockAchievements } from './achievements';
import { mockHistory } from './history';

export const mockProfileData: UserProfile = {
  id: 'me',
  name: 'Hackathon Hero',
  email: 'hero@innovahack.com',
  level: 19,
  currentXP: 9450,
  nextLevelXP: 10000,
  statistics: {
    interviewsCompleted: 24,
    totalQuestionsAnswered: 350,
    averageScore: 82,
    bestTopic: 'React',
    weakTopic: 'System Design'
  },
  recentBadges: [
    { id: 'b1', name: 'First Blood', description: 'Complete your first interview', iconName: 'FaTrophy', isUnlocked: true },
    { id: 'b2', name: 'Consistent', description: '7 day streak', iconName: 'FaFire', isUnlocked: true },
    { id: 'b3', name: 'Master', description: 'Score 90%+ in 3 interviews', iconName: 'FaCrown', isUnlocked: true }
  ],
  recentAchievements: mockAchievements,
  recentInterviews: mockHistory
};
