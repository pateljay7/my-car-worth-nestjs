import { Body, Controller, Post, Session } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserLoginDto } from './dtos/user-login.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { Public } from '../core/decorators/public.decorator';
import { EmailService } from 'src/email/services/email/email.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailService: EmailService,
  ) {}

  @Public()
  @Post('/signup')
  async signup(@Body() data: CreateUserDto) {
    const user = await this.authService.signup(data);
    this.emailService.sendEmail(
      data.email,
      'Welcome to onboard',
      `Welcome to our system ${user.email}`,
    );
    return user;
  }

  @Public()
  @Post('login')
  async login(@Body() payload: UserLoginDto, @Session() session: any) {
    const authUser = await this.authService.login(payload);
    session.user = authUser.user;
    session.accessToken = authUser.accessToken;
    return authUser;
  }

  @Post('/signout')
  signout(@Session() session: any) {
    session.user = null;
  }
}
