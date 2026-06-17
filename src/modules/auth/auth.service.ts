import { ConflictException, Injectable, UnauthorizedException, } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Password } from '../user/entities/password.embeddable';
import { randomBytes, scryptSync } from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(body: LoginDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: body.email },
    });

    if (!existingUser) {
      throw new UnauthorizedException('A user with this email doesnt exists');
    }

    const isPasswordValid = this.verifyPasswordHash(
      body.password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is incorrect');
    }

    return {
      accessToken: await this.jwtService.signAsync({
        sub: existingUser.id,
        email: existingUser.email,
      }),
    };
  }

  async signUp(body: SignUpDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: body.email },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    const { password: passwordPlain, ...userData } = body;
    const password = this.getPasswordHash(passwordPlain);

    const newUser = this.usersRepository.create({
      ...userData,
      password,
    });

    await this.usersRepository.save(newUser);

    return {
      accessToken: await this.jwtService.signAsync({
        sub: newUser.id,
        email: newUser.email,
      }),
    };
  }

  private getPasswordHash(password: string): Password {
    const salt = randomBytes(16);
    const hashBuffer = scryptSync(password, salt, 64);
    const passwordEntry = new Password();
    passwordEntry.hash = hashBuffer.toString('hex');
    passwordEntry.salt = salt.toString('hex');
    return passwordEntry;
  }

  private verifyPasswordHash(
    password: string,
    storedPassword: Password,
  ): boolean {
    const saltBuffer = Buffer.from(storedPassword.salt, 'hex');
    const computedHash = scryptSync(password, saltBuffer, 64).toString('hex');

    return computedHash === storedPassword.hash;
  }
}
