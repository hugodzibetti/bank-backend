export const configuration = () => {
  const jwtSecret = process.env.JWT_SECRET;
  const dbHost = process.env.DB_HOST;
  const dbUsername = process.env.DB_USERNAME;
  const dbPassword = process.env.DB_PASSWORD;
  const dbDatabase = process.env.DB_DATABASE;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  if (!dbHost || !dbUsername || !dbPassword || !dbDatabase) {
    throw new Error(
      'DB_HOST, DB_USERNAME, DB_PASSWORD, and DB_DATABASE environment variables are required',
    );
  }

  return {
    NODE_ENV: process.env.NODE_ENV,
    port: parseInt(process.env.PORT ?? '3000', 10),
    database: {
      host: dbHost,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: dbUsername,
      password: dbPassword,
      database: dbDatabase,
    },
    jwt: {
      secret: jwtSecret,
    },
  };
};
