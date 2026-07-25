import React from 'react';
import { FaUserCircle, FaBell } from 'react-icons/fa';

export const Navbar: React.FC = () => {
  return (
    <header className="h-16 border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-md flex items-center px-8 sticky top-0 z-20">
      <div className="flex-1 font-semibold text-neutral-200 text-lg">
        Member 3 Dashboard
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors relative">
          <FaBell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-neutral-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-white shadow-md shadow-violet-900/50 text-sm">
            H
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-white">Hackathon Hero</p>
            <p className="text-[10px] text-violet-400 font-medium">Level 19 Master</p>
          </div>
        </div>
      </div>
    </header>
  );
};
