import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMe', () => {
    it('should return the user when found', async () => {
      const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.getMe(1);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(service.getMe(999)).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('getUserById', () => {
    it('should return the user when found', async () => {
      const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.getUserById(1);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(service.getUserById(999)).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });
});
