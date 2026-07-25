import React from 'react';
import { Card } from '../common/Card';
import { getScoreColor } from '../../utils';
import { CountUp } from '../animations/CountUp';

interface ScoreCardProps {
  score: number;
  label?: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score, label = "Average Score" }) => {
  const colorClass = getScoreColor(score);
  
  return (
    <Card className="flex flex-col items-center justify-center text-center py-8">
      <h3 className="text-neutral-400 font-medium mb-4">{label}</h3>
      <div className={`text-6xl font-black tracking-tighter ${colorClass}`}>
        <CountUp value={score} suffix="%" duration={2} />
      </div>
      <p className="text-sm text-neutral-500 mt-4">
        {score >= 80 ? 'Excellent performance! Keep it up.' : 
         score >= 60 ? 'Good work. Room for improvement.' : 
         'Needs more practice.'}
      </p>
    </Card>
  );
};
