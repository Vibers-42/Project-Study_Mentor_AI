import { Achievement, Badge } from '../types';
import { mockAchievements } from '../data/achievements';

export const getAchievements = async (): Promise<Achievement[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockAchievements;
};

export const getAllBadges = async (): Promise<Badge[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return [
    { id: 'b1', name: 'First Blood', description: 'Complete your first interview', iconName: 'FaTrophy', isUnlocked: true },
    { id: 'b2', name: 'Consistent', description: '7 day streak', iconName: 'FaFire', isUnlocked: true },
    { id: 'b3', name: 'Master', description: 'Score 90%+ in 3 interviews', iconName: 'FaCrown', isUnlocked: true },
    { id: 'b4', name: 'Perfect Score', description: 'Score 100% in any interview', iconName: 'FaStar', isUnlocked: false },
    { id: 'b5', name: 'Night Owl', description: 'Study after midnight', iconName: 'FaMoon', isUnlocked: false },
    { id: 'b6', name: 'Marathon', description: '30 day streak', iconName: 'FaRunning', isUnlocked: false },
  ];
};
