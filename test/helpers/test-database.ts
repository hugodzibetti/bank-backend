import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../src/users/entities/user.entity';

export function createTestDatabaseModule() {
  return TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.TEST_DB_HOST,
    port: Number(process.env.TEST_DB_PORT),
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_DATABASE,
    entities: [User],
    synchronize: true,
  });
}
