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
    <Card className="flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 bg-neutral-800 rounded-lg text-violet-400">
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend.isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
          }`}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div>
        <h4 className="text-neutral-400 text-sm mb-1">{title}</h4>
        <div className="text-2xl font-bold text-neutral-100">{value}</div>
      </div>
    </Card>
  );
};
