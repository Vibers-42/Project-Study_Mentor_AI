const jwt = require('jsonwebtoken');
const { error } = require('../utils/apiResponse');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) 
    return error(res, 'Access denied. No token provided.', 401);
  try {
    req.user = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET);
    next();
  } catch {
    return error(res, 'Invalid or expired token.', 401);
  }
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try { req.user = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET); } catch {}
  }
  next();
};

module.exports = { authenticate, optionalAuth };
