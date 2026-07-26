import api from './api';

/**
 * Fetch all dynamic dashboard statistics directly from the backend API.
 */
export const fetchDashboardStats = async () => {
  try {
    const res = await api.get('/progress/stats');
    const data = res.data?.data;
    if (!data) return getEmptyStats();

    const sessionsCount = data.total_sessions || 0;
    const rawScore = Number(data.average_score) || 0;
    const accuracyPct = rawScore <= 10 ? Math.round(rawScore * 10) : Math.round(rawScore);

    return {
      questionsSolved: data.total_questions || 0,
      interviewsCompleted: sessionsCount,
      accuracyPct,
      streak: data.streak || 0,
      totalStudyMinutes: data.total_study_minutes || 0,
      sessionsCount,
      sessions: data.recent_sessions || [],
    };
  } catch (error) {
    console.warn('[DashboardService] Error fetching dashboard stats:', error);
    return getEmptyStats();
  }
};

const getEmptyStats = () => ({
  questionsSolved: 0,
  interviewsCompleted: 0,
  accuracyPct: 0,
  streak: 0,
  totalStudyMinutes: 0,
  sessionsCount: 0,
  sessions: [],
});

/**
 * Fetch recent activities by getting sessions from the backend and extracting activities.
 * @param {number} limit
 */
export const fetchRecentActivity = async (limit = 5) => {
  try {
    const res = await api.get('/progress');
    const sessions = res.data?.data || [];
    
    const activities = [];

    sessions.forEach((s) => {
      const rawScore = Number(s.overall_score) || 0;
      const scorePct = rawScore <= 10 ? Math.round(rawScore * 10) : Math.round(rawScore);
      const qCount = Number(s.questions_count) || 0;

      // Add the session itself as an activity
      activities.push({
        id: `session_${s.id}`,
        title: `Completed ${s.topic || 'Interview'} Session`,
        description: `Scored ${scorePct}% • ${qCount} question${qCount === 1 ? '' : 's'}`,
        created_at: s.created_at,
        icon: '🎤',
        rawScore: s.overall_score,
        topic: s.topic,
      });

      // Optionally, add individual questions from session_data if available
      if (Array.isArray(s.session_data)) {
        s.session_data.forEach((q, idx) => {
          const qScore = Number(q.score) || 0;
          const qScorePct = qScore <= 10 ? Math.round(qScore * 10) : Math.round(qScore);
          const shortText = q.question
            ? q.question.length > 50
              ? `${q.question.slice(0, 50)}...`
              : q.question
            : 'Practice question';

          activities.push({
            id: `answer_${s.id}_${idx}`,
            title: `Answered Question`,
            description: `"${shortText}" — Score: ${qScorePct}%`,
            created_at: s.created_at, // Use session time for simplicity
            icon: '💡',
            rawScore: qScore,
          });
        });
      }
    });

    // Sort combined list by created_at DESC
    return activities
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  } catch (error) {
    console.warn('[DashboardService] Error fetching recent activity:', error);
    return [];
  }
};

/**
 * Empty subscription function since we rely on REST API refetching now.
 */
export const subscribeToDashboardUpdates = (onUpdate) => {
  // Can be implemented via WebSockets/SSE later if backend supports it.
  return {
    unsubscribe: () => {},
  };
};
