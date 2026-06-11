import { AuthService } from '../../modules/auth/auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(userName: string, password: string) {
    const user = await this.authService.validateCredentials(userName, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
