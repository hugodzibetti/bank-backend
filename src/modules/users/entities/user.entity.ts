import { IsInt, IsString } from 'class-validator';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Balance {
  @IsInt()
  money: 1000;
}

export class User {
  @IsInt()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsString()
  email: string;

  @Column()
  @IsString()
  password: string;
}
