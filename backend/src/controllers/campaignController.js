const campaignService = require('../services/campaignService');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const create = asyncHandler(async (req, res) => {
  const campaign = await campaignService.create(req.user.id, req.body);
  return ApiResponse.created(res, campaign, 'Campaign created');
});

const list = asyncHandler(async (req, res) => {
  const campaigns = await campaignService.findAll(req.user.id);
  return ApiResponse.success(res, campaigns);
});

const get = asyncHandler(async (req, res) => {
  const campaign = await campaignService.findById(req.params.id, req.user.id);
  if (!campaign) return ApiResponse.notFound(res, 'Campaign not found');
  return ApiResponse.success(res, campaign);
});

const update = asyncHandler(async (req, res) => {
  const campaign = await campaignService.update(req.params.id, req.user.id, req.body);
  return ApiResponse.success(res, campaign, 'Campaign updated');
});

const updateStatus = asyncHandler(async (req, res) => {
  const campaign = await campaignService.updateStatus(req.params.id, req.user.id, req.body.status);
  return ApiResponse.success(res, campaign, 'Status updated');
});

const duplicate = asyncHandler(async (req, res) => {
  const campaign = await campaignService.duplicate(req.params.id, req.user.id);
  return ApiResponse.created(res, campaign, 'Campaign duplicated');
});

const remove = asyncHandler(async (req, res) => {
  await campaignService.delete(req.params.id, req.user.id);
  return ApiResponse.success(res, null, 'Campaign deleted');
});

const stats = asyncHandler(async (req, res) => {
  const data = await campaignService.getStats(req.user.id);
  return ApiResponse.success(res, data);
});

const listReferrals = asyncHandler(async (req, res) => {
  const referrals = await campaignService.getReferrals(req.params.id, req.user.id);
  return ApiResponse.success(res, referrals);
});

module.exports = { create, list, get, update, updateStatus, duplicate, remove, stats, listReferrals };
