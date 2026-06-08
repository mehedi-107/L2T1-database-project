const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toNumber(process.env.PORT, 5000),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  databaseUrl: process.env.DATABASE_URL,
  postgres: {
    host: process.env.PGHOST || 'localhost',
    port: toNumber(process.env.PGPORT, 5432),
    database: process.env.PGDATABASE || 'dbmsProject',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD,
    sslMode: process.env.PGSSLMODE,
  },
};

module.exports = env;
