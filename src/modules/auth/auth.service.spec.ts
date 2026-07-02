import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Password } from '../user/entities/password.embeddable';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scryptSync } from 'crypto';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mock-access-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should fail when user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const credentials: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      await expect(service.login(credentials)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should fail when password is incorrect', async () => {
      const salt = randomBytes(16).toString('hex');
      const hash = scryptSync(
        'correctPassword',
        Buffer.from(salt, 'hex'),
        64,
      ).toString('hex');

      mockUserRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: { hash, salt },
      });

      const credentials: LoginDto = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      await expect(service.login(credentials)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should succeed with valid credentials', async () => {
      const password = 'correctPassword';
      const salt = randomBytes(16).toString('hex');
      const hash = scryptSync(password, Buffer.from(salt, 'hex'), 64).toString(
        'hex',
      );

      mockUserRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: { hash, salt },
      });

      const credentials: LoginDto = {
        email: 'test@example.com',
        password,
      };

      const result = await service.login(credentials);

      expect(result).toEqual({ accessToken: 'mock-access-token' });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: 1,
        email: 'test@example.com',
      });
    });
  });

  describe('signUp', () => {
    it('should succeed with valid data', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue({
        name: 'exampleUser1',
        email: 'example@email.com',
        password: expect.any(Object) as unknown as Password,
      });
      mockUserRepository.save.mockResolvedValue({
        id: 1,
        name: 'exampleUser1',
        email: 'example@email.com',
      });

      const validData: SignUpDto = {
        name: 'exampleUser1',
        email: 'example@email.com',
        password: '3xampl&PASSW0RD',
      };
      const result = await service.signUp(validData);
      expect(result).toMatchObject({
        accessToken: expect.any(String) as never,
      });
    });

    it('should error on using existing users email', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 1 });

      const validData: SignUpDto = {
        name: 'exampleUser1',
        email: 'example@email.com',
        password: 'somePassword123',
      };
      await expect(service.signUp(validData)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
