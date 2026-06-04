const leadService = require('../services/leadService');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const result = await leadService.register(req.body);
  return ApiResponse.created(res, result, 'Registration successful');
});

const getProgress = asyncHandler(async (req, res) => {
  const data = await leadService.getProgress(req.params.uuid);
  return ApiResponse.success(res, data);
});

module.exports = { register, getProgress };
