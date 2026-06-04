const adminService = require('../services/adminService');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const listUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const role = req.query.role || null;
  const data = await adminService.listUsers(page, 20, role);
  return ApiResponse.success(res, data);
});

const createUser = asyncHandler(async (req, res) => {
  const user = await adminService.createUser(req.body);
  return ApiResponse.created(res, user, 'User created');
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await adminService.updateUser(req.params.id, req.body);
  return ApiResponse.success(res, user, 'User updated');
});

const toggleUser = asyncHandler(async (req, res) => {
  const user = await adminService.toggleUserStatus(req.params.id);
  return ApiResponse.success(res, user, 'User status toggled');
});

const listCampaigns = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const data = await adminService.listCampaigns(page);
  return ApiResponse.success(res, data);
});

const toggleCampaign = asyncHandler(async (req, res) => {
  const campaign = await adminService.toggleCampaignStatus(req.params.id);
  return ApiResponse.success(res, campaign, 'Campaign status toggled');
});

module.exports = { listUsers, createUser, updateUser, toggleUser, listCampaigns, toggleCampaign };
