const express = require('express');
const router = express.Router();

const authRoutes        = require('./auth.routes');
const aiRoutes          = require('./ai.routes');
const progressRoutes    = require('./progress.routes');
const leaderboardRoutes = require('./leaderboard.routes');
const voiceRoutes       = require('./voice.routes');

router.use('/auth',        authRoutes);
router.use('/ai',          aiRoutes);
router.use('/progress',    progressRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/voice',       voiceRoutes);

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'AI Study & Interview Coach API v1.0',
    docs: '/api-docs',
    endpoints: {
      auth:        '/api/auth',
      ai:          '/api/ai',
      progress:    '/api/progress',
      leaderboard: '/api/leaderboard',
      voice:       '/api/voice',
    },
  });
});

module.exports = router;
