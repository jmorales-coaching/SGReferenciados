const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Campaign = sequelize.define('Campaign', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, unique: true, allowNull: false },
  userId: { type: DataTypes.BIGINT, allowNull: false },
  name: { type: DataTypes.STRING(200), allowNull: false },
  slug: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.ENUM('draft', 'active', 'paused', 'completed'), defaultValue: 'draft' },
  settings: { type: DataTypes.JSONB, defaultValue: {} },
  totalLeads: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalReferrals: { type: DataTypes.INTEGER, defaultValue: 0 },
  deletedAt: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'campaigns',
  paranoid: true,
  indexes: [
    { unique: true, fields: ['slug'] },
    { fields: ['user_id'] },
    { fields: ['status'] },
  ],
});

module.exports = Campaign;
