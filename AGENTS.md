# Bank REST API — Agent Instructions

## Project Overview

Production-grade banking backend: NestJS 11 + TypeORM + PostgreSQL.  
See [README.md](./README.md) for feature list and architecture diagram.

## Quick Start

```bash
npm install
cp .env.example .env   # then fill in DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, JWT_SECRET
docker compose up -d   # starts PostgreSQL 18 on :5432
npm run start:dev      # http://localhost:3000, Swagger at /api
```

## Commands

| Command            | Purpose                                           |
| ------------------ | ------------------------------------------------- |
| `npm test`         | Unit tests (Jest, `--selectProjects unit`)        |
| `npm run test:e2e` | E2E tests (requires Docker — uses Testcontainers) |
| `npm run test:cov` | Unit tests with coverage                          |
| `npm run lint`     | ESLint + Prettier fix                             |
| `npm run build`    | NestJS build                                      |

Integration tests: `npx jest --config ./test/jest-integration.json`

## Key Architecture

```
src/
├── common/                  # Cross-cutting: guards, decorators, pipes, strategies, config
├── infrastructure/database/ # TypeORM root config (async, from ConfigService)
└── modules/
    ├── auth/                # Sign up, login, JWT issue (public endpoints)
    ├── user/                # Profile retrieval (authenticated)
    ├── accounts/            # Account entity + scaffolded module
    └── transaction/         # Money transfers with ACID guarantees
```

### Conventions

- **Global JWT guard** in `AppModule` — all routes require auth unless decorated with `@Public()`.
- **Passwords** hashed with Node `scrypt` (per-user 16-byte salt, 64-byte hash). Stored as `Password` embeddable (`passwordHash` + `passwordSalt` columns).
- **Validation** via `class-validator` DTOs + global `ValidationPipe` (whitelist, forbidNonWhitelisted, transform).
- **`@CurrentUser()` param decorator** extracts JWT payload from request (e.g., `@CurrentUser('id') userId: number`).
- **`BodyRequiredPipe`** used on auth controllers to reject missing body early.
- **TypeORM** with `synchronize: true` in non-production (dev only).
- **Swagger** auto-generated via `@nestjs/swagger` plugin in `nest-cli.json` (picks up DTO/entity decorators).

### Testing Patterns

- **Unit tests**: Manual mock objects for repositories/services (see `auth.service.spec.ts`). Use `jest-mock-extended` available.
- **Integration tests**: Use `createTestDatabaseModule()` from `test/helpers/test-database.ts` — spins up Testcontainers PostgreSQL 16, sets env from container. See `transaction.service.integration-spec.ts`.
- **E2E tests**: Override `DatabaseModule` with `createTestDatabaseModule()`. Uses `supertest`. See `test/e2e/auth.e2e-spec.ts`.
- **Testcontainers** setup in `test/jest-global-setup.ts` (PostgreSQL 16, sets `DB_*` env vars). Teardown in `jest-global-teardown.ts`.

### Config

All env vars validated on boot in `src/common/config/configuration.ts`. Required vars: `JWT_SECRET`, `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`.

## Pitfalls

- `tsconfig.json` uses `module: "nodenext"` — imports **must** include `.js` extension in relative paths (e.g., `import { X } from './foo.js'`). TypeScript strips `.ts` at compile time.
- E2E/integration tests require Docker (Testcontainers pulls `postgres:16`).
- Test database is **not cleaned** between tests — each suite should use unique data or clean in `beforeEach`.
- `synchronize: true` drops/recreates schema on every app restart — don't use in production.
