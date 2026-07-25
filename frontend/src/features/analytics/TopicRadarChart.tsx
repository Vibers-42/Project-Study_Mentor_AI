import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { Card } from '../../shared/ui/Card';
import { CHART_COLORS, commonTooltipProps } from '../../utils';
import { TopicPerformance } from '../../types';

interface TopicRadarChartProps {
  data: TopicPerformance[];
}

export const TopicRadarChart: React.FC<TopicRadarChartProps> = ({ data }) => {
  return (
    <Card className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-neutral-100 mb-1">Topic Mastery</h3>
      <p className="text-sm text-neutral-400 mb-4">Relative strengths across subjects</p>
      
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke={CHART_COLORS.grid} />
            <PolarAngleAxis dataKey="topic" tick={{ fill: CHART_COLORS.text, fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip {...commonTooltipProps} formatter={(val: any) => [`${val}%`, 'Accuracy']} />
            <Radar 
              name="Accuracy" 
              dataKey="accuracy" 
              stroke={CHART_COLORS.tertiary} 
              fill={CHART_COLORS.tertiary} 
              fillOpacity={0.4} 
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
