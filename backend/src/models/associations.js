const User = require('./User');
const Campaign = require('./Campaign');
const LandingPage = require('./LandingPage');
const LandingSection = require('./LandingSection');
const Reward = require('./Reward');
const RewardFile = require('./RewardFile');
const Upload = require('./Upload');
const Analytics = require('./Analytics');
const Referral = require('./Referral');

User.hasMany(Campaign, { foreignKey: 'userId', as: 'campaigns' });
Campaign.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

Campaign.hasOne(LandingPage, { foreignKey: 'campaignId', as: 'landingPage' });
LandingPage.belongsTo(Campaign, { foreignKey: 'campaignId', as: 'campaign' });

LandingPage.hasMany(LandingSection, { foreignKey: 'landingPageId', as: 'sections' });
LandingSection.belongsTo(LandingPage, { foreignKey: 'landingPageId' });

Campaign.hasMany(Reward, { foreignKey: 'campaignId', as: 'rewards' });
Reward.belongsTo(Campaign, { foreignKey: 'campaignId' });

Reward.hasMany(RewardFile, { foreignKey: 'rewardId', as: 'files' });
RewardFile.belongsTo(Reward, { foreignKey: 'rewardId' });

User.hasMany(Upload, { foreignKey: 'userId', as: 'uploads' });
Upload.belongsTo(User, { foreignKey: 'userId' });

Campaign.hasMany(Analytics, { foreignKey: 'campaignId', as: 'analytics' });
Analytics.belongsTo(Campaign, { foreignKey: 'campaignId' });

Campaign.hasMany(Referral, { foreignKey: 'campaignId', as: 'referrals' });
Referral.belongsTo(Campaign, { foreignKey: 'campaignId' });
Referral.belongsTo(User, { foreignKey: 'referrerId', as: 'referrer' });
Referral.belongsTo(User, { foreignKey: 'referredId', as: 'referred' });

const Config = require('./Config');

module.exports = { User, Campaign, LandingPage, LandingSection, Reward, RewardFile, Upload, Analytics, Referral, Config };
