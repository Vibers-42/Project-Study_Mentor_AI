import React from 'react';
import { 
  FaChartPie, 
  FaUserGraduate, 
  FaTrophy, 
  FaUser 
} from 'react-icons/fa';
import { NavLink, Outlet } from 'react-router-dom';

export const DashboardLayout: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: FaChartPie },
    { name: 'Analytics', path: '/analytics', icon: FaUserGraduate },
    { name: 'Leaderboard', path: '/leaderboard', icon: FaTrophy },
    { name: 'Profile', path: '/profile', icon: FaUser },
  ];

  return (
    <div className="flex h-screen bg-[#121212] text-white">
      {/* Sidebar */}
      <div className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500">
            Study Mentor AI
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/50' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-[#121212]">
        <header className="h-16 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur flex items-center px-8 sticky top-0 z-10">
          <div className="flex-1" />
          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center font-bold shadow-md shadow-violet-900/50">
            Y
          </div>
        </header>
        <main className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
