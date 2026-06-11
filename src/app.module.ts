import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AccountsModule } from './modules/accounts/accounts.module';

@Module({
  imports: [AuthModule, UsersModule, AccountsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
