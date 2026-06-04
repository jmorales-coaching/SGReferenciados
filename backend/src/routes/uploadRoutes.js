const { Router } = require('express');
const { uploadFile, listFiles, deleteFile } = require('../controllers/uploadController');
const { authenticate } = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');

const router = Router();
router.use(authenticate);
router.post('/', upload.single('file'), uploadFile);
router.get('/', listFiles);
router.delete('/:id', deleteFile);

module.exports = router;
