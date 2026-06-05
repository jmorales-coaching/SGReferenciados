const bcrypt = require('bcryptjs');
const { sequelize, testConnection } = require('./database');
const { User, Config } = require('../models/associations');
const { generateReferralCode } = require('../utils/referralCode');

const migrate = async () => {
  await testConnection();
  await sequelize.sync({ force: false, alter: true });

  // Seed default config
  await Config.upsert({ key: 'upgrade_text', value: 'Actualiza tu plan y obtén más beneficios' });
  await Config.upsert({ key: 'upgrade_link', value: '/#contacto' });

  // Seed default users (upsert so it's safe to re-run)
  await User.upsert({
    email: 'admin@sgreferidos.com',
    fullName: 'Admin',
    password: await bcrypt.hash('admin123', 12),
    role: 'admin',
    active: true,
    referralCode: generateReferralCode(),
  });

  await User.upsert({
    email: 'demo@sgreferidos.com',
    fullName: 'Demo User',
    password: await bcrypt.hash('demo123', 12),
    role: 'user',
    active: true,
    referralCode: generateReferralCode(),
  });

  console.log('[DB] Migration completed');
  console.log('  Admin: admin@sgreferidos.com / admin123');
  console.log('  User:  demo@sgreferidos.com / demo123');
  process.exit(0);
};

migrate().catch((err) => {
  console.error('[DB] Migration failed:', err.message);
  process.exit(1);
});
