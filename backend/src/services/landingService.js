const { LandingPage, LandingSection, Campaign } = require('../models/associations');

class LandingService {
  async updatePage(campaignId, userId, data) {
    const campaign = await Campaign.findOne({ where: { id: campaignId, userId } });
    if (!campaign) throw Object.assign(new Error('Campaign not found'), { statusCode: 404 });
    const lp = await LandingPage.findOne({ where: { campaignId } });
    if (!lp) throw Object.assign(new Error('Landing page not found'), { statusCode: 404 });
    if (data.publish) {
      data.publishedAt = new Date();
      delete data.publish;
      await campaign.update({ status: 'active' });
    }
    await lp.update(data);
    return await LandingPage.findByPk(lp.id, { include: [{ association: 'sections', order: [['order', 'ASC']] }] });
  }

  async getSections(landingPageId) {
    return await LandingSection.findAll({ where: { landingPageId }, order: [['order', 'ASC']] });
  }

  async upsertSection(campaignId, userId, data) {
    const campaign = await Campaign.findOne({ where: { id: campaignId, userId } });
    if (!campaign) throw Object.assign(new Error('Campaign not found'), { statusCode: 404 });
    const lp = await LandingPage.findOne({ where: { campaignId } });
    if (!lp) throw Object.assign(new Error('Landing page not found'), { statusCode: 404 });
    if (data.id) {
      const section = await LandingSection.findOne({ where: { id: data.id, landingPageId: lp.id } });
      if (!section) throw Object.assign(new Error('Section not found'), { statusCode: 404 });
      await section.update(data);
      return section;
    }
    return await LandingSection.create({
      landingPageId: lp.id,
      type: data.type,
      title: data.title || '',
      content: data.content || {},
      order: data.order || 0,
      active: data.active !== undefined ? data.active : true,
    });
  }

  async deleteSection(campaignId, userId, sectionId) {
    const campaign = await Campaign.findOne({ where: { id: campaignId, userId } });
    if (!campaign) throw Object.assign(new Error('Campaign not found'), { statusCode: 404 });
    const lp = await LandingPage.findOne({ where: { campaignId } });
    const section = await LandingSection.findOne({ where: { id: sectionId, landingPageId: lp.id } });
    if (!section) throw Object.assign(new Error('Section not found'), { statusCode: 404 });
    await section.destroy();
  }

  async reorderSections(campaignId, userId, order) {
    const campaign = await Campaign.findOne({ where: { id: campaignId, userId } });
    if (!campaign) throw Object.assign(new Error('Campaign not found'), { statusCode: 404 });
    const lp = await LandingPage.findOne({ where: { campaignId } });
    for (const item of order) {
      await LandingSection.update({ order: item.order }, { where: { id: item.id, landingPageId: lp.id } });
    }
  }
}

module.exports = new LandingService();
