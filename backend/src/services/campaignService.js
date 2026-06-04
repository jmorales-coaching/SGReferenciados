const { User, Campaign, LandingPage, LandingSection, Reward } = require('../models/associations');
const { generateSlug } = require('../utils/referralCode');

const PLAN_LIMITS = { free: 1, paid_3: 3, paid_2: 10, paid_1: Infinity };

class CampaignService {
  async checkLimit(userId) {
    const user = await User.findByPk(userId, { attributes: ['plan'] });
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
    const max = PLAN_LIMITS[user.plan] ?? 1;
    if (max === Infinity) return { max, current: 0 };
    const count = await Campaign.count({ where: { userId } });
    if (count >= max) {
      throw Object.assign(new Error(`Plan limit reached (${max} campaigns). Upgrade your plan to create more.`), { statusCode: 403 });
    }
    return { max, current: count };
  }

  async create(userId, data) {
    await this.checkLimit(userId);
    const slug = generateSlug(data.name);
    const campaign = await Campaign.create({
      userId,
      name: data.name,
      slug,
      description: data.description || '',
      settings: data.settings || {},
    });
    const lp = await LandingPage.create({ campaignId: campaign.id });
    await LandingSection.bulkCreate([
      { landingPageId: lp.id, type: 'hero', title: 'Consigue Acceso Exclusivo', content: { text: 'Regístrate y obtén contenido premium. Invita a tus amigos y desbloquea más beneficios.' }, order: 0 },
      { landingPageId: lp.id, type: 'benefits', title: 'Beneficios', content: { items: [{ icon: 'bi-gift', title: 'Lead Magnets', text: 'Contenido exclusivo para ti' }, { icon: 'bi-people', title: 'Fácil de Compartir', text: 'Link único para referir' }, { icon: 'bi-trophy', title: '3 Niveles', text: 'Más referidos, más premios' }] }, order: 1 },
    ]);
    return Campaign.findByPk(campaign.id, {
      include: [{ association: 'landingPage' }],
    });
  }

  async findAll(userId) {
    return await Campaign.findAll({
      where: { userId },
      include: [
        { association: 'landingPage' },
        { association: 'rewards' },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id, userId) {
    return await Campaign.findOne({
      where: { id, userId },
      include: [
        { association: 'landingPage', include: [{ association: 'sections', order: [['order', 'ASC']] }] },
        { association: 'rewards', include: [{ association: 'files' }] },
      ],
    });
  }

  async findBySlug(slug) {
    return await Campaign.findOne({
      where: { slug, status: 'active' },
      include: [
        { association: 'owner', attributes: ['id', 'fullName', 'avatar'] },
        { association: 'landingPage', include: [{ association: 'sections', where: { active: true }, order: [['order', 'ASC']], required: false }] },
        { association: 'rewards', where: { active: true }, required: false, include: [{ association: 'files' }] },
      ],
    });
  }

  async update(id, userId, data) {
    const campaign = await Campaign.findOne({ where: { id, userId } });
    if (!campaign) throw Object.assign(new Error('Campaign not found'), { statusCode: 404 });
    if (data.name && data.name !== campaign.name) {
      data.slug = generateSlug(data.name);
    }
    await campaign.update(data);
    return campaign;
  }

  async updateStatus(id, userId, status) {
    const campaign = await Campaign.findOne({ where: { id, userId } });
    if (!campaign) throw Object.assign(new Error('Campaign not found'), { statusCode: 404 });
    await campaign.update({ status });
    return campaign;
  }

  async duplicate(id, userId) {
    await this.checkLimit(userId);
    const original = await Campaign.findOne({
      where: { id, userId },
      include: [
        { association: 'rewards' },
        { association: 'landingPage', include: [{ association: 'sections' }] },
      ],
    });
    if (!original) throw Object.assign(new Error('Campaign not found'), { statusCode: 404 });
    const slug = generateSlug(original.name + ' copy');
    const copy = await Campaign.create({
      userId,
      name: original.name + ' (Copy)',
      slug,
      description: original.description,
      settings: original.settings,
    });
    const lp = await LandingPage.create({ campaignId: copy.id });
    if (original.landingPage?.sections) {
      for (const s of original.landingPage.sections) {
        await LandingSection.create({
          landingPageId: lp.id, type: s.type, title: s.title,
          content: s.content, order: s.order, active: s.active,
        });
      }
    }
    if (original.rewards) {
      for (const r of original.rewards) {
        await Reward.create({ campaignId: copy.id, level: r.level, name: r.name, description: r.description, referralsRequired: r.referralsRequired });
      }
    }
    return await Campaign.findByPk(copy.id, { include: [{ association: 'landingPage' }, { association: 'rewards' }] });
  }

  async delete(id, userId) {
    const campaign = await Campaign.findOne({ where: { id, userId } });
    if (!campaign) throw Object.assign(new Error('Campaign not found'), { statusCode: 404 });
    await campaign.destroy();
  }

  async getStats(userId) {
    const campaigns = await Campaign.findAll({ where: { userId } });
    const total = campaigns.length;
    const active = campaigns.filter((c) => c.status === 'active').length;
    const totalLeads = campaigns.reduce((s, c) => s + c.totalLeads, 0);
    const totalReferrals = campaigns.reduce((s, c) => s + c.totalReferrals, 0);
    return { total, active, totalLeads, totalReferrals };
  }

  async getReferrals(campaignId, userId) {
    const campaign = await Campaign.findOne({ where: { id: campaignId, userId } });
    if (!campaign) throw Object.assign(new Error('Campaign not found'), { statusCode: 404 });
    const referrals = await User.findAll({
      where: { campaignId, role: 'referenciado' },
      attributes: ['id', 'uuid', 'fullName', 'email', 'whatsapp', 'referralCode', 'referralCount', 'referredBy', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });
    return referrals;
  }
}

module.exports = new CampaignService();
