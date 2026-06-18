import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const authServiceMock: jest.Mocked<Pick<AuthService, 'login' | 'signUp'>> = {
    login: jest.fn(),
    signUp: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with the provided body', async () => {
      const dto: LoginDto = {
        email: 'test@email.com',
        password: 'Password1',
      };
      authServiceMock.login.mockResolvedValue({
        accessToken: 'mock-token',
      });

      const result = await controller.login(dto);

      expect(authServiceMock.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ accessToken: 'mock-token' });
    });
  });

  describe('signUp', () => {
    it('should call authService.signUp with the provided body', async () => {
      const dto: SignUpDto = {
        name: 'newUser',
        email: 'new@email.com',
        password: 'StrongP4ss',
      };
      authServiceMock.signUp.mockResolvedValue({
        accessToken: 'mock-token',
      });

      const result = await controller.signUp(dto);

      expect(authServiceMock.signUp).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ accessToken: 'mock-token' });
    });
  });
});
