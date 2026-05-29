import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AccountModule } from './account/account.module';

@Module({
  imports: [AuthModule, UserModule, DatabaseModule, AccountModule],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
