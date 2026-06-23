import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Account } from '../accounts/entities/account.entity';
import { User } from '../user/entities/user.entity';
import { createTestDatabaseModule } from '../../../test/helpers/test-database';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Password } from '../user/entities/password.embeddable';

describe('TransactionService', () => {
  let service: TransactionService;
  let module: TestingModule;
  let accountRepository: Repository<Account>;
  let userRepository: Repository<User>;

  let userId: number;
  let fromAccountId: number;
  let toAccountId: number;

  async function createUser(emailSuffix: string) {
    const password = new Password();
    password.hash = 'test-hash';
    password.salt = 'test-salt';
    const user = userRepository.create({
      name: `User ${emailSuffix}`,
      email: `transaction-${emailSuffix}@example.com`,
      password,
    });
    return userRepository.save(user);
  }

  async function createAccount(userId: number, balance: number, name: string) {
    const account = accountRepository.create({
      name,
      balance,
      user: { id: userId },
    });
    return accountRepository.save(account);
  }

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        createTestDatabaseModule(),
        TypeOrmModule.forFeature([Transaction, Account, User]),
      ],
      providers: [TransactionService],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    accountRepository = module.get<Repository<Account>>(
      getRepositoryToken(Account),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    const user = await createUser('owner');
    userId = user.id;

    fromAccountId = (await createAccount(userId, 1000, 'From Account')).id;
    toAccountId = (await createAccount(userId, 0, 'To Account')).id;
  });

  afterAll(async () => {
    await module?.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw when transferring to the same account', async () => {
      await expect(
        service.create(userId, {
          fromId: fromAccountId,
          toId: fromAccountId,
          amount: 100,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when source account does not exist', async () => {
      await expect(
        service.create(userId, {
          fromId: 99999,
          toId: toAccountId,
          amount: 100,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw when source account is not owned by the user', async () => {
      const otherUser = await createUser('other');
      const otherAccount = await createAccount(
        otherUser.id,
        500,
        'Other Account',
      );

      await expect(
        service.create(userId, {
          fromId: otherAccount.id,
          toId: toAccountId,
          amount: 100,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw when destination account does not exist', async () => {
      await expect(
        service.create(userId, {
          fromId: fromAccountId,
          toId: 99999,
          amount: 100,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw when balance is insufficient', async () => {
      await expect(
        service.create(userId, {
          fromId: fromAccountId,
          toId: toAccountId,
          amount: 100_000,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should transfer successfully and update balances', async () => {
      const fromBefore = await accountRepository.findOne({
        where: { id: fromAccountId },
      });
      const toBefore = await accountRepository.findOne({
        where: { id: toAccountId },
      });

      const result = await service.create(userId, {
        fromId: fromAccountId,
        toId: toAccountId,
        amount: 200,
      });

      expect(result).toBeDefined();
      expect(result.amount).toBe(200);
      expect(result.from.id).toBe(fromAccountId);
      expect(result.to.id).toBe(toAccountId);

      const fromAfter = await accountRepository.findOne({
        where: { id: fromAccountId },
      });
      const toAfter = await accountRepository.findOne({
        where: { id: toAccountId },
      });

      expect(fromAfter!.balance).toBe(fromBefore!.balance - 200);
      expect(toAfter!.balance).toBe(toBefore!.balance + 200);
    });
  });
});
