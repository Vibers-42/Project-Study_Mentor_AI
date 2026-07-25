import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import LandingLayout from '../layouts/LandingLayout';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';

// Pages
import Landing from '../pages/Landing/Landing';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Dashboard from '../pages/Dashboard/Dashboard';
import Session from '../pages/Session/Session';
import Interview from '../pages/Interview/Interview';
import Results from '../pages/Results/Results';
import Progress from '../pages/Progress/Progress';
import Analytics from '../pages/Analytics/Analytics';
import Settings from '../pages/Settings/Settings';
import Roadmap from '../pages/Roadmap/Roadmap';
import NotFound from '../pages/NotFound/NotFound';

// Guards
import ProtectedRoute from '../components/common/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing Page Route */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      {/* Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Routes wrapped in MainLayout */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/session" element={<Session />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/results" element={<Results />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/settings" element={<Settings />} />

        {/* Legacy redirects from old stub routes */}
        <Route path="/question" element={<Navigate to="/session" replace />} />
        <Route path="/answer"   element={<Navigate to="/session" replace />} />
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
