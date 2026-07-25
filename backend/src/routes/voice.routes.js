const express = require('express');
const router = express.Router();

const { transcribe, upload } = require('../controllers/voice.controller');
const { optionalAuth } = require('../middleware/auth');

/**
 * POST /api/voice/transcribe
 * Accepts multipart/form-data with field "audio".
 * optionalAuth — authenticated users get their id logged; unauthenticated still works.
 */
router.post(
  '/transcribe',
  optionalAuth,
  upload.single('audio'),
  transcribe
);

module.exports = router;
