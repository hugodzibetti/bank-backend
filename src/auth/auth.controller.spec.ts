import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { createTestDatabaseModule } from '../../test/helpers/test-database';

let pgContainer: StartedPostgreSqlContainer;

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeAll(async () => {
    pgContainer = await new PostgreSqlContainer('postgres:16').start();

    const app: TestingModule = await Test.createTestingModule({
      imports: [createTestDatabaseModule(), TypeOrmModule.forFeature([User])],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
  }, 30_000);

  describe('login', () => {
    it('should success with example user', async () => {
      const validLoginDto: LoginDto = {
        email: 'example@gmail.com',
        password: '01020304',
      };

      jest.spyOn(authService, 'login').mockResolvedValue('Logged in!');

      await expect(authController.login(validLoginDto)).resolves.toBe(
        'Logged in!',
      );
    });
  });

  afterAll(async () => {
    await pgContainer.stop();
  });
});
