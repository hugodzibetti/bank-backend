import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  describe('login', () => {
    it('should success with example user', () => {
      const validLoginDto: LoginDto = {
        email: 'example@gmail.com',
        password: '01020304',
      };

      expect(authService.login(validLoginDto)).toBe('Logged in!');
    });
  });
});
