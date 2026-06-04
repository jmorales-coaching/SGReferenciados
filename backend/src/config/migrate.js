const { sequelize, testConnection } = require('./database');
const { Config } = require('../models/associations');

const migrate = async () => {
  await testConnection();
  await sequelize.sync({ force: false, alter: true });
  // Seed default config
  await Config.upsert({ key: 'upgrade_text', value: 'Actualiza tu plan y obtén más beneficios' });
  await Config.upsert({ key: 'upgrade_link', value: '/#contacto' });
  console.log('[DB] Migration completed');
  process.exit(0);
};

migrate().catch((err) => {
  console.error('[DB] Migration failed:', err.message);
  process.exit(1);
});
