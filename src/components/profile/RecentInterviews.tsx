import React from 'react';
import { Card } from '../common/Card';
import { InterviewHistory } from '../../types';
import { getScoreColor } from '../../utils';

interface RecentInterviewsProps {
  interviews: InterviewHistory[];
}

export const RecentInterviews: React.FC<RecentInterviewsProps> = ({ interviews }) => {
  return (
    <Card className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-neutral-200">Recent Interviews</h3>
        <button className="text-xs text-violet-400 hover:text-violet-300">View History</button>
      </div>
      
      <div className="space-y-3">
        {interviews.map((interview) => (
          <div key={interview.id} className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-neutral-200">{interview.topic}</p>
              <div className="flex gap-2 text-xs text-neutral-500 mt-1">
                <span>{interview.date}</span>
                <span>•</span>
                <span>{interview.difficulty}</span>
              </div>
            </div>
            <div className={`text-lg font-bold ${getScoreColor(interview.score)}`}>
              {interview.score}%
            </div>
          </div>
        ))}
        {interviews.length === 0 && (
          <div className="text-center p-4 text-neutral-500 text-sm">
            No interviews completed yet.
          </div>
        )}
      </div>
    </Card>
  );
};
