import React from 'react';
import { useAnalytics } from '../../hooks';
import { useProgress } from '../../hooks';
import { 
  SectionHeader, 
  LoadingSpinner, 
  ErrorState 
} from '../../components/common';
import { 
  StatsCard, 
  RecentActivity, 
  WeakTopicsCard,
  PerformanceChart
} from '../../components/analytics';
import { 
  XPCard, 
  StreakCounter, 
  LevelProgress 
} from '../../components/gamification';
import { FaCheckCircle, FaStar, FaBullseye } from 'react-icons/fa';
import { SlideUp, FadeIn } from '../../components/animations';

export const Dashboard: React.FC = () => {
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useAnalytics();
  const { progress, isLoading: progressLoading, error: progressError } = useProgress();

  if (analyticsLoading || progressLoading) return <LoadingSpinner size="lg" text="Loading your dashboard..." />;
  if (analyticsError || progressError || !analytics || !progress) {
    return <ErrorState message="Could not load dashboard data." />;
  }

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Welcome back!" 
        description="Here is your learning progress for today."
      />

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FadeIn delay={0.1}>
          <XPCard currentXP={progress.currentXP} xpGainedToday={150} />
        </FadeIn>
        <FadeIn delay={0.2}>
          <StreakCounter streak={progress.dailyStreak} />
        </FadeIn>
        <FadeIn delay={0.3}>
          <StatsCard 
            title="Avg Score" 
            value={`${analytics.averageScore}%`} 
            icon={FaStar} 
            trend={{ value: 5, isPositive: true }} 
          />
        </FadeIn>
        <FadeIn delay={0.4}>
          <StatsCard 
            title="Accuracy" 
            value={`${analytics.overallAccuracy}%`} 
            icon={FaBullseye} 
            trend={{ value: 2, isPositive: true }} 
          />
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <SlideUp delay={0.5} className="lg:col-span-2 space-y-6">
          <LevelProgress 
            level={progress.level} 
            currentXP={progress.currentXP} 
            nextLevelXP={progress.nextLevelXP} 
          />
          <PerformanceChart data={analytics.weeklyProgress.map(d => ({ date: d.day, score: d.score }))} />
        </SlideUp>

        {/* Sidebar Widgets */}
        <SlideUp delay={0.6} className="space-y-6">
          <WeakTopicsCard topics={analytics.weakTopics} />
          <RecentActivity activities={analytics.interviewHistory} />
        </SlideUp>
      </div>
    </div>
  );
};
