import React from 'react';
import { Card } from '../common/Card';
import { CountUp } from '../animations/CountUp';
import { FaStar } from 'react-icons/fa';

interface XPCardProps {
  currentXP: number;
  xpGainedToday?: number;
}

export const XPCard: React.FC<XPCardProps> = ({ currentXP, xpGainedToday = 0 }) => {
  return (
    <Card className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-violet-500/20 text-violet-500 flex items-center justify-center">
          <FaStar className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-neutral-400">Total XP</p>
          <div className="text-2xl font-bold text-neutral-100">
            <CountUp value={currentXP} />
          </div>
        </div>
      </div>
      
      {xpGainedToday > 0 && (
        <div className="text-right">
          <p className="text-xs text-neutral-500">Today</p>
          <p className="text-sm font-medium text-green-500">+{xpGainedToday} XP</p>
        </div>
      )}
    </Card>
  );
};
