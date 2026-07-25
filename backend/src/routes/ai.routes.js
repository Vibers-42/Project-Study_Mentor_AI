const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  generateQuestionController,
  evaluateAnswerController,
  generateFeedbackController,
  adaptiveNextQuestionController,
  generateRoadmapController,
  recommendResourcesController,
} = require('../controllers/ai.controller');
const { optionalAuth } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validate');

// Apply AI-specific rate limit to every route in this file
router.use(aiLimiter);

router.post(
  '/generate-question',
  optionalAuth,
  [
    body('topic').optional().trim().isString(),
    body('job_role').optional().trim().isString(),
    body('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced']),
    body('question_type').optional().isIn(['conceptual', 'practical', 'scenario', 'behavioral']),
    body('previous_questions').optional().isArray(),
  ],
  validate,
  generateQuestionController
);

router.post(
  '/evaluate-answer',
  optionalAuth,
  [
    body('question').trim().notEmpty().withMessage('question is required'),
    body('user_answer').trim().notEmpty().withMessage('user_answer is required'),
    body('expected_concepts').optional().isArray(),
    body('topic').optional().trim().isString(),
    body('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced']),
  ],
  validate,
  evaluateAnswerController
);

router.post(
  '/generate-feedback',
  optionalAuth,
  [
    body('topic').optional().trim().isString(),
    body('job_role').optional().trim().isString(),
    body('session_history').optional().isArray(),
    body('overall_score').optional().isFloat({ min: 0, max: 10 }),
    body('weaknesses').optional().isArray(),
  ],
  validate,
  generateFeedbackController
);

router.post(
  '/adaptive-next-question',
  optionalAuth,
  [
    body('topic').optional().trim().isString(),
    body('job_role').optional().trim().isString(),
    body('session_history').optional().isArray(),
    body('current_difficulty').optional().isIn(['beginner', 'intermediate', 'advanced']),
  ],
  validate,
  adaptiveNextQuestionController
);

router.post(
  '/generate-roadmap',
  optionalAuth,
  [
    body('topic').optional().trim().isString(),
    body('job_role').optional().trim().isString(),
    body('current_level').optional().isIn(['beginner', 'intermediate', 'advanced']),
    body('target_role').optional().trim().isString(),
    body('timeframe').optional().trim().isString(),
  ],
  validate,
  generateRoadmapController
);

router.post(
  '/recommend-resources',
  optionalAuth,
  [
    body('topic').optional().trim().isString(),
    body('job_role').optional().trim().isString(),
    body('weak_areas').optional().isArray(),
    body('skill_level').optional().isIn(['beginner', 'intermediate', 'advanced']),
    body('learning_style').optional().trim().isString(),
  ],
  validate,
  recommendResourcesController
);

module.exports = router;
