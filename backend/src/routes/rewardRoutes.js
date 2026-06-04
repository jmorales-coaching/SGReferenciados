const { Router } = require('express');
const { create, update, remove, attachFile, removeFile } = require('../controllers/rewardController');
const { authenticate } = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');

const router = Router();
router.use(authenticate);
router.post('/:campaignId', create);
router.put('/:id/campaigns/:campaignId', update);
router.delete('/:id/campaigns/:campaignId', remove);
router.post('/:id/campaigns/:campaignId/files', upload.single('file'), attachFile);
router.delete('/files/:fileId/campaigns/:campaignId', removeFile);

module.exports = router;
