import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('should success with example user', () => {
      const validLoginDto: LoginDto = {
        email: 'example@gmail.com',
        password: '01020304',
      };

      expect(authController.login(validLoginDto)).toBe('Logged in!');
    });
  });
});
