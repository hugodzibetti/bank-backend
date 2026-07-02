import { ExecutionContext } from '@nestjs/common';

describe('CurrentUser Decorator', () => {
  // Duplicate the exact factory logic from createParamDecorator
  const factory = (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Record<string, unknown>>();
    const user = request.user as Record<string, unknown> | undefined;
    return data ? user?.[data] : user;
  };

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
