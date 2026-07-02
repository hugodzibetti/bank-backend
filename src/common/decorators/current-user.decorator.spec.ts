import { ExecutionContext } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { CurrentUser } from './current-user.decorator';

function getParamDecoratorFactory(
  decorator: (...args: unknown[]) => ParameterDecorator,
) {
  class TestClass {
    test(@decorator() _value: unknown) {
      void _value;
    }
  }
  const args = Reflect.getMetadata(
    ROUTE_ARGS_METADATA,
    TestClass,
    'test',
  ) as Record<string, { factory: (...args: unknown[]) => unknown }>;
  const key = Object.keys(args)[0];
  return args[key].factory;
}

describe('CurrentUser Decorator', () => {
  const factory = getParamDecoratorFactory(CurrentUser);

  function createMockCtx(user: unknown): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
        getResponse: () => ({}),
        getNext: () => () => {},
      }),
      getArgByIndex: jest.fn(),
      getArgs: jest.fn(),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    } as unknown as ExecutionContext;
  }

  it('should return the entire user when no data key is provided', () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    const result = factory(undefined, createMockCtx(mockUser));
    expect(result).toEqual(mockUser);
  });

  it('should return a specific property when data key is provided', () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    const result = factory('id', createMockCtx(mockUser));
    expect(result).toBe(1);
  });

  it('should return undefined for a non-existent property', () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    const result = factory('nonexistent', createMockCtx(mockUser));
    expect(result).toBeUndefined();
  });

  it('should return undefined when user is not on request', () => {
    const result = factory('id', createMockCtx(undefined));
    expect(result).toBeUndefined();
  });
});
