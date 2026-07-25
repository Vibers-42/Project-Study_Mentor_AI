import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Member3Layout from '../shared/layout/Member3Layout';

const Dashboard = lazy(() =>
  import('../features/dashboard/Dashboard').then(({ Dashboard: Page }) => ({ default: Page }))
);
const AnalyticsPage = lazy(() =>
  import('../features/analytics/AnalyticsPage').then(({ AnalyticsPage: Page }) => ({ default: Page }))
);
const LeaderboardPage = lazy(() =>
  import('../features/gamification/LeaderboardPage').then(({ LeaderboardPage: Page }) => ({ default: Page }))
);
const ProfilePage = lazy(() =>
  import('../features/profile/ProfilePage').then(({ ProfilePage: Page }) => ({ default: Page }))
);

const PageFallback = () => (
  <div className="py-16 text-center text-sm text-[var(--text-secondary)]" role="status">
    Loading analytics workspace...
  </div>
);

const AppRoutes = () => (
  <Routes>
    <Route element={<Member3Layout />}>
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <Suspense fallback={<PageFallback />}>
            <Dashboard />
          </Suspense>
        }
      />
      <Route
        path="/analytics"
        element={
          <Suspense fallback={<PageFallback />}>
            <AnalyticsPage />
          </Suspense>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <Suspense fallback={<PageFallback />}>
            <LeaderboardPage />
          </Suspense>
        }
      />
      <Route
        path="/profile"
        element={
          <Suspense fallback={<PageFallback />}>
            <ProfilePage />
          </Suspense>
        }
      />
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default AppRoutes;
