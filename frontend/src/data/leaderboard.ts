import { LeaderboardData } from '../types';

export const mockLeaderboardData: LeaderboardData = {
  topUsers: [
    { id: 'u1', name: 'Alex Johnson', rank: 1, xp: 12500, level: 24, streak: 45 },
    { id: 'u2', name: 'Sarah Miller', rank: 2, xp: 11200, level: 22, streak: 32 },
    { id: 'u3', name: 'David Chen', rank: 3, xp: 10500, level: 21, streak: 28 },
    { id: 'u4', name: 'Emma Wilson', rank: 4, xp: 9800, level: 20, streak: 15 },
    { id: 'me', name: 'You', rank: 5, xp: 9450, level: 19, streak: 12, isCurrentUser: true },
    { id: 'u6', name: 'James Taylor', rank: 6, xp: 8900, level: 18, streak: 8 },
    { id: 'u7', name: 'Lisa Anderson', rank: 7, xp: 8200, level: 17, streak: 5 },
  ],
  currentUserRank: { id: 'me', name: 'You', rank: 5, xp: 9450, level: 19, streak: 12, isCurrentUser: true }
};
