const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, unique: true, allowNull: false },
  fullName: { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false },
  password: { type: DataTypes.STRING(255), allowNull: true },
  whatsapp: { type: DataTypes.STRING(20), allowNull: true },
  company: { type: DataTypes.STRING(120), allowNull: true },
  role: { type: DataTypes.ENUM('admin', 'user', 'referenciado'), defaultValue: 'user', allowNull: false },
  plan: { type: DataTypes.ENUM('free', 'paid_3', 'paid_2', 'paid_1'), defaultValue: 'free', allowNull: false },
  type: { type: DataTypes.ENUM('user', 'lead'), defaultValue: 'user', allowNull: false },
  active: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
  avatar: { type: DataTypes.STRING(255), allowNull: true },
  referralCode: { type: DataTypes.STRING(10), unique: true, allowNull: true },
  referredBy: { type: DataTypes.STRING(10), allowNull: true },
  referralCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  campaignId: { type: DataTypes.BIGINT, allowNull: true },
  lastLogin: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'users',
  indexes: [
    { fields: ['email'] },
    { unique: true, fields: ['referral_code'] },
    { unique: true, fields: ['uuid'] },
    { fields: ['role'] },
    { fields: ['type'] },
    { fields: ['campaign_id'] },
  ],
});

module.exports = User;
