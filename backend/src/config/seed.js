const bcrypt = require('bcryptjs');
const { sequelize, testConnection } = require('./database');
const { User } = require('../models/associations');
const { generateReferralCode } = require('../utils/referralCode');

const seed = async () => {
  await testConnection();
  await sequelize.sync({ force: true });

  const admin = await User.create({
    fullName: 'Admin',
    email: 'admin@sgreferidos.com',
    password: await bcrypt.hash('admin123', 12),
    role: 'admin',
    active: true,
    referralCode: generateReferralCode(),
  });

  const user = await User.create({
    fullName: 'Demo User',
    email: 'demo@sgreferidos.com',
    password: await bcrypt.hash('demo123', 12),
    role: 'user',
    active: true,
    referralCode: generateReferralCode(),
  });

  console.log('[DB] Seed completed');
  console.log('  Admin: admin@sgreferidos.com / admin123');
  console.log('  User:  demo@sgreferidos.com / demo123');
  process.exit(0);
};

seed().catch((err) => {
  console.error('[DB] Seed failed:', err.message);
  process.exit(1);
});
