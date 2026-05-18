import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsInt, IsString } from 'class-validator';

export class Account {
  @PrimaryGeneratedColumn()
  @IsInt()
  id: number;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsInt()
  dollarUnits: number;
}
