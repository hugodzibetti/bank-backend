import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { SingUpDto } from './dtos/singUp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDto): string {
    return this.appService.login(body);
  }

  @Post('signup')
  signUp(@Body() body: SingUpDto): string {
    return this.appService.signUp(body);
  }
}
