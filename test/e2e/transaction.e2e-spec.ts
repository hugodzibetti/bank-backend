import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DatabaseModule } from '../../src/infrastructure/database/database.module';
import { createTestDatabaseModule } from '../helpers/test-database';
import { Repository, DeepPartial } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from '../../src/modules/accounts/entities/account.entity';

describe('TransactionController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let fromAccountId: number;
  let toAccountId: number;
  let accountRepository: Repository<Account>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(DatabaseModule)
      .useModule(createTestDatabaseModule())
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer())
      .post('/auth/signUp')
      .send({
        email: 'transaction-e2e@example.com',
        password: 'StrongP4ss',
        name: 'Transaction E2E User',
      })
      .expect(201);

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'transaction-e2e@example.com',
        password: 'StrongP4ss',
      })
      .expect(201);

    const loginBody = loginRes.body as { accessToken: string };
    accessToken = loginBody.accessToken;

    const meRes = await request(app.getHttpServer())
      .get('/user/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const meBody = meRes.body as { id: number };
    const userId = meBody.id;

    accountRepository = app.get<Repository<Account>>(
      getRepositoryToken(Account),
    );

    const partial: DeepPartial<Account> = {
      name: 'From Account',
      balance: 1000,
      user: { id: userId },
    };
    const fromAccount = accountRepository.create(partial);
    const savedFrom = await accountRepository.save(fromAccount);
    fromAccountId = savedFrom.id;

    const toPartial: DeepPartial<Account> = {
      name: 'To Account',
      balance: 0,
      user: { id: userId },
    };
    const toAccount = accountRepository.create(toPartial);
    const savedTo = await accountRepository.save(toAccount);
    toAccountId = savedTo.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /transaction', () => {
    it('should return 401 when no credentials are provided', () => {
      return request(app.getHttpServer())
        .post('/transaction')
        .send({
          fromId: fromAccountId,
          toId: toAccountId,
          amount: 100,
        })
        .expect(401);
    });

    it('should return 400 when transferring to the same account', () => {
      return request(app.getHttpServer())
        .post('/transaction')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          fromId: fromAccountId,
          toId: fromAccountId,
          amount: 100,
        })
        .expect(400);
    });

    it('should return 400 with insufficient balance', () => {
      return request(app.getHttpServer())
        .post('/transaction')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          fromId: fromAccountId,
          toId: toAccountId,
          amount: 999_999,
        })
        .expect(400);
    });

    it('should create a transaction and update balances', async () => {
      const res = await request(app.getHttpServer())
        .post('/transaction')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          fromId: fromAccountId,
          toId: toAccountId,
          amount: 200,
        })
        .expect(201);

      const txBody = res.body as {
        id: number;
        amount: number;
        from: { id: number };
        to: { id: number };
      };
      expect(txBody).toHaveProperty('id');
      expect(txBody.amount).toBe(200);
      expect(txBody.from.id).toBe(fromAccountId);
      expect(txBody.to.id).toBe(toAccountId);

      const fromAfter = await accountRepository.findOne({
        where: { id: fromAccountId },
      });
      const toAfter = await accountRepository.findOne({
        where: { id: toAccountId },
      });
      expect(fromAfter!.balance).toBe(800);
      expect(toAfter!.balance).toBe(200);
    });
  });
});
