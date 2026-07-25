import React, { ReactNode } from 'react';
import { Card } from './Card';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, action, children, className = '' }) => {
  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-200">{title}</h3>
          {subtitle && <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </Card>
  );
};
