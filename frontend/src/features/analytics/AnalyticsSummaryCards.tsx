import React from 'react';
import { StatCard } from '../../shared/ui/StatCard';
import { FaChartLine, FaBullseye, FaClock, FaRocket } from 'react-icons/fa';

interface AnalyticsSummaryCardsProps {
  averageScore: number;
  overallAccuracy: number;
  totalStudyHours: number;
  learningVelocity: number;
}

export const AnalyticsSummaryCards: React.FC<AnalyticsSummaryCardsProps> = ({
  averageScore,
  overallAccuracy,
  totalStudyHours,
  learningVelocity,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Average Score"
        value={averageScore}
        suffix="%"
        icon={<FaChartLine className="w-5 h-5" />}
        trend={{ value: 5, isPositive: true }}
        iconBg="bg-violet-500/10"
        iconColor="text-violet-400"
      />
      <StatCard
        title="Accuracy"
        value={overallAccuracy}
        suffix="%"
        icon={<FaBullseye className="w-5 h-5" />}
        trend={{ value: 3, isPositive: true }}
        iconBg="bg-emerald-500/10"
        iconColor="text-emerald-400"
      />
      <StatCard
        title="Study Hours"
        value={totalStudyHours}
        suffix="h"
        icon={<FaClock className="w-5 h-5" />}
        trend={{ value: 12, isPositive: true }}
        iconBg="bg-sky-500/10"
        iconColor="text-sky-400"
      />
      <StatCard
        title="Daily Questions"
        value={Math.round(learningVelocity)}
        suffix="/day"
        icon={<FaRocket className="w-5 h-5" />}
        trend={{ value: 8, isPositive: true }}
        iconBg="bg-amber-500/10"
        iconColor="text-amber-400"
      />
    </div>
  );
};
