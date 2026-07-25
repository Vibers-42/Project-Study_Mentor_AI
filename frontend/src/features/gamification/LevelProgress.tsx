import React from 'react';
import { Card } from '../../shared/ui/Card';

interface LevelProgressProps {
  level: number;
  currentXP: number;
  nextLevelXP: number;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({ level, currentXP, nextLevelXP }) => {
  // Backend is single source of truth for XP and Level; compute display ratio without client-side recalculation
  const percent = nextLevelXP > 0 ? Math.min(Math.max(Math.round((currentXP / nextLevelXP) * 100), 0), 100) : 0;

  return (
    <Card>
      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-sm text-neutral-400">Current Level</p>
          <div className="text-3xl font-bold text-neutral-100 flex items-baseline gap-2">
            {level} <span className="text-sm font-normal text-neutral-500">Master</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-violet-400 font-medium">{currentXP} XP</p>
          <p className="text-xs text-neutral-500">/ {nextLevelXP} XP</p>
        </div>
      </div>
      
      <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-1000 ease-out relative"
          style={{ width: `${percent}%` }}
        >
          <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
        </div>
      </div>
      <p className="text-xs text-neutral-500 text-center mt-3">
        {nextLevelXP - currentXP} XP to next level
      </p>
    </Card>
  );
};
