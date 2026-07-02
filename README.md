# Bank REST API

A production-grade banking backend built with **NestJS**, **TypeORM**, and **PostgreSQL**. Designed as a portfolio project demonstrating modern backend engineering practices — modular architecture, JWT authentication, transactional data integrity, containerized development, and comprehensive testing with Testcontainers.

## Features

### Implemented

- **Authentication & Authorization**
  - Sign up and login with JWT (1h expiry)
  - Password hashing via `scrypt` with per-user salts + constant-time verification
  - Global JWT guard with `@Public()` route opt-out

- **User Management**
  - Profile retrieval (authenticated)
  - Public user lookup by ID

- **Account Management** (scaffolded)
  - Account entity with user relation and balance tracking

- **Transactions & Transfers**
  - Transfer funds between accounts with full ACID guarantees
  - Source account ownership verification
  - Balance validation before transfer
  - Same-account transfer protection

- **API Documentation**
  - Interactive Swagger UI at `/api`

### Planned

- Deposit / withdrawal operations
- Transaction history with pagination, filtering, and sorting
- Investment portfolios (stocks, fixed income, etc.)
- Admin dashboard with user/account management
- Scheduled transactions (recurring transfers, bill payments)
- Account statements (PDF export)
- Email notifications (transaction alerts, password reset)
- Rate limiting and request throttling
- Audit logging

## Tech Stack

| Layer            | Technology                                                      |
| ---------------- | --------------------------------------------------------------- |
| Runtime          | Node.js (TypeScript 5.7)                                        |
| Framework        | NestJS 11                                                       |
| Database         | PostgreSQL 18 (Docker), 16 (Testcontainers)                     |
| ORM              | TypeORM 0.3                                                     |
| Auth             | Passport.js + `passport-jwt` strategy                           |
| Validation       | `class-validator` with custom decorators                        |
| Crypto           | `scrypt` (Node.js built-in) with per-user salts                 |
| API Docs         | Swagger / OpenAPI (`@nestjs/swagger`)                          |
| Testing          | Jest, Supertest, Testcontainers                                 |
| Containerization | Docker Compose                                                  |

## Architecture

```
src/
├── common/                          # Shared cross-cutting concerns
│   ├── config/                      # Environment configuration
│   ├── decorators/                  # @CurrentUser, @Password, @Public
│   ├── guards/                      # JwtGuard (global)
│   ├── pipes/                       # BodyRequired pipe
│   └── strategies/                  # JwtStrategy (Passport)
├── infrastructure/
│   └── database/                    # TypeORM root module config
└── modules/
    ├── accounts/                    # Account entity + scaffolded module
    ├── auth/                        # Sign up, login, JWT issuance
    ├── transaction/                 # Money transfers (ACID)
    └── user/                        # Profile retrieval
```

## Getting Started

### Prerequisites

- Node.js >= 20
- Docker & Docker Compose
- npm

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=1234
DB_DATABASE=bank

JWT_SECRET=your-secret-here
```

### Start Development

```bash
# 1. Start PostgreSQL
docker compose up -d

# 2. Start the application (watch mode)
npm run start:dev
```

The API will be available at `http://localhost:3000` and the Swagger UI at `http://localhost:3000/api`.

## API Endpoints

### Auth

| Method | Path             | Auth     | Description          |
| ------ | ---------------- | -------- | -------------------- |
| POST   | `/auth/signUp`   | Public   | Create a new user    |
| POST   | `/auth/login`    | Public   | Authenticate a user  |

### User

| Method | Path          | Auth     | Description              |
| ------ | ------------- | -------- | ------------------------ |
| GET    | `/user/me`    | JWT      | Get authenticated user   |
| GET    | `/user/:id`   | JWT      | Get user by ID (public)  |

### Transaction

| Method | Path              | Auth     | Description            |
| ------ | ----------------- | -------- | ---------------------- |
| POST   | `/transaction`    | JWT      | Transfer between accounts |

## Testing

The project uses **Testcontainers** to spin up disposable PostgreSQL instances for integration and E2E tests — no manual database setup required.

```bash
# Unit tests
npm test

# Unit tests with coverage
npm run test:cov

# Unit tests (watch mode)
npm run test:watch

# E2E tests (spins up testcontainer)
npm run test:e2e
```

### Test Structure

| Type               | Pattern                           | Database            |
| ------------------ | --------------------------------- | ------------------- |
| Unit               | `*.spec.ts`                       | Mocked repositories |
| Integration        | `*.integration-spec.ts`           | Testcontainers      |
| E2E                | `test/e2e/*.e2e-spec.ts`          | Testcontainers      |

## Project Status

This is an actively developed portfolio project. The core banking primitives (users, auth, accounts, transfers) are in place. See the **Planned** section above for what's coming next.
