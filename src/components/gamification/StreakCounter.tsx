import React from 'react';
import { Card } from '../common/Card';
import { FaFire } from 'react-icons/fa';

interface StreakCounterProps {
  streak: number;
  isActiveToday?: boolean;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ streak, isActiveToday = true }) => {
  return (
    <Card className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
        isActiveToday ? 'bg-orange-500/20 text-orange-500' : 'bg-neutral-800 text-neutral-500'
      }`}>
        <FaFire className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-neutral-400">Day Streak</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-neutral-100">{streak}</span>
          <span className="text-xs text-neutral-500">Days</span>
        </div>
      </div>
    </Card>
  );
};
