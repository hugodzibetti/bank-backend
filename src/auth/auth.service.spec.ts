import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { SignUpDto } from './dto/sign-up.dto';
import { createTestDatabaseModule } from '../../test/helpers/test-database';
import { Repository } from 'typeorm';

const exampleSignUpDto: SignUpDto = {
  name: 'John Doe',
  email: 'example@gmail.com',
  password: '01020304',
};

const exampleLoginDto: LoginDto = {
  email: exampleSignUpDto.email,
  password: exampleSignUpDto.password,
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: Repository<User>;

  const givenExampleUserExists = async () => {
    const response = await authService.signUp(exampleSignUpDto);

    if (response instanceof Error) {
      throw new Error(`Test setup failed: ${response.message}`);
    }
  };

  beforeAll(async () => {
    const authModule: TestingModule = await Test.createTestingModule({
      imports: [createTestDatabaseModule(), TypeOrmModule.forFeature([User])],
      providers: [AuthService],
    }).compile();

    authService = authModule.get<AuthService>(AuthService);
    usersRepository = authModule.get<Repository<User>>(
      getRepositoryToken(User),
    );
  });

  beforeEach(async () => {
    await usersRepository.clear();
  });

  describe('signUp', () => {
    it('should create example user', async () => {
      const result = await authService.signUp(exampleSignUpDto);

      expect(result).toBe('Signed up!');
    });

    it('should return error if email already exists', async () => {
      await givenExampleUserExists();
      const result = await authService.signUp(exampleSignUpDto);

      expect(result).toBeInstanceOf(Error);
      expect((result as Error).message).toBe(
        'A user with this email already exists',
      );
    });
  });

  describe('login', () => {
    it('should fail with non-existent user', async () => {
      const result = await authService.login(exampleLoginDto);

      expect(result).toBeInstanceOf(Error);
      expect((result as Error).message).toBe(
        'A user with this email doesnt exists',
      );
    });

    describe('with existing user', () => {
      beforeEach(async () => {
        await givenExampleUserExists();
      });

      it('should succeed with example user', async () => {
        const result = await authService.login(exampleLoginDto);

        expect(result).toBe('Logged in!');
      });

      it('should fail with incorrect password', async () => {
        const result = await authService.login({
          ...exampleLoginDto,
          password: 'wrongpassword123',
        });

        expect(result).toBeInstanceOf(Error);
        expect((result as Error).message).toBe('Password is incorrect');
      });
    });
  });
});
