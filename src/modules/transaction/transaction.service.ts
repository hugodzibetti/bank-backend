import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Account } from '../accounts/entities/account.entity';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    userId: number,
    dto: CreateTransactionDto,
  ): Promise<Transaction> {
    if (dto.fromId === dto.toId) {
      throw new BadRequestException('Cannot transfer to the same account');
    }

    const from = await this.accountRepository.findOne({
      where: { id: dto.fromId },
      relations: ['user'],
    });

    if (!from || from.user.id !== userId) {
      throw new NotFoundException('Source account not found');
    }

    const to = await this.accountRepository.findOne({
      where: { id: dto.toId },
    });

    if (!to) {
      throw new NotFoundException('Destination account not found');
    }

    if (from.balance < dto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    return this.dataSource.transaction(async (manager) => {
      from.balance -= dto.amount;
      to.balance += dto.amount;

      await manager.save(Account, from);
      await manager.save(Account, to);

      const transaction = manager.create(Transaction, {
        from,
        to,
        amount: dto.amount,
      });

      return manager.save(Transaction, transaction);
    });
  }
}
