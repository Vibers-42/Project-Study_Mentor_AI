import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartCard } from '../common/ChartCard';
import { commonAxisProps, commonTooltipProps, CHART_COLORS } from '../../utils/chartHelpers';

interface MonthlyTrendChartProps {
  data: { month: string; score: number }[];
}

export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ data }) => {
  return (
    <ChartCard title="Monthly Performance Trend" subtitle="Average score per month">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis dataKey="month" {...commonAxisProps} />
          <YAxis {...commonAxisProps} domain={[0, 100]} />
          <Tooltip {...commonTooltipProps} formatter={(val: any) => [`${val}%`, 'Score']} />
          <Line
            type="monotone"
            dataKey="score"
            stroke={CHART_COLORS.primary}
            strokeWidth={2.5}
            dot={{ r: 4, fill: CHART_COLORS.primary, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#fff', stroke: CHART_COLORS.primary, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};
