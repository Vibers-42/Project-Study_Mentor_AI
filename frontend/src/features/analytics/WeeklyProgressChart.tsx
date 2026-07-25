import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card } from '../../shared/ui/Card';
import { CHART_COLORS, commonAxisProps, commonTooltipProps } from '../../utils';
import { WeeklyProgress } from '../../types';

interface WeeklyProgressChartProps {
  data: WeeklyProgress[];
}

export const WeeklyProgressChart: React.FC<WeeklyProgressChartProps> = ({ data }) => {
  return (
    <Card className="h-full">
      <h3 className="text-lg font-semibold text-neutral-100 mb-1">Weekly Activity</h3>
      <p className="text-sm text-neutral-400 mb-4">Questions answered per day</p>
      
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis dataKey="day" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip {...commonTooltipProps} cursor={{ fill: '#334155', opacity: 0.4 }} />
            <Bar dataKey="questions" name="Questions" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
