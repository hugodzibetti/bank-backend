import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService: jest.Mocked<
    Pick<UserService, 'getMe' | 'getUserById'>
  > = {
    getMe: jest.fn(),
    getUserById: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMe', () => {
    it('should call userService.getMe with userId', async () => {
      const userId = 42;
      const expected = { id: userId, name: 'Test', email: 'test@example.com' };
      mockUserService.getMe.mockResolvedValue(expected);

      const result = await controller.getMe(userId);

      expect(mockUserService.getMe).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expected);
    });
  });

  describe('getUserById', () => {
    it('should call userService.getUserById with id', async () => {
      const userId = 42;
      const expected = { id: userId, name: 'Test' };
      mockUserService.getUserById.mockResolvedValue(expected);

      const result = await controller.getUserById(userId);

      expect(mockUserService.getUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expected);
    });
  });
});
