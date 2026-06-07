const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RewardFile = sequelize.define('RewardFile', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  rewardId: { type: DataTypes.BIGINT, allowNull: false },
  filename: { type: DataTypes.STRING(255), allowNull: false },
  originalName: { type: DataTypes.STRING(255), allowNull: false },
  mimeType: { type: DataTypes.STRING(100), allowNull: false },
  size: { type: DataTypes.INTEGER, allowNull: false },
  path: { type: DataTypes.STRING(500), allowNull: true },
  url: { type: DataTypes.STRING(500), allowNull: true },
}, {
  tableName: 'reward_files',
  indexes: [
    { fields: ['reward_id'] },
  ],
});

module.exports = RewardFile;
