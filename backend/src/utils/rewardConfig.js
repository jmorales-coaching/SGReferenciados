const REWARDS = [
  { level: 0, name: 'Sin recompensas', referralsRequired: 0, description: 'Regístrate y comienza a referir' },
  { level: 1, name: 'Lead Magnet Básico', referralsRequired: 1, description: 'Guía rápida de growth marketing' },
  { level: 2, name: 'Lead Magnet Intermedio', referralsRequired: 3, description: 'Plantillas de embudos de ventas' },
  { level: 3, name: 'Lead Magnet Premium', referralsRequired: 5, description: 'Curso completo de referidos viral' },
];

const getRewardByLevel = (level) => REWARDS.find((r) => r.level === level) || null;

const getRewardForReferrals = (count) => {
  let unlocked = REWARDS[0];
  for (const reward of REWARDS) {
    if (count >= reward.referralsRequired) unlocked = reward;
  }
  return unlocked;
};

const getNextReward = (count) => {
  for (const reward of REWARDS) {
    if (count < reward.referralsRequired) return reward;
  }
  return null;
};

const getProgressToNext = (count) => {
  const current = getRewardForReferrals(count);
  const next = getNextReward(count);
  if (!next) return { current, next: null, progress: 100, remaining: 0 };
  const progress = current.referralsRequired === 0
    ? (count / next.referralsRequired) * 100
    : ((count - current.referralsRequired) / (next.referralsRequired - current.referralsRequired)) * 100;
  return { current, next, progress: Math.min(progress, 100), remaining: next.referralsRequired - count };
};

module.exports = { REWARDS, getRewardByLevel, getRewardForReferrals, getNextReward, getProgressToNext };
