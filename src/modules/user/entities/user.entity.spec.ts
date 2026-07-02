import { getMetadataArgsStorage } from 'typeorm';
import { User } from './user.entity';

describe('User Entity', () => {
  it('should create an instance', () => {
    const user = new User();
    expect(user).toBeInstanceOf(User);
  });

  it('should have TypeORM embedded metadata with callable type function', () => {
    const embeddeds = getMetadataArgsStorage().filterEmbeddeds(User);

    expect(embeddeds.length).toBeGreaterThanOrEqual(1);

    for (const embedded of embeddeds) {
      const result = (embedded.type as () => unknown)();
      expect(result).toBeDefined();
    }
  });
});
