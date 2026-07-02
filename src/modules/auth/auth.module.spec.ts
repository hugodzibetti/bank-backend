import { ConfigService } from '@nestjs/config';
import { AuthModule, jwtFactory } from './auth.module';

describe('AuthModule', () => {
  describe('jwtFactory', () => {
    it('should return jwt config with secret and expiry', () => {
      const mockGet = jest.fn((key: string) => {
        const map: Record<string, unknown> = {
          'jwt.secret': 'test-secret',
        };
        return map[key as keyof typeof map];
      });
      const mockConfigService = { get: mockGet } as unknown as ConfigService;

      const result = jwtFactory(mockConfigService);

      expect(result).toEqual({
        secret: 'test-secret',
        signOptions: { expiresIn: '1h' },
      });
      expect(mockGet).toHaveBeenCalledWith('jwt.secret');
    });
  });

  it('should be defined', () => {
    expect(AuthModule).toBeDefined();
  });
});
