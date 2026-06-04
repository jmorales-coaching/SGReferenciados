const { Router } = require('express');
const { getCampaignLanding } = require('../controllers/publicController');

const router = Router();
router.get('/c/:slug', getCampaignLanding);

module.exports = router;
