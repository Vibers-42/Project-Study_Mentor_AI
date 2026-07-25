import React from 'react';
import { Card } from '../../shared/ui/Card';
import { ProgressBar } from '../../shared/ui/ProgressBar';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';

interface Milestone {
  id: string;
  title: string;
  target: number;
  current: number;
  reward: string;
  isComplete: boolean;
}

interface MilestoneCardProps {
  milestones?: Milestone[];
}

const defaultMilestones: Milestone[] = [
  { id: 'm1', title: 'First Interview', target: 1, current: 1, reward: '100 XP', isComplete: true },
  { id: 'm2', title: '10 Interviews', target: 10, current: 10, reward: '500 XP', isComplete: true },
  { id: 'm3', title: '25 Interviews', target: 25, current: 24, reward: '1,000 XP', isComplete: false },
  { id: 'm4', title: '50 Interviews', target: 50, current: 24, reward: '2,500 XP', isComplete: false },
  { id: 'm5', title: '100 Interviews', target: 100, current: 24, reward: '5,000 XP', isComplete: false },
];

export const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestones = defaultMilestones }) => {
  return (
    <Card>
      <h3 className="text-sm font-semibold text-neutral-200 mb-4">Milestones</h3>
      <div className="space-y-4">
        {milestones.map(m => (
          <div key={m.id} className="flex items-start gap-3">
            <div className="mt-0.5">
              {m.isComplete ? (
                <FaCheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <FaRegCircle className="w-4 h-4 text-neutral-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${m.isComplete ? 'text-neutral-300' : 'text-neutral-400'}`}>{m.title}</span>
                <span className="text-xs text-violet-400 font-medium">{m.reward}</span>
              </div>
              <ProgressBar
                value={m.current}
                max={m.target}
                size="sm"
                showPercentage={false}
                color={m.isComplete ? '#22c55e' : '#8b5cf6'}
              />
              <p className="text-[10px] text-neutral-600 mt-1">{m.current}/{m.target}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
