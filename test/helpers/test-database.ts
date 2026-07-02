import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from '../../src/common/config/configuration';
import { User } from '../../src/modules/user/entities/user.entity';
import { Account } from '../../src/modules/accounts/entities/account.entity';
import { Transaction } from '../../src/modules/transaction/entities/transaction.entity';

export function createTestDatabaseModule() {
  const config = configuration();
  return TypeOrmModule.forRoot({
    type: 'postgres',
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    entities: [User, Account, Transaction],
    synchronize: true,
  });
}
