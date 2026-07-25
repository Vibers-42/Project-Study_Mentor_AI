import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartCard } from '../common/ChartCard';
import { commonAxisProps, commonTooltipProps, CHART_COLORS } from '../../utils/chartHelpers';
import { TopicPerformance } from '../../types';

interface TopicComparisonChartProps {
  data: TopicPerformance[];
}

export const TopicComparisonChart: React.FC<TopicComparisonChartProps> = ({ data }) => {
  const chartData = data.map(d => ({
    topic: d.topic,
    accuracy: d.accuracy,
    questions: d.questionsAnswered,
  }));

  return (
    <ChartCard title="Topic Comparison" subtitle="Accuracy vs questions answered per topic">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis dataKey="topic" {...commonAxisProps} />
          <YAxis {...commonAxisProps} />
          <Tooltip {...commonTooltipProps} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', color: CHART_COLORS.text }} />
          <Bar dataKey="accuracy" fill={CHART_COLORS.primary} name="Accuracy %" radius={[4, 4, 0, 0]} barSize={20} />
          <Bar dataKey="questions" fill={CHART_COLORS.tertiary} name="Questions" radius={[4, 4, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};
