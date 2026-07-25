import React from 'react';
import { Card } from '../../shared/ui/Card';
import { CountUp } from '../../shared/animations/CountUp';
import { FaStar } from 'react-icons/fa';

interface XPCardProps {
  currentXP: number;
  xpGainedToday?: number;
}

export const XPCard: React.FC<XPCardProps> = ({ currentXP, xpGainedToday = 0 }) => {
  return (
    <Card className="min-h-[114px] h-full flex flex-col justify-between p-5 bg-gradient-to-br from-neutral-900 via-neutral-900 to-violet-950/20 border-violet-500/20">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Total XP</p>
        <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-400 flex items-center justify-center shrink-0">
          <FaStar className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline justify-between gap-2 mt-3">
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          <CountUp value={currentXP} />
        </div>
        {xpGainedToday > 0 && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            +{xpGainedToday} Today
          </span>
        )}
      </div>
    </Card>
  );
};
