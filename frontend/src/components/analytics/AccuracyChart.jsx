import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import Card from '../layout/Card';
import { CHART_COLORS } from '../../utils/chartHelpers';

const AccuracyChart = ({ accuracy = 84 }) => {
  const data = [
    { name: 'Correct', value: accuracy },
    { name: 'Incorrect', value: 100 - accuracy },
  ];

  const COLORS = [CHART_COLORS.success, 'rgba(239, 68, 68, 0.2)'];

  return (
    <Card className="p-5 flex flex-col items-center justify-center border-slate-200/80 dark:border-slate-800">
      <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-2">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Overall Accuracy</h3>
        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Target: 80%+</span>
      </div>

      <div className="w-full h-44 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(val) => [`${val}%`, undefined]}
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">{accuracy}%</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Accuracy</span>
        </div>
      </div>
    </Card>
  );
};

export default AccuracyChart;
