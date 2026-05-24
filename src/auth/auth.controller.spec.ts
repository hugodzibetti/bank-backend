import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';

const exampleLoginDto: LoginDto = {
  email: 'example@gmail.com',
  password: '01020304',
};

const exampleSignUpDto: SignUpDto = {
  name: 'John Doe',
  email: 'example@gmail.com',
  password: '01020304',
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<Pick<AuthService, 'login' | 'signUp'>>;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            signUp: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get(AuthService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should call auth service login', async () => {
      authService.login.mockResolvedValue({
        accessToken: 'imaginaryAccessToken',
      });

      const result = await authController.login(exampleLoginDto);

      expect(result).toHaveProperty('accessToken');
      expect(authService.login).toHaveBeenCalledWith(exampleLoginDto);
    });

    it('should return error if login fails', async () => {
      const error = new Error('Password is incorrect');
      authService.login.mockResolvedValue(error);

      const result = await authController.login(exampleLoginDto);
      expect(result).toBe(error);
    });
  });

  describe('signUp', () => {
    it('should call auth service signUp', async () => {
      authService.signUp.mockResolvedValue({
        accessToken: 'imaginaryAccessToken',
      });

      const result = await authController.signUp(exampleSignUpDto);

      expect(result).toHaveProperty('accessToken');
      expect(authService.signUp).toHaveBeenCalledWith(exampleSignUpDto);
    });

    it('should return error if signUp fails', async () => {
      const error = new Error('A user with this email already exists');
      authService.signUp.mockResolvedValue(error);

      const result = await authController.signUp(exampleSignUpDto);
      expect(result).toBe(error);
    });
  });
});
