const { User, Campaign, Reward, RewardFile } = require('../models/associations');
const { generateReferralCode } = require('../utils/referralCode');

class LeadService {
  async register(data) {
    const campaign = await Campaign.findOne({
      where: { slug: data.campaignSlug, status: 'active' },
      include: [{ association: 'owner', attributes: ['id', 'referralCode'] }],
    });
    if (!campaign) throw Object.assign(new Error('Campaign not found or inactive'), { statusCode: 404 });

    const existing = await User.findOne({ where: { email: data.email, campaignId: campaign.id } });
    if (existing) throw Object.assign(new Error(`Email already registered for campaign "${campaign.name}" (ID: ${campaign.id})`), { statusCode: 409 });

    // Determine who gets the referral credit: ?ref code > campaign owner
    let referrerCode = null;
    if (data.ref) {
      const refUser = await User.findOne({ where: { referralCode: data.ref } });
      if (refUser) referrerCode = data.ref;
    }
    if (!referrerCode) referrerCode = campaign.owner?.referralCode || null;

    await campaign.increment('totalLeads');

    if (referrerCode) {
      const [updated] = await User.increment('referralCount', { where: { referralCode: referrerCode } });
      if (updated > 0) {
        await campaign.increment('totalReferrals');
      }
    }

    const code = await this._uniqueCode();
    const lead = await User.create({
      fullName: data.fullName,
      email: data.email,
      whatsapp: data.whatsapp,
      role: 'referenciado',
      referralCode: code,
      referredBy: referrerCode,
      campaignId: campaign.id,
    });

    return {
      uuid: lead.uuid,
      fullName: lead.fullName,
      referralCode: lead.referralCode,
      campaignId: campaign.id,
      campaignName: campaign.name,
      campaignSlug: campaign.slug,
    };
  }

  async getProgress(uuid) {
    const lead = await User.findOne({ where: { uuid, role: 'referenciado' } });
    if (!lead) throw Object.assign(new Error('Lead not found'), { statusCode: 404 });

    const rewards = await Reward.findAll({
      where: { campaignId: lead.campaignId, active: true },
      include: [{ association: 'files' }],
      order: [['level', 'ASC']],
    });

    const unlocked = rewards.filter((r) => lead.referralCount >= r.referralsRequired);
    const next = rewards.find((r) => lead.referralCount < r.referralsRequired);
    const allUnlocked = !next;

    const currentTier = unlocked.length;
    const totalTiers = rewards.length;
    const progress = totalTiers > 0 ? (currentTier / totalTiers) * 100 : 0;

    const campaign = await Campaign.findByPk(lead.campaignId, { attributes: ['slug', 'name'] });

    return {
      uuid: lead.uuid,
      fullName: lead.fullName,
      referralCode: lead.referralCode,
      referralCount: lead.referralCount,
      campaignId: lead.campaignId,
      campaignSlug: campaign?.slug || '',
      campaignName: campaign?.name || '',
      rewards: rewards.map((r) => ({
        id: r.id,
        level: r.level,
        name: r.name,
        description: r.description,
        link: r.link,
        referralsRequired: r.referralsRequired,
        unlocked: lead.referralCount >= r.referralsRequired,
        files: r.files?.map((f) => ({
          id: f.id,
          originalName: f.originalName,
          url: `/uploads/${f.filename}`,
        })) || [],
      })),
      nextReward: next ? { name: next.name, referralsRequired: next.referralsRequired, remaining: next.referralsRequired - lead.referralCount } : null,
      progress: Math.round(progress),
      allUnlocked,
    };
  }

  async _uniqueCode() {
    let code, exists;
    do { code = generateReferralCode(); exists = await User.findOne({ where: { referralCode: code } }); } while (exists);
    return code;
  }
}

module.exports = new LeadService();
