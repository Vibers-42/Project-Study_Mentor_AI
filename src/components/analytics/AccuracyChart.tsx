import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card } from '../common/Card';
import { CHART_COLORS } from '../../utils';
import { FaBullseye } from 'react-icons/fa';

interface AccuracyChartProps {
  accuracy: number;
}

export const AccuracyChart: React.FC<AccuracyChartProps> = ({ accuracy }) => {
  const incorrect = 100 - accuracy;
  const data = [
    { name: 'Correct Answers', value: accuracy },
    { name: 'Incorrect / Revise', value: incorrect }
  ];

  const COLORS = [CHART_COLORS.success, '#334155'];

  return (
    <Card className="min-h-[320px] h-full flex flex-col justify-between p-6 bg-neutral-900 border-neutral-800/80">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-neutral-100">Answer Accuracy</h3>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <FaBullseye /> Precise
          </span>
        </div>
        <p className="text-xs text-neutral-400">Ratio of correct responses to attempted interview prompts</p>
      </div>

      <div className="w-full h-44 relative my-auto">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={76}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
              paddingAngle={4}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="transition-all duration-300 hover:opacity-80 cursor-pointer" />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [`${value}%`, undefined]}
              contentStyle={{ backgroundColor: '#090d16', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '12px', padding: '6px 12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
          <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">{accuracy}%</span>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400 mt-0.5">Correct</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800/80 text-center">
        <div className="bg-neutral-800/50 p-2 rounded-lg border border-neutral-800">
          <p className="text-lg font-bold text-emerald-400">{accuracy}%</p>
          <p className="text-[11px] text-neutral-400 font-medium">Valid Responses</p>
        </div>
        <div className="bg-neutral-800/50 p-2 rounded-lg border border-neutral-800">
          <p className="text-lg font-bold text-slate-400">{incorrect}%</p>
          <p className="text-[11px] text-neutral-400 font-medium">Needs Revision</p>
        </div>
      </div>
    </Card>
  );
};
