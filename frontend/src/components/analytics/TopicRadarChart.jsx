import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import Card from '../layout/Card';
import { CHART_COLORS, commonTooltipProps } from '../../utils/chartHelpers';

const TopicRadarChart = ({ data = [] }) => {
  return (
    <Card className="p-5 flex flex-col border-slate-200/80 dark:border-slate-800">
      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Topic Mastery Radar</h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">Subject proficiency breakdown</p>

      <div className="w-full h-52">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="68%" data={data}>
            <PolarGrid stroke={CHART_COLORS.grid} />
            <PolarAngleAxis dataKey="topic" tick={{ fill: CHART_COLORS.text, fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip {...commonTooltipProps} formatter={(val) => [`${val}%`, 'Accuracy']} />
            <Radar
              name="Accuracy"
              dataKey="accuracy"
              stroke={CHART_COLORS.secondary}
              fill={CHART_COLORS.secondary}
              fillOpacity={0.35}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TopicRadarChart;
