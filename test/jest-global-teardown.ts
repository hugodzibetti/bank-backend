import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';

declare global {
  // eslint-disable-next-line no-var
  var __PG_CONTAINER__: StartedPostgreSqlContainer;
}

export default async function globalTeardown() {
  await globalThis.__PG_CONTAINER__?.stop();
}
