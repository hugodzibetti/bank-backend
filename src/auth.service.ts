import { Body, Injectable } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  login(@Body() body: LoginDto): string {
    return 'Logged in!';
  }
}
