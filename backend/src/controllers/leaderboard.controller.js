const { supabaseAdmin } = require('../config/supabase');
const { success, error } = require('../utils/apiResponse');
const logger = require('../utils/logger');

/**
 * @swagger
 * tags:
 *   name: Leaderboard
 *   description: Global XP leaderboard and user ranking
 */

/**
 * @swagger
 * /leaderboard:
 *   get:
 *     summary: Get top 20 users by XP (public)
 *     tags: [Leaderboard]
 *     responses:
 *       200:
 *         description: Array of top users
 */
const getLeaderboard = async (req, res, next) => {
  try {
    const { data, error: dbErr } = await supabaseAdmin
      .from('leaderboard')
      .select('user_id, full_name, xp, level, average_score, total_sessions, badges, updated_at')
      .order('xp', { ascending: false })
      .limit(20);

    if (dbErr) {
      logger.error('Leaderboard fetch error', dbErr);
      return error(res, 'Failed to load leaderboard.', 500);
    }

    // Add rank field
    const ranked = (data || []).map((row, i) => ({ rank: i + 1, ...row }));
    return success(res, ranked);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /leaderboard/me:
 *   get:
 *     summary: Get the authenticated user's rank and XP stats
 *     tags: [Leaderboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user's rank info
 *       401:
 *         description: Not authenticated
 */
const getMyRank = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    // Fetch full leaderboard ordered by XP to calculate rank
    const { data: all, error: lbErr } = await supabaseAdmin
      .from('leaderboard')
      .select('user_id, xp')
      .order('xp', { ascending: false });

    if (lbErr) {
      logger.error('Leaderboard rank error', lbErr);
      return error(res, 'Failed to load rank.', 500);
    }

    const rank = (all || []).findIndex((r) => r.user_id === userId) + 1;

    // Fetch own row
    const { data: me, error: meErr } = await supabaseAdmin
      .from('leaderboard')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (meErr && meErr.code !== 'PGRST116') { // PGRST116 = no rows
      return error(res, 'Failed to load your stats.', 500);
    }

    return success(res, {
      rank: rank || null,
      total_users: (all || []).length,
      ...(me || { user_id: userId, xp: 0, level: 1, badges: [], total_sessions: 0 }),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getLeaderboard, getMyRank };
