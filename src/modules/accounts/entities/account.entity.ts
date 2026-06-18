import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsInt, IsString } from 'class-validator';

@Entity()
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
