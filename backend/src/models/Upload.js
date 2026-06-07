const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Upload = sequelize.define('Upload', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.BIGINT, allowNull: false },
  filename: { type: DataTypes.STRING(255), allowNull: false },
  originalName: { type: DataTypes.STRING(255), allowNull: false },
  mimeType: { type: DataTypes.STRING(100), allowNull: false },
  size: { type: DataTypes.INTEGER, allowNull: false },
  path: { type: DataTypes.STRING(500), allowNull: true },
  url: { type: DataTypes.STRING(500), allowNull: true },
  type: { type: DataTypes.ENUM('image', 'pdf', 'other'), allowNull: false },
}, {
  tableName: 'uploads',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['type'] },
  ],
});

module.exports = Upload;
