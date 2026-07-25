import { LeaderboardData } from '../types';
import { mockLeaderboardData } from '../data/leaderboard';
import {
  adaptLeaderboardData,
  BackendLeaderboardRow,
  BackendMyRank,
} from './adapters';
import { getMember3Resource } from './member3Api.service';

type BackendLeaderboardPayload =
  | BackendLeaderboardRow[]
  | {
      entries?: BackendLeaderboardRow[];
      currentUserRank?: BackendMyRank;
      currentUserId?: string;
    };

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

export const getLeaderboardData = async (): Promise<LeaderboardData> => {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockLeaderboardData;
  }

  const payload = await getMember3Resource<BackendLeaderboardPayload>('/leaderboard');
  const rows = Array.isArray(payload) ? payload : payload.entries ?? [];
  const currentUserRank = Array.isArray(payload) ? undefined : payload.currentUserRank;
  const currentUserId = Array.isArray(payload) ? undefined : payload.currentUserId;
  return adaptLeaderboardData(rows, currentUserRank, currentUserId);
};