const jwt = require('jsonwebtoken');
const env = require('../config/environment');
const ApiResponse = require('../utils/apiResponse');
const { User } = require('../models/associations');

const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return ApiResponse.error(res, 'Authentication required', 401);
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, env.jwt.secret);
    const user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
    if (!user || !user.active) {
      return ApiResponse.error(res, 'User not found or inactive', 401);
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return ApiResponse.error(res, 'Token expired', 401);
    }
    return ApiResponse.error(res, 'Invalid token', 401);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return ApiResponse.error(res, 'Insufficient permissions', 403);
    }
    next();
  };
};

module.exports = { authenticate, authorize };
