/**
 * Builds the analytics view-model from the user's real data.
 *
 * Inputs come straight from the API:
 *   stats    → GET /progress/stats
 *   sessions → GET /progress   (rows of user_progress)
 *
 * The returned shape is consumed by the Analytics page and its chart
 * components, so it must stay stable.
 */

/** Backend stores scores 0–10; the UI works in 0–100. */
const toPercent = (score) => Math.round((Number(score) || 0) * 10);

const toGrade = (pct) => {
  if (pct >= 90) return 'A';
  if (pct >= 85) return 'A-';
  if (pct >= 80) return 'B+';
  if (pct >= 70) return 'B';
  if (pct >= 65) return 'C+';
  if (pct >= 55) return 'C';
  return 'D';
};

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const shortDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';

const dayKey = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
};

/** Per-topic accuracy and volume, derived from session rows. */
const topicStats = (sessions) => {
  const byTopic = new Map();
  sessions.forEach((s) => {
    const key = s.topic || 'General';
    const e = byTopic.get(key) || { total: 0, count: 0, questions: 0, minutes: 0 };
    e.total += toPercent(s.overall_score);
    e.count += 1;
    e.questions += s.questions_count || 0;
    e.minutes += s.duration_minutes || 0;
    byTopic.set(key, e);
  });

  return [...byTopic.entries()]
    .map(([topic, e]) => ({
      topic,
      accuracy: Math.round(e.total / e.count),
      questionsAnswered: e.questions,
      avgTime: e.questions
        ? `${((e.minutes * 60) / e.questions / 60).toFixed(1)} min`
        : '—',
    }))
    .sort((a, b) => b.accuracy - a.accuracy);
};

/** Empty-but-valid shape so charts render before data arrives. */
export const EMPTY_ANALYTICS = {
  overallAccuracy: 0,
  averageScore: 0,
  interviewsTaken: 0,
  questionsSolved: 0,
  weakTopics: [],
  strongTopics: [],
  topicRadar: [],
  weeklyProgress: [],
  performanceHistory: [],
  interviewHistory: [],
  difficultyDistribution: [],
};

export const buildAnalyticsData = (stats, sessions = []) => {
  if (!sessions.length) {
    return {
      ...EMPTY_ANALYTICS,
      overallAccuracy: toPercent(stats?.average_score),
      averageScore: toPercent(stats?.average_score),
      interviewsTaken: stats?.total_sessions ?? 0,
      questionsSolved: stats?.total_questions ?? 0,
    };
  }

  const topics = topicStats(sessions);

  // Oldest → newest, so the trend line reads left to right.
  const chronological = [...sessions].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  // Last 7 days of activity
  const weeklyProgress = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const onDay = sessions.filter((s) => dayKey(s.created_at) === dayKey(d));
    const scores = onDay.map((s) => toPercent(s.overall_score));
    weeklyProgress.push({
      day: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3),
      score: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      questions: onDay.reduce((sum, s) => sum + (s.questions_count || 0), 0),
    });
  }

  // Distribution of individual answer scores across every stored session
  const answerScores = sessions
    .flatMap((s) => (Array.isArray(s.session_data) ? s.session_data : []))
    .map((q) => Number(q?.score))
    .filter((n) => Number.isFinite(n));

  const strongCount = answerScores.filter((s) => s >= 8).length;
  const fairCount = answerScores.filter((s) => s >= 5 && s < 8).length;
  const weakCount = answerScores.filter((s) => s < 5).length;
  const answerTotal = answerScores.length;
  const pctOf = (n) => (answerTotal ? Math.round((n / answerTotal) * 100) : 0);

  return {
    overallAccuracy: toPercent(stats?.average_score),
    averageScore: toPercent(stats?.average_score),
    interviewsTaken: stats?.total_sessions ?? sessions.length,
    questionsSolved: stats?.total_questions ?? 0,

    strongTopics: topics.slice(0, 3),
    weakTopics: [...topics].reverse().slice(0, 3),
    topicRadar: topics.slice(0, 6).map((t) => ({ topic: t.topic, accuracy: t.accuracy })),

    weeklyProgress,

    performanceHistory: chronological.slice(-10).map((s) => ({
      date: shortDate(s.created_at),
      score: toPercent(s.overall_score),
    })),

    interviewHistory: sessions.slice(0, 8).map((s) => {
      const score = toPercent(s.overall_score);
      return {
        id: String(s.id),
        date: fmtDate(s.created_at),
        role: s.topic || 'Practice session',
        score,
        grade: toGrade(score),
        difficulty: `${s.questions_count || 0} questions`,
      };
    }),

    difficultyDistribution: answerTotal
      ? [
          { name: 'Strong', value: pctOf(strongCount), color: '#10b981' },
          { name: 'Fair', value: pctOf(fairCount), color: '#f59e0b' },
          { name: 'Needs work', value: pctOf(weakCount), color: '#ef4444' },
        ]
      : [],
  };
};
