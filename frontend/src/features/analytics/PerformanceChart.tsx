import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card } from '../../shared/ui/Card';
import { CHART_COLORS, commonAxisProps, commonTooltipProps } from '../../utils';

interface PerformanceChartProps {
  data: { date: string; score: number }[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  return (
    <Card className="w-full h-full min-h-[300px]">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-neutral-100">Performance History</h3>
        <p className="text-sm text-neutral-400">Score progression over time</p>
      </div>
      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis dataKey="date" {...commonAxisProps} />
            <YAxis {...commonAxisProps} domain={[0, 100]} />
            <Tooltip {...commonTooltipProps} formatter={(val: any) => [`${val}%`, 'Score']} />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke={CHART_COLORS.primary} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorScore)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
