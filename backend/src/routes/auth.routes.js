const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { register, login, logout, me, updateProfile } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validate');

router.post(
  '/register',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('A valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('full_name').trim().notEmpty().withMessage('Full name is required'),
  ],
  validate,
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('A valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.post('/logout', authenticate, logout);

router.get('/me', authenticate, me);

router.put(
  '/profile',
  authenticate,
  [
    body('full_name').optional().trim().isString(),
    body('job_role').optional().trim().isString(),
    body('skill_level').optional().isIn(['beginner', 'intermediate', 'advanced']),
    body('learning_goals').optional().isArray(),
  ],
  validate,
  updateProfile
);

module.exports = router;
