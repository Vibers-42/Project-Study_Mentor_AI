import { UserProfile, GamificationProgress } from '../types';
import { mockProfileData } from '../data/profile';

export const getUserProfile = async (): Promise<UserProfile> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  return mockProfileData;
};

export const getProgress = async (): Promise<GamificationProgress> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    currentXP: mockProfileData.currentXP,
    nextLevelXP: mockProfileData.nextLevelXP,
    level: mockProfileData.level,
    dailyStreak: 12,
    badges: mockProfileData.recentBadges,
    achievements: mockProfileData.recentAchievements
  };
};
