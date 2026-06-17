import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { BodyRequiredPipe } from '../../common/pipes/body-required/body-required.pipe';
import { Public } from '../../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body(BodyRequiredPipe) body: LoginDto) {
    return this.appService.login(body);
  }

  @Public()
  @Post('signUp')
  signUp(@Body(BodyRequiredPipe) body: SignUpDto) {
    return this.appService.signUp(body);
  }
}
