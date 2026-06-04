require('dotenv').config();
const app = require('./src/app');
const env = require('./src/config/environment');
const { testConnection } = require('./src/config/database');
const logger = require('./src/utils/logger');

const start = async () => {
  await testConnection();

  app.listen(env.port, () => {
    logger.info(`Server running on port ${env.port} [${env.nodeEnv}]`);
  });
};

start().catch((err) => {
  logger.error('Failed to start server', { error: err.message });
  process.exit(1);
});
