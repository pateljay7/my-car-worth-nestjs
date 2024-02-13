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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/core/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/core/decorators/user.decortor';

@Controller('user')
@Serialize(UserDto) // can use on top of the controller as all API returns User data only
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get('/me')
  async me(@CurrentUser() user: { id: number }) {
    return this.userService.findOne(user.id);
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string, @Session() session: any) {
    console.log('session', session);

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
