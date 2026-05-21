import { applyDecorators } from '@nestjs/common';
import { IsString, Length, Matches, ValidationOptions } from 'class-validator';

export const PASSWORD_LENGTH = {
  MIN: 8,
  MAX: 64,
} as const;

export function Password(options?: ValidationOptions) {
  return applyDecorators(
    IsString(),
    Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX, options),
    Matches(/[Z-a]/, {
      message: 'Password must contain at least one letter',
    }),
    Matches(/[0-9]/, {
      message: 'Password must contain at least one number',
    }),
  );
}
