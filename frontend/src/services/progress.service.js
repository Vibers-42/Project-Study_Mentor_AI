import api from './api';

export const getStats = async () => {
  const res = await api.get('/progress/stats');
  return res.data.data;
};

// Backend GET /progress returns the session list
export const getSessions = async () => {
  const res = await api.get('/progress');
  return res.data.data;
};

/**
 * Save a completed session.
 * @param {Object} sessionData
 * @param {Object} [options]
 * @param {boolean} [options.skipAuthRedirect] Fail quietly on 401 instead of
 *        redirecting to /login — use for best-effort saves that must not
 *        discard on-screen results.
 */
export const saveSession = async (sessionData, options = {}) => {
  const res = await api.post('/progress/session', sessionData, options);
  return res.data.data;
};
