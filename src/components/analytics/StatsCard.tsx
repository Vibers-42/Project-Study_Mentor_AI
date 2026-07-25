import React from 'react';
import { Card } from '../common/Card';
import { IconType } from 'react-icons';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend }) => {
  return (
    <Card className="min-h-[114px] h-full flex flex-col justify-between p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{title}</p>
        <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-400 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline justify-between gap-2 mt-3">
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {value}
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
            trend.isPositive ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-red-500/15 text-red-400 border-red-500/30'
          }`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% week
          </span>
        )}
      </div>
    </Card>
  );
};
