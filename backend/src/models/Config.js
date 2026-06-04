const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Config = sequelize.define('Config', {
  key: { type: DataTypes.STRING(100), primaryKey: true },
  value: { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName: 'configs',
  timestamps: true,
  underscored: true,
});

module.exports = Config;
