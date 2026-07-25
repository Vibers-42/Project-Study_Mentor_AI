import React from 'react';
import { useLeaderboard } from '../../hooks';
import { SectionHeader, LoadingSpinner, ErrorState, Card, Tabs, Avatar } from '../../shared/ui';
import {
  Leaderboard, RankCard, WeeklyRanking, MonthlyRanking, XPRanking, AchievementRanking
} from './';
import { SlideUp, FadeIn, PageTransition, HoverScale } from '../../shared/animations';
import { FaCrown, FaFire } from 'react-icons/fa';

export const LeaderboardPage: React.FC = () => {
  const { data, isLoading, error } = useLeaderboard();

  if (isLoading) return <LoadingSpinner size="lg" text="Loading leaderboard..." />;
  if (error || !data) return <ErrorState message="Could not load leaderboard." />;

  // Arrange top 3 for traditional podium order: [2nd, 1st, 3rd]
  const top1 = data.topUsers[0];
  const top2 = data.topUsers[1];
  const top3 = data.topUsers[2];

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        <SectionHeader
          title="Global Leaderboard"
          description="Compete with peers worldwide, earn XP, and secure your place among elite learners."
          className="mb-0"
        />

        {/* Current User Personal Rank Strip */}
        {data.currentUserRank && (
          <FadeIn delay={0.1}>
            <RankCard
              rank={data.currentUserRank.rank}
              name={data.currentUserRank.name}
              xp={data.currentUserRank.xp}
              previousRank={7}
            />
          </FadeIn>
        )}

        {/* Top 3 Champions Podium Deck */}
        {top1 && top2 && top3 && (
          <SlideUp delay={0.15} className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              
              {/* 2nd Place */}
              <HoverScale scale={1.02} className="w-full order-2 sm:order-1">
                <Card className="bg-gradient-to-t from-neutral-900 via-neutral-900 to-neutral-800/80 border-neutral-700/60 text-center relative pt-8 pb-6 flex flex-col items-center">
                  <span className="text-2xl absolute top-3 right-3">🥈</span>
                  <Avatar name={top2.name} src={top2.avatarUrl} size="lg" className="ring-2 ring-slate-400 mb-3" />
                  <p className="text-base font-bold text-white truncate w-full px-2">{top2.name}</p>
                  <p className="text-xs text-slate-400 mb-2">Rank #2 • Level {top2.level}</p>
                  <span className="px-3 py-1 bg-neutral-800 rounded-full font-bold text-sm text-slate-300 border border-neutral-700">
                    {top2.xp.toLocaleString()} XP
                  </span>
                  <p className="text-[11px] text-neutral-500 mt-2.5 flex items-center justify-center gap-1">
                    <FaFire className="text-amber-500" /> {top2.streak} day streak
                  </p>
                </Card>
              </HoverScale>

              {/* 1st Place (Elevated Center Champion) */}
              <HoverScale scale={1.03} className="w-full order-1 sm:order-2 z-10 sm:-my-4">
                <Card className="bg-gradient-to-t from-violet-950/40 via-neutral-900 to-amber-950/30 border-amber-500/50 text-center relative pt-10 pb-8 flex flex-col items-center shadow-xl shadow-amber-500/10">
                  <div className="absolute -top-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 px-3 py-0.5 rounded-full text-[11px] font-extrabold tracking-wider uppercase shadow-md flex items-center gap-1">
                    <FaCrown className="w-3 h-3" /> Champion
                  </div>
                  <span className="text-3xl absolute top-3 right-3">🥇</span>
                  <Avatar name={top1.name} src={top1.avatarUrl} size="xl" className="ring-4 ring-amber-400/80 mb-3 shadow-lg" />
                  <p className="text-lg font-extrabold text-white truncate w-full px-2">{top1.name}</p>
                  <p className="text-xs text-amber-300 font-medium mb-3">Rank #1 • Level {top1.level} Master</p>
                  <span className="px-4 py-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-full font-bold text-base text-amber-300 border border-amber-500/30 shadow-sm">
                    {top1.xp.toLocaleString()} XP
                  </span>
                  <p className="text-xs text-neutral-400 mt-3 flex items-center justify-center gap-1">
                    <FaFire className="text-amber-500 w-3.5 h-3.5" /> {top1.streak} day streak
                  </p>
                </Card>
              </HoverScale>

              {/* 3rd Place */}
              <HoverScale scale={1.02} className="w-full order-3">
                <Card className="bg-gradient-to-t from-neutral-900 via-neutral-900 to-orange-950/20 border-orange-700/40 text-center relative pt-8 pb-6 flex flex-col items-center">
                  <span className="text-2xl absolute top-3 right-3">🥉</span>
                  <Avatar name={top3.name} src={top3.avatarUrl} size="lg" className="ring-2 ring-amber-700/80 mb-3" />
                  <p className="text-base font-bold text-white truncate w-full px-2">{top3.name}</p>
                  <p className="text-xs text-orange-400/80 mb-2">Rank #3 • Level {top3.level}</p>
                  <span className="px-3 py-1 bg-neutral-800 rounded-full font-bold text-sm text-orange-300 border border-neutral-700">
                    {top3.xp.toLocaleString()} XP
                  </span>
                  <p className="text-[11px] text-neutral-500 mt-2.5 flex items-center justify-center gap-1">
                    <FaFire className="text-amber-500" /> {top3.streak} day streak
                  </p>
                </Card>
              </HoverScale>

            </div>
          </SlideUp>
        )}

        {/* Multi-Dimensional Leaderboard Tables */}
        <SlideUp delay={0.25} className="pt-4">
          <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800/80 shadow-inner">
            <Tabs
              tabs={[
                { id: 'overall', label: '🏆 Overall Standings', content: <div className="pt-4"><Leaderboard users={data.topUsers} /></div> },
                { id: 'weekly', label: '⚡ Weekly Sprint', content: <div className="pt-4"><WeeklyRanking users={data.topUsers} /></div> },
                { id: 'monthly', label: '📅 Monthly Marathon', content: <div className="pt-4"><MonthlyRanking users={data.topUsers} /></div> },
                { id: 'xp', label: '⭐ XP Gainers', content: <div className="pt-4"><XPRanking users={data.topUsers} /></div> },
                { id: 'achievement', label: '🎯 Badges & Titles', content: <div className="pt-4"><AchievementRanking users={data.topUsers} /></div> },
              ]}
            />
          </div>
        </SlideUp>
      </div>
    </PageTransition>
  );
};
