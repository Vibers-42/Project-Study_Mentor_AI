import api from './api';

export const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data.data; // { user, session }
};

export const register = async (email, password, full_name) => {
  const res = await api.post('/auth/register', { email, password, full_name });
  return res.data.data; // { user, session }
};

export const logout = async () => {
  await api.post('/auth/logout');
};

export const getMe = async () => {
  const res = await api.get('/auth/me');
  return res.data.data;
};

export const updateProfile = async (profileData) => {
  const res = await api.put('/auth/profile', profileData);
  return res.data.data;
};
