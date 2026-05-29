import { Body, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { randomBytes, scryptSync } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { BodyRequiredPipe } from '../common/pipes/body-required/body-required.pipe';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(@Body(BodyRequiredPipe) body: LoginDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: body.email },
    });

    if (!existingUser) {
      return Error('A user with this email doesnt exists');
    }

    const isPasswordValid = await this.verifyPasswordHash(
      body.password,
      existingUser.passwordHash,
      existingUser.passwordSalt,
    );

    if (!isPasswordValid) {
      return Error('Password is incorrect');
    }

    return {
      accessToken: await this.jwtService.signAsync({
        sub: existingUser.id,
        email: existingUser.email,
      }),
    };
  }

  async signUp(@Body(BodyRequiredPipe) body: SignUpDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: body.email },
    });

    if (existingUser) {
      return Error('A user with this email already exists');
    }

    const [passwordHash, passwordSalt] = await this.getPasswordHash(
      body.password,
    );
    const { password, ...userData } = body;

    const newUser = this.usersRepository.create({
      ...userData,
      passwordHash,
      passwordSalt,
    });

    await this.usersRepository.save(newUser);

    return {
      accessToken: await this.jwtService.signAsync({
        sub: newUser.id,
        email: newUser.email,
      }),
    };
  }

  private async getPasswordHash(password: string) {
    const salt = randomBytes(16);
    const hashBuffer = scryptSync(password, salt, 64);
    return [hashBuffer.toString('hex'), salt.toString('hex')];
  }

  /**
   * Checks whether a plain-text password matches the stored password hash.
   */
  private async verifyPasswordHash(
    password: string,
    storedPasswordHash: string,
    passwordSalt: string,
  ): Promise<boolean> {
    const saltBuffer = Buffer.from(passwordSalt, 'hex');
    const computedHash = scryptSync(password, saltBuffer, 64).toString('hex');

    return computedHash === storedPasswordHash;
  }
}
