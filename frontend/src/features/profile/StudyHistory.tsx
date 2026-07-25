import React from 'react';
import { Card } from '../../shared/ui/Card';
import { StudySession } from '../../types';
import { FaClock, FaCheckCircle } from 'react-icons/fa';

interface StudyHistoryProps {
  sessions: StudySession[];
}

export const StudyHistory: React.FC<StudyHistoryProps> = ({ sessions }) => {
  return (
    <Card>
      <h3 className="text-sm font-semibold text-neutral-200 mb-4">Study History</h3>
      <div className="space-y-3">
        {sessions.map(session => (
          <div key={session.id} className="flex items-center gap-4 p-3 bg-neutral-800/50 rounded-lg border border-neutral-800">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
              <FaCheckCircle className="w-4 h-4 text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-200 truncate">{session.topic}</p>
              <div className="flex items-center gap-3 text-xs text-neutral-500 mt-0.5">
                <span>{session.date}</span>
                <span className="flex items-center gap-1"><FaClock className="w-2.5 h-2.5" />{session.duration}m</span>
                <span>{session.questionsAnswered} Q</span>
              </div>
            </div>
            <div className={`text-sm font-bold ${session.accuracy >= 80 ? 'text-emerald-400' : session.accuracy >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
              {session.accuracy}%
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
