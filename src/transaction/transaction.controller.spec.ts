import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';

describe('TransactionController', () => {
  let controller: TransactionController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
