import React from 'react';
import { Card } from '../common/Card';
import { UserStatistics } from '../../types';
import { FaChartBar, FaCheckCircle, FaStar, FaTrophy, FaExclamationTriangle } from 'react-icons/fa';

interface StatisticsProps {
  stats: UserStatistics;
}

export const Statistics: React.FC<StatisticsProps> = ({ stats }) => {
  const statItems = [
    { label: 'Interviews', value: stats.interviewsCompleted, icon: FaChartBar, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Questions', value: stats.totalQuestionsAnswered, icon: FaCheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Avg Score', value: `${stats.averageScore}%`, icon: FaStar, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Best Topic', value: stats.bestTopic, icon: FaTrophy, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { label: 'Weak Topic', value: stats.weakTopic, icon: FaExclamationTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <Card>
      <h3 className="font-semibold text-neutral-200 mb-4">Overall Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statItems.map((item, index) => (
          <div key={index} className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg flex flex-col items-center text-center">
            <div className={`p-3 rounded-full ${item.bg} ${item.color} mb-3`}>
              <item.icon className="w-5 h-5" />
            </div>
            <p className="text-xs text-neutral-400 mb-1">{item.label}</p>
            <p className="text-lg font-bold text-neutral-200 line-clamp-1 w-full" title={item.value.toString()}>{item.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
