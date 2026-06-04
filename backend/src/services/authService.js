const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/associations');
const { generateReferralCode } = require('../utils/referralCode');
const env = require('../config/environment');

const PLAN_LIMITS = { free: 1, paid_3: 3, paid_2: 10, paid_1: Infinity };

const getMaxCampaigns = (plan) => PLAN_LIMITS[plan] ?? 1;

class AuthService {
  async register(data) {
    const existing = await User.findOne({ where: { email: data.email } });
    if (existing) throw Object.assign(new Error('Email already registered'), { statusCode: 409 });
    const hashed = await bcrypt.hash(data.password, 12);
    const code = await this._uniqueCode();
    const user = await User.create({
      fullName: data.fullName,
      email: data.email,
      password: hashed,
      plan: data.plan || 'free',
      whatsapp: data.whatsapp || null,
      company: data.company || null,
      referralCode: code,
    });
    const token = this._generateToken(user);
    return { token, user: this._sanitize(user) };
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    if (!user.active) throw Object.assign(new Error('Account deactivated'), { statusCode: 403 });
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    if (user.role === 'referenciado') throw Object.assign(new Error('Account not authorized for login'), { statusCode: 403 });
    await user.update({ lastLogin: new Date() });
    const token = this._generateToken(user);
    return { token, user: this._sanitize(user) };
  }

  async getProfile(id) {
    const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
    return user;
  }

  _generateToken(user) {
    return jwt.sign({ id: user.id, role: user.role, plan: user.plan }, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
  }

  getMaxCampaigns(plan) {
    return PLAN_LIMITS[plan] ?? 1;
  }

  _sanitize(user) {
    const { password, ...rest } = user.toJSON();
    return rest;
  }

  async _uniqueCode() {
    let code, exists;
    do {
      code = generateReferralCode();
      exists = await User.findOne({ where: { referralCode: code } });
    } while (exists);
    return code;
  }
}

module.exports = new AuthService();
