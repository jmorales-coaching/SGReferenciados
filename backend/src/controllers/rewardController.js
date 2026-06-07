const rewardService = require('../services/rewardService');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const create = asyncHandler(async (req, res) => {
  const reward = await rewardService.create(req.params.campaignId, req.user.id, req.body);
  return ApiResponse.created(res, reward, 'Reward created');
});

const update = asyncHandler(async (req, res) => {
  const reward = await rewardService.update(req.params.id, req.params.campaignId, req.user.id, req.body);
  return ApiResponse.success(res, reward, 'Reward updated');
});

const remove = asyncHandler(async (req, res) => {
  await rewardService.delete(req.params.id, req.params.campaignId, req.user.id);
  return ApiResponse.success(res, null, 'Reward deleted');
});

const attachFile = asyncHandler(async (req, res) => {
  const file = await rewardService.attachFile(req.params.id, req.params.campaignId, req.user.id, {
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    path: null,
    url: req.file.path,
  });
  return ApiResponse.created(res, file, 'File attached');
});

const removeFile = asyncHandler(async (req, res) => {
  await rewardService.removeFile(req.params.fileId, req.params.campaignId, req.user.id);
  return ApiResponse.success(res, null, 'File removed');
});

module.exports = { create, update, remove, attachFile, removeFile };
