import { LeaderboardData } from '../types';
import { mockLeaderboardData } from '../data/leaderboard';

export const getLeaderboardData = async (): Promise<LeaderboardData> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockLeaderboardData;
};
