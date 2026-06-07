const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const env = require('../config/environment');
const ApiResponse = require('../utils/apiResponse');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'sg-referidos',
    resource_type: 'auto',
    public_id: (req, file) => `${Date.now()}-${file.originalname.replace(/\.[^.]+$/, '')}`,
  },
});

const fileFilter = (req, file, cb) => {
  const allowedImages = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const allowedDocs = ['application/pdf'];
  const allowed = [...allowedImages, ...allowedDocs];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: JPEG, PNG, GIF, WebP, PDF'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.upload.maxSize },
});

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return ApiResponse.error(res, 'File too large. Max 10MB', 400);
    }
    return ApiResponse.error(res, err.message, 400);
  }
  if (err) return ApiResponse.error(res, err.message, 400);
  next();
};

module.exports = { upload, handleMulterError };
