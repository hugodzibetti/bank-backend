import { IsInt, IsPositive } from 'class-validator';

export class CreateTransactionDto {
  @IsInt()
  @IsPositive()
  fromId: number;

  @IsInt()
  @IsPositive()
  toId: number;

  @IsInt()
  @IsPositive()
  amount: number;
}
