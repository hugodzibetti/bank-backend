# NestJS Banking API

A banking back-end built with NestJS, demonstrating modern back-end development practices.

## Tech Stack

- **Framework:** [NestJS](https://nestjs.com/) (v11)
- **Language:** TypeScript
- **ORM:** [TypeORM](https://typeorm.io/)
- **Database:** SQLite
- **Validation:** [class-validator](https://github.com/typestack/class-validator)
- **Authentication:** [Passport.js](https://www.passportjs.org/) (JWT)
- **Testing:** [Jest](https://jestjs.io/) & Supertest

## Features

- [x] **Users:** Creation and profile management
- [x] **Authentication:** Login and registration with JWT
- [x] **Accounts:** Bank account management (In progress)
- [ ] **Transactions:** Deposit and withdrawal logic
- [ ] **Transfers:** Peer-to-peer transfers

## Getting Started

### Prerequisites

- Node.js (v20+)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd nestjs-banking
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment:
   ```bash
   cp .env.example .env
   ```
   *Update the `.env` file with your configuration.*

### Running the App

```bash
# Development
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```
