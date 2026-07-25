import React, { ReactNode } from 'react';
import { Card } from '../common/Card';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  trend,
  className = ''
}) => {
  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-neutral-400">{title}</span>
        {icon && <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">{icon}</div>}
      </div>
      <div>
        <div className="text-2xl font-bold text-neutral-100">{value}</div>
        {subtitle && <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>}
        {trend && (
          <p className={`text-xs font-medium mt-1 ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}% from last week
          </p>
        )}
      </div>
    </Card>
  );
};
