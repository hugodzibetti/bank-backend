import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return await this.appService.login(body);
  }

  @Post('signUp')
  async signUp(@Body() body: SignUpDto) {
    return await this.appService.signUp(body);
  }
}
