import React from 'react';
import { Link } from 'react-router-dom';
import { useAnalytics, useDashboard, useProgress } from '../../hooks';
import { SectionHeader, LoadingSpinner, ErrorState, Card } from '../../shared/ui';
import {
  StatsCard, RecentActivity, WeakTopicsCard, PerformanceChart,
  GoalProgressCard, StudyConsistencyChart
} from '../analytics';
import { XPCard, StreakCounter, LevelProgress } from '../gamification';
import { FaStar, FaBullseye, FaPlay, FaExclamationTriangle, FaTrophy, FaArrowRight } from 'react-icons/fa';
import { SlideUp, FadeIn, PageTransition, HoverScale } from '../../shared/animations';

export const Dashboard: React.FC = () => {
  const { data: analytics, isLoading: aLoading, error: aError } = useAnalytics();
  const { data: dashboard, isLoading: dLoading, error: dError } = useDashboard();
  const { progress, isLoading: pLoading, error: pError } = useProgress();

  if (aLoading || dLoading || pLoading) return <LoadingSpinner size="lg" text="Loading your dashboard..." />;
  if (aError || dError || pError || !analytics || !dashboard || !progress) {
    return <ErrorState message="Could not load dashboard data." />;
  }

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-8 pb-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <SectionHeader
            title="Dashboard"
            description="Your daily learning command center and performance pulse."
            className="mb-0"
          />
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AI Mentor Active
            </span>
          </div>
        </div>

        {/* Row 1: Top KPI Metrics Row (Harmonized Heights & Layouts) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          <FadeIn delay={0.05} className="h-full"><XPCard currentXP={progress.currentXP} xpGainedToday={150} /></FadeIn>
          <FadeIn delay={0.1} className="h-full"><StreakCounter streak={progress.dailyStreak} /></FadeIn>
          <FadeIn delay={0.15} className="h-full">
            <StatsCard title="Avg Score" value={`${analytics.averageScore}%`} icon={FaStar} trend={{ value: 5, isPositive: true }} />
          </FadeIn>
          <FadeIn delay={0.2} className="h-full">
            <StatsCard title="Accuracy" value={`${analytics.overallAccuracy}%`} icon={FaBullseye} trend={{ value: 2, isPositive: true }} />
          </FadeIn>
        </div>

        {/* Row 2: Full-Width LeetCode & GitHub Style Annual Study Consistency Grid */}
        <SlideUp delay={0.25}>
          <StudyConsistencyChart data={dashboard.calendar} />
        </SlideUp>

        {/* Row 3: Main 12-Column Balanced Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Primary Performance Trajectory & Activity Audit (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <SlideUp delay={0.3}>
              <PerformanceChart data={analytics.weeklyProgress.map(d => ({ date: d.day, score: d.score }))} />
            </SlideUp>

            <SlideUp delay={0.35}>
              <RecentActivity activities={analytics.interviewHistory.slice(0, 5)} />
            </SlideUp>
          </div>

          {/* Right Column: Gamification Command Deck & Actionable Practice (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <SlideUp delay={0.3}>
              <LevelProgress level={progress.level} currentXP={progress.currentXP} nextLevelXP={progress.nextLevelXP} />
            </SlideUp>

            {/* Compact Quick Actions Box */}
            <SlideUp delay={0.35}>
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-neutral-100">Quick Actions</h3>
                  <span className="text-[10px] bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded font-mono font-bold">READY</span>
                </div>
                <div className="space-y-2.5">
                  {dashboard.quickActions.map(action => (
                    <HoverScale key={action.id} scale={1.015}>
                      <Link to={action.href} className="w-full flex items-center gap-3 p-3 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-800 hover:border-violet-500/40 transition-all group text-left cursor-pointer no-underline">
                        <div className={`w-9 h-9 rounded-xl bg-${action.color}-500/15 border border-${action.color}-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                          {action.iconName === 'FaPlay' && <FaPlay className={`w-3.5 h-3.5 text-${action.color}-400`} />}
                          {action.iconName === 'FaExclamationTriangle' && <FaExclamationTriangle className={`w-3.5 h-3.5 text-${action.color}-400`} />}
                          {action.iconName === 'FaTrophy' && <FaTrophy className={`w-3.5 h-3.5 text-${action.color}-400`} />}
                          {action.iconName === 'FaBullseye' && <FaBullseye className={`w-3.5 h-3.5 text-${action.color}-400`} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-neutral-200 group-hover:text-white transition-colors truncate">{action.label}</p>
                          <p className="text-[11px] text-neutral-400 truncate">{action.description}</p>
                        </div>
                        <FaArrowRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-violet-400 transition-colors shrink-0" />
                      </Link>
                    </HoverScale>
                  ))}
                </div>
              </Card>
            </SlideUp>

            <SlideUp delay={0.4}>
              <GoalProgressCard goals={dashboard.goals} />
            </SlideUp>

            <SlideUp delay={0.45}>
              <WeakTopicsCard topics={analytics.weakTopics} />
            </SlideUp>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
