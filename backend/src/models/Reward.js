const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Reward = sequelize.define('Reward', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  campaignId: { type: DataTypes.BIGINT, allowNull: false },
  level: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  referralsRequired: { type: DataTypes.INTEGER, allowNull: false },
  link: { type: DataTypes.STRING(500), allowNull: true },
  type: { type: DataTypes.ENUM('pdf', 'content', 'video', 'other'), defaultValue: 'pdf' },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'rewards',
  indexes: [
    { fields: ['campaign_id'] },
  ],
});

module.exports = Reward;
