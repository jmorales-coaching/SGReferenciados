const { Sequelize } = require('sequelize');
const env = require('./environment');

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'postgres',
  dialectOptions: {
    ssl: env.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
  },
  logging: env.nodeEnv === 'development' ? false : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('[DB] PostgreSQL connected successfully');
  } catch (error) {
    console.error('[DB] Connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, testConnection };
