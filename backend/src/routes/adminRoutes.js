const { Router } = require('express');
const { listUsers, createUser, updateUser, toggleUser, listCampaigns, toggleCampaign } = require('../controllers/adminController');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createUserRules, updateUserRules } = require('../validators/adminValidator');

const router = Router();
router.use(authenticate, authorize('admin'));
router.get('/users', listUsers);
router.post('/users', validate(createUserRules), createUser);
router.put('/users/:id', validate(updateUserRules), updateUser);
router.patch('/users/:id/toggle', toggleUser);
router.get('/campaigns', listCampaigns);
router.patch('/campaigns/:id/toggle', toggleCampaign);

module.exports = router;
