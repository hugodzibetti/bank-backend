import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Account } from '../accounts/entities/account.entity';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';

describe('TransactionService', () => {
  let service: TransactionService;

  const mockAccountRepository = {
    findOne: jest.fn(),
  };

  const mockManager = {
    save: jest.fn(),
    create: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: getRepositoryToken(Account), useValue: mockAccountRepository },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const userId = 1;
    const dto: CreateTransactionDto = {
      fromId: 1,
      toId: 2,
      amount: 100,
    };

    it('should throw BadRequestException when transferring to the same account', async () => {
      const sameDto: CreateTransactionDto = { fromId: 1, toId: 1, amount: 100 };

      await expect(service.create(userId, sameDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when source account not found', async () => {
      mockAccountRepository.findOne.mockResolvedValue(null);

      await expect(service.create(userId, dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when source account does not belong to user', async () => {
      mockAccountRepository.findOne.mockResolvedValue({
        id: 1,
        balance: 500,
        user: { id: 999 },
      });

      await expect(service.create(userId, dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when destination account not found', async () => {
      mockAccountRepository.findOne
        .mockResolvedValueOnce({
          id: 1,
          balance: 500,
          user: { id: userId },
        })
        .mockResolvedValueOnce(null);

      await expect(service.create(userId, dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when balance is insufficient', async () => {
      mockAccountRepository.findOne
        .mockResolvedValueOnce({
          id: 1,
          balance: 50,
          user: { id: userId },
        })
        .mockResolvedValueOnce({
          id: 2,
          balance: 200,
        });

      await expect(service.create(userId, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should complete a successful transfer', async () => {
      const fromAccount = { id: 1, balance: 500, user: { id: userId } };
      const toAccount = { id: 2, balance: 200 };
      const savedTransaction = {
        id: 1,
        from: fromAccount,
        to: toAccount,
        amount: 100,
      };

      mockAccountRepository.findOne
        .mockResolvedValueOnce(fromAccount)
        .mockResolvedValueOnce(toAccount);

      mockManager.save.mockResolvedValue(savedTransaction);
      mockManager.create.mockReturnValue(savedTransaction);
      mockDataSource.transaction.mockImplementation(
        async (cb: (manager: typeof mockManager) => unknown) => {
          return cb(mockManager);
        },
      );

      const result = await service.create(userId, dto);

      expect(result).toEqual(savedTransaction);
      expect(mockDataSource.transaction).toHaveBeenCalled();
      expect(mockManager.save).toHaveBeenCalledWith(Account, expect.objectContaining({
        id: 1,
        balance: 400,
      }));
      expect(mockManager.save).toHaveBeenCalledWith(Account, expect.objectContaining({
        id: 2,
        balance: 300,
      }));
      expect(mockManager.create).toHaveBeenCalledWith(Transaction, {
        from: fromAccount,
        to: toAccount,
        amount: 100,
      });
      expect(mockManager.save).toHaveBeenCalledWith(Transaction, savedTransaction);
    });

    it('should propagate error when transaction callback throws', async () => {
      const fromAccount = { id: 1, balance: 500, user: { id: userId } };
      const toAccount = { id: 2, balance: 200 };

      mockAccountRepository.findOne
        .mockResolvedValueOnce(fromAccount)
        .mockResolvedValueOnce(toAccount);

      mockDataSource.transaction.mockImplementation(
        async () => {
          throw new Error('Database error');
        },
      );

      await expect(service.create(userId, dto)).rejects.toThrow(
        'Database error',
      );
    });
  });
});
