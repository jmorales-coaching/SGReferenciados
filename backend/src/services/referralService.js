const userRepository = require('../repositories/userRepository');
const { generateReferralCode } = require('../utils/referralCode');
const logger = require('../utils/logger');

class ReferralService {
  async register(data) {
    const code = await this._generateUniqueCode();

    const userData = {
      fullName: data.fullName,
      email: data.email,
      whatsapp: data.whatsapp,
      referralCode: code,
    };

    if (data.ref) {
      const referrer = await userRepository.findByReferralCode(data.ref);
      if (referrer) {
        userData.referredBy = data.ref;
      }
    }

    const user = await userRepository.create(userData);

    if (userData.referredBy) {
      await this._incrementReferrerCount(userData.referredBy);
    }

    logger.info('User registered', { uuid: user.uuid, referralCode: code, referredBy: data.ref || null });

    return user;
  }

  async _generateUniqueCode() {
    let code;
    let exists = true;
    do {
      code = generateReferralCode();
      exists = await userRepository.findByReferralCode(code);
    } while (exists);
    return code;
  }

  async _incrementReferrerCount(code) {
    const user = await userRepository.findByReferralCode(code);
    if (user) {
      await user.increment('referralCount');
    }
  }

  async getReferralInfo(code) {
    const user = await userRepository.findByReferralCode(code);
    if (!user) return null;
    return {
      fullName: user.fullName,
      referralCount: user.referralCount,
      referralCode: user.referralCode,
    };
  }
}

module.exports = new ReferralService();
