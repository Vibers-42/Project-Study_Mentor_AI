import React, { ReactNode } from 'react';
import { Card } from './Card';
import { CountUp } from '../animations/CountUp';

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon?: ReactNode;
  trend?: { value: number; isPositive: boolean };
  iconBg?: string;
  iconColor?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  suffix = '',
  prefix = '',
  icon,
  trend,
  iconBg = 'bg-violet-500/15',
  iconColor = 'text-violet-400',
  className = '',
}) => {
  return (
    <Card className={`min-h-[114px] h-full flex flex-col justify-between p-5 ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider truncate">{title}</p>
        {icon && (
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-current/20 ${iconBg} ${iconColor}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-baseline justify-between gap-2 mt-3">
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {prefix}<CountUp value={value} />{suffix}
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border shrink-0 ${
            trend.isPositive ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-red-500/15 text-red-400 border-red-500/30'
          }`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}% week
          </span>
        )}
      </div>
    </Card>
  );
};
