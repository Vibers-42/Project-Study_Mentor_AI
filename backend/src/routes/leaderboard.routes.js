const express = require('express');
const router = express.Router();

const { getLeaderboard, getMyRank } = require('../controllers/leaderboard.controller');
const { authenticate, optionalAuth } = require('../middleware/auth');

/**
 * GET /api/leaderboard     — public, no auth required (optionalAuth sets req.user if token present)
 * GET /api/leaderboard/me  — requires authentication
 */
router.get('/', optionalAuth, getLeaderboard);
router.get('/me', authenticate, getMyRank);

module.exports = router;
