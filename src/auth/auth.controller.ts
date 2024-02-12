import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserLoginDto } from './dtos/user-login.dto';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  signup(@Body() data: CreateUserDto) {
    return this.authService.signup(data);
  }

  @Post('login')
  public login(@Body() payload: UserLoginDto) {
    return this.authService.login(payload);
  }
}
