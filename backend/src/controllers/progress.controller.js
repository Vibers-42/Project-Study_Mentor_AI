const { supabaseAdmin } = require('../config/supabase');
const { success, error } = require('../utils/apiResponse');
const { updateUserXP } = require('../services/xp.service');
const logger = require('../utils/logger');

/**
 * @swagger
 * tags:
 *   name: Progress
 *   description: User progress tracking and session history
 */

/**
 * @swagger
 * /progress:
 *   get:
 *     summary: Get all study sessions for the authenticated user
 *     tags: [Progress]
 *     responses:
 *       200:
 *         description: List of study sessions
 */
const getProgress = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const { data, error: dbError } = await supabaseAdmin
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (dbError) {
      logger.error('DB error fetching progress', dbError);
      return error(res, 'Failed to retrieve progress data.', 500);
    }

    return success(res, data || []);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /progress/stats:
 *   get:
 *     summary: Get aggregated statistics for the authenticated user
 *     tags: [Progress]
 */
const getStats = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const { data, error: dbError } = await supabaseAdmin
      .from('user_progress')
      .select('overall_score, topic, created_at, questions_count, duration_minutes')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (dbError) {
      logger.error('DB error fetching stats', dbError);
      return error(res, 'Failed to retrieve stats.', 500);
    }

    const sessions = data || [];

    // ── Streak calculation ─────────────────────────────────────────
    // Count consecutive calendar days (most-recent first) that have ≥1 session.
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sessionDays = [
      ...new Set(
        sessions.map((r) => {
          const d = new Date(r.created_at);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        })
      ),
    ].sort((a, b) => b - a); // descending

    let streak = 0;
    let cursor = today.getTime();

    // If the user hasn't practiced today, allow yesterday as a valid streak start.
    // Without this, a user who practiced every day for a week but hasn't yet
    // today would see streak = 0 instead of their actual streak.
    if (sessionDays.length > 0 && sessionDays[0] !== cursor) {
      const yesterday = cursor - 86400000;
      if (sessionDays[0] === yesterday) {
        cursor = yesterday;
      }
    }

    for (const dayTs of sessionDays) {
      if (dayTs === cursor) {
        streak++;
        cursor -= 86400000; // go back one day
      } else {
        break;
      }
    }
    // ──────────────────────────────────────────────────────────────

    const stats = {
      total_sessions: sessions.length,
      average_score: sessions.length
        ? +(sessions.reduce((s, r) => s + (r.overall_score || 0), 0) / sessions.length).toFixed(1)
        : 0,
      total_questions: sessions.reduce((s, r) => s + (r.questions_count || 0), 0),
      total_study_minutes: sessions.reduce((s, r) => s + (r.duration_minutes || 0), 0),
      streak,
      topics_studied: [...new Set(sessions.map((r) => r.topic).filter(Boolean))],
      recent_sessions: sessions.slice(0, 5),
      score_trend: sessions.slice(0, 10).map((r) => ({
        date: r.created_at,
        score: r.overall_score,
        topic: r.topic,
      })),
    };

    return success(res, stats);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /progress/session:
 *   post:
 *     summary: Save a completed study session
 *     tags: [Progress]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *               job_role:
 *                 type: string
 *               session_history:
 *                 type: array
 *               overall_score:
 *                 type: number
 *               duration_minutes:
 *                 type: number
 */
const saveSession = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { topic, job_role, session_history, overall_score, duration_minutes } = req.body;

    const { data, error: dbError } = await supabaseAdmin
      .from('user_progress')
      .insert([{
        user_id: userId,
        topic: topic || job_role || 'General',
        session_data: session_history || [],
        overall_score: overall_score || 0,
        duration_minutes: duration_minutes || 0,
        questions_count: session_history?.length || 0,
      }])
      .select()
      .single();

    if (dbError) {
      logger.error('DB error saving session', dbError);
      return error(res, 'Failed to save session.', 500);
    }

    // Award XP + badges fire-and-forget (never blocks the response)
    const statsForXP = {
      streak:       0, // streak is recalculated by getStats; not available here
      averageScore: overall_score || 0,
    };
    updateUserXP(userId, session_history || [], statsForXP).catch(() => {});

    return success(res, data, 'Session saved successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = { getProgress, getStats, saveSession };
