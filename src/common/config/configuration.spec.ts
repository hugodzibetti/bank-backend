import { configuration } from './configuration';

describe('configuration', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    delete process.env.JWT_SECRET;
    delete process.env.DB_HOST;
    delete process.env.DB_USERNAME;
    delete process.env.DB_PASSWORD;
    delete process.env.DB_DATABASE;
    delete process.env.NODE_ENV;
    delete process.env.PORT;
    delete process.env.DB_PORT;
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should throw when JWT_SECRET is missing', () => {
    process.env.DB_HOST = 'localhost';
    process.env.DB_USERNAME = 'user';
    process.env.DB_PASSWORD = 'pass';
    process.env.DB_DATABASE = 'db';

    expect(() => configuration()).toThrow('JWT_SECRET');
  });

  it('should throw when DB env vars are missing', () => {
    process.env.JWT_SECRET = 'secret';

    expect(() => configuration()).toThrow('DB_HOST');
  });

  it('should return config with all values', () => {
    process.env.JWT_SECRET = 'my-secret';
    process.env.DB_HOST = 'db-host';
    process.env.DB_USERNAME = 'db-user';
    process.env.DB_PASSWORD = 'db-pass';
    process.env.DB_DATABASE = 'db-name';
    process.env.NODE_ENV = 'development';
    process.env.PORT = '4000';
    process.env.DB_PORT = '5433';

    const result = configuration();

    expect(result).toEqual({
      NODE_ENV: 'development',
      port: 4000,
      database: {
        host: 'db-host',
        port: 5433,
        username: 'db-user',
        password: 'db-pass',
        database: 'db-name',
      },
      jwt: {
        secret: 'my-secret',
      },
    });
  });

  it('should use default port values', () => {
    process.env.JWT_SECRET = 'secret';
    process.env.DB_HOST = 'host';
    process.env.DB_USERNAME = 'user';
    process.env.DB_PASSWORD = 'pass';
    process.env.DB_DATABASE = 'db';

    const result = configuration();

    expect(result.port).toBe(3000);
    expect(result.database.port).toBe(5432);
  });
});
