const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { getProgress, getStats, saveSession } = require('../controllers/progress.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// All progress routes require authentication
router.use(authenticate);

router.get('/', getProgress);

router.get('/stats', getStats);

router.post(
  '/session',
  [
    body('topic').optional().trim().isString(),
    body('job_role').optional().trim().isString(),
    body('session_history').optional().isArray(),
    body('overall_score').optional().isFloat({ min: 0, max: 10 }),
    body('duration_minutes').optional().isInt({ min: 0 }),
  ],
  validate,
  saveSession
);

module.exports = router;
