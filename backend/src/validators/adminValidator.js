const { body } = require('express-validator');

const createUserRules = [
  body('fullName').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 120 }).escape(),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().normalizeEmail().escape(),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Min 6 characters'),
  body('role').optional().isIn(['user', 'admin', 'referenciado']).withMessage('Role must be user, admin or referenciado'),
  body('plan').optional().isIn(['free', 'paid_3', 'paid_2', 'paid_1']).withMessage('Invalid plan'),
  body('company').optional().trim().escape(),
  body('whatsapp').optional().trim().matches(/^\+?\d{7,15}$/).withMessage('Invalid WhatsApp').escape(),
];

const updateUserRules = [
  body('fullName').optional().trim().isLength({ min: 2, max: 120 }).escape(),
  body('email').optional().trim().isEmail().normalizeEmail().escape(),
  body('password').optional().isLength({ min: 6 }).withMessage('Min 6 characters'),
  body('role').optional().isIn(['user', 'admin', 'referenciado']).withMessage('Role must be user, admin or referenciado'),
  body('plan').optional().isIn(['free', 'paid_3', 'paid_2', 'paid_1']).withMessage('Invalid plan'),
  body('company').optional().trim().escape(),
  body('whatsapp').optional().trim().matches(/^\+?\d{7,15}$/).withMessage('Invalid WhatsApp').escape(),
  body('active').optional().isBoolean().withMessage('Active must be boolean'),
  body('plan').optional().isIn(['free', 'paid_3', 'paid_2', 'paid_1']).withMessage('Invalid plan'),
];

module.exports = { createUserRules, updateUserRules };
