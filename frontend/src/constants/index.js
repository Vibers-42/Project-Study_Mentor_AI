const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const API_BASE_URL = rawApiUrl.endsWith('/api')
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/$/, '')}/api`;
