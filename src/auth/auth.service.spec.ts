import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { SignUpDto } from './dto/sign-up.dto';

let pgContainer: StartedPostgreSqlContainer;

describe('AuthService', () => {
  let authService: AuthService;

  const exampleSignUpDto: SignUpDto = {
    name: 'John Doe',
    email: 'example@gmail.com',
    password: '01020304',
  };

  const exampleLoginDto: LoginDto = {
    email: exampleSignUpDto.email,
    password: exampleSignUpDto.password,
  };

  const signUpExampleUser = async () => {
    return await authService.signUp(exampleSignUpDto);
  };

  beforeEach(async () => {
    pgContainer = await new PostgreSqlContainer('postgres:16').start();

    const authModule: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: pgContainer.getHost(),
          port: pgContainer.getPort(),
          username: pgContainer.getUsername(),
          password: pgContainer.getPassword(),
          database: pgContainer.getDatabase(),
          entities: [User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [AuthService],
    }).compile();

    authService = authModule.get<AuthService>(AuthService);
  }, 30_000);

  describe('signUp', () => {
    it('should create example user', async () => {
      const signUpResponse = await signUpExampleUser();

      expect(signUpResponse).toBe('Signed up!');
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await signUpExampleUser();
    });

    it('should success with example user', async () => {
      const loginResponse = await authService.login(exampleLoginDto);

      expect(loginResponse).toBe('Logged in!');
    });
  });

  afterAll(async () => {
    await pgContainer.stop();
  });
});
