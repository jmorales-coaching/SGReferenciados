const { Router } = require('express');
const { getConfig, updateConfig } = require('../controllers/configController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = Router();

// Public — no auth required (used by frontend layouts)
router.get('/', getConfig);

// Admin only
router.put('/', authenticate, authorize('admin'), updateConfig);

module.exports = router;
