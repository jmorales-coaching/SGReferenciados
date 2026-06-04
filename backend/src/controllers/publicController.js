const campaignService = require('../services/campaignService');
const rewardService = require('../services/rewardService');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getCampaignLanding = asyncHandler(async (req, res) => {
  const campaign = await campaignService.findBySlug(req.params.slug);
  if (!campaign) return ApiResponse.notFound(res, 'Campaign not found');
  return ApiResponse.success(res, campaign);
});

module.exports = { getCampaignLanding };
