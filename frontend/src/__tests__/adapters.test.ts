import { describe, it, expect } from 'vitest';
import {
  adaptProgressData,
  adaptAnalyticsData,
  adaptDashboardData,
  adaptLeaderboardData,
  BackendProgressStats,
  BackendUserPayload,
  BackendLeaderboardRow,
  BackendMyRank,
} from '../services/adapters';
import type { GamificationProgress, AnalyticsData, DashboardData, LeaderboardData } from '../types';

// ── Shared test fixtures ──────────────────────────────────────

const mockBackendStats: BackendProgressStats = {
  total_sessions: 12,
  average_score: 8.25,       // 0-10 scale (backend)
  total_questions: 140,
  total_study_minutes: 360,
  streak: 5,
  topics_studied: ['React Hooks', 'State Management', 'TypeScript'],
  recent_sessions: [
    { id: 's1', created_at: '2026-07-25T10:00:00.000Z', overall_score: 9, topic: 'React Hooks', duration_minutes: 45, questions_count: 12 },
    { id: 's2', created_at: '2026-07-24T14:00:00.000Z', overall_score: 7.5, topic: 'TypeScript', duration_minutes: 30, questions_count: 8 },
  ],
  score_trend: [
    { date: '2026-07-25T10:00:00.000Z', score: 9, topic: 'React Hooks' },
    { date: '2026-07-24T14:00:00.000Z', score: 7.5, topic: 'TypeScript' },
  ],
};

const mockUser: BackendUserPayload = {
  id: 'usr-1',
  email: 'dev@innovahack.com',
  full_name: 'Alex Rivera',
  xp: 750,
  level: 2,
  next_level_xp: 1000,
  badges: ['first_session', 'streak_3'],
};

// ── adaptProgressData ─────────────────────────────────────────

describe('adaptProgressData() → GamificationProgress', () => {
  it('returns a type-safe GamificationProgress with full Badge objects', () => {
    const result: GamificationProgress = adaptProgressData(mockBackendStats, mockUser);

    expect(result.level).toBe(2);
    expect(result.currentXP).toBe(750);
    expect(result.nextLevelXP).toBe(1000);
    expect(result.dailyStreak).toBe(5);

    // Badges must be full objects, not raw ID strings
    expect(result.badges).toHaveLength(2);
    expect(result.badges[0]).toHaveProperty('id', 'first_session');
    expect(result.badges[0]).toHaveProperty('name', 'First Steps');
    expect(result.badges[0]).toHaveProperty('iconName');
    expect(result.badges[0]).toHaveProperty('isUnlocked', true);

    // Achievements array must exist (even if empty)
    expect(Array.isArray(result.achievements)).toBe(true);
  });

  it('prevents negative level progress (formerly -188% bug)', () => {
    const result = adaptProgressData(mockBackendStats, mockUser);
    const percent = result.nextLevelXP > 0
      ? Math.min(Math.max(Math.round((result.currentXP / result.nextLevelXP) * 100), 0), 100)
      : 0;
    expect(percent).toBe(75);
    expect(percent).toBeGreaterThanOrEqual(0);
    expect(percent).toBeLessThanOrEqual(100);
  });
});

// ── adaptAnalyticsData ────────────────────────────────────────

describe('adaptAnalyticsData() → AnalyticsData', () => {
  it('normalizes backend 0-10 scores to 0-100 UI scale', () => {
    const result: AnalyticsData = adaptAnalyticsData(mockBackendStats);

    // 8.25 * 10 = 82.5 → rounded to 83
    expect(result.averageScore).toBe(83);
    expect(result.overallAccuracy).toBe(83);
    expect(result.averageScore).toBeGreaterThanOrEqual(0);
    expect(result.averageScore).toBeLessThanOrEqual(100);
  });

  it('includes all required AnalyticsData fields', () => {
    const result: AnalyticsData = adaptAnalyticsData(mockBackendStats);

    // Required fields that were previously missing
    expect(result).toHaveProperty('interviewsTaken', 12);
    expect(result).toHaveProperty('strongTopics');
    expect(result).toHaveProperty('weakTopics');
    expect(result).toHaveProperty('difficultyDistribution');
    expect(Array.isArray(result.strongTopics)).toBe(true);
    expect(Array.isArray(result.difficultyDistribution)).toBe(true);
  });

  it('formats WeeklyProgress with questions field and InterviewHistory with difficulty', () => {
    const result: AnalyticsData = adaptAnalyticsData(mockBackendStats);

    expect(result.weeklyProgress).toHaveLength(2);
    expect(result.weeklyProgress[0]).toHaveProperty('questions');
    expect(result.weeklyProgress[0]).toHaveProperty('score');

    expect(result.interviewHistory).toHaveLength(2);
    expect(result.interviewHistory[0]).toHaveProperty('difficulty');
    expect(result.interviewHistory[0].date).toBe('2026-07-25');
    // Score should be normalized: 9 * 10 = 90
    expect(result.interviewHistory[0].score).toBe(90);
  });

  it('includes averageTimePerQuestion in topic performances', () => {
    const result: AnalyticsData = adaptAnalyticsData(mockBackendStats);
    const allTopics = [...result.strongTopics, ...result.weakTopics];
    expect(allTopics.length).toBeGreaterThan(0);
    for (const topic of allTopics) {
      expect(topic).toHaveProperty('averageTimePerQuestion');
      expect(topic).toHaveProperty('questionsAnswered');
    }
  });
});

