import { getMetadataArgsStorage } from 'typeorm';
import { Account } from './account.entity';

describe('Account Entity', () => {
  it('should create an instance', () => {
    const account = new Account();
    expect(account).toBeInstanceOf(Account);
  });

  it('should have TypeORM relation metadata with callable type function', () => {
    const relations = getMetadataArgsStorage().relations.filter(
      (r) => (r.target as () => unknown) === Account,
    );

    expect(relations.length).toBeGreaterThanOrEqual(1);

    for (const relation of relations) {
      if (typeof relation.type === 'function') {
        const result = (relation.type as () => unknown)();
        expect(result).toBeDefined();
      }
    }
  });
});
