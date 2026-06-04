const { Router } = require('express');
const { create, list, get, update, updateStatus, duplicate, remove, stats, listReferrals } = require('../controllers/campaignController');
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createRules, updateRules } = require('../validators/campaignValidator');

const router = Router();
router.use(authenticate);
router.get('/stats', stats);
router.get('/', list);
router.get('/:id', get);
router.post('/', validate(createRules), create);
router.put('/:id', validate(updateRules), update);
router.patch('/:id/status', updateStatus);
router.post('/:id/duplicate', duplicate);
router.delete('/:id', remove);
router.get('/:id/referrals', listReferrals);

module.exports = router;
