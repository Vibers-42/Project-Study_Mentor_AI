import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import ThemeToggle from '../components/common/ThemeToggle';
import Badge from '../components/common/Badge';

const FEATURE_ITEMS = [
  { icon: '⚡', title: 'Adaptive AI Questions', desc: 'Difficulty adjusts in real-time to your performance' },
  { icon: '🎯', title: 'Instant Feedback', desc: 'Claude evaluates every answer with detailed insights' },
  { icon: '🗺️', title: 'Learning Roadmaps', desc: 'Personalized paths to your dream role' },
];

const AuthLayout = () => {
  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Left Column: Branding & Feature Panel (Desktop) */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white p-12 relative overflow-hidden shadow-2xl">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header & Back to Home */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-extrabold text-2xl text-white tracking-tight hover:opacity-90 transition-opacity"
          >
            <div className="w-9 h-9 rounded-xl bg-white text-indigo-700 flex items-center justify-center font-black text-lg shadow-md">
              AI
            </div>
            <span>Study Mentor AI</span>
          </Link>
        </div>

        {/* Middle Feature Highlights */}
        <div className="relative z-10 space-y-6 max-w-md my-auto py-12">
          <Badge variant="primary" className="bg-white/15 text-white border-white/20">
            ✨ AI-Powered Academic Success
          </Badge>

          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Accelerate Your Learning & Crack Every Technical Interview.
          </h1>

          <p className="text-indigo-100 text-base leading-relaxed">
            Get instant 24/7 step-by-step doubt resolution, real-time AI mock interview practice, and personalized progress analytics.
          </p>

          <div className="pt-4 border-t border-white/15 grid grid-cols-2 gap-4 text-xs font-medium text-indigo-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>24/7 AI Availability</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Real-Time Scoring</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Tailored Roadmaps</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>100% Free Trial</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer Quote */}
        <div className="relative z-10 text-xs text-indigo-200/80 pt-6 border-t border-white/10 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Study Mentor AI</span>
          <Link to="/" className="hover:text-white transition-colors underline underline-offset-2">
            Back to Home
          </Link>
        </div>
      </div>

      {/* Right Column: Centered Auth Form Container */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-12 relative">
        {/* Top Controls: Mobile Logo & Theme Toggle */}
        <div className="flex items-center justify-between w-full max-w-md mx-auto mb-6">
          <Link to="/" className="lg:hidden flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-extrabold shadow-sm">
              AI
            </div>
            <span>Study Mentor AI</span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle size="sm" />
            <Link
              to="/"
              className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors hidden sm:block ml-2"
            >
              ← Home
            </Link>
          </div>
        </div>

        {/* Form Outlet Container */}
        <div className="w-full max-w-md mx-auto my-auto py-4">
          <Outlet />
        </div>

        {/* Bottom Helper Bar */}
        <div className="w-full max-w-md mx-auto text-center text-xs text-slate-400 dark:text-slate-500 pt-6">
          Protected by Study Mentor AI • Enterprise-Grade Security
        </div>
      </div>

      {/* Responsive style hack — Tailwind v4 doesn't need this but inline styles do */}
      <style>{`
        @media (min-width: 1024px) {
          .lg-flex { display: flex !important; }
          .auth-right { grid-column: 2 / 3 !important; }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
