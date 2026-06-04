const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LandingPage = sequelize.define('LandingPage', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  campaignId: { type: DataTypes.BIGINT, allowNull: false },
  seoTitle: { type: DataTypes.STRING(200), allowNull: true },
  seoDescription: { type: DataTypes.TEXT, allowNull: true },
  favicon: { type: DataTypes.STRING(255), allowNull: true },
  customDomain: { type: DataTypes.STRING(255), allowNull: true },
  primaryColor: { type: DataTypes.STRING(7), defaultValue: '#0d6efd' },
  secondaryColor: { type: DataTypes.STRING(7), defaultValue: '#6610f2' },
  fontFamily: { type: DataTypes.STRING(100), defaultValue: 'Inter' },
  publishedAt: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'landing_pages',
  indexes: [
    { fields: ['campaign_id'] },
  ],
});

module.exports = LandingPage;
