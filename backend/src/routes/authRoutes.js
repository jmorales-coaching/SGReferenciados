const { Router } = require('express');
const { register, login, profile } = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { registerRules, loginRules } = require('../validators/authValidator');
const { authLimiter } = require('../middlewares/rateLimiter');

const router = Router();
router.post('/register', authLimiter, validate(registerRules), register);
router.post('/login', authLimiter, validate(loginRules), login);
router.get('/profile', authenticate, profile);

module.exports = router;
