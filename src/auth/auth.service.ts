import { Body, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  login(@Body() body: LoginDto): string {
    return 'Logged in!';
  }

  signUp(@Body() body: SignUpDto): string {
    return 'Signed Up!';
  }
}
