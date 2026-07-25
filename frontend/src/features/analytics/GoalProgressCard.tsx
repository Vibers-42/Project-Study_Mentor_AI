import React from 'react';
import { Card } from '../../shared/ui/Card';
import { ProgressRing } from '../../shared/ui/ProgressRing';
import { Goal } from '../../types';

interface GoalProgressCardProps {
  goals: Goal[];
}

const categoryColors: Record<string, string> = {
  study: '#22c55e',
  interview: '#8b5cf6',
  streak: '#f59e0b',
  xp: '#06b6d4',
};

export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({ goals }) => {
  return (
    <Card className="flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-neutral-200">Weekly Goals</h3>
        <span className="text-[11px] text-violet-400 font-medium px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20">
          On Track
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 my-auto">
        {goals.map(goal => (
          <div key={goal.id} className="flex flex-col items-center justify-between p-3 bg-neutral-800/40 rounded-xl border border-neutral-800/80 transition-colors hover:border-neutral-700">
            <ProgressRing
              value={goal.current}
              max={goal.target}
              size={68}
              strokeWidth={6}
              color={categoryColors[goal.category] || '#8b5cf6'}
              showValue={true}
            />
            <div className="mt-2 text-center w-full min-w-0">
              <p className="text-xs font-medium text-neutral-200 truncate" title={goal.title}>{goal.title}</p>
              <p className="text-[10px] text-neutral-500 mt-0.5">{goal.current} / {goal.target} {goal.unit}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
