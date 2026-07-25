import React from 'react';
import { Card } from '../common/Card';
import { FaFire } from 'react-icons/fa';

interface StreakCounterProps {
  streak: number;
  isActiveToday?: boolean;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ streak, isActiveToday = true }) => {
  return (
    <Card className="min-h-[114px] h-full flex flex-col justify-between p-5 bg-gradient-to-br from-neutral-900 via-neutral-900 to-orange-950/20 border-orange-500/20">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Day Streak</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${
          isActiveToday ? 'bg-orange-500/15 border-orange-500/30 text-orange-400' : 'bg-neutral-800 border-neutral-700 text-neutral-500'
        }`}>
          <FaFire className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline justify-between gap-2 mt-3">
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {streak} <span className="text-base font-bold text-neutral-400 normal-case">Days</span>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
          🔥 Active
        </span>
      </div>
    </Card>
  );
};
