const { Router } = require('express');
const { register, getProgress } = require('../controllers/leadController');
const { authLimiter } = require('../middlewares/rateLimiter');

const router = Router();
router.post('/register', authLimiter, register);
router.get('/:uuid/progress', getProgress);

module.exports = router;
