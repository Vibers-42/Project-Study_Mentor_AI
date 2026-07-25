// Global constants — API URL reads from Vite env var, falls back to localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
