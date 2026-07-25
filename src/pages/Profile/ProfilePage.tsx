import React, { useState, useEffect } from 'react';
import { SectionHeader, LoadingSpinner, ErrorState } from '../../components/common';
import { ProfileCard, SkillProgress, Statistics, RecentInterviews } from '../../components/profile';
import { BadgeCard, AchievementCard } from '../../components/gamification';
import { getUserProfile } from '../../services/profile.service';
import { UserProfile } from '../../types';
import { SlideUp, FadeIn } from '../../components/animations';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load profile'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner size="lg" text="Loading profile..." />;
  if (error || !profile) return <ErrorState message="Could not load user profile." />;

  return (
    <div className="space-y-6">
      <SectionHeader title="My Profile" />

      <FadeIn delay={0.1}>
        <ProfileCard profile={profile} />
      </FadeIn>

      <SlideUp delay={0.2}>
        <Statistics stats={profile.statistics} />
      </SlideUp>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SlideUp delay={0.3}>
          <SkillProgress skills={[
            { topic: 'React', accuracy: 92, questionsAnswered: 45, averageTimePerQuestion: 45 },
            { topic: 'JavaScript', accuracy: 88, questionsAnswered: 60, averageTimePerQuestion: 40 },
            { topic: 'System Design', accuracy: 54, questionsAnswered: 24, averageTimePerQuestion: 120 }
          ]} />
        </SlideUp>
        <SlideUp delay={0.4}>
          <RecentInterviews interviews={profile.recentInterviews} />
        </SlideUp>
      </div>

      <SectionHeader title="Badges Earned" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {profile.recentBadges.map((badge, index) => (
          <SlideUp key={badge.id} delay={0.1 * index}>
            <BadgeCard badge={badge} />
          </SlideUp>
        ))}
      </div>

      <SectionHeader title="Achievements" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profile.recentAchievements.map((ach, index) => (
          <SlideUp key={ach.id} delay={0.1 * index}>
            <AchievementCard achievement={ach} />
          </SlideUp>
        ))}
      </div>
    </div>
  );
};
