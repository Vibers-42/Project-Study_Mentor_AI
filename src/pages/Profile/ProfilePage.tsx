import React, { useState } from 'react';
import { SectionHeader, LoadingSpinner, ErrorState, Card, Tabs, Button } from '../../components/common';
import {
  SkillProgress, Statistics, RecentInterviews,
  StudyHistory, LearningSummary, AccountOverview, ProfileCompletion, EditableAvatar
} from '../../components/profile';
import { BadgeCard, AchievementCard, AchievementTimeline, UnlockModal, MilestoneCard } from '../../components/gamification';
import { useProfile, useDashboard, useProgress } from '../../hooks';
import { SlideUp, FadeIn, PageTransition, HoverScale, ProgressAnimation } from '../../components/animations';
import { FaTrophy, FaUserShield, FaHistory, FaCheckCircle, FaShareAlt, FaStar } from 'react-icons/fa';

export const ProfilePage: React.FC = () => {
  const { profile, isLoading: pLoading, error: pError } = useProfile();
  const { data: dashboard, isLoading: dLoading } = useDashboard();
  const { progress, isLoading: gLoading } = useProgress();
  const [showUnlock, setShowUnlock] = useState(false);

  if (pLoading || dLoading || gLoading) return <LoadingSpinner size="lg" text="Loading profile..." />;
  if (pError || !profile) return <ErrorState message="Could not load user profile." />;

  const xpPercent = Math.min(Math.round((profile.currentXP / profile.nextLevelXP) * 100), 100);

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <SectionHeader
            title="Learner Profile"
            description="Manage your learning identity, review skill proficiency, and showcase your earned trophies."
            className="mb-0"
          />
          <Button variant="secondary" size="sm" onClick={() => setShowUnlock(true)}>
            <FaShareAlt className="w-3.5 h-3.5 mr-2" /> Share Report Card
          </Button>
        </div>

        {/* Hero Identity & Account Overview Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Identity Desk (8 cols) */}
          <FadeIn delay={0.05} className="lg:col-span-8 h-full">
            <Card className="h-full flex flex-col justify-between bg-gradient-to-br from-neutral-900 via-neutral-900 to-violet-950/20 border-violet-500/20">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                <EditableAvatar name={profile.name} src={profile.avatarUrl} size="xl" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">{profile.name}</h2>
                    <span className="inline-flex items-center self-center sm:self-auto gap-1 px-3 py-0.5 bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-bold rounded-full shadow-sm">
                      <FaStar className="text-violet-400 w-3 h-3" /> Level {profile.level} Master
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 mb-4">{profile.email}</p>
                  
                  {/* XP Level Bar */}
                  <div className="space-y-1.5 w-full bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-neutral-300">Level Progress</span>
                      <span className="text-violet-400">{profile.currentXP.toLocaleString()} / {profile.nextLevelXP.toLocaleString()} XP ({xpPercent}%)</span>
                    </div>
                    <ProgressAnimation value={profile.currentXP} max={profile.nextLevelXP} className="h-2 bg-neutral-800" />
                  </div>
                </div>
              </div>
            </Card>
          </FadeIn>

          {/* Account Details & Setup Card (4 cols) */}
          <FadeIn delay={0.1} className="lg:col-span-4 h-full">
            <AccountOverview name={profile.name} email={profile.email} plan="Pro Hacker" />
          </FadeIn>
        </div>

        {/* Lifetime Learning Summary Row */}
        <SlideUp delay={0.15}>
          <LearningSummary
            totalHours={dashboard?.totalStudyHours || 67}
            totalQuestions={profile.statistics.totalQuestionsAnswered}
            avgAccuracy={profile.statistics.averageScore}
            topicsStudied={4}
          />
        </SlideUp>

        {/* Tabbed Workspace to Eliminate Vertical Visual Clutter */}
        <SlideUp delay={0.2} className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800/80 shadow-inner">
          <Tabs
            tabs={[
              {
                id: 'trophies',
                label: '🏆 Trophy Case & Achievements',
                content: (
                  <div className="space-y-8 pt-4">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <FaTrophy className="text-amber-400" /> Unlocked Badges
                        </h3>
                        <span className="text-xs text-neutral-400 font-medium">Click any achievement to celebrate</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {profile.recentBadges.map((badge, index) => (
                          <HoverScale key={badge.id} scale={1.03}>
                            <BadgeCard badge={badge} />
                          </HoverScale>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-4 border-t border-neutral-800/80">
                      <div className="lg:col-span-7 space-y-4">
                        <h3 className="text-base font-bold text-white mb-2">Achievement Milestone Checklist</h3>
                        <div className="space-y-3">
                          {profile.recentAchievements.map(ach => (
                            <div key={ach.id} onClick={() => ach.isCompleted && setShowUnlock(true)} className={ach.isCompleted ? 'cursor-pointer transition-transform hover:translate-x-1' : 'opacity-70'}>
                              <AchievementCard achievement={ach} />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="lg:col-span-5">
                        {progress && <AchievementTimeline achievements={progress.achievements} />}
                      </div>
                    </div>
                  </div>
                )
              },
              {
                id: 'skills',
                label: '⚡ Skills & Statistics',
                content: (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-4">
                    <div className="lg:col-span-7">
                      <SkillProgress skills={[
                        { topic: 'React & Frontend Architecture', accuracy: 94, questionsAnswered: 48, averageTimePerQuestion: 42 },
                        { topic: 'TypeScript & Type Systems', accuracy: 89, questionsAnswered: 36, averageTimePerQuestion: 45 },
                        { topic: 'JavaScript ES2026', accuracy: 91, questionsAnswered: 60, averageTimePerQuestion: 35 },
                        { topic: 'Node.js & Backend Architecture', accuracy: 82, questionsAnswered: 35, averageTimePerQuestion: 50 },
                        { topic: 'System Design & Scalability', accuracy: 68, questionsAnswered: 24, averageTimePerQuestion: 110 },
                      ]} />
                    </div>
                    <div className="lg:col-span-5">
                      <Statistics stats={profile.statistics} />
                    </div>
                  </div>
                )
              },
              {
                id: 'history',
                label: '📋 Activity Log & Setup',
                content: (
                  <div className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                      {dashboard && <StudyHistory sessions={dashboard.studySessions} />}
                      <RecentInterviews interviews={profile.recentInterviews} />
                    </div>
                    <div className="max-w-2xl mx-auto">
                      <ProfileCompletion completedFields={7} totalFields={10} />
                    </div>
                  </div>
                )
              }
            ]}
          />
        </SlideUp>

        {/* Celebration Modal (Fires on button click or achievement click) */}
        <UnlockModal
          isOpen={showUnlock}
          onClose={() => setShowUnlock(false)}
          title="Century Master"
          description="You successfully surpassed 100 answered interview questions with over 90% accuracy!"
          rewardXP={500}
        />
      </div>
    </PageTransition>
  );
};
