const landingService = require('../services/landingService');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const updatePage = asyncHandler(async (req, res) => {
  const page = await landingService.updatePage(req.params.campaignId, req.user.id, req.body);
  return ApiResponse.success(res, page, 'Landing page updated');
});

const getSections = asyncHandler(async (req, res) => {
  const sections = await landingService.getSections(req.params.landingPageId);
  return ApiResponse.success(res, sections);
});

const upsertSection = asyncHandler(async (req, res) => {
  const section = await landingService.upsertSection(req.params.campaignId, req.user.id, req.body);
  return ApiResponse.success(res, section, 'Section saved');
});

const deleteSection = asyncHandler(async (req, res) => {
  await landingService.deleteSection(req.params.campaignId, req.user.id, req.params.sectionId);
  return ApiResponse.success(res, null, 'Section deleted');
});

const reorderSections = asyncHandler(async (req, res) => {
  await landingService.reorderSections(req.params.campaignId, req.user.id, req.body.order);
  return ApiResponse.success(res, null, 'Order updated');
});

module.exports = { updatePage, getSections, upsertSection, deleteSection, reorderSections };
