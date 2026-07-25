const logger = require('../utils/logger');

const notFound = (req, res, next) => {
  const err = new Error(`Not found: ${req.method} ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const isDev = process.env.NODE_ENV === 'development';

  if (statusCode >= 500) {
    logger.error('Server error', { message: err.message, path: req.path, method: req.method, stack: err.stack });
  }

  // Generic AI provider errors (Groq / any future provider)
  // Groq errors expose a numeric .status and an .error.type string
  const isAIError = err.status === 429
    || err.status === 503
    || err.constructor?.name === 'APIError'
    || err.constructor?.name === 'GroqError';

  if (isAIError) {
    return res.status(502).json({
      success: false,
      message: err.status === 429
        ? 'AI service rate limit reached. Please wait a moment and try again.'
        : 'AI service error. Please try again.',
    });
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode < 500 ? err.message : 'Something went wrong. Please try again.',
    ...(isDev && statusCode >= 500 && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
