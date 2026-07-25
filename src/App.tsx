import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout, Dashboard } from './pages/Dashboard';
import { AnalyticsPage } from './pages/Analytics';
import { LeaderboardPage } from './pages/Leaderboard';
import { ProfilePage } from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
