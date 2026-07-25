const { supabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

// ── XP Rules ────────────────────────────────────────────────────
const XP_PER_QUESTION   = 10;
const XP_PER_SCORE_UNIT = 5;   // score (0-10) * 5 → max +50 per question
const XP_SESSION_BONUS  = 50;

/**
 * Calculate XP earned for a completed session.
 * @param {Array} sessionHistory — array of { score, ... } objects
 * @returns {number} total XP earned
 */
const calculateXP = (sessionHistory = []) => {
  let xp = 0;
  for (const item of sessionHistory) {
    xp += XP_PER_QUESTION;
    xp += Math.round((item.score || 0) * XP_PER_SCORE_UNIT);
  }
  xp += XP_SESSION_BONUS; // session completion bonus
  return xp;
};

/**
 * Derive level from total XP.
 * Level 1 starts at 0 XP; every 500 XP is a new level.
 */
const levelFromXP = (totalXP) => Math.floor(totalXP / 500) + 1;

// ── Badge Rules ──────────────────────────────────────────────────
const BADGE_RULES = [
  {
    id: 'first_session',
    label: 'First Steps',
    check: ({ totalSessions }) => totalSessions >= 1,
  },
  {
    id: 'streak_3',
    label: 'On a Roll',
    check: ({ streak }) => streak >= 3,
  },
  {
    id: 'streak_7',
    label: 'Week Warrior',
    check: ({ streak }) => streak >= 7,
  },
  {
    id: 'perfect_score',
    label: 'Perfect Score',
    check: ({ sessionHistory }) =>
      (sessionHistory || []).some((q) => (q.score || 0) >= 10),
  },
  {
    id: 'high_achiever',
    label: 'High Achiever',
    check: ({ averageScore }) => (averageScore || 0) >= 8,
  },
  {
    id: 'dedicated',
    label: 'Dedicated Learner',
    check: ({ totalSessions }) => totalSessions >= 10,
  },
  {
    id: 'expert',
    label: 'Expert',
    check: ({ totalSessions }) => totalSessions >= 50,
  },
];

/**
 * Return merged list of earned badge IDs.
 * @param {object} stats — { totalSessions, streak, averageScore, sessionHistory }
 * @param {string[]} existingBadges — already earned badge IDs
 * @returns {string[]} full updated badge list
 */
const checkBadges = (stats, existingBadges = []) => {
  const set = new Set(existingBadges);
  for (const rule of BADGE_RULES) {
    if (!set.has(rule.id) && rule.check(stats)) {
      set.add(rule.id);
      logger.debug(`Badge unlocked: ${rule.id}`);
    }
  }
  return [...set];
};

// ── DB Update ────────────────────────────────────────────────────
/**
 * Award XP, recalculate level, check badges, update user_profiles and leaderboard.
 * Designed to be called fire-and-forget after session save — errors are logged, not thrown.
 *
 * @param {string} userId
 * @param {Array}  sessionHistory — current session's Q&A items
 * @param {object} currentStats   — { totalSessions, streak, averageScore }
 */
const updateUserXP = async (userId, sessionHistory = [], currentStats = {}) => {
  try {
    // 1. Fetch current profile
    const { data: profile, error: fetchErr } = await supabaseAdmin
      .from('users')
      .select('xp, level, badges, total_sessions, full_name')
      .eq('id', userId)
      .single();

    if (fetchErr) {
      logger.warn('XP service: could not fetch profile', { userId, error: fetchErr.message });
      return;
    }

    const prevXP            = profile?.xp            || 0;
    const prevBadges        = profile?.badges         || [];
    const prevTotalSessions = profile?.total_sessions || 0;
    const fullName          = profile?.full_name      || '';

    // 2. Calculate gains
    const earnedXP      = calculateXP(sessionHistory);
    const newXP         = prevXP + earnedXP;
    const newLevel      = levelFromXP(newXP);
    const newTotalSess  = prevTotalSessions + 1;

    // 3. Check badges
    const badgeStats = {
      totalSessions: newTotalSess,
      streak:        currentStats.streak        || 0,
      averageScore:  currentStats.averageScore  || currentStats.average_score || 0,
      sessionHistory,
    };
    const newBadges = checkBadges(badgeStats, prevBadges);

    // 4. Upsert user_profiles
    const { error: profileErr } = await supabaseAdmin
      .from('users')
      .update({
        xp:             newXP,
        level:          newLevel,
        badges:         newBadges,
        total_sessions: newTotalSess,
        updated_at:     new Date().toISOString(),
      })
      .eq('id', userId);

    if (profileErr) {
      logger.warn('XP service: profile update failed', { userId, error: profileErr.message });
    }

    // 5. Upsert leaderboard row
    const { error: lbErr } = await supabaseAdmin
      .from('leaderboard')
      .upsert({
        user_id:        userId,
        full_name:      fullName,
        xp:             newXP,
        level:          newLevel,
        average_score:  currentStats.averageScore || currentStats.average_score || 0,
        total_sessions: newTotalSess,
        badges:         newBadges,
        updated_at:     new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (lbErr) {
      logger.warn('XP service: leaderboard upsert failed', { userId, error: lbErr.message });
    }

    logger.info('XP awarded', { userId, earned: earnedXP, total: newXP, level: newLevel });
  } catch (err) {
    logger.error('XP service: unexpected error', { userId, message: err.message });
  }
};

module.exports = { calculateXP, checkBadges, levelFromXP, updateUserXP };
