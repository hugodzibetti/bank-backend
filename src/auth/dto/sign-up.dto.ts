import { Length } from 'class-validator';
import { Password } from '../../common/validation/password.decorator';

export class SignUpDto {
  @Length(3, 24)
  name: string;
  email: string;
  @Password()
  password: string;
}
