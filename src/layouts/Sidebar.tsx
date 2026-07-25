import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col h-full shrink-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500">
          Study Mentor AI
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive 
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/80'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-violet-900/30 to-fuchsia-900/20 border border-violet-500/20">
        <p className="text-xs font-semibold text-violet-300">InnovaHack Project</p>
        <p className="text-[11px] text-neutral-400 mt-1">Analytics UI Component layer active.</p>
      </div>
    </aside>
  );
};
