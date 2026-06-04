const { body } = require('express-validator');

const createRules = [
  body('name').trim().notEmpty().withMessage('Campaign name is required').isLength({ max: 200 }).escape(),
  body('description').optional().trim().escape(),
];

const updateRules = [
  body('name').optional().trim().isLength({ max: 200 }).escape(),
  body('description').optional().trim().escape(),
  body('settings').optional().isObject(),
];

module.exports = { createRules, updateRules };
