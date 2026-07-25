export interface LeaderboardUser {
  id: string;
  name: string;
  avatarUrl?: string;
  rank: number;
  xp: number;
  level: number;
  streak: number;
  isCurrentUser?: boolean;
}

export interface LeaderboardData {
  topUsers: LeaderboardUser[];
  currentUserRank?: LeaderboardUser;
}
