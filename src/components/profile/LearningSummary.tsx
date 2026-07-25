import React from 'react';
import { StatCard } from '../common/StatCard';
import { FaBook, FaClock, FaChartLine, FaCheckCircle } from 'react-icons/fa';

interface LearningSummaryProps {
  totalHours: number;
  totalQuestions: number;
  avgAccuracy: number;
  topicsStudied: number;
}

export const LearningSummary: React.FC<LearningSummaryProps> = ({
  totalHours,
  totalQuestions,
  avgAccuracy,
  topicsStudied,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Study Hours"
        value={totalHours}
        suffix="h"
        icon={<FaClock className="w-4 h-4" />}
        iconBg="bg-sky-500/10"
        iconColor="text-sky-400"
      />
      <StatCard
        title="Questions"
        value={totalQuestions}
        icon={<FaCheckCircle className="w-4 h-4" />}
        iconBg="bg-emerald-500/10"
        iconColor="text-emerald-400"
      />
      <StatCard
        title="Accuracy"
        value={avgAccuracy}
        suffix="%"
        icon={<FaChartLine className="w-4 h-4" />}
        iconBg="bg-violet-500/10"
        iconColor="text-violet-400"
      />
      <StatCard
        title="Topics"
        value={topicsStudied}
        icon={<FaBook className="w-4 h-4" />}
        iconBg="bg-amber-500/10"
        iconColor="text-amber-400"
      />
    </div>
  );
};
