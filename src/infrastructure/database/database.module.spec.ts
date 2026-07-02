import { ConfigService } from '@nestjs/config';
import { DatabaseModule, typeOrmFactory } from './database.module';

describe('DatabaseModule', () => {
  describe('typeOrmFactory', () => {
    it('should return config with values from ConfigService', () => {
      const mockGet = jest.fn((key: string) => {
        const map: Record<string, unknown> = {
          'database.host': 'localhost',
          'database.port': 5432,
          'database.username': 'test-user',
          'database.password': 'test-pass',
          'database.database': 'test-db',
          NODE_ENV: 'development',
        };
        return map[key as keyof typeof map];
      });
      const mockConfigService = {
        get: mockGet,
      } as unknown as ConfigService;

      const result: TypeOrmModuleOptions = typeOrmFactory(mockConfigService);

      expect(result).toEqual({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'test-user',
        password: 'test-pass',
        database: 'test-db',
        entities: expect.any(Array),
        synchronize: true,
      });
      expect(mockGet).toHaveBeenCalledWith('database.host');
      expect(mockGet).toHaveBeenCalledWith('database.port');
      expect(mockGet).toHaveBeenCalledWith('NODE_ENV');
    });

    it('should set synchronize to false when NODE_ENV is production', () => {
      const mockGet = jest.fn((key: string) => {
        const map: Record<string, unknown> = {
          'database.host': 'localhost',
          'database.port': 5432,
          'database.username': 'test',
          'database.password': 'test',
          'database.database': 'test',
          NODE_ENV: 'production',
        };
        return map[key as keyof typeof map];
      });
      const mockConfigService = {
        get: mockGet,
      } as unknown as ConfigService;

      const result = typeOrmFactory(mockConfigService);

      expect(result.synchronize).toBe(false);
    });
  });

  it('should be defined', () => {
    expect(DatabaseModule).toBeDefined();
  });
});
