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

export const saveSession = async (sessionData) => {
  const res = await api.post('/progress/session', sessionData);
  return res.data.data;
};
