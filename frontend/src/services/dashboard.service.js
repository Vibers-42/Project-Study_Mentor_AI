import supabase from '../config/supabase';
import api from './api';

/**
 * Fetch all dynamic dashboard statistics directly from Supabase database.
 * Falls back to backend API if Supabase client RLS restricts unauthenticated direct access.
 * @param {string} userId - Authenticated user's UUID
 */
export const fetchDashboardStats = async (userId) => {
  if (!userId) {
    console.warn('[DashboardService] fetchDashboardStats called without userId');
    return getEmptyStats();
  }

  console.log('[DashboardService] Fetching dashboard stats for userId:', userId);

  try {
    // 1. Direct Supabase query for user_progress
    const { data: dbSessions, error: dbError } = await supabase
      .from('user_progress')
      .select('id, topic, job_role, session_data, overall_score, questions_count, duration_minutes, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (dbError) {
      console.error('[DashboardService] Supabase user_progress query error:', dbError);
    } else {
      console.log('[DashboardService] Supabase user_progress returned:', dbSessions ? `${dbSessions.length} rows` : '0 rows');
    }

    let sessions = dbSessions || [];

    // Fallback: If direct query returned empty/error (e.g. due to Supabase RLS policies), fetch via backend API
    if (sessions.length === 0) {
      console.log('[DashboardService] Direct Supabase query returned 0 sessions. Attempting backend API fallback...');
      try {
        const res = await api.get('/progress/stats');
        const apiData = res.data?.data;
        if (apiData && (apiData.total_sessions > 0 || apiData.recent_sessions?.length > 0)) {
          console.log('[DashboardService] Backend API returned live stats:', apiData);
          return {
            questionsSolved: apiData.total_questions || 0,
            interviewsCompleted: apiData.total_sessions || 0,
            accuracyPct: Number(apiData.average_score) <= 10 ? Math.round(Number(apiData.average_score) * 10) : Math.round(Number(apiData.average_score)),
            streak: apiData.streak || 0,
            totalStudyMinutes: apiData.total_study_minutes || 0,
            sessionsCount: apiData.total_sessions || 0,
            sessions: apiData.recent_sessions || [],
          };
        }
      } catch (apiErr) {
        console.warn('[DashboardService] Backend API fallback attempt:', apiErr.message);
      }
    }

    // Compute live values directly from database records
    const interviewsCompleted = sessions.length;

    const questionsSolved = sessions.reduce((acc, s) => {
      const count = Number(s.questions_count) || (Array.isArray(s.session_data) ? s.session_data.length : 0);
      return acc + count;
    }, 0);

    const totalStudyMinutes = sessions.reduce((acc, s) => acc + (Number(s.duration_minutes) || 0), 0);

    let accuracyPct = 0;
    if (sessions.length > 0) {
      const sumScores = sessions.reduce((acc, s) => {
        const rawScore = Number(s.overall_score) || 0;
        const pct = rawScore <= 10 ? Math.round(rawScore * 10) : Math.round(rawScore);
        return acc + pct;
      }, 0);
      accuracyPct = Math.round(sumScores / sessions.length);
    }

    const streak = calculateStreak(sessions);

    const stats = {
      questionsSolved,
      interviewsCompleted,
      accuracyPct,
      streak,
      totalStudyMinutes,
      sessionsCount: interviewsCompleted,
      sessions,
    };

    console.log('[DashboardService] Live stats computed successfully:', stats);
    return stats;
  } catch (error) {
    console.error('[DashboardService] Error in fetchDashboardStats:', error);
    throw new Error(`Failed to load database statistics: ${error.message}`);
  }
};

/**
 * Calculate learning streak based on consecutive calendar days with sessions.
 */
