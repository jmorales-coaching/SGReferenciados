const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');
const env = require('../config/environment');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, {
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
    return ApiResponse.badRequest(res, 'Validation error', errors);
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return ApiResponse.conflict(res, 'Resource already exists');
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return ApiResponse.badRequest(res, 'Invalid reference');
  }

  const statusCode = err.statusCode || 500;
  const message = env.nodeEnv === 'production' && statusCode === 500
    ? 'Internal server error'
    : err.message;
  return ApiResponse.error(res, message, statusCode);
};

module.exports = errorHandler;
