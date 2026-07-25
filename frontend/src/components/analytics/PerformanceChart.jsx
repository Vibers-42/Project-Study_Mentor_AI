import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import Card from '../layout/Card';
import { CHART_COLORS, commonAxisProps, commonTooltipProps } from '../../utils/chartHelpers';

const PerformanceChart = ({ data = [] }) => {
  return (
    <Card className="p-5 border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Performance Trend</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">Interview score progression over time</p>
        </div>
        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-md">
          📈 Upward Trend
        </span>
      </div>

      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.4} />
                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis dataKey="date" {...commonAxisProps} />
            <YAxis {...commonAxisProps} domain={[0, 100]} />
            <Tooltip {...commonTooltipProps} formatter={(val) => [`${val}%`, 'Score']} />
            <Area
              type="monotone"
              dataKey="score"
              stroke={CHART_COLORS.primary}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#scoreGlow)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default PerformanceChart;
