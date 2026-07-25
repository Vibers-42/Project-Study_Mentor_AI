import React from 'react';
import { Card } from '../common/Card';
import { Achievement } from '../../types';
import { FaTrophy, FaCheckCircle } from 'react-icons/fa';

interface AchievementTimelineProps {
  achievements: Achievement[];
}

export const AchievementTimeline: React.FC<AchievementTimelineProps> = ({ achievements }) => {
  const sorted = [...achievements].sort((a, b) => (b.isCompleted ? 1 : 0) - (a.isCompleted ? 1 : 0));

  return (
    <Card>
      <h3 className="text-sm font-semibold text-neutral-200 mb-4">Achievement Timeline</h3>
      <div className="relative">
        <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-neutral-800" />
        <div className="space-y-4">
          {sorted.map(ach => (
            <div key={ach.id} className="flex gap-4 relative">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${ach.isCompleted ? 'bg-emerald-500' : 'bg-neutral-700'}`}>
                {ach.isCompleted ? (
                  <FaCheckCircle className="w-3 h-3 text-white" />
                ) : (
                  <FaTrophy className="w-3 h-3 text-neutral-400" />
                )}
              </div>
              <div className="pb-4">
                <p className={`text-sm font-medium ${ach.isCompleted ? 'text-neutral-200' : 'text-neutral-500'}`}>
                  {ach.title}
                </p>
                <p className="text-xs text-neutral-500">{ach.description}</p>
                {!ach.isCompleted && (
                  <p className="text-[10px] text-violet-400 mt-1">{ach.progress}/{ach.target} — {ach.rewardXP} XP reward</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
