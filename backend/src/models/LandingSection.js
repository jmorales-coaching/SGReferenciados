const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LandingSection = sequelize.define('LandingSection', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  landingPageId: { type: DataTypes.BIGINT, allowNull: false },
  type: { type: DataTypes.STRING(50), allowNull: false },
  title: { type: DataTypes.STRING(200), allowNull: true },
  content: { type: DataTypes.JSONB, defaultValue: {} },
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'landing_sections',
  indexes: [
    { fields: ['landing_page_id'] },
    { fields: ['order'] },
  ],
});

module.exports = LandingSection;
