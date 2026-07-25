import React from 'react';
import { useAnalytics } from '../../hooks';
import { SectionHeader, LoadingSpinner, ErrorState } from '../../components/common';
import { 
  AccuracyChart, 
  TopicRadarChart, 
  WeeklyProgressChart, 
  InterviewHistoryTable,
  StrongTopicsCard,
  WeakTopicsCard,
  ScoreCard
} from '../../components/analytics';
import { SlideUp } from '../../components/animations';

export const AnalyticsPage: React.FC = () => {
  const { data: analytics, isLoading, error } = useAnalytics();

  if (isLoading) return <LoadingSpinner size="lg" text="Analyzing performance..." />;
  if (error || !analytics) return <ErrorState message="Could not load analytics data." />;

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Deep Analytics" 
        description="Detailed breakdown of your study and interview performance."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SlideUp delay={0.1} className="md:col-span-1">
          <ScoreCard score={analytics.averageScore} label="Overall Average Score" />
        </SlideUp>
        <SlideUp delay={0.2} className="md:col-span-1">
          <AccuracyChart accuracy={analytics.overallAccuracy} />
        </SlideUp>
        <SlideUp delay={0.3} className="md:col-span-1">
          <TopicRadarChart data={[...analytics.strongTopics, ...analytics.weakTopics].slice(0, 5)} />
        </SlideUp>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SlideUp delay={0.4}>
          <StrongTopicsCard topics={analytics.strongTopics} />
        </SlideUp>
        <SlideUp delay={0.5}>
          <WeakTopicsCard topics={analytics.weakTopics} />
        </SlideUp>
      </div>

      <SlideUp delay={0.6}>
        <WeeklyProgressChart data={analytics.weeklyProgress} />
      </SlideUp>

      <SlideUp delay={0.7}>
        <InterviewHistoryTable history={analytics.interviewHistory} />
      </SlideUp>
    </div>
  );
};
