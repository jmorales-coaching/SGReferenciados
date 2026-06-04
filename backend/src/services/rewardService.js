const { Reward, RewardFile, Campaign } = require('../models/associations');

class RewardService {
  async create(campaignId, userId, data) {
    const campaign = await Campaign.findOne({ where: { id: campaignId, userId } });
    if (!campaign) throw Object.assign(new Error('Campaign not found'), { statusCode: 404 });
    const existing = await Reward.count({ where: { campaignId } });
    return await Reward.create({ campaignId, level: existing + 1, ...data });
  }

  async update(id, campaignId, userId, data) {
    const campaign = await Campaign.findOne({ where: { id: campaignId, userId } });
    if (!campaign) throw Object.assign(new Error('Campaign not found'), { statusCode: 404 });
    const reward = await Reward.findOne({ where: { id, campaignId } });
    if (!reward) throw Object.assign(new Error('Reward not found'), { statusCode: 404 });
    await reward.update(data);
    return reward;
  }

  async delete(id, campaignId, userId) {
    const campaign = await Campaign.findOne({ where: { id: campaignId, userId } });
    if (!campaign) throw Object.assign(new Error('Campaign not found'), { statusCode: 404 });
    const reward = await Reward.findOne({ where: { id, campaignId } });
    if (!reward) throw Object.assign(new Error('Reward not found'), { statusCode: 404 });
    await reward.destroy();
  }

  async attachFile(rewardId, campaignId, userId, fileData) {
    const campaign = await Campaign.findOne({ where: { id: campaignId, userId } });
    if (!campaign) throw Object.assign(new Error('Campaign not found'), { statusCode: 404 });
    const reward = await Reward.findOne({ where: { id: rewardId, campaignId } });
    if (!reward) throw Object.assign(new Error('Reward not found'), { statusCode: 404 });
    return await RewardFile.create({ rewardId, ...fileData });
  }

  async removeFile(fileId, campaignId, userId) {
    const file = await RewardFile.findByPk(fileId, {
      include: { association: 'reward', where: { campaignId } },
    });
    if (!file) throw Object.assign(new Error('File not found'), { statusCode: 404 });
    await file.destroy();
  }

  async getUserRewards(campaignId, referralCount) {
    const rewards = await Reward.findAll({ where: { campaignId, active: true }, include: [{ association: 'files' }] });
    return rewards.map((r) => ({
      ...r.toJSON(),
      unlocked: referralCount >= r.referralsRequired,
    }));
  }
}

module.exports = new RewardService();
