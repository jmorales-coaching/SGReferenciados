const { Config } = require('../models/associations');

class ConfigService {
  async getAll() {
    const configs = await Config.findAll();
    const obj = {};
    for (const c of configs) obj[c.key] = c.value;
    return obj;
  }

  async upsert(key, value) {
    const existing = await Config.findByPk(key);
    if (existing) {
      await existing.update({ value });
    } else {
      await Config.create({ key, value });
    }
    return { key, value };
  }
}

module.exports = new ConfigService();
