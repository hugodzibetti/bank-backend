import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalGuard } from '../../common/guards/local.guard';
import { LocalStrategy } from '../../common/strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, LocalGuard, LocalStrategy],
})
export class AuthModule {}
