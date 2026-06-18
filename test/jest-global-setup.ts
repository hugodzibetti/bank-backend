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

  process.env.DB_HOST = container.getHost();
  process.env.DB_PORT = container.getPort().toString();
  process.env.DB_USERNAME = container.getUsername();
  process.env.DB_PASSWORD = container.getPassword();
  process.env.DB_DATABASE = container.getDatabase();
}
