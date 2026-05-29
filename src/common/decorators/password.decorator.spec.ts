import { validate } from 'class-validator';
import { Password } from './password.decorator';

class PasswordTest {
  @Password()
  password: any;
}

describe('Password Decorator', () => {
  let model: PasswordTest;

  beforeEach(() => {
    model = new PasswordTest();
  });

  it('should pass with a valid password', async () => {
    model.password = 'Pass1234';
    const errors = await validate(model);
    expect(errors.length).toBe(0);
  });

  it('should fail if password is too short', async () => {
    model.password = 'P1s';
    const errors = await validate(model);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isLength');
  });

  it('should fail if password is too long', async () => {
    model.password = 'P'.repeat(65);
    const errors = await validate(model);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isLength');
  });

  it('should fail if password has no letters', async () => {
    model.password = '12345678';
    const errors = await validate(model);
    expect(errors.length).toBeGreaterThan(0);
    const constraints = Object.values(errors[0].constraints ?? {});
    expect(constraints).toContain('Password must contain at least one letter');
  });

  it('should fail if password has no numbers', async () => {
    model.password = 'Password';
    const errors = await validate(model);
    expect(errors.length).toBeGreaterThan(0);
    const constraints = Object.values(errors[0].constraints ?? {});
    expect(constraints).toContain('Password must contain at least one number');
  });

  it('should fail if password is not a string', async () => {
    model.password = 12345678;
    const errors = await validate(model);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });
});
