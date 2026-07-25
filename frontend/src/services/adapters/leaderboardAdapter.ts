/**
 * Adapter: Backend leaderboard response → UI LeaderboardData type.
 */
import { LeaderboardData, LeaderboardUser } from '../../types';

export interface BackendLeaderboardRow {
  rank: number;
  user_id: string;
  full_name: string;
  xp: number;
  level: number;
  average_score?: number;
  total_sessions?: number;
  badges?: string[];
  updated_at?: string;
}

export interface BackendMyRank {
  rank: number | null;
  total_users: number;
  user_id: string;
  xp: number;
  level: number;
  badges?: string[];
  total_sessions?: number;
}

function mapRow(row: BackendLeaderboardRow, currentUserId?: string): LeaderboardUser {
  return {
    id: row.user_id,
    name: row.full_name ?? 'Anonymous',
    rank: row.rank,
    xp: row.xp ?? 0,
    level: row.level ?? 1,
    streak: 0, // Backend leaderboard table doesn't expose streak yet
    isCurrentUser: currentUserId ? row.user_id === currentUserId : false,
  };
}

export const adaptLeaderboardData = (
  rows: BackendLeaderboardRow[],
  myRank?: BackendMyRank,
  currentUserId?: string
): LeaderboardData => {
  const topUsers = (rows ?? []).map(r => mapRow(r, currentUserId));

  let currentUserRank: LeaderboardUser | undefined;
  if (myRank && myRank.rank) {
    currentUserRank = {
      id: myRank.user_id,
      name: topUsers.find(u => u.id === myRank.user_id)?.name ?? 'You',
      rank: myRank.rank,
      xp: myRank.xp ?? 0,
      level: myRank.level ?? 1,
      streak: 0,
      isCurrentUser: true,
    };
  }

  return { topUsers, currentUserRank };
};
