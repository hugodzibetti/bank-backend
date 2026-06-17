import { Column } from 'typeorm';

export class Password {
  @Column({ name: 'passwordHash' })
  hash: string;

  @Column({ name: 'passwordSalt' })
  salt: string;
}
