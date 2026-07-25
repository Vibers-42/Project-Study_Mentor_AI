import React, { useState } from 'react';
import { FaBars, FaChartBar, FaChartLine, FaTrophy, FaUser } from 'react-icons/fa';
import { Link, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: FaChartBar },
  { name: 'Analytics', href: '/analytics', icon: FaChartLine },
  { name: 'Leaderboard', href: '/leaderboard', icon: FaTrophy },
  { name: 'Profile', href: '/profile', icon: FaUser },
];

const Sidebar = ({ onNavigate }) => {
  const location = useLocation();

  return (
    <aside className="w-60 shrink-0 border-r border-white/10 bg-[var(--bg-surface)] min-h-full flex flex-col">
      <Link to="/dashboard" className="h-16 px-5 border-b border-white/10 flex items-center gap-3 no-underline" onClick={onNavigate}>
        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 grid place-items-center text-white font-black">M</span>
        <span className="font-bold text-sm text-[var(--text-primary)]">Mentor Metrics</span>
      </Link>

      <nav className="flex-1 p-3" aria-label="Member 3 analytics navigation">
        <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-[var(--text-muted)]">Workspace</p>
        {navItems.map(({ name, href, icon: Icon }) => {
          const active = location.pathname === href;
          return (
            <Link
              key={href}
              to={href}
              onClick={onNavigate}
              className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors no-underline ${active ? 'bg-violet-500/15 text-violet-300 border border-violet-500/25' : 'text-[var(--text-secondary)] border border-transparent hover:bg-white/5 hover:text-[var(--text-primary)]'}`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              {name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 text-xs leading-5 text-[var(--text-muted)]">
        Analytics, gamification, and learner profile.
      </div>
    </aside>
  );
};

const Member3Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[var(--bg-base)]">
      <div className="hidden md:block"><Sidebar /></div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="h-full w-60" onClick={(event) => event.stopPropagation()}>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1 flex flex-col">
        <header className="h-16 px-5 border-b border-white/10 bg-[var(--bg-surface)] flex items-center gap-3">
          <button type="button" className="md:hidden rounded-lg p-2 text-[var(--text-secondary)] hover:bg-white/5" aria-label="Open navigation" onClick={() => setMobileOpen(true)}>
            <FaBars />
          </button>
          <span className="font-semibold text-[var(--text-primary)]">AI Study Mentor</span>
          <span className="ml-auto text-xs rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-emerald-300">Analytics workspace</span>
        </header>
        <main className="flex-1 overflow-y-auto p-5 sm:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Member3Layout;
