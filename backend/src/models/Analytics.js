const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Analytics = sequelize.define('Analytics', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  campaignId: { type: DataTypes.BIGINT, allowNull: false },
  eventType: { type: DataTypes.STRING(50), allowNull: false },
  metadata: { type: DataTypes.JSONB, defaultValue: {} },
  ip: { type: DataTypes.STRING(45), allowNull: true },
  userAgent: { type: DataTypes.TEXT, allowNull: true },
  referrer: { type: DataTypes.TEXT, allowNull: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'analytics',
  timestamps: false,
  indexes: [
    { fields: ['campaign_id'] },
    { fields: ['event_type'] },
    { fields: ['created_at'] },
  ],
});

module.exports = Analytics;
