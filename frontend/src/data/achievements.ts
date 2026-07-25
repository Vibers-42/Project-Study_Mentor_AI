import { Achievement } from '../types';

export const mockAchievements: Achievement[] = [
  { id: 'a1', title: 'Century', description: 'Answer 100 questions', progress: 100, target: 100, rewardXP: 500, isCompleted: true },
  { id: 'a2', title: 'Half Millennium', description: 'Answer 500 questions', progress: 350, target: 500, rewardXP: 1000, isCompleted: false },
  { id: 'a3', title: 'Marathon', description: '30 day streak', progress: 12, target: 30, rewardXP: 2000, isCompleted: false }
];
