import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '../layouts';
import { Dashboard } from '../pages/Dashboard';
import { AnalyticsPage } from '../pages/Analytics';
import { LeaderboardPage } from '../pages/Leaderboard';
import { ProfilePage } from '../pages/Profile';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
};
