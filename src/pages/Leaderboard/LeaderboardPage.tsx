import React from 'react';
import { useLeaderboard } from '../../hooks';
import { SectionHeader, LoadingSpinner, ErrorState, Card } from '../../components/common';
import { Leaderboard } from '../../components/gamification';
import { SlideUp, FadeIn } from '../../components/animations';

export const LeaderboardPage: React.FC = () => {
  const { data, isLoading, error } = useLeaderboard();

  if (isLoading) return <LoadingSpinner size="lg" text="Loading leaderboard..." />;
  if (error || !data) return <ErrorState message="Could not load leaderboard." />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SectionHeader 
        title="Global Leaderboard" 
        description="See how you stack up against other learners."
      />

      {data.currentUserRank && (
        <FadeIn delay={0.1}>
          <Card className="bg-violet-900/20 border-violet-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-violet-300 font-medium mb-1">Your Current Rank</p>
                <div className="text-3xl font-bold text-white flex items-baseline gap-2">
                  #{data.currentUserRank.rank}
                  <span className="text-sm font-normal text-neutral-400 ml-2">Top {Math.round(data.currentUserRank.rank / 100 * 100)}%</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-neutral-400">Total XP</p>
                <p className="text-xl font-bold text-violet-400">{data.currentUserRank.xp}</p>
              </div>
            </div>
          </Card>
        </FadeIn>
      )}

      <SlideUp delay={0.2}>
        <Leaderboard users={data.topUsers} />
      </SlideUp>
    </div>
  );
};