// ── adaptDashboardData ────────────────────────────────────────

describe('adaptDashboardData() → DashboardData', () => {
  it('produces a complete DashboardData with deterministic calendar', () => {
    const result: DashboardData = adaptDashboardData(mockBackendStats, mockUser);

    expect(result).toHaveProperty('goals');
    expect(result).toHaveProperty('calendar');
    expect(result).toHaveProperty('quickActions');
    expect(result).toHaveProperty('monthlyStats');
    expect(result).toHaveProperty('studySessions');
    expect(result).toHaveProperty('performanceTimeline');
    expect(result).toHaveProperty('totalStudyHours');
    expect(result).toHaveProperty('completionRate');
    expect(result).toHaveProperty('learningVelocity');
  });

  it('generates calendar from real sessions, not random data', () => {
    const result: DashboardData = adaptDashboardData(mockBackendStats, mockUser);

    expect(result.calendar).toHaveLength(2);
    expect(result.calendar[0].date).toBe('2026-07-25');
    expect(result.calendar[0].questionsAnswered).toBe(12);
  });

  it('uses static quick actions with correct routes', () => {
    const result: DashboardData = adaptDashboardData(mockBackendStats, mockUser);

    expect(result.quickActions).toHaveLength(4);
    const hrefs = result.quickActions.map(a => a.href);
    expect(hrefs).toContain('/dashboard');
    expect(hrefs).toContain('/analytics');
    expect(hrefs).toContain('/leaderboard');
    expect(hrefs).toContain('/profile');
  });
});

// ── adaptLeaderboardData ──────────────────────────────────────

describe('adaptLeaderboardData() → LeaderboardData', () => {
  const rows: BackendLeaderboardRow[] = [
    { rank: 1, user_id: 'u1', full_name: 'Alice', xp: 2000, level: 5 },
    { rank: 2, user_id: 'u2', full_name: 'Bob', xp: 1500, level: 4 },
    { rank: 3, user_id: 'usr-1', full_name: 'Alex Rivera', xp: 750, level: 2 },
  ];

  const myRank: BackendMyRank = {
    rank: 3,
    total_users: 50,
    user_id: 'usr-1',
    xp: 750,
    level: 2,
  };

  it('maps backend rows to LeaderboardUser objects', () => {
    const result: LeaderboardData = adaptLeaderboardData(rows, myRank, 'usr-1');

    expect(result.topUsers).toHaveLength(3);
    expect(result.topUsers[0]).toEqual(expect.objectContaining({
      id: 'u1',
      name: 'Alice',
      rank: 1,
      xp: 2000,
      level: 5,
      isCurrentUser: false,
    }));
    expect(result.topUsers[2].isCurrentUser).toBe(true);
  });

  it('includes currentUserRank when available', () => {
    const result: LeaderboardData = adaptLeaderboardData(rows, myRank, 'usr-1');

    expect(result.currentUserRank).toBeDefined();
    expect(result.currentUserRank?.rank).toBe(3);
    expect(result.currentUserRank?.isCurrentUser).toBe(true);
  });

  it('handles missing myRank gracefully', () => {
    const result: LeaderboardData = adaptLeaderboardData(rows, undefined);

    expect(result.topUsers).toHaveLength(3);
    expect(result.currentUserRank).toBeUndefined();
  });
});
