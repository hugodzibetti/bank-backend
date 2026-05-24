import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { DatabaseModule } from './infrastructure/database/database.module';

@Module({
  imports: [AuthModule, UsersModule, DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class AppModule {}
