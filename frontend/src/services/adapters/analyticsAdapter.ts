/**
 * Adapter: Backend progress stats → UI AnalyticsData type.
 * Normalizes 0-10 backend scores to 0-100 UI scale.
 */
import { AnalyticsData, TopicPerformance, WeeklyProgress, InterviewHistory } from '../../types';
import { BackendProgressStats } from './progressAdapter';

/** Normalize backend 0-10 score to 0-100 UI percentage. */
const toPercent = (score: number): number => Math.round(Math.min(score * 10, 100));

export const adaptAnalyticsData = (stats: BackendProgressStats): AnalyticsData => {
  const avgScorePercent = toPercent(stats?.average_score ?? 0);

  // ── Weekly Progress ──
  const weeklyProgress: WeeklyProgress[] = (stats?.score_trend ?? []).map(item => ({
    day: item.date
      ? new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      : 'Unknown',
    score: toPercent(item.score ?? 0),
    questions: 1, // Backend doesn't track per-trend-point question count yet
  }));

  // ── Interview History ──
  const interviewHistory: InterviewHistory[] = (stats?.recent_sessions ?? []).map((s: any, i: number) => ({
    id: s.id ?? `session-${i}`,
    date: s.created_at
      ? new Date(s.created_at).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    topic: s.topic ?? 'General Practice',
    score: toPercent(s.overall_score ?? 0),
    difficulty: 'Beginner' as const, // Backend doesn't track difficulty per session yet
  }));

  // ── Topics ──
  const topicsCount = Math.max(stats?.topics_studied?.length ?? 1, 1);
  const questionsPerTopic = Math.round((stats?.total_questions ?? 0) / topicsCount);
  const avgTimePerQuestion = stats?.total_questions > 0
    ? Math.round((stats.total_study_minutes * 60) / stats.total_questions)
    : 45; // default 45 seconds

  const allTopics: TopicPerformance[] = (stats?.topics_studied ?? []).map(topic => ({
    topic,
    accuracy: avgScorePercent,
    questionsAnswered: questionsPerTopic,
    averageTimePerQuestion: avgTimePerQuestion,
  }));

  // Split into strong/weak by median score
  const strongTopics = allTopics.filter(t => t.accuracy >= avgScorePercent);
  const weakTopics = allTopics.filter(t => t.accuracy < avgScorePercent);
  // If all topics are equal (no variance), put them all in strongTopics
  const finalStrongTopics = weakTopics.length === 0 && strongTopics.length === 0
    ? allTopics
    : strongTopics.length === 0
      ? allTopics.slice(0, Math.ceil(allTopics.length / 2))
      : strongTopics;
  const finalWeakTopics = weakTopics.length === 0 && strongTopics.length > 0
    ? []
    : weakTopics.length === 0
      ? allTopics.slice(Math.ceil(allTopics.length / 2))
      : weakTopics;

  // ── Difficulty Distribution (static fallback until backend tracks) ──
  const difficultyDistribution = [
    { difficulty: 'Beginner', percentage: 60 },
    { difficulty: 'Intermediate', percentage: 30 },
    { difficulty: 'Advanced', percentage: 10 },
  ];

  return {
    overallAccuracy: avgScorePercent,
    averageScore: avgScorePercent,
    interviewsTaken: stats?.total_sessions ?? 0,
    weakTopics: finalWeakTopics,
    strongTopics: finalStrongTopics,
    weeklyProgress,
    interviewHistory,
    difficultyDistribution,
  };
};
