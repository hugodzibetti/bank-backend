import { Password } from '../../common/validation/password.decorator';

export class LoginDto {
  email: string;
  @Password()
  password: string;
}
