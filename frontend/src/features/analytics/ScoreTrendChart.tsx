import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartCard } from '../../shared/ui/ChartCard';
import { commonAxisProps, commonTooltipProps, CHART_COLORS } from '../../utils/chartHelpers';

interface ScoreTrendChartProps {
  data: { date: string; score: number }[];
}

export const ScoreTrendChart: React.FC<ScoreTrendChartProps> = ({ data }) => {
  return (
    <ChartCard title="Score Trend" subtitle="Your score progression over time">
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreTrendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.tertiary} stopOpacity={0.3} />
              <stop offset="95%" stopColor={CHART_COLORS.tertiary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis dataKey="date" {...commonAxisProps} />
          <YAxis {...commonAxisProps} domain={[0, 100]} />
          <Tooltip {...commonTooltipProps} formatter={(val: any) => [`${val}%`, 'Score']} />
          <Area
            type="monotone"
            dataKey="score"
            stroke={CHART_COLORS.tertiary}
            strokeWidth={2}
            fill="url(#scoreTrendGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};
