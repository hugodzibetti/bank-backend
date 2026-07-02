import { Body, Controller, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@CurrentUser('id') userId: number, @Body() dto: CreateTransactionDto) {
    return this.transactionService.create(userId, dto);
  }
}
