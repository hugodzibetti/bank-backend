import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const jwtFactory = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.get<string>('jwt.secret')!,
  signOptions: { expiresIn: '1h' },
});

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtFactory,
    }),
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
