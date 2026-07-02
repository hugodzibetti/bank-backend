import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'fromId' })
  from: Account;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'toId' })
  to: Account;
}
