import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import SignUpDto from './dto/sign-up.dto';
import LoginDto from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should success with valid credentials', () => {
      const validCredentials: LoginDto = {
        email: 'email@example.com',
        password: 'password123',
      };

      const result = service.login(validCredentials);
      expect(result).toBeTruthy();
    });
  });

  describe('signUp', () => {
    it('should success with valid data', async () => {
      const validData: SignUpDto = {
        name: 'exampleUser1',
        email: 'example@email.com',
        password: '3xampl&PASSW0RD',
      };
      const result = await service.signUp(validData);
      expect(result).toEqual(
        expect.objectContaining({ accessToken: expect.any(String) }),
      );
    });

    it('should error on using existing users email', async () => {
      const validData: SignUpDto = {
        name: 'exampleUser1',
        email: 'example@email.com',
        password: 'somePassword123',
      };
      await expect(service.signUp(validData)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
