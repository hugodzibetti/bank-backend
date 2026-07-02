import { JwtStrategy } from './jwt.strategy';
import { AuthService } from '../../modules/auth/auth.service';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const mockAuthService = {};
  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    strategy = new JwtStrategy(
      mockAuthService as unknown as AuthService,
      mockConfigService as unknown as ConfigService,
    );
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should get jwt secret from config on construction', () => {
    expect(mockConfigService.get).toHaveBeenCalledWith('jwt.secret');
  });

  describe('validate', () => {
    it('should return user object from payload', () => {
      const payload = { sub: 1, email: 'test@example.com' };
      const result = strategy.validate(payload);
      expect(result).toEqual({ id: 1, email: 'test@example.com' });
    });
  });
});
