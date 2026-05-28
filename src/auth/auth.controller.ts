import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @Post('login')
  login(@Body(BodyRequiredPipe) body: LoginDto) {
    return this.appService.login(body);
  }

  @Post('signUp')
  signUp(@Body(BodyRequiredPipe) body: SignUpDto) {
    return this.appService.signUp(body);
  }
}
