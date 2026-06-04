const { Router } = require('express');
const { updatePage, getSections, upsertSection, deleteSection, reorderSections } = require('../controllers/landingController');
const { authenticate } = require('../middlewares/auth');

const router = Router();
router.use(authenticate);
router.put('/:campaignId/page', updatePage);
router.get('/:landingPageId/sections', getSections);
router.post('/:campaignId/sections', upsertSection);
router.put('/:campaignId/sections', upsertSection);
router.delete('/:campaignId/sections/:sectionId', deleteSection);
router.put('/:campaignId/sections/reorder', reorderSections);

module.exports = router;
