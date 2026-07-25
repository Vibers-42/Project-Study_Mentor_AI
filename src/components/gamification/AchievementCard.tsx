import React from 'react';
import { Achievement } from '../../types';
import { FaTrophy } from 'react-icons/fa';

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const percentComplete = Math.min(100, Math.round((achievement.progress / achievement.target) * 100));
  
  return (
    <div className={`p-4 rounded-xl border ${
      achievement.isCompleted 
        ? 'bg-neutral-800 border-yellow-500/30' 
        : 'bg-neutral-900 border-neutral-800'
    }`}>
      <div className="flex gap-4 items-start">
        <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${
          achievement.isCompleted ? 'bg-yellow-500/20 text-yellow-500' : 'bg-neutral-800 text-neutral-500'
        }`}>
          <FaTrophy className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-semibold text-neutral-200 text-sm">{achievement.title}</h4>
            {achievement.isCompleted && (
              <span className="text-xs font-medium text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">
                +{achievement.rewardXP} XP
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 mb-3">{achievement.description}</p>
          
          <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full ${achievement.isCompleted ? 'bg-yellow-500' : 'bg-violet-500'}`}
              style={{ width: `${percentComplete}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-neutral-500">{achievement.progress} / {achievement.target}</span>
            <span className="text-[10px] text-neutral-500">{percentComplete}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
