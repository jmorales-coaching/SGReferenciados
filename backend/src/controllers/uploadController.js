const { Upload } = require('../models/associations');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const uploadFile = asyncHandler(async (req, res) => {
  const fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'image';
  const record = await Upload.create({
    userId: req.user.id,
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    path: req.file.path,
    type: fileType,
  });
  return ApiResponse.created(res, record, 'File uploaded');
});

const listFiles = asyncHandler(async (req, res) => {
  const files = await Upload.findAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']],
  });
  return ApiResponse.success(res, files);
});

const deleteFile = asyncHandler(async (req, res) => {
  const file = await Upload.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!file) return ApiResponse.notFound(res, 'File not found');
  await file.destroy();
  return ApiResponse.success(res, null, 'File deleted');
});

module.exports = { uploadFile, listFiles, deleteFile };
