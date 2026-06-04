const { body } = require('express-validator');

const registerRules = [
  body('fullName').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 120 }).escape(),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().normalizeEmail().escape(),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Min 6 characters'),
  body('company').optional().trim().escape(),
  body('whatsapp').optional().trim().matches(/^\+?\d{7,15}$/).withMessage('Invalid WhatsApp').escape(),
];

const loginRules = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { registerRules, loginRules };
