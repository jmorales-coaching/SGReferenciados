const { Campaign, Referral, Analytics, User } = require('../models/associations');
const { Op, fn, col, literal } = require('sequelize');
const { sequelize } = require('../config/database');

class DashboardService {
  async getUserStats(userId) {
    const campaigns = await Campaign.findAll({ where: { userId } });
    const campaignIds = campaigns.map((c) => c.id);
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;
    const totalLeads = campaigns.reduce((s, c) => s + c.totalLeads, 0);
    const totalReferrals = campaigns.reduce((s, c) => s + c.totalReferrals, 0);

    const recentReferrals = await Referral.findAll({
      where: { campaignId: { [Op.in]: campaignIds } },
      order: [['createdAt', 'DESC']],
      limit: 10,
      include: [
        { association: 'referred', attributes: ['id', 'fullName', 'email'] },
      ],
    });

    const leadsByDay = await Analytics.findAll({
      where: { campaignId: { [Op.in]: campaignIds }, eventType: 'lead' },
      attributes: [
        [fn('DATE', col('created_at')), 'date'],
        [fn('COUNT', col('id')), 'count'],
      ],
      group: [fn('DATE', col('created_at'))],
      order: [[fn('DATE', col('created_at')), 'ASC']],
      limit: 30,
    });

    return { totalCampaigns, activeCampaigns, totalLeads, totalReferrals, recentReferrals, leadsByDay };
  }

  async getAdminStats() {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { active: true } });
    const totalCampaigns = await Campaign.count();
    const activeCampaigns = await Campaign.count({ where: { status: 'active' } });
    const totalLeads = await Campaign.sum('totalLeads').catch(() => 0);
    const totalReferrals = await Campaign.sum('totalReferrals').catch(() => 0);

    const recentUsers = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    const topCampaigns = await Campaign.findAll({
      order: [['totalLeads', 'DESC']],
      limit: 5,
      include: [{ association: 'owner', attributes: ['id', 'fullName', 'email'] }],
    });

    return { totalUsers, activeUsers, totalCampaigns, activeCampaigns, totalLeads, totalReferrals, recentUsers, topCampaigns };
  }
}

module.exports = new DashboardService();
