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

  // Seed default users (safe to re-run — email is not unique, so we use findOrCreate)
  const seedUser = async (data) => {
    const existing = await User.findOne({ where: { email: data.email, campaignId: null } });
    if (existing) {
      await existing.update({ ...data, id: existing.id });
    } else {
      await User.create(data);
    }
  };

  const hash = await bcrypt.hash('admin123', 12);
  await seedUser({ email: 'admin@sgreferidos.com', fullName: 'Admin', password: hash, role: 'admin', active: true, referralCode: generateReferralCode() });

  const hash2 = await bcrypt.hash('demo123', 12);
  await seedUser({ email: 'demo@sgreferidos.com', fullName: 'Demo User', password: hash2, role: 'user', active: true, referralCode: generateReferralCode() });

  console.log('[DB] Migration completed');
  console.log('  Admin: admin@sgreferidos.com / admin123');
  console.log('  User:  demo@sgreferidos.com / demo123');
  process.exit(0);
};

migrate().catch((err) => {
  console.error('[DB] Migration failed:', err.message);
  process.exit(1);
});
