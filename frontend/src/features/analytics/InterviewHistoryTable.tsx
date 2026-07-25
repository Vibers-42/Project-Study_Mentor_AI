import React from 'react';
import { Card } from '../../shared/ui/Card';
import { InterviewHistory } from '../../types';
import { getScoreColor } from '../../utils';

interface InterviewHistoryTableProps {
  history: InterviewHistory[];
}

export const InterviewHistoryTable: React.FC<InterviewHistoryTableProps> = ({ history }) => {
  return (
    <Card className="overflow-hidden p-0" noPadding>
      <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900">
        <h3 className="font-semibold text-neutral-200">Recent Interviews</h3>
        <button className="text-sm text-violet-400 hover:text-violet-300">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-900/50 text-neutral-400 text-xs uppercase tracking-wider">
              <th className="p-4 font-medium">Topic</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Difficulty</th>
              <th className="p-4 font-medium text-right">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {history.map((interview) => (
              <tr key={interview.id} className="hover:bg-neutral-800/30 transition-colors">
                <td className="p-4 font-medium text-neutral-200">{interview.topic}</td>
                <td className="p-4 text-sm text-neutral-400">{interview.date}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    interview.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-500' :
                    interview.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {interview.difficulty}
                  </span>
                </td>
                <td className={`p-4 text-right font-bold ${getScoreColor(interview.score)}`}>
                  {interview.score}%
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-neutral-500">
                  No recent interviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
