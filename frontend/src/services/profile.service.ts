import { UserProfile, GamificationProgress } from '../types';
import { mockProfileData } from '../data/profile';
import { adaptProgressData, BackendProgressStats, BackendUserPayload } from './adapters';
import { getAchievements } from './achievement.service';
import { getMember3Resource } from './member3Api.service';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

export const getUserProfile = async (): Promise<UserProfile> => {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 700));
    return mockProfileData;
  }

  const [user, stats, achievements] = await Promise.all([
    getMember3Resource<BackendUserPayload>('/profile'),
    getMember3Resource<BackendProgressStats>('/progress'),
    getAchievements(),
  ]);

  const progress = adaptProgressData(stats, user);

  return {
    id: user.id,
    name: user.full_name,
    email: user.email,
    level: progress.level,
    currentXP: progress.currentXP,
    nextLevelXP: progress.nextLevelXP,
    statistics: {
      interviewsCompleted: stats.total_sessions ?? 0,
      totalQuestionsAnswered: stats.total_questions ?? 0,
      averageScore: Math.round(Math.min((stats.average_score ?? 0) * 10, 100)),
      bestTopic: stats.topics_studied?.[0] ?? 'N/A',
      weakTopic: stats.topics_studied?.[stats.topics_studied.length - 1] ?? 'N/A',
    },
    recentBadges: progress.badges,
    recentAchievements: achievements,
    recentInterviews: (stats.recent_sessions ?? []).slice(0, 5).map((s: any, i: number) => ({
      id: s.id ?? `session-${i}`,
      date: s.created_at ? new Date(s.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      topic: s.topic ?? 'General',
      score: Math.round(Math.min((s.overall_score ?? 0) * 10, 100)),
      difficulty: 'Beginner' as const,
    })),
  };
};

export const getProgress = async (): Promise<GamificationProgress> => {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      currentXP: mockProfileData.currentXP,
      nextLevelXP: mockProfileData.nextLevelXP,
      level: mockProfileData.level,
      dailyStreak: 12,
      badges: mockProfileData.recentBadges,
      achievements: mockProfileData.recentAchievements,
    };
  }

  const [user, stats] = await Promise.all([
    getMember3Resource<BackendUserPayload>('/profile'),
    getMember3Resource<BackendProgressStats>('/progress'),
  ]);

  return adaptProgressData(stats, user);
};