import { Body, Controller, Post, Session } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserLoginDto } from './dtos/user-login.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { Public } from 'src/core/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/signup')
  signup(@Body() data: CreateUserDto) {
    return this.authService.signup(data);
  }

  @Public()
  @Post('login')
  async login(@Body() payload: UserLoginDto, @Session() session: any) {
    const authUser = await this.authService.login(payload);
    session.user = authUser.user;
    session.accessToken = authUser.accessToken;
    return authUser;
  }
}
