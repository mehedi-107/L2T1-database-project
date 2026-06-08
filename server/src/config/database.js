const env = require('./env');

const shouldUseSsl = (sslMode) => ['require', 'verify-ca', 'verify-full'].includes(sslMode);

const createDatabaseConfig = () => {
  if (env.databaseUrl) {
    return {
      connectionString: env.databaseUrl,
      ssl: shouldUseSsl(env.postgres.sslMode) ? { rejectUnauthorized: false } : undefined,
    };
  }

  return {
    host: env.postgres.host,
    port: env.postgres.port,
    database: env.postgres.database,
    user: env.postgres.user,
    password: env.postgres.password,
    ssl: shouldUseSsl(env.postgres.sslMode) ? { rejectUnauthorized: false } : undefined,
  };
};

module.exports = createDatabaseConfig();
