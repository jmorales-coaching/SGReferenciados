const { Router } = require('express');
const { userStats, adminStats } = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = Router();
router.use(authenticate);
router.get('/user', userStats);
router.get('/admin', authorize('admin'), adminStats);

module.exports = router;
