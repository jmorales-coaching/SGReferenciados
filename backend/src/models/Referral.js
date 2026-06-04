const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Referral = sequelize.define('Referral', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  campaignId: { type: DataTypes.BIGINT, allowNull: false },
  referrerId: { type: DataTypes.BIGINT, allowNull: false },
  referredId: { type: DataTypes.BIGINT, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'confirmed', 'rewarded'), defaultValue: 'confirmed' },
}, {
  tableName: 'referrals',
  indexes: [
    { fields: ['campaign_id'] },
    { fields: ['referrer_id'] },
    { fields: ['referred_id'] },
  ],
});

module.exports = Referral;
