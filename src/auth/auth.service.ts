import { Body, Injectable } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { SingUpDto } from './dtos/singUp.dto';

@Injectable()
export class AuthService {
  login(@Body() body: LoginDto): string {
    return 'Logged in!';
  }

  signUp(@Body() body: SingUpDto): string {
    return 'Signed Up!';
  }
}
