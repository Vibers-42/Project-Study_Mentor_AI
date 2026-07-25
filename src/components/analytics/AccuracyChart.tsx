import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card } from '../common/Card';
import { CHART_COLORS } from '../../utils';

interface AccuracyChartProps {
  accuracy: number;
}

export const AccuracyChart: React.FC<AccuracyChartProps> = ({ accuracy }) => {
  const data = [
    { name: 'Correct', value: accuracy },
    { name: 'Incorrect', value: 100 - accuracy }
  ];

  const COLORS = [CHART_COLORS.success, CHART_COLORS.grid];

  return (
    <Card className="flex flex-col items-center justify-center h-full">
      <h3 className="text-sm text-neutral-400 mb-2 w-full text-left">Overall Accuracy</h3>
      <div className="w-full h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [`${value}%`, undefined]}
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-3xl font-bold text-neutral-100">{accuracy}%</span>
        </div>
      </div>
    </Card>
  );
};
