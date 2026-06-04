const configService = require('../services/configService');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getConfig = asyncHandler(async (req, res) => {
  const config = await configService.getAll();
  return ApiResponse.success(res, config);
});

const updateConfig = asyncHandler(async (req, res) => {
  const { key, value } = req.body;
  if (!key) return ApiResponse.error(res, 'Key is required', 400);
  const result = await configService.upsert(key, value);
  return ApiResponse.success(res, result, 'Config updated');
});

module.exports = { getConfig, updateConfig };
