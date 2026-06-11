# NestJS Banking API

A scalable, complete, and well-designed banking back-end solution built with NestJS. This project is developed as part
of a professional curriculum to demonstrate best practices in modern back-end development.

## 🚀 Tech Stack

- **Framework:** [NestJS](https://nestjs.com/) (v11)
- **Language:** TypeScript
- **ORM:** [TypeORM](https://typeorm.io/)
- **Database:** SQLite (Configurable via environment variables)
- **Validation:
  ** [class-validator](https://github.com/typestack/class-validator) & [class-transformer](https://github.com/typestack/class-transformer)
- **Authentication:** [Passport.js](https://www.passportjs.org/) & JWT
- **Testing:** [Jest](https://jestjs.io/) & Supertest

## ✨ Features

- [x] **Users:** Account creation and profile management.
- [x] **Authentication:** Secure login and registration using JWT and Passport.
- [x] **Accounts:** Bank account management (In progress).
- [ ] **Transactions:** Deposit and withdrawal logic.
- [ ] **Transfers:** Peer-to-peer money transfers.

## 🛠️ Getting Started

### Prerequisites

- Node.js (v20+ recommended)
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

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` as needed.*

### Running the App

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📈 Development Process

I’m using [Linear](https://linear.app/) for managing the development process and tracking tasks.
