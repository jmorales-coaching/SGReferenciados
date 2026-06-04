const bcrypt = require('bcryptjs');
const { User, Campaign } = require('../models/associations');
const { generateReferralCode } = require('../utils/referralCode');

const PLAN_LIMITS = { free: 1, paid_3: 3, paid_2: 10, paid_1: Infinity };

class AdminService {
  async listUsers(page = 1, limit = 20, role = null) {
    const offset = (page - 1) * limit;
    const where = {};
    if (role) where.role = role;
    const { rows, count } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      include: [{ association: 'campaigns', attributes: ['id'], required: false }],
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      distinct: true,
    });
    const users = rows.map((u) => {
      const json = u.toJSON();
      json.maxCampaigns = PLAN_LIMITS[json.plan] ?? 1;
      return json;
    });
    return { users, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async createUser(data) {
    const existing = await User.findOne({ where: { email: data.email } });
    if (existing) throw Object.assign(new Error('Email already registered'), { statusCode: 409 });
    const hashed = await bcrypt.hash(data.password, 12);
    let code, exists;
    do {
      code = generateReferralCode();
      exists = await User.findOne({ where: { referralCode: code } });
    } while (exists);
    const user = await User.create({
      fullName: data.fullName,
      email: data.email,
      password: hashed,
      role: data.role || 'user',
      plan: data.plan || 'free',
      whatsapp: data.whatsapp || null,
      company: data.company || null,
      referralCode: code,
    });
    const { password, ...sanitized } = user.toJSON();
    return sanitized;
  }

  async updateUser(userId, data) {
    const user = await User.findByPk(userId);
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
    if (data.email && data.email !== user.email) {
      const existing = await User.findOne({ where: { email: data.email } });
      if (existing) throw Object.assign(new Error('Email already in use'), { statusCode: 409 });
    }
    const updates = {};
    if (data.fullName) updates.fullName = data.fullName;
    if (data.email) updates.email = data.email;
    if (data.role) updates.role = data.role;
    if (data.plan) updates.plan = data.plan;
    if (data.company !== undefined) updates.company = data.company;
    if (data.whatsapp !== undefined) updates.whatsapp = data.whatsapp;
    if (data.active !== undefined) updates.active = data.active;
    if (data.password) updates.password = await bcrypt.hash(data.password, 12);
    await user.update(updates);
    const { password, ...sanitized } = user.toJSON();
    return sanitized;
  }

  async toggleUserStatus(userId) {
    const user = await User.findByPk(userId);
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
    await user.update({ active: !user.active });
    return user;
  }

  async listCampaigns(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const { rows, count } = await Campaign.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      include: [{ association: 'owner', attributes: ['id', 'fullName', 'email'] }],
    });
    return { campaigns: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async toggleCampaignStatus(campaignId) {
    const campaign = await Campaign.findByPk(campaignId);
    if (!campaign) throw Object.assign(new Error('Campaign not found'), { statusCode: 404 });
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    await campaign.update({ status: newStatus });
    return campaign;
  }
}

module.exports = new AdminService();
