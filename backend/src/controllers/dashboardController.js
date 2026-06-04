const dashboardService = require('../services/dashboardService');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const userStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getUserStats(req.user.id);
  return ApiResponse.success(res, stats);
});

const adminStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getAdminStats();
  return ApiResponse.success(res, stats);
});

module.exports = { userStats, adminStats };
