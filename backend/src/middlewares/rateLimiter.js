const rateLimit = require('express-rate-limit');
const env = require('../config/environment');

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || 'Too many requests, please try again later',
      timestamp: new Date().toISOString(),
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

const generalLimiter = createRateLimiter(
  env.rateLimit.windowMs,
  env.rateLimit.max,
  'Too many requests'
);

const authLimiter = createRateLimiter(15 * 60 * 1000, 10, 'Too many registration attempts');

module.exports = { generalLimiter, authLimiter };
