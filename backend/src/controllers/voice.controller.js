const multer = require('multer');
const { Readable } = require('stream');
const groq = require('../config/groq');
const { success, error } = require('../utils/apiResponse');
const logger = require('../utils/logger');

// Store file in memory (we stream it straight to Groq — no disk writes)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB — Whisper limit
  fileFilter: (req, file, cb) => {
    const allowed = ['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac', 'video/webm'];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(mp3|mp4|mpeg|mpga|m4a|wav|webm|ogg|flac)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported audio format. Use mp3, mp4, wav, webm, ogg or flac.'));
    }
  },
});

/**
 * @swagger
 * tags:
 *   name: Voice
 *   description: Audio transcription powered by Groq Whisper
 */

/**
 * @swagger
 * /voice/transcribe:
 *   post:
 *     summary: Transcribe an audio recording to text
 *     tags: [Voice]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               audio:
 *                 type: string
 *                 format: binary
 *                 description: Audio file (mp3, mp4, wav, webm, ogg, flac — max 25 MB)
 *     responses:
 *       200:
 *         description: Transcribed text
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 text:
 *                   type: string
 *       400:
 *         description: No audio file provided
 *       502:
 *         description: Transcription service error
 */
const transcribe = async (req, res, next) => {
  try {
    if (!req.file) {
      return error(res, 'No audio file provided. Send a multipart/form-data request with an "audio" field.', 400);
    }

    const { buffer, originalname, mimetype } = req.file;

    logger.info('Transcribing audio', {
      filename: originalname,
      mimetype,
      sizeKB: Math.round(buffer.length / 1024),
    });

    // Groq SDK expects a File-like object. We wrap the buffer.
    // The File constructor works in Node 20+; for older Node we use a Blob workaround.
    let audioFile;
    try {
      audioFile = new File([buffer], originalname || 'audio.webm', { type: mimetype });
    } catch {
      // Node < 20 fallback
      const { Blob } = require('buffer');
      const blob = new Blob([buffer], { type: mimetype });
      blob.name = originalname || 'audio.webm';
      audioFile = blob;
    }

    const transcription = await groq.audio.transcriptions.create({
      file:            audioFile,
      model:           'whisper-large-v3-turbo',
      response_format: 'json',
      language:        'en',
    });

    const text = transcription.text?.trim() || '';
    logger.info('Transcription complete', { chars: text.length });

    return success(res, { text }, 'Transcription successful');
  } catch (err) {
    logger.error('Transcription error', { message: err.message });
    next(err);
  }
};

module.exports = { transcribe, upload };
