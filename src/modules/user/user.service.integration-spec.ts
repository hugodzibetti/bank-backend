import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Account } from '../accounts/entities/account.entity';
import { createTestDatabaseModule } from '../../../test/helpers/test-database';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Password } from './entities/password.embeddable';

describe('UserService', () => {
  let service: UserService;
  let module: TestingModule;
  let userRepository: Repository<User>;
  let createdUserId: number;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        createTestDatabaseModule(),
        TypeOrmModule.forFeature([User, Account]),
      ],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    const password = new Password();
    password.hash = 'test-hash';
    password.salt = 'test-salt';
    const user = userRepository.create({
      name: 'User Service Test',
      email: 'user-service-test@example.com',
      password,
    });
    const saved = await userRepository.save(user);
    createdUserId = saved.id;
  });

  afterAll(async () => {
    await module?.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMe', () => {
    it('should return user profile for existing user', async () => {
      const result = await service.getMe(createdUserId);
      expect(result).toEqual({
        id: createdUserId,
        name: 'User Service Test',
        email: 'user-service-test@example.com',
      });
    });

    it('should throw NotFoundException for non-existent user', async () => {
      await expect(service.getMe(99999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserById', () => {
    it('should return user basic info for existing user', async () => {
      const result = await service.getUserById(createdUserId);
      expect(result).toEqual({
        id: createdUserId,
        name: 'User Service Test',
      });
    });

    it('should throw NotFoundException for non-existent user', async () => {
      await expect(service.getUserById(99999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
