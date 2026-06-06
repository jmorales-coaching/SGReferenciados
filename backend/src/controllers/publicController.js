const campaignService = require('../services/campaignService');
const rewardService = require('../services/rewardService');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const absUrls = (obj, base) => {
  if (typeof obj === 'string') {
    return obj
      .replace(/(src=")(\/uploads\/)/g, `$1${base}$2`)
      .replace(/(url\()(\/uploads\/)/g, `$1${base}$2`)
      .replace(/^(\/uploads\/)/, `${base}$1`);
  }
  if (Array.isArray(obj)) return obj.map(v => absUrls(v, base));
  if (obj && typeof obj === 'object') {
    for (const k of Object.keys(obj)) obj[k] = absUrls(obj[k], base);
  }
  return obj;
};

const getCampaignLanding = asyncHandler(async (req, res) => {
  const campaign = await campaignService.findBySlug(req.params.slug);
  if (!campaign) return ApiResponse.notFound(res, 'Campaign not found');
  const base = `${req.protocol}://${req.get('host')}`;
  absUrls(campaign, base);
  if (campaign.landingPage?.formIcon && campaign.landingPage.formIcon.startsWith('/')) {
    campaign.landingPage.formIcon = `${base}${campaign.landingPage.formIcon}`;
  }
  return ApiResponse.success(res, campaign);
});

module.exports = { getCampaignLanding };
