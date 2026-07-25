import { UserProfile, GamificationProgress } from '../types';

export const getUserProfile = async (): Promise<UserProfile> => {
  await new Promise(resolve => setTimeout(resolve, 700));

  return {
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
    recentAchievements: [
      { id: 'a1', title: 'Century', description: 'Answer 100 questions', progress: 100, target: 100, rewardXP: 500, isCompleted: true },
      { id: 'a2', title: 'Half Millennium', description: 'Answer 500 questions', progress: 350, target: 500, rewardXP: 1000, isCompleted: false }
    ],
    recentInterviews: [
      { id: '1', date: 'Today', topic: 'Frontend Eng', score: 92, difficulty: 'Advanced' },
      { id: '2', date: '2 days ago', topic: 'System Design', score: 65, difficulty: 'Intermediate' },
    ]
  };
};

export const getProgress = async (): Promise<GamificationProgress> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    currentXP: 9450,
    nextLevelXP: 10000,
    level: 19,
    dailyStreak: 12,
    badges: [
      { id: 'b1', name: 'First Blood', description: 'Complete your first interview', iconName: 'FaTrophy', isUnlocked: true },
      { id: 'b2', name: 'Consistent', description: '7 day streak', iconName: 'FaFire', isUnlocked: true },
      { id: 'b3', name: 'Master', description: 'Score 90%+ in 3 interviews', iconName: 'FaCrown', isUnlocked: true },
      { id: 'b4', name: 'Perfect', description: 'Score 100% in any interview', iconName: 'FaStar', isUnlocked: false },
    ],
    achievements: [
      { id: 'a1', title: 'Century', description: 'Answer 100 questions', progress: 100, target: 100, rewardXP: 500, isCompleted: true },
      { id: 'a2', title: 'Half Millennium', description: 'Answer 500 questions', progress: 350, target: 500, rewardXP: 1000, isCompleted: false },
      { id: 'a3', title: 'Marathon', description: '30 day streak', progress: 12, target: 30, rewardXP: 2000, isCompleted: false }
    ]
  };
};
