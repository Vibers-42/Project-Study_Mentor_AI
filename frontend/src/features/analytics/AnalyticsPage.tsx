import React from 'react';
import { useAnalytics, useDashboard } from '../../hooks';
import { SectionHeader, LoadingSpinner, ErrorState, Tabs } from '../../shared/ui';
import {
  AccuracyChart, TopicRadarChart, WeeklyProgressChart, InterviewHistoryTable,
  StrongTopicsCard, WeakTopicsCard, ScoreCard,
  MonthlyTrendChart, DifficultyDistributionChart, ScoreTrendChart,
  LearningVelocityChart, CompletionRateCard, AnalyticsSummaryCards, TopicComparisonChart,
  StudyConsistencyChart
} from './';
import { SlideUp, PageTransition } from '../../shared/animations';

export const AnalyticsPage: React.FC = () => {
  const { data: analytics, isLoading: aLoading, error: aError } = useAnalytics();
  const { data: dashboard, isLoading: dLoading, error: dError } = useDashboard();

  if (aLoading || dLoading) return <LoadingSpinner size="lg" text="Analyzing performance..." />;
  if (aError || dError || !analytics || !dashboard) return <ErrorState message="Could not load analytics data." />;

  const allTopics = [...analytics.strongTopics, ...analytics.weakTopics];
  const scoreTrendData = dashboard.performanceTimeline.map(e => ({ date: e.date.slice(5), score: e.score }));

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-8 pb-14">
        <SectionHeader
          title="Analytics Hub"
          description="Comprehensive performance metrics, velocity tracking, and subject mastery breakdown."
          className="mb-0"
        />

        {/* Primary Executive Summary Cards (Row 1) */}
        <SlideUp delay={0.05}>
          <AnalyticsSummaryCards
            averageScore={analytics.averageScore}
            overallAccuracy={analytics.overallAccuracy}
            totalStudyHours={dashboard.totalStudyHours}
            learningVelocity={dashboard.learningVelocity}
          />
        </SlideUp>

        {/* Core Efficiency KPIs (Row 2: 3 Equal Height Columns, 320px uniform geometry) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <SlideUp delay={0.1} className="h-full">
            <ScoreCard score={analytics.averageScore} label="Score Mastery Analysis" />
          </SlideUp>
          <SlideUp delay={0.15} className="h-full">
            <AccuracyChart accuracy={analytics.overallAccuracy} />
          </SlideUp>
          <SlideUp delay={0.2} className="h-full">
            <CompletionRateCard rate={dashboard.completionRate} />
          </SlideUp>
        </div>

        {/* Interactive Analytical Explorer (Tabs to eliminate visual noise & vertical clutter) */}
        <SlideUp delay={0.25} className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800/80 shadow-inner">
          <div className="mb-2">
            <h3 className="text-base font-bold text-white mb-1">Deep Dive Explorer</h3>
            <p className="text-xs text-neutral-400">Select a perspective to inspect your trajectory, annual consistency, and topic proficiency.</p>
          </div>
          <Tabs
            className="mt-6"
            tabs={[
              {
                id: 'performance',
                label: '🚀 Velocity & Consistency',
                content: (
                  <div className="space-y-6 pt-2">
                    <StudyConsistencyChart data={dashboard.calendar} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <WeeklyProgressChart data={analytics.weeklyProgress} />
                      <LearningVelocityChart data={analytics.weeklyProgress.map(d => ({ day: d.day, questions: d.questions }))} />
                    </div>
                    <ScoreTrendChart data={scoreTrendData} />
                  </div>
                )
              },
              {
                id: 'topics',
                label: '🎯 Topic Mastery & Breakdown',
                content: (
                  <div className="space-y-6 pt-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <TopicRadarChart data={allTopics.slice(0, 5)} />
                      <TopicComparisonChart data={allTopics} />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <StrongTopicsCard topics={analytics.strongTopics} />
                      <WeakTopicsCard topics={analytics.weakTopics} />
                    </div>
                  </div>
                )
              },
              {
                id: 'trends',
                label: '📈 Long-term Trends & Difficulty',
                content: (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                    <MonthlyTrendChart data={dashboard.monthlyStats} />
                    <DifficultyDistributionChart data={analytics.difficultyDistribution} />
                  </div>
                )
              }
            ]}
          />
        </SlideUp>

        {/* Detailed Interview History Audit Table */}
        <SlideUp delay={0.35}>
          <InterviewHistoryTable history={analytics.interviewHistory} />
        </SlideUp>
      </div>
    </PageTransition>
  );
};
