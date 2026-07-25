import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ChartCard } from '../../shared/ui/ChartCard';
import { commonTooltipProps, CHART_COLORS } from '../../utils/chartHelpers';

interface DifficultyDistributionChartProps {
  data: { difficulty: string; percentage: number }[];
}

const COLORS = [CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.danger];

export const DifficultyDistributionChart: React.FC<DifficultyDistributionChartProps> = ({ data }) => {
  return (
    <ChartCard title="Difficulty Distribution" subtitle="Breakdown by difficulty level">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            dataKey="percentage"
            nameKey="difficulty"
            strokeWidth={0}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip {...commonTooltipProps} formatter={(val: any) => [`${val}%`, undefined]} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px', color: CHART_COLORS.text }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};
