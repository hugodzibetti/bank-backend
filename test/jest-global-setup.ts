import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';

declare global {
  var __PG_CONTAINER__: StartedPostgreSqlContainer;
}

export default async function globalSetup() {
  const container = await new PostgreSqlContainer('postgres:16').start();

  globalThis.__PG_CONTAINER__ = container;

  process.env.TEST_DB_HOST = container.getHost();
  process.env.TEST_DB_PORT = container.getPort().toString();
  process.env.TEST_DB_USERNAME = container.getUsername();
  process.env.TEST_DB_PASSWORD = container.getPassword();
  process.env.TEST_DB_DATABASE = container.getDatabase();
}
