import api from './api';

/** Global leaderboard (public). */
export const getLeaderboard = async () => {
  const res = await api.get('/leaderboard');
  return res.data.data;
};

/**
 * The signed-in user's rank, XP, level and earned badge IDs.
 * Returns { rank, total_users, xp, level, badges[], total_sessions, average_score }.
 */
export const getMyRank = async (options = {}) => {
  const res = await api.get('/leaderboard/me', options);
  return res.data.data;
};
