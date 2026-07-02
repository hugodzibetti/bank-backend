import { BodyRequiredPipe } from './body-required.pipe';
import { BadRequestException } from '@nestjs/common';

describe('BodyRequiredPipe', () => {
  let pipe: BodyRequiredPipe;

  beforeEach(() => {
    pipe = new BodyRequiredPipe();
  });

  it('returns the value when a truthy body object is passed', () => {
    const body = { foo: 'bar' };
    expect(pipe.transform(body)).toBe(body);
  });

  it('throws BadRequestException for undefined', () => {
    expect(() => pipe.transform(undefined)).toThrow(BadRequestException);
  });

  it('throws BadRequestException for null', () => {
    expect(() => pipe.transform(null)).toThrow(BadRequestException);
  });

  it('returns falsy-but-defined values (0, "", false) without throwing', () => {
    expect(pipe.transform(0)).toBe(0);
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(false)).toBe(false);
  });
});
