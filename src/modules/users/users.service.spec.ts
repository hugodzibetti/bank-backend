import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import exampleUsers from '../../../test/fixtures/users';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {
    it('should return users with matching id', () => {
      const user = exampleUsers[0];

      expect(service.find(user.id)).toEqual(user);
    });
  });
});
