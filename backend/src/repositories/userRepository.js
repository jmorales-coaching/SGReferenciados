const { sequelize } = require('../config/database');
const User = require('../models/User');

class UserRepository {
  async create(data) {
    return await User.create(data);
  }

  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async findById(id) {
    return await User.findByPk(id);
  }

  async findByReferralCode(code) {
    return await User.findOne({ where: { referralCode: code } });
  }

  async findByUuid(uuid) {
    return await User.findOne({ where: { uuid } });
  }

  async incrementReferralCount(code) {
    const [affected] = await User.update(
      { referralCount: sequelize.literal('referral_count + 1') },
      { where: { referralCode: code } }
    );
    return affected > 0;
  }

  async updateUnlockedReward(id, level) {
    return await User.update({ unlockedReward: level }, { where: { id } });
  }

  async getReferralCount(code) {
    const user = await this.findByReferralCode(code);
    return user ? user.referralCount : 0;
  }
}

module.exports = new UserRepository();
