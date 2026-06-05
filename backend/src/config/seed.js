const bcrypt = require('bcryptjs');
const { sequelize, testConnection } = require('./database');
const { User, Config } = require('../models/associations');
const { generateReferralCode } = require('../utils/referralCode');

const seed = async () => {
  await testConnection();

  const [admin] = await User.upsert({
    email: 'admin@sgreferidos.com',
    fullName: 'Admin',
    password: await bcrypt.hash('admin123', 12),
    role: 'admin',
    active: true,
    referralCode: generateReferralCode(),
  });

  const [user] = await User.upsert({
    email: 'demo@sgreferidos.com',
    fullName: 'Demo User',
    password: await bcrypt.hash('demo123', 12),
    role: 'user',
    active: true,
    referralCode: generateReferralCode(),
  });

  await Config.upsert({ key: 'upgrade_text', value: 'Actualiza tu plan y obtén más beneficios' });
  await Config.upsert({ key: 'upgrade_link', value: '/#contacto' });

  console.log('[DB] Seed completed');
  console.log('  Admin: admin@sgreferidos.com / admin123');
  console.log('  User:  demo@sgreferidos.com / demo123');
  process.exit(0);
};

seed().catch((err) => {
  console.error('[DB] Seed failed:', err.message);
  process.exit(1);
});
