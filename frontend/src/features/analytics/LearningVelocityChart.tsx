import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartCard } from '../../shared/ui/ChartCard';
import { commonAxisProps, commonTooltipProps, CHART_COLORS } from '../../utils/chartHelpers';

interface LearningVelocityChartProps {
  data: { day: string; questions: number }[];
}

export const LearningVelocityChart: React.FC<LearningVelocityChartProps> = ({ data }) => {
  return (
    <ChartCard title="Learning Velocity" subtitle="Questions answered per day">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis dataKey="day" {...commonAxisProps} />
          <YAxis {...commonAxisProps} />
          <Tooltip {...commonTooltipProps} formatter={(val: any) => [val, 'Questions']} />
          <Line
            type="monotone"
            dataKey="questions"
            stroke={CHART_COLORS.secondary}
            strokeWidth={2}
            dot={{ r: 3, fill: CHART_COLORS.secondary, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};
