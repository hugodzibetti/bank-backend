import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Password } from './password.embeddable';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column(() => Password, { prefix: '' })
  password: Password;
}
