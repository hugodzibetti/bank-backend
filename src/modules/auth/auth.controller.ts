import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import type LoginDto from './dto/login.dto';
import { BodyRequiredPipe } from '../../common/pipes/body-required.pipe';
import type SignUpDto from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body(BodyRequiredPipe) body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('signUp')
  signUp(@Body(BodyRequiredPipe) body: SignUpDto) {
    return this.authService.signUp(body);
  }
}
