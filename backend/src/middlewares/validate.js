const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/apiResponse');

const validate = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    const formatted = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));

    return ApiResponse.badRequest(res, 'Validation failed', formatted);
  };
};

module.exports = validate;
