import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
  Session,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../core/interceptors/serialize.interceptor';
import { CurrentUser } from '../core/decorators/user.decortor';
import { Public } from '../core/decorators/public.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from '../database/entities/user.entity';

@Controller('user')
@Serialize(UserDto) // can use on top of the controller as all API returns User data only
@UseInterceptors(CurrentUserInterceptor) // applied on controller scope
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  //using jwt token
  @Get('/me')
  async me(@CurrentUser() user: User) {
    return user;
  }

  //using session
  @Public()
  @Get('/whoami')
  async whoami(@Session() session: any) {
    const currentUser = await this.userService.findOne(session?.user?.id);
    if (!currentUser) throw new NotFoundException('user not found');
    return currentUser;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(+id, body);
  }
}
