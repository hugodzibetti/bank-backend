import { Body, Injectable, Post, UnauthorizedException } from '@nestjs/common';
import type LoginDto from './dto/login.dto';
import type SignUpDto from './dto/sign-up.dto';
import exampleUsers from '../../../test/fixtures/users';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = this.validateCredentials(body.email, body.password);

    return;
  }

  @Post('signUp')
  async signUp(@Body() body: SignUpDto) {
    const { email, password } = body;
    const existingUser = exampleUsers.find((user) => user.email == email);

    if (existingUser) {
      throw new UnauthorizedException('A users with this email already exists');
    }

    const newUser: User = {
      id: exampleUsers.length + 1,
      name: 'New User',
      email,
      password,
    };
    exampleUsers.push(newUser);

    return {
      generatedUserId: 123112,
      accessToken: 'generated_token',
    };
  }

  async validateCredentials(email: string, password: string) {
    const user = exampleUsers.find(
      (user) => user.email == email && user.password == password,
    );
    if (!user) {
      throw new UnauthorizedException(
        'Could not find a users with these credentials',
      );
    }

    return user;
  }
}
