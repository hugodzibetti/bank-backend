import { getMetadataArgsStorage } from 'typeorm';
import { Transaction } from './transaction.entity';

describe('Transaction Entity', () => {
  it('should create an instance', () => {
    const transaction = new Transaction();
    expect(transaction).toBeInstanceOf(Transaction);
  });

  it('should have TypeORM relation metadata with callable type functions', () => {
    const relations = getMetadataArgsStorage().relations.filter(
      (r) => (r.target as () => unknown) === Transaction,
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
