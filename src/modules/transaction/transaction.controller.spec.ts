import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

describe('TransactionController', () => {
  let controller: TransactionController;

  const mockTransactionService = {
    create: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call transactionService.create with userId and dto', async () => {
      const dto: CreateTransactionDto = {
        fromId: 1,
        toId: 2,
        amount: 100,
      };
      const userId = 42;
      mockTransactionService.create.mockResolvedValue({ id: 1, amount: 100 });

      const result = await controller.create(userId, dto);

      expect(mockTransactionService.create).toHaveBeenCalledWith(userId, dto);
      expect(result).toEqual({ id: 1, amount: 100 });
    });
  });
});
