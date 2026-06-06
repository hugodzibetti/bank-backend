import { IsEmail } from 'class-validator';
import { Password } from '../../../common/decorators/password.decorator';

export class LoginDto {
  @IsEmail()
  email: string;
  @Password()
  password: string;
}