const calculateStreak = (sessions) => {
  if (!sessions || sessions.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sessionDays = [
    ...new Set(
      sessions.map((s) => {
        const d = new Date(s.created_at);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    ),
  ].sort((a, b) => b - a);

  let streak = 0;
  let cursor = today.getTime();

  if (sessionDays.length > 0 && sessionDays[0] !== cursor) {
    const yesterday = cursor - 86400000;
    if (sessionDays[0] === yesterday) {
      cursor = yesterday;
    }
  }

  for (const dayTs of sessionDays) {
    if (dayTs === cursor) {
      streak++;
      cursor -= 86400000;
    } else {
      break;
    }
  }

  return streak;
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
 * Fetch latest recent activities for logged-in user directly from Supabase.
 * @param {string} userId - Authenticated user's UUID
 * @param {number} limit - Maximum activity items to return
 */
export const fetchRecentActivity = async (userId, limit = 5) => {
  if (!userId) {
    console.warn('[DashboardService] fetchRecentActivity called without userId');
    return [];
  }

  console.log('[DashboardService] Fetching recent activities for userId:', userId);

  try {
    const activities = [];

    // Query 1: Fetch recent sessions from user_progress table
    const { data: progressRows, error: progressErr } = await supabase
      .from('user_progress')
      .select('id, topic, job_role, session_data, overall_score, questions_count, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (progressErr) {
      console.error('[DashboardService] Supabase user_progress activity query error:', progressErr);
    } else if (progressRows && progressRows.length > 0) {
      progressRows.forEach((s) => {
        const rawScore = Number(s.overall_score) || 0;
        const scorePct = rawScore <= 10 ? Math.round(rawScore * 10) : Math.round(rawScore);
        const qCount = Number(s.questions_count) || (Array.isArray(s.session_data) ? s.session_data.length : 0);

        activities.push({
          id: `session_${s.id}`,
          title: `Completed ${s.topic || 'Interview'} Session`,
          description: `Scored ${scorePct}% • ${qCount} question${qCount === 1 ? '' : 's'}`,
          created_at: s.created_at,
          icon: '🎤',
          rawScore: s.overall_score,
          topic: s.topic,
        });

        if (Array.isArray(s.session_data)) {
          s.session_data.forEach((q, idx) => {
            const qScore = Number(q.score) || 0;
            const qScorePct = qScore <= 10 ? Math.round(qScore * 10) : Math.round(qScore);
            const shortText = q.question
              ? q.question.length > 45
                ? `${q.question.slice(0, 45)}...`
                : q.question
              : 'Practice question';

            activities.push({
              id: `q_${s.id}_${idx}`,
              title: `Answered Question`,
              description: `"${shortText}" — Score: ${qScorePct}%`,
              created_at: s.created_at,
              icon: '💡',
              rawScore: qScore,
            });
          });
        }
      });
    }

    // Query 2: Fetch individual answers from user_answers table
    const { data: answerRows, error: answerErr } = await supabase
      .from('user_answers')
      .select('id, question_text, user_answer_text, score, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (answerErr) {
      console.error('[DashboardService] Supabase user_answers activity query error:', answerErr);
    } else if (answerRows && answerRows.length > 0) {
      answerRows.forEach((ans) => {
        const rawScore = Number(ans.score) || 0;
        const qScorePct = rawScore <= 10 ? Math.round(rawScore * 10) : Math.round(rawScore);
        const shortText = ans.question_text
          ? ans.question_text.length > 45
            ? `${ans.question_text.slice(0, 45)}...`
            : ans.question_text
          : 'Practice question';

        activities.push({
          id: `answer_${ans.id}`,
          title: `Answered Question`,
          description: `"${shortText}" — Score: ${qScorePct}%`,
          created_at: ans.created_at,
          icon: '💡',
          rawScore: ans.score,
        });
      });
    }

    // Fallback: If direct queries returned no items, attempt backend API fallback
    if (activities.length === 0) {
      console.log('[DashboardService] Direct Supabase activity query empty. Attempting backend API fallback...');
      try {
        const res = await api.get('/progress');
        const apiSessions = res.data?.data || [];
        apiSessions.forEach((s) => {
          const rawScore = Number(s.overall_score) || 0;
          const scorePct = rawScore <= 10 ? Math.round(rawScore * 10) : Math.round(rawScore);
          const qCount = Number(s.questions_count) || 0;

          activities.push({
            id: `session_${s.id}`,
            title: `Completed ${s.topic || 'Interview'} Session`,
            description: `Scored ${scorePct}% • ${qCount} question${qCount === 1 ? '' : 's'}`,
            created_at: s.created_at,
            icon: '🎤',
            rawScore: s.overall_score,
            topic: s.topic,
          });
        });
      } catch (apiErr) {
        console.warn('[DashboardService] Backend activity fallback error:', apiErr.message);
      }
    }

    // Deduplicate activities by ID and sort newest first
    const uniqueMap = new Map();
    activities.forEach((act) => {
      if (!uniqueMap.has(act.id)) {
        uniqueMap.set(act.id, act);
      }
    });

    const sortedActivities = [...uniqueMap.values()]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);

    console.log(`[DashboardService] Fetched ${sortedActivities.length} recent activities`);
    return sortedActivities;
  } catch (error) {
    console.error('[DashboardService] Error in fetchRecentActivity:', error);
    return [];
  }
};

/**
 * Subscribe to Supabase Realtime database changes for user_progress, user_answers, and users tables.
 * @param {string} userId - Authenticated user's UUID
 * @param {Function} onUpdate - Callback function when records are inserted, updated, or deleted
 */
export const subscribeToDashboardUpdates = (userId, onUpdate) => {
  if (!userId) {
    console.warn('[DashboardService] Realtime subscription skipped: missing userId');
    return { unsubscribe: () => {} };
  }

  console.log(`[DashboardService] Subscribing to Supabase Realtime updates for user_id: ${userId}`);

  const channel = supabase
    .channel(`dashboard_updates_${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_progress',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log('[DashboardService] Realtime change detected on user_progress:', payload);
        onUpdate(payload);
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_answers',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log('[DashboardService] Realtime change detected on user_answers:', payload);
        onUpdate(payload);
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${userId}`,
      },
      (payload) => {
        console.log('[DashboardService] Realtime change detected on users:', payload);
        onUpdate(payload);
      }
    )
    .subscribe((status, err) => {
      console.log(`[DashboardService] Realtime subscription status: ${status}`, err || '');
      if (err) {
        console.error('[DashboardService] Realtime subscription error:', err);
      }
    });

  return {
    unsubscribe: () => {
      console.log(`[DashboardService] Unsubscribing Realtime channel for user_id: ${userId}`);
      supabase.removeChannel(channel);
    },
  };
};
