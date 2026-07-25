import { FaChartPie, FaUserGraduate, FaTrophy, FaUser } from 'react-icons/fa';

export const APP_THEME = {
  colors: {
    primary: '#8b5cf6', // Violet
    secondary: '#d946ef', // Fuchsia
    background: '#121212',
    card: '#1e1e1e',
    border: '#2a2a2a',
  },
  animation: {
    duration: 0.3,
  }
};

export const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: FaChartPie },
  { name: 'Analytics', path: '/analytics', icon: FaUserGraduate },
  { name: 'Leaderboard', path: '/leaderboard', icon: FaTrophy },
  { name: 'Profile', path: '/profile', icon: FaUser },
];
