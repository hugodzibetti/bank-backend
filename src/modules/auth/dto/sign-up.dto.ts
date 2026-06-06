import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Password } from '../../../common/decorators/password.decorator';

export class SignUpDto {
  @IsNotEmpty()
  @Length(3, 24)
  name: string;
  @IsEmail()
  email: string;
  @Password()
  password: string;
}
