import React from 'react';
import { Card } from '../../shared/ui/Card';
import { InterviewHistory } from '../../types';
import { FaPlay, FaCheck, FaTimes } from 'react-icons/fa';

interface RecentActivityProps {
  activities: InterviewHistory[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <Card>
      <h3 className="font-semibold text-neutral-200 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.slice(0, 4).map((activity, i) => (
          <div key={activity.id} className="flex gap-4">
            <div className="relative flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                activity.score >= 80 ? 'bg-green-500/20 text-green-500' :
                activity.score >= 60 ? 'bg-yellow-500/20 text-yellow-500' :
                'bg-red-500/20 text-red-500'
              }`}>
                {activity.score >= 80 ? <FaCheck className="w-3 h-3" /> : 
                 activity.score >= 60 ? <FaPlay className="w-3 h-3" /> : 
                 <FaTimes className="w-3 h-3" />}
              </div>
              {i !== Math.min(activities.length, 4) - 1 && (
                <div className="w-0.5 h-full bg-neutral-800 absolute top-8" />
              )}
            </div>
            <div className="pb-4 flex-1">
              <p className="text-sm text-neutral-300 font-medium">{activity.topic} Interview</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-neutral-500">{activity.date}</span>
                <span className={`text-xs font-bold ${
                  activity.score >= 80 ? 'text-green-400' :
                  activity.score >= 60 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  Score: {activity.score}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
