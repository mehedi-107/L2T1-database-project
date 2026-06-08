const app = require('./app');
const env = require('./config/env');
const pool = require('./db/pool');

const server = app.listen(env.port, () => {
  console.log(`Health Harbor API is running on port ${env.port}`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down API server...`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
