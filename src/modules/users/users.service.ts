import { Injectable, NotFoundException, Post } from '@nestjs/common';
import exampleUsers from '../../../test/fixtures/users';

@Injectable()
export class UsersService {
  @Post('find')
  find(id: number) {
    const user = exampleUsers.find((user) => user.id === id);
    if (user === undefined) {
      throw new NotFoundException();
    }

    return {
      name: user.name,
    };
  }
}
